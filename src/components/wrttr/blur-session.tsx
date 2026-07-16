'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Eye } from 'lucide-react';
import { blurFor, countWords, AUTOSAVE_MS, DEFAULT_TARGET } from '@/lib/wrttr/config';
import { sessionsDB, requestPersist, newId } from '@/lib/wrttr/db';
import type { LocalSession } from '@/lib/wrttr/types';

export function BlurSession() {
  const [session, setSession] = useState<LocalSession | null>(null);
  const [text, setText] = useState('');
  const [peeking, setPeeking] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [peekTick, setPeekTick] = useState(0); // bumps autosave so peekCount persists

  const peekCountRef = useRef(0);
  const startRef = useRef(Date.now());
  const savedDurationRef = useRef(0);
  const idRef = useRef('');
  const targetRef = useRef(DEFAULT_TARGET);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Init from URL: ?id= resumes (SESS-9), ?target= starts new.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const target = Number(params.get('target')) || DEFAULT_TARGET;
    requestPersist();
    (async () => {
      if (id) {
        const existing = await sessionsDB.get(id);
        if (existing) {
          idRef.current = existing.id;
          targetRef.current = existing.target;
          peekCountRef.current = existing.peekCount;
          savedDurationRef.current = existing.durationMs || 0;
          setSession(existing);
          setText(existing.rawText || '');
          if (existing.state === 'drafting') setDone(true);
          setLoading(false);
          return;
        }
      }
      const now = Date.now();
      const s: LocalSession = {
        id: id || newId(),
        createdAt: now,
        updatedAt: now,
        state: 'incomplete',
        target,
        rawText: '',
        peekCount: 0,
        durationMs: 0,
      };
      idRef.current = s.id;
      targetRef.current = target;
      await sessionsDB.put(s);
      setSession(s);
      setLoading(false);
    })();
  }, []);

  const target = targetRef.current;
  const wordCount = countWords(text);
  const pct = target > 0 ? Math.min(100, (wordCount / target) * 100) : 0;

  const persist = useCallback(
    (over: Partial<LocalSession>) => {
      if (!idRef.current) return;
      const now = Date.now();
      const s: LocalSession = {
        id: idRef.current,
        createdAt: session?.createdAt || now,
        updatedAt: now,
        state: session?.state || 'incomplete',
        target: targetRef.current,
        rawText: text,
        peekCount: peekCountRef.current,
        durationMs: savedDurationRef.current + (now - startRef.current),
        title: session?.title,
        slug: session?.slug,
        ...over,
      };
      sessionsDB.put(s);
    },
    [session, text]
  );

  // Autosave (SESS-8), debounced.
  useEffect(() => {
    if (loading || done) return;
    const t = setTimeout(() => persist({ rawText: text }), AUTOSAVE_MS);
    return () => clearTimeout(t);
  }, [text, peekTick, loading, done, persist]);

  // Target hit (SESS-11): lift blur, freeze rawText, become an editable draft.
  useEffect(() => {
    if (!loading && !done && target > 0 && wordCount >= target) {
      setDone(true);
      setPeeking(false);
      persist({ state: 'drafting', rawText: text, body: text });
    }
  }, [wordCount, target, loading, done, text, persist]);

  // Keystroke capture while writing (SESS-4/5/6).
  useEffect(() => {
    if (loading || done) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Control' || e.key === 'Meta') {
        if (!peeking) {
          peekCountRef.current += 1;
          setPeeking(true);
          setPeekTick((t) => t + 1);
        }
        return;
      }
      const nav = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'];
      if (nav.includes(e.key) || (e.key.toLowerCase() === 'a' && (e.ctrlKey || e.metaKey))) {
        e.preventDefault();
        return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'Backspace') {
        e.preventDefault();
        setText((t) => {
          if (!t) return t;
          const last = t[t.length - 1];
          if (last === ' ' || last === '\n') return t; // boundary at last space
          return t.slice(0, -1);
        });
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        setText((t) => t + '\n');
        return;
      }
      if (e.key === ' ') {
        e.preventDefault();
        setText((t) => t + ' ');
        return;
      }
      if (e.key.length === 1) {
        e.preventDefault();
        setText((t) => t + e.key);
      }
    }
    function onKeyUp(e: KeyboardEvent) {
      if (e.key === 'Control' || e.key === 'Meta') setPeeking(false);
    }
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [loading, done, peeking]);

  // Paste disabled during a session (SESS-6).
  useEffect(() => {
    function onPaste(e: ClipboardEvent) {
      if (!done) e.preventDefault();
    }
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [done]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [text]);

  const words = useMemo(() => {
    const tokens = text.split(/(\s+)/).filter((t) => t !== '');
    const total = tokens.reduce((n, t) => n + (/^\s+$/.test(t) ? 0 : 1), 0);
    let wi = 0;
    return tokens.map((tok, i) => {
      const isSpace = /^\s+$/.test(tok);
      const d = total - 1 - wi;
      if (!isSpace) wi += 1;
      const b = peeking ? 0 : blurFor(d);
      return { tok, blur: b, key: i };
    });
  }, [text, peeking]);

  function abandon() {
    persist({ state: 'incomplete', rawText: text });
    window.location.href = '/wrttr/';
  }

  async function copyAll() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  if (loading) {
    return (
      <div className="min-h-[100svh] flex items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Post-target: blur lifts, text becomes an editable draft (M1 seam → M2 editor).
  if (done) {
    return (
      <div className="min-h-[100svh] bg-background text-foreground flex flex-col items-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <p className="text-sm text-muted-foreground italic mb-6 text-center">
            {wordCount} words. The blur is gone — this is yours to edit now.
          </p>
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              persist({ rawText: session?.rawText ?? text, body: e.target.value, state: 'drafting' });
            }}
            className="w-full min-h-[55svh] bg-transparent border border-border rounded-2xl p-6 text-lg leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none font-sans"
            spellCheck
          />
          <div className="flex items-center justify-between mt-6 text-sm">
            <button onClick={copyAll} className="px-4 py-2 rounded-xl border border-border hover:border-primary hover:text-primary transition-colors">
              {copied ? 'Copied' : 'Copy text'}
            </button>
            <a href="/wrttr/" className="px-4 py-2 rounded-xl border border-border hover:border-primary hover:text-primary transition-colors">
              Back to library
            </a>
          </div>
          <p className="text-xs text-muted-foreground/60 mt-6 text-center">
            Full editor, images and publish land in the next stage.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background text-foreground flex flex-col">
      {/* progress bar */}
      <div className="h-1 w-full bg-border/40">
        <div className="h-full bg-primary transition-[width] duration-300" style={{ width: `${pct}%` }} />
      </div>

      {/* writing surface */}
      <div ref={scrollRef} className="flex-1 overflow-hidden px-6 md:px-0">
        <div
          className="mx-auto max-w-2xl py-[18vh] text-xl md:text-2xl leading-relaxed font-sans whitespace-pre-wrap break-words"
          style={{ minHeight: '100%' }}
        >
          {words.length === 0 && (
            <span className="text-muted-foreground/50 italic">Start typing…</span>
          )}
          {words.map(({ tok, blur, key }) => (
            <span
              key={key}
              style={{ filter: blur ? `blur(${blur}px)` : undefined, transition: 'filter 0.25s ease' }}
            >
              {tok}
            </span>
          ))}
          <span className="inline-block w-[2px] h-[1.1em] align-middle bg-primary animate-pulse ml-[1px]" />
        </div>
      </div>

      {/* footer chrome: count, peek, abandon */}
      <div className="flex items-center justify-between px-6 py-4 text-sm text-muted-foreground select-none">
        <button
          onClick={abandon}
          className="hover:text-primary transition-colors"
          title="Save as incomplete and leave"
        >
          Abandon
        </button>
        <div className="tabular-nums">
          {wordCount} / {target}
        </div>
        <button
          onMouseDown={() => {
            peekCountRef.current += 1;
            setPeeking(true);
            setPeekTick((t) => t + 1);
          }}
          onMouseUp={() => setPeeking(false)}
          onMouseLeave={() => setPeeking(false)}
          className="flex items-center gap-1.5 hover:text-primary transition-colors"
          title="Hold to peek (also: hold Ctrl)"
        >
          <Eye className="w-4 h-4" />
          peek
        </button>
      </div>
    </div>
  );
}
