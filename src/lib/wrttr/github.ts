// Browser-side GitHub client for the writing surface (§8: the repo is the DB).
// All writes go through the Git Data API (blobs -> tree -> commit -> update
// ref) so every publish/save/unpublish is a SINGLE atomic commit — never the
// Contents API's one-call-per-file (§7.5). Wired to the existing content model:
//   content/blog/<slug>.md          (body only, no frontmatter)
//   content/blog/metadata.json      (array of post meta)
//   public/thoughts/<slug>/*.webp   (published images)
//   content/drafts/<slug>.md        (frontmatter + body; never read by build)
//   public/drafts/<slug>/*.webp     (draft images)
import type { BlogPostMeta } from '@/types';
import type { LibraryItem, Collection } from './types';
export type { Collection };

const REPO = 'Vujavujavuja/vujicai';
// The browser never talks to GitHub directly and never holds a token. It calls
// the same-origin Worker proxy (worker/index.ts), which validates the
// Cloudflare Access login and injects the GitHub token server-side.
const API = '/api/gh';
const BRANCH = 'main';
const SITE = 'https://vujic.ai';

// Two publish targets. Short "Thoughts" live under content/blog + /thoughts;
// long-form "Deep Thoughts" under content/deep + /deep-thoughts. Drafts are a
// shared pool (content/drafts) and remember their target in frontmatter.
const COLLECTIONS: Record<Collection, { contentDir: string; urlBase: string }> = {
  thought: { contentDir: 'content/blog', urlBase: 'thoughts' },
  deep: { contentDir: 'content/deep', urlBase: 'deep-thoughts' },
};
export function collectionUrlBase(c: Collection): string {
  return COLLECTIONS[c].urlBase;
}

// ---------- errors (PUB-9: never fail silently) ----------
export type WrttrErrorKind =
  | 'no-token'
  | 'auth'
  | 'permission'
  | 'rate-limit'
  | 'not-found'
  | 'conflict'
  | 'collision'
  | 'network'
  | 'unknown';

export class WrttrError extends Error {
  kind: WrttrErrorKind;
  status?: number;
  constructor(kind: WrttrErrorKind, message: string, status?: number) {
    super(message);
    this.kind = kind;
    this.status = status;
  }
}

function mapHttpError(status: number, body: string): WrttrError {
  const msg = (() => {
    try {
      return JSON.parse(body).message as string;
    } catch {
      return body.slice(0, 200);
    }
  })();
  if (status === 401) return new WrttrError('auth', `Server GitHub token rejected: ${msg}`, status);
  if (status === 403) {
    if (/rate limit/i.test(msg)) return new WrttrError('rate-limit', 'GitHub rate limit hit. Wait and retry.', status);
    return new WrttrError('permission', msg || 'Not authorized.', status);
  }
  if (status === 404) return new WrttrError('not-found', `Not found: ${msg}`, status);
  if (status === 409 || status === 422) {
    if (/fast[- ]?forward|reference|sha/i.test(msg))
      return new WrttrError('conflict', 'The repo moved under you (non-fast-forward). Refresh and retry.', status);
    return new WrttrError('conflict', msg, status);
  }
  return new WrttrError('unknown', `GitHub error ${status}: ${msg}`, status);
}

async function ghFetch(path: string, init: RequestInit = {}): Promise<Response> {
  let res: Response;
  try {
    res = await fetch(`${API}${path}`, {
      ...init,
      credentials: 'same-origin', // send the Cloudflare Access cookie
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...(init.headers || {}),
      },
    });
  } catch (e) {
    throw new WrttrError('network', `Network error: ${(e as Error).message}`);
  }
  if (!res.ok) throw mapHttpError(res.status, await res.text());
  return res;
}

// ---------- encoding helpers ----------
function decodeBase64Utf8(b64: string): string {
  const bin = atob(b64.replace(/\n/g, ''));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(',')[1]);
    r.onerror = () => reject(new WrttrError('unknown', 'Failed to read image blob.'));
    r.readAsDataURL(blob);
  });
}

// ---------- read ----------
export interface TreeEntry {
  path: string;
  type: 'blob' | 'tree';
  sha: string;
  mode: string;
}
export interface RepoState {
  commitSha: string;
  treeSha: string;
  tree: TreeEntry[];
}

export async function getRepoState(): Promise<RepoState> {
  const ref = await (await ghFetch(`/git/ref/heads/${BRANCH}`)).json();
  const commitSha = ref.object.sha as string;
  const commit = await (await ghFetch(`/git/commits/${commitSha}`)).json();
  const treeSha = commit.tree.sha as string;
  const treeRes = await (await ghFetch(`/git/trees/${treeSha}?recursive=1`)).json();
  return { commitSha, treeSha, tree: treeRes.tree as TreeEntry[] };
}

async function getBlobText(sha: string): Promise<string> {
  const j = await (await ghFetch(`/git/blobs/${sha}`)).json();
  return decodeBase64Utf8(j.content);
}

// LIB-4: cache the merged repo list against the head commit SHA. A refresh only
// costs one cheap ref call unless the repo actually moved.
const LIB_CACHE_KEY = 'wrttr_lib_cache';
export async function getLibraryItems(force = false): Promise<LibraryItem[]> {
  const ref = await (await ghFetch(`/git/ref/heads/${BRANCH}`)).json();
  const commitSha = ref.object.sha as string;
  if (!force) {
    try {
      const cached = JSON.parse(localStorage.getItem(LIB_CACHE_KEY) || 'null');
      if (cached && cached.commitSha === commitSha) return cached.items as LibraryItem[];
    } catch {
      /* ignore */
    }
  }
  const commit = await (await ghFetch(`/git/commits/${commitSha}`)).json();
  const treeRes = await (await ghFetch(`/git/trees/${commit.tree.sha}?recursive=1`)).json();
  const items = await loadRepoLibrary({ commitSha, treeSha: commit.tree.sha, tree: treeRes.tree });
  try {
    localStorage.setItem(LIB_CACHE_KEY, JSON.stringify({ commitSha, items }));
  } catch {
    /* ignore */
  }
  return items;
}
export function invalidateLibraryCache() {
  try {
    localStorage.removeItem(LIB_CACHE_KEY);
  } catch {
    /* ignore */
  }
}

/** Merge repo published + repo drafts into library items (local ones added by caller). */
export async function loadRepoLibrary(state: RepoState): Promise<LibraryItem[]> {
  const items: LibraryItem[] = [];

  for (const collection of Object.keys(COLLECTIONS) as Collection[]) {
    const { contentDir, urlBase } = COLLECTIONS[collection];
    const metaEntry = state.tree.find((t) => t.path === `${contentDir}/metadata.json`);
    if (!metaEntry) continue;
    const meta = JSON.parse(await getBlobText(metaEntry.sha)) as (BlogPostMeta & { wordCount?: number })[];
    for (const p of meta) {
      items.push({
        id: p.slug,
        state: 'published',
        collection,
        title: p.title,
        date: new Date(p.date).getTime(),
        wordCount: p.wordCount ?? 0,
        slug: p.slug,
        liveUrl: `${SITE}/${urlBase}/${p.slug}/`,
      });
    }
  }

  const draftFiles = state.tree.filter((t) => t.path.startsWith('content/drafts/') && t.path.endsWith('.md'));
  for (const f of draftFiles) {
    const raw = await getBlobText(f.sha);
    const fm = parseFrontmatter(raw);
    const slug = fm.slug || f.path.replace('content/drafts/', '').replace('.md', '');
    items.push({
      id: slug,
      state: 'draft',
      collection: fm.collection === 'deep' ? 'deep' : 'thought',
      title: fm.title || slug,
      date: fm.date ? new Date(fm.date).getTime() : 0,
      wordCount: Number(fm.wordCount) || 0,
      peekCount: Number(fm.peekCount) || 0,
      slug,
    });
  }
  return items;
}

// ---------- frontmatter (drafts only) ----------
type Frontmatter = Record<string, string> & { tags?: string; body?: string };
function parseFrontmatter(raw: string): Frontmatter {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { body: raw };
  const fm: Frontmatter = { body: m[2] };
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i === -1) continue;
    fm[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return fm;
}
function buildFrontmatter(fields: Record<string, string | number | string[]>, body: string): string {
  const lines = Object.entries(fields).map(([k, v]) => {
    if (Array.isArray(v)) return `${k}: [${v.map((x) => JSON.stringify(x)).join(', ')}]`;
    return `${k}: ${typeof v === 'string' ? v : String(v)}`;
  });
  return `---\n${lines.join('\n')}\n---\n\n${body}\n`;
}

// ---------- write primitives ----------
type Entry = { path: string; mode: '100644'; type: 'blob'; sha: string | null };

async function createTextBlob(content: string): Promise<string> {
  const j = await (await ghFetch('/git/blobs', { method: 'POST', body: JSON.stringify({ content, encoding: 'utf-8' }) })).json();
  return j.sha;
}
async function createBinaryBlob(blob: Blob): Promise<string> {
  const content = await blobToBase64(blob);
  const j = await (await ghFetch('/git/blobs', { method: 'POST', body: JSON.stringify({ content, encoding: 'base64' }) })).json();
  return j.sha;
}
async function commitTree(state: RepoState, entries: Entry[], message: string): Promise<string> {
  const newTree = await (
    await ghFetch('/git/trees', { method: 'POST', body: JSON.stringify({ base_tree: state.treeSha, tree: entries }) })
  ).json();
  const newCommit = await (
    await ghFetch('/git/commits', { method: 'POST', body: JSON.stringify({ message, tree: newTree.sha, parents: [state.commitSha] }) })
  ).json();
  await ghFetch(`/git/refs/heads/${BRANCH}`, { method: 'PATCH', body: JSON.stringify({ sha: newCommit.sha, force: false }) });
  return newCommit.sha;
}

// ---------- high-level operations ----------
export interface DraftImage {
  filename: string;
  blob: Blob;
}
export interface PublishInput {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  body: string; // image refs as bare filenames
  wordCount: number;
  images: DraftImage[];
  fromDraft?: boolean; // also remove content/drafts/<slug> + public/drafts/<slug>
}

function rewriteImagePaths(body: string, images: DraftImage[], dir: string): string {
  let out = body;
  for (const img of images) out = out.split(`(${img.filename})`).join(`(${dir}/${img.filename})`);
  return out;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Save a draft into the repo (content/drafts). Idempotent per slug. */
export async function saveDraftToRepo(
  input: PublishInput & { peekCount?: number; target?: number; collection?: Collection }
): Promise<string> {
  const state = await getRepoState();
  const body = rewriteImagePaths(input.body, input.images, `/drafts/${input.slug}`);
  const md = buildFrontmatter(
    {
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      tags: input.tags,
      date: todayISO(),
      wordCount: input.wordCount,
      peekCount: input.peekCount ?? 0,
      target: input.target ?? 0,
      collection: input.collection ?? 'thought',
    },
    body
  );
  const entries: Entry[] = [{ path: `content/drafts/${input.slug}.md`, mode: '100644', type: 'blob', sha: await createTextBlob(md) }];
  for (const img of input.images) {
    entries.push({ path: `public/drafts/${input.slug}/${img.filename}`, mode: '100644', type: 'blob', sha: await createBinaryBlob(img.blob) });
  }
  return commitTree(state, entries, `wrttr: save draft "${input.title}"`);
}

export interface LoadedPost {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  body: string;
  filename?: string; // published: the .md file in the collection's content dir
  collection: Collection;
}

function parseTagList(v?: string): string[] {
  if (!v) return [];
  return v
    .replace(/^\[|\]$/g, '')
    .split(',')
    .map((s) => s.trim().replace(/^"|"$/g, ''))
    .filter(Boolean);
}

/** Load an existing repo post (published or draft) into editable fields. */
export async function loadRepoPost(
  slug: string,
  kind: 'published' | 'draft',
  collection: Collection = 'thought'
): Promise<LoadedPost> {
  const state = await getRepoState();
  if (kind === 'published') {
    const { contentDir } = COLLECTIONS[collection];
    const metaEntry = state.tree.find((t) => t.path === `${contentDir}/metadata.json`);
    const meta: BlogPostMeta[] = metaEntry ? JSON.parse(await getBlobText(metaEntry.sha)) : [];
    const m = meta.find((p) => p.slug === slug);
    if (!m) throw new WrttrError('not-found', `No published post "${slug}".`);
    const fileEntry = state.tree.find((t) => t.path === `${contentDir}/${m.filename}`);
    const body = fileEntry ? await getBlobText(fileEntry.sha) : '';
    return { slug, title: m.title, excerpt: m.description, tags: m.tags || [], body, filename: m.filename, collection };
  }
  const fileEntry = state.tree.find((t) => t.path === `content/drafts/${slug}.md`);
  if (!fileEntry) throw new WrttrError('not-found', `No draft "${slug}".`);
  const fm = parseFrontmatter(await getBlobText(fileEntry.sha));
  return {
    slug,
    title: fm.title || slug,
    excerpt: fm.excerpt || '',
    tags: parseTagList(fm.tags),
    body: fm.body || '',
    collection: fm.collection === 'deep' ? 'deep' : 'thought',
  };
}

/** Update a published post in place (EDIT-9): overwrite the .md + its metadata
 *  entry (keeping the original date), add any new images. One commit. */
export async function updatePublished(
  input: PublishInput & { filename?: string },
  collection: Collection = 'thought'
): Promise<{ commit: string; url: string }> {
  const { contentDir, urlBase } = COLLECTIONS[collection];
  const state = await getRepoState();
  const metaEntry = state.tree.find((t) => t.path === `${contentDir}/metadata.json`);
  const meta: (BlogPostMeta & { wordCount?: number })[] = metaEntry ? JSON.parse(await getBlobText(metaEntry.sha)) : [];
  const idx = meta.findIndex((m) => m.slug === input.slug);
  if (idx === -1) throw new WrttrError('not-found', `No published post "${input.slug}".`);
  const filename = input.filename || meta[idx].filename || `${input.slug}.md`;
  meta[idx] = { ...meta[idx], title: input.title, description: input.excerpt, tags: input.tags, filename };

  const body = rewriteImagePaths(input.body, input.images, `/${urlBase}/${input.slug}`);
  const entries: Entry[] = [
    { path: `${contentDir}/${filename}`, mode: '100644', type: 'blob', sha: await createTextBlob(body) },
    { path: `${contentDir}/metadata.json`, mode: '100644', type: 'blob', sha: await createTextBlob(JSON.stringify(meta, null, 2) + '\n') },
  ];
  for (const img of input.images) {
    entries.push({ path: `public/${urlBase}/${input.slug}/${img.filename}`, mode: '100644', type: 'blob', sha: await createBinaryBlob(img.blob) });
  }
  const commit = await commitTree(state, entries, `Update: ${input.title}`);
  return { commit, url: `${SITE}/${urlBase}/${input.slug}/` };
}

/** Publish: one atomic commit adding the post + metadata entry + images (and
 *  removing the draft if it came from one). Returns the live URL. */
export async function publishToRepo(
  input: PublishInput,
  collection: Collection = 'thought'
): Promise<{ commit: string; url: string }> {
  const { contentDir, urlBase } = COLLECTIONS[collection];
  const state = await getRepoState();

  if (state.tree.some((t) => t.path === `${contentDir}/${input.slug}.md`)) {
    throw new WrttrError('collision', `A published post with slug "${input.slug}" already exists.`);
  }

  const body = rewriteImagePaths(input.body, input.images, `/${urlBase}/${input.slug}`);

  // upsert metadata.json
  const metaEntry = state.tree.find((t) => t.path === `${contentDir}/metadata.json`);
  const meta: (BlogPostMeta & { wordCount?: number })[] = metaEntry ? JSON.parse(await getBlobText(metaEntry.sha)) : [];
  meta.unshift({
    slug: input.slug,
    filename: `${input.slug}.md`,
    title: input.title,
    description: input.excerpt,
    tags: input.tags,
    date: todayISO(),
    wordCount: input.wordCount,
  });

  const entries: Entry[] = [
    { path: `${contentDir}/${input.slug}.md`, mode: '100644', type: 'blob', sha: await createTextBlob(body) },
    { path: `${contentDir}/metadata.json`, mode: '100644', type: 'blob', sha: await createTextBlob(JSON.stringify(meta, null, 2) + '\n') },
  ];
  for (const img of input.images) {
    entries.push({ path: `public/${urlBase}/${input.slug}/${img.filename}`, mode: '100644', type: 'blob', sha: await createBinaryBlob(img.blob) });
  }
  if (input.fromDraft) {
    entries.push({ path: `content/drafts/${input.slug}.md`, mode: '100644', type: 'blob', sha: null });
    state.tree
      .filter((t) => t.path.startsWith(`public/drafts/${input.slug}/`) && t.type === 'blob')
      .forEach((t) => entries.push({ path: t.path, mode: '100644', type: 'blob', sha: null }));
  }

  const commit = await commitTree(state, entries, `Publish: ${input.title}`);
  return { commit, url: `${SITE}/${urlBase}/${input.slug}/` };
}

/** Unpublish: move a published post back to content/drafts (reuses image blob
 *  SHAs — no re-upload) and drop its metadata entry. One commit. */
export async function unpublishFromRepo(slug: string, collection: Collection = 'thought'): Promise<string> {
  const { contentDir, urlBase } = COLLECTIONS[collection];
  const state = await getRepoState();
  const postEntry = state.tree.find((t) => t.path === `${contentDir}/${slug}.md`);
  if (!postEntry) throw new WrttrError('not-found', `No published post "${slug}".`);

  const metaEntry = state.tree.find((t) => t.path === `${contentDir}/metadata.json`);
  const meta: (BlogPostMeta & { wordCount?: number })[] = metaEntry ? JSON.parse(await getBlobText(metaEntry.sha)) : [];
  const removed = meta.find((m) => m.slug === slug);
  const nextMeta = meta.filter((m) => m.slug !== slug);

  // rewrite /<urlBase>/<slug>/ -> /drafts/<slug>/ in the body, keep image blobs
  const body = (await getBlobText(postEntry.sha)).split(`/${urlBase}/${slug}/`).join(`/drafts/${slug}/`);
  const md = buildFrontmatter(
    {
      title: removed?.title || slug,
      slug,
      excerpt: removed?.description || '',
      tags: removed?.tags || [],
      date: removed?.date || todayISO(),
      wordCount: removed?.wordCount ?? 0,
      collection,
    },
    body
  );

  const entries: Entry[] = [
    { path: `content/drafts/${slug}.md`, mode: '100644', type: 'blob', sha: await createTextBlob(md) },
    { path: `${contentDir}/${slug}.md`, mode: '100644', type: 'blob', sha: null },
    { path: `${contentDir}/metadata.json`, mode: '100644', type: 'blob', sha: await createTextBlob(JSON.stringify(nextMeta, null, 2) + '\n') },
  ];
  // move images by reusing their blob SHAs
  state.tree
    .filter((t) => t.path.startsWith(`public/${urlBase}/${slug}/`) && t.type === 'blob')
    .forEach((t) => {
      const name = t.path.split('/').pop()!;
      entries.push({ path: `public/drafts/${slug}/${name}`, mode: '100644', type: 'blob', sha: t.sha });
      entries.push({ path: t.path, mode: '100644', type: 'blob', sha: null });
    });

  return commitTree(state, entries, `Unpublish: ${removed?.title || slug}`);
}

/** Delete a repo item (published or draft) and its images in one commit. */
export async function deleteFromRepo(
  slug: string,
  kind: 'draft' | 'published',
  collection: Collection = 'thought'
): Promise<string> {
  const { contentDir, urlBase } = COLLECTIONS[collection];
  const state = await getRepoState();
  const entries: Entry[] = [];

  if (kind === 'published') {
    entries.push({ path: `${contentDir}/${slug}.md`, mode: '100644', type: 'blob', sha: null });
    const metaEntry = state.tree.find((t) => t.path === `${contentDir}/metadata.json`);
    if (metaEntry) {
      const meta = JSON.parse(await getBlobText(metaEntry.sha)).filter((m: BlogPostMeta) => m.slug !== slug);
      entries.push({ path: `${contentDir}/metadata.json`, mode: '100644', type: 'blob', sha: await createTextBlob(JSON.stringify(meta, null, 2) + '\n') });
    }
  } else {
    entries.push({ path: `content/drafts/${slug}.md`, mode: '100644', type: 'blob', sha: null });
  }
  const imgDir = kind === 'published' ? `public/${urlBase}/${slug}/` : `public/drafts/${slug}/`;
  state.tree
    .filter((t) => t.path.startsWith(imgDir) && t.type === 'blob')
    .forEach((t) => entries.push({ path: t.path, mode: '100644', type: 'blob', sha: null }));

  return commitTree(state, entries, `wrttr: delete ${kind} "${slug}"`);
}
