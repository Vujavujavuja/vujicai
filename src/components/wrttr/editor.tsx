'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ImagePlus, Check } from 'lucide-react';
import { sessionsDB, imagesDB, newId } from '@/lib/wrttr/db';
import { compressToWebp, imageFilename } from '@/lib/wrttr/image';
import { markdownToHtml, slugify } from '@/lib/markdown';
import { countWords } from '@/lib/wrttr/config';
import {
  publishToRepo,
  saveDraftToRepo,
  updatePublished,
  loadRepoPost,
  collectionUrlBase,
  WrttrError,
  type DraftImage,
} from '@/lib/wrttr/github';
import type { LocalSession, LocalImage, Collection } from '@/lib/wrttr/types';

type Source = 'local' | 'published' | 'draft';

export function Editor() {
  const [session, setSession] = useState<LocalSession | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [body, setBody] = useState('');
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [pubBusy, setPubBusy] = useState<'draft' | 'publish' | null>(null);
  const [status, setStatus] = useState<{ kind: 'ok' | 'err'; msg: string; url?: string } | null>(null);

  const idRef = useRef('');
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const filenameRef = useRef<string | undefined>(undefined);
  const [source, setSource] = useState<Source>('local');
  const [collection, setCollection] = useState<Collection>('thought');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const repoSlug = params.get('slug');
    const kind = params.get('kind') as 'published' | 'draft' | null;
    const urlCollection = params.get('collection') === 'deep' ? 'deep' : 'thought';

    // Editing an existing repo post/draft (EDIT-9).
    if (repoSlug && kind) {
      idRef.current = repoSlug; // any new images are keyed under the slug
      setSource(kind);
      (async () => {
        try {
          const post = await loadRepoPost(repoSlug, kind, urlCollection);
          filenameRef.current = post.filename;
          setCollection(post.collection);
          setSession({
            id: repoSlug,
            createdAt: 0,
            updatedAt: 0,
            state: 'drafting',
            target: 0,
            rawText: post.body,
            peekCount: 0,
            durationMs: 0,
          });
          setTitle(post.title);
          setSlug(post.slug);
          setSlugTouched(true);
          setExcerpt(post.excerpt);
          setTags(post.tags.join(', '));
          setBody(post.body);
        } catch (e) {
          setNotFound(true);
          setStatus({ kind: 'err', msg: (e as WrttrError).message });
        }
      })();
      return;
    }

    // Editing a local session.
    if (!id) {
      setNotFound(true);
      return;
    }
    idRef.current = id;
    setSource('local');
    (async () => {
      const s = await sessionsDB.get(id);
      if (!s) {
        setNotFound(true);
        return;
      }
      setSession(s);
      setTitle(s.title || '');
      if (s.slug) {
        setSlug(s.slug);
        setSlugTouched(true);
      }
      setExcerpt(s.excerpt || '');
      setTags((s.tags || []).join(', '));
      setBody(s.body ?? s.rawText ?? '');

      const imgs = await imagesDB.forSession(id);
      const urls: Record<string, string> = {};
      imgs.forEach((im) => (urls[im.filename] = URL.createObjectURL(im.blob)));
      setImageUrls(urls);
    })();
  }, []);

  // Auto-derive slug from title until the slug is edited by hand.
  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  const tagsArr = useMemo(
    () => tags.split(',').map((t) => t.trim()).filter(Boolean),
    [tags]
  );

  const save = useCallback(
    (flash = true) => {
      if (source !== 'local' || !idRef.current || !session) return; // repo posts don't touch IndexedDB
      const s: LocalSession = {
        ...session,
        title,
        slug,
        excerpt,
        tags: tagsArr,
        body,
        state: 'drafting',
        updatedAt: Date.now(),
      };
      sessionsDB.put(s);
      setSession(s);
      if (flash) {
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      }
    },
    [source, session, title, slug, excerpt, tagsArr, body]
  );

  // Debounced autosave.
  useEffect(() => {
    if (!session) return;
    const t = setTimeout(() => save(false), 800);
    return () => clearTimeout(t);
  }, [title, slug, excerpt, tags, body, session, save]);

  function insertAtCursor(snippet: string) {
    const ta = bodyRef.current;
    if (!ta) {
      setBody((b) => b + snippet);
      return;
    }
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    setBody((b) => b.slice(0, start) + snippet + b.slice(end));
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + snippet.length;
      ta.setSelectionRange(pos, pos);
    });
  }

  async function handleImageFile(file: File) {
    setBusy(true);
    try {
      const webp = await compressToWebp(file);
      const alt = window.prompt('Alt text — describe the image (required):')?.trim();
      if (!alt) {
        alert('Alt text is required; image not inserted.');
        return;
      }
      const filename = imageFilename(alt);
      const img: LocalImage = { id: newId(), sessionId: idRef.current, blob: webp, alt, filename };
      await imagesDB.put(img);
      setImageUrls((m) => ({ ...m, [filename]: URL.createObjectURL(webp) }));
      insertAtCursor(`\n\n![${alt}](${filename})\n\n`);
    } catch (e) {
      alert('Could not process image: ' + (e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function onPaste(e: React.ClipboardEvent) {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const it of Array.from(items)) {
      if (it.type.startsWith('image/')) {
        e.preventDefault();
        const file = it.getAsFile();
        if (file) handleImageFile(file);
        return;
      }
    }
  }

  function onDrop(e: React.DragEvent) {
    const files = e.dataTransfer?.files;
    if (files && files.length) {
      const img = Array.from(files).find((f) => f.type.startsWith('image/'));
      if (img) {
        e.preventDefault();
        handleImageFile(img);
      }
    }
  }

  async function gatherImages(): Promise<DraftImage[]> {
    const imgs = await imagesDB.forSession(idRef.current);
    return imgs.map((i) => ({ filename: i.filename, blob: i.blob }));
  }

  async function doUpdate() {
    if (!title.trim() || !body.trim()) {
      setStatus({ kind: 'err', msg: 'Title and body are required.' });
      return;
    }
    if (!window.confirm(`Update the published "${title}"?`)) return;
    setPubBusy('publish');
    setStatus(null);
    try {
      const { url } = await updatePublished(
        {
          slug,
          title,
          excerpt,
          tags: tagsArr,
          body,
          wordCount: countWords(body),
          images: await gatherImages(),
          filename: filenameRef.current,
        },
        collection
      );
      setStatus({ kind: 'ok', msg: 'Updated. Cloudflare is redeploying.', url });
    } catch (e) {
      setStatus({ kind: 'err', msg: (e as WrttrError).message });
    } finally {
      setPubBusy(null);
    }
  }

  async function doSaveDraft() {
    if (!title.trim() || !slug.trim()) {
      setStatus({ kind: 'err', msg: 'Add a title first.' });
      return;
    }
    save(false);
    setPubBusy('draft');
    setStatus(null);
    try {
      await saveDraftToRepo({
        slug,
        title,
        excerpt,
        tags: tagsArr,
        body,
        wordCount: countWords(body),
        images: await gatherImages(),
        peekCount: session?.peekCount,
        target: session?.target,
        collection,
      });
      setStatus({ kind: 'ok', msg: 'Draft saved to the repo.' });
    } catch (e) {
      setStatus({ kind: 'err', msg: (e as WrttrError).message });
    } finally {
      setPubBusy(null);
    }
  }

  async function doPublish() {
    if (!title.trim() || !slug.trim()) {
      setStatus({ kind: 'err', msg: 'Title and slug are required.' });
      return;
    }
    if (!body.trim()) {
      setStatus({ kind: 'err', msg: 'Nothing to publish yet.' });
      return;
    }
    if (!window.confirm(`Publish "${title}" to vujic.ai/${collectionUrlBase(collection)}/${slug}?`)) return;
    save(false);
    setPubBusy('publish');
    setStatus(null);
    try {
      const { url } = await publishToRepo(
        {
          slug,
          title,
          excerpt,
          tags: tagsArr,
          body,
          wordCount: countWords(body),
          images: await gatherImages(),
        },
        collection
      );
      setStatus({ kind: 'ok', msg: 'Published. Cloudflare is deploying it now.', url });
    } catch (e) {
      setStatus({ kind: 'err', msg: (e as WrttrError).message });
    } finally {
      setPubBusy(null);
    }
  }

  const previewHtml = useMemo(() => {
    let html = markdownToHtml(body || '');
    for (const [filename, url] of Object.entries(imageUrls)) {
      html = html.split(`src="${filename}"`).join(`src="${url}"`);
    }
    return html;
  }, [body, imageUrls]);

  if (notFound) {
    return (
      <div className="min-h-[100svh] bg-background text-foreground flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">That draft isn&apos;t here.</p>
        <a href="/wrttr/" className="px-4 py-2 rounded-xl border border-border hover:border-primary hover:text-primary transition-colors text-sm">
          Back to library
        </a>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-[100svh] flex items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] bg-background text-foreground">
      {/* top bar */}
      <div className="sticky top-0 z-10 bg-background/90 backdrop-blur border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-3 flex items-center gap-4">
          <a href="/wrttr/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← library
          </a>
          <span className="text-xs text-muted-foreground/60 tabular-nums">{countWords(body)} words</span>

          {/* Publish target: Thought vs long-form Deep Thought. Locked once a
              post is live (moving between collections isn't supported). */}
          {source === 'published' ? (
            <span className="text-xs uppercase tracking-wider text-muted-foreground/60 font-mono">
              {collection === 'deep' ? 'deep thought' : 'thought'}
            </span>
          ) : (
            <div className="flex items-center rounded-lg border border-border overflow-hidden text-xs">
              {(['thought', 'deep'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCollection(c)}
                  className={`px-2.5 py-1 transition-colors ${
                    collection === c
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {c === 'deep' ? 'Deep Thought' : 'Thought'}
                </button>
              ))}
            </div>
          )}

          {source === 'published' && (
            <span className="text-xs uppercase tracking-wider text-primary/80 font-mono">editing live post</span>
          )}
          <div className="ml-auto flex items-center gap-3">
            {saved && source === 'local' && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> saved locally
              </span>
            )}
            {source === 'published' ? (
              <button
                onClick={doUpdate}
                disabled={pubBusy !== null}
                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                {pubBusy === 'publish' ? 'updating…' : 'Update'}
              </button>
            ) : (
              <>
                <button
                  onClick={doSaveDraft}
                  disabled={pubBusy !== null}
                  className="px-4 py-2 rounded-xl border border-border hover:border-primary hover:text-primary transition-colors text-sm disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground"
                >
                  {pubBusy === 'draft' ? 'saving…' : 'Save draft'}
                </button>
                <button
                  onClick={doPublish}
                  disabled={pubBusy !== null}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                  {pubBusy === 'publish' ? 'publishing…' : 'Publish'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {status && (
        <div className="mx-auto max-w-6xl px-6 pt-4">
          <div
            className={`rounded-xl border px-4 py-3 text-sm ${
              status.kind === 'ok' ? 'border-primary/40 text-foreground' : 'border-red-500/40 text-red-300'
            }`}
          >
            {status.msg}
            {status.url && (
              <a href={status.url} target="_blank" rel="noopener noreferrer" className="underline text-primary ml-1">
                view →
              </a>
            )}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* metadata */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full bg-transparent font-serif text-3xl md:text-4xl font-medium tracking-tight focus:outline-none placeholder:text-muted-foreground/30 mb-4"
        />
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground w-16">slug</span>
            <input
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
              placeholder="auto-from-title"
              className="flex-1 bg-transparent border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono text-xs"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground w-16">tags</span>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="ai, sleep, …"
              className="flex-1 bg-transparent border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40 text-xs"
            />
          </label>
        </div>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Excerpt — one or two sentences for the Thoughts index"
          rows={2}
          className="w-full bg-transparent border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm mb-6 resize-none"
        />

        {/* editor + preview */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2 text-xs text-muted-foreground">
              <span>Markdown</span>
              <span className="flex items-center gap-1.5">
                <ImagePlus className="w-3.5 h-3.5" />
                paste or drop an image {busy && '· processing…'}
              </span>
            </div>
            <textarea
              ref={bodyRef}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onPaste={onPaste}
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
              spellCheck
              className="w-full min-h-[60svh] bg-transparent border border-border rounded-2xl p-5 text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none font-sans"
            />
          </div>
          <div>
            <div className="mb-2 text-xs text-muted-foreground">Preview</div>
            <div className="min-h-[60svh] border border-border rounded-2xl p-6 overflow-auto">
              {body.trim() ? (
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: previewHtml }} />
              ) : (
                <p className="text-muted-foreground/40 italic text-sm">Preview appears here.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
