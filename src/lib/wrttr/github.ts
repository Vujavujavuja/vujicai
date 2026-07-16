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
import type { LibraryItem } from './types';

const REPO = 'Vujavujavuja/vujicai';
const API = `https://api.github.com/repos/${REPO}`;
const BRANCH = 'main';
const SITE = 'https://vujic.ai';
const TOKEN_KEY = 'wrttr_gh_pat';

// ---------- token ----------
export function getToken(): string | null {
  return typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
}
export function setToken(t: string) {
  localStorage.setItem(TOKEN_KEY, t.trim());
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
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
  if (status === 401) return new WrttrError('auth', 'GitHub token is invalid or expired. Re-enter it.', status);
  if (status === 403) {
    if (/rate limit/i.test(msg)) return new WrttrError('rate-limit', 'GitHub rate limit hit. Wait and retry.', status);
    return new WrttrError('permission', `Token lacks permission: ${msg}`, status);
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
  const token = getToken();
  if (!token) throw new WrttrError('no-token', 'No GitHub token set. Add one in settings.');
  let res: Response;
  try {
    res = await fetch(path.startsWith('http') ? path : `${API}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
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

/** Cheap validity check for a freshly entered token. */
export async function verifyToken(): Promise<{ ok: boolean; error?: string }> {
  try {
    await ghFetch('');
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as WrttrError).message };
  }
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

  const metaEntry = state.tree.find((t) => t.path === 'content/blog/metadata.json');
  if (metaEntry) {
    const meta = JSON.parse(await getBlobText(metaEntry.sha)) as (BlogPostMeta & { wordCount?: number })[];
    for (const p of meta) {
      items.push({
        id: p.slug,
        state: 'published',
        title: p.title,
        date: new Date(p.date).getTime(),
        wordCount: p.wordCount ?? 0,
        slug: p.slug,
        liveUrl: `${SITE}/thoughts/${p.slug}/`,
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
export async function saveDraftToRepo(input: PublishInput & { peekCount?: number; target?: number }): Promise<string> {
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
    },
    body
  );
  const entries: Entry[] = [{ path: `content/drafts/${input.slug}.md`, mode: '100644', type: 'blob', sha: await createTextBlob(md) }];
  for (const img of input.images) {
    entries.push({ path: `public/drafts/${input.slug}/${img.filename}`, mode: '100644', type: 'blob', sha: await createBinaryBlob(img.blob) });
  }
  return commitTree(state, entries, `wrttr: save draft "${input.title}"`);
}

/** Publish: one atomic commit adding the post + metadata entry + images (and
 *  removing the draft if it came from one). Returns the live URL. */
export async function publishToRepo(input: PublishInput): Promise<{ commit: string; url: string }> {
  const state = await getRepoState();

  if (state.tree.some((t) => t.path === `content/blog/${input.slug}.md`)) {
    throw new WrttrError('collision', `A published post with slug "${input.slug}" already exists.`);
  }

  const body = rewriteImagePaths(input.body, input.images, `/thoughts/${input.slug}`);

  // upsert metadata.json
  const metaEntry = state.tree.find((t) => t.path === 'content/blog/metadata.json');
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
    { path: `content/blog/${input.slug}.md`, mode: '100644', type: 'blob', sha: await createTextBlob(body) },
    { path: 'content/blog/metadata.json', mode: '100644', type: 'blob', sha: await createTextBlob(JSON.stringify(meta, null, 2) + '\n') },
  ];
  for (const img of input.images) {
    entries.push({ path: `public/thoughts/${input.slug}/${img.filename}`, mode: '100644', type: 'blob', sha: await createBinaryBlob(img.blob) });
  }
  if (input.fromDraft) {
    entries.push({ path: `content/drafts/${input.slug}.md`, mode: '100644', type: 'blob', sha: null });
    state.tree
      .filter((t) => t.path.startsWith(`public/drafts/${input.slug}/`) && t.type === 'blob')
      .forEach((t) => entries.push({ path: t.path, mode: '100644', type: 'blob', sha: null }));
  }

  const commit = await commitTree(state, entries, `Publish: ${input.title}`);
  return { commit, url: `${SITE}/thoughts/${input.slug}/` };
}

/** Unpublish: move a published post back to content/drafts (reuses image blob
 *  SHAs — no re-upload) and drop its metadata entry. One commit. */
export async function unpublishFromRepo(slug: string): Promise<string> {
  const state = await getRepoState();
  const postEntry = state.tree.find((t) => t.path === `content/blog/${slug}.md`);
  if (!postEntry) throw new WrttrError('not-found', `No published post "${slug}".`);

  const metaEntry = state.tree.find((t) => t.path === 'content/blog/metadata.json');
  const meta: (BlogPostMeta & { wordCount?: number })[] = metaEntry ? JSON.parse(await getBlobText(metaEntry.sha)) : [];
  const removed = meta.find((m) => m.slug === slug);
  const nextMeta = meta.filter((m) => m.slug !== slug);

  // rewrite /thoughts/<slug>/ -> /drafts/<slug>/ in the body, keep image blobs
  const body = (await getBlobText(postEntry.sha)).split(`/thoughts/${slug}/`).join(`/drafts/${slug}/`);
  const md = buildFrontmatter(
    {
      title: removed?.title || slug,
      slug,
      excerpt: removed?.description || '',
      tags: removed?.tags || [],
      date: removed?.date || todayISO(),
      wordCount: removed?.wordCount ?? 0,
    },
    body
  );

  const entries: Entry[] = [
    { path: `content/drafts/${slug}.md`, mode: '100644', type: 'blob', sha: await createTextBlob(md) },
    { path: `content/blog/${slug}.md`, mode: '100644', type: 'blob', sha: null },
    { path: 'content/blog/metadata.json', mode: '100644', type: 'blob', sha: await createTextBlob(JSON.stringify(nextMeta, null, 2) + '\n') },
  ];
  // move images by reusing their blob SHAs
  state.tree
    .filter((t) => t.path.startsWith(`public/thoughts/${slug}/`) && t.type === 'blob')
    .forEach((t) => {
      const name = t.path.split('/').pop()!;
      entries.push({ path: `public/drafts/${slug}/${name}`, mode: '100644', type: 'blob', sha: t.sha });
      entries.push({ path: t.path, mode: '100644', type: 'blob', sha: null });
    });

  return commitTree(state, entries, `Unpublish: ${removed?.title || slug}`);
}

/** Delete a repo item (published or draft) and its images in one commit. */
export async function deleteFromRepo(slug: string, kind: 'draft' | 'published'): Promise<string> {
  const state = await getRepoState();
  const entries: Entry[] = [];

  if (kind === 'published') {
    entries.push({ path: `content/blog/${slug}.md`, mode: '100644', type: 'blob', sha: null });
    const metaEntry = state.tree.find((t) => t.path === 'content/blog/metadata.json');
    if (metaEntry) {
      const meta = JSON.parse(await getBlobText(metaEntry.sha)).filter((m: BlogPostMeta) => m.slug !== slug);
      entries.push({ path: 'content/blog/metadata.json', mode: '100644', type: 'blob', sha: await createTextBlob(JSON.stringify(meta, null, 2) + '\n') });
    }
  } else {
    entries.push({ path: `content/drafts/${slug}.md`, mode: '100644', type: 'blob', sha: null });
  }
  const imgDir = kind === 'published' ? `public/thoughts/${slug}/` : `public/drafts/${slug}/`;
  state.tree
    .filter((t) => t.path.startsWith(imgDir) && t.type === 'blob')
    .forEach((t) => entries.push({ path: t.path, mode: '100644', type: 'blob', sha: null }));

  return commitTree(state, entries, `wrttr: delete ${kind} "${slug}"`);
}
