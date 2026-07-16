'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ImagePlus, Check } from 'lucide-react';
import { sessionsDB, imagesDB, newId } from '@/lib/wrttr/db';
import { compressToWebp, imageFilename } from '@/lib/wrttr/image';
import { markdownToHtml, slugify } from '@/lib/markdown';
import { countWords } from '@/lib/wrttr/config';
import type { LocalSession, LocalImage } from '@/lib/wrttr/types';

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

  const idRef = useRef('');
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('id');
    if (!id) {
      setNotFound(true);
      return;
    }
    idRef.current = id;
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
      if (!idRef.current || !session) return;
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
    [session, title, slug, excerpt, tagsArr, body]
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
          <div className="ml-auto flex items-center gap-3">
            {saved && (
              <span className="text-xs text-primary flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> saved
              </span>
            )}
            <button
              onClick={() => save(true)}
              className="px-4 py-2 rounded-xl border border-border hover:border-primary hover:text-primary transition-colors text-sm"
            >
              Save
            </button>
            <button
              disabled
              title="Publishing lands with your GitHub token in the next stage"
              className="px-4 py-2 rounded-xl bg-primary/40 text-primary-foreground text-sm font-medium cursor-not-allowed"
            >
              Publish
            </button>
          </div>
        </div>
      </div>

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
