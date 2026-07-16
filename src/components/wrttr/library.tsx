'use client';

import { useEffect, useState } from 'react';
import { PenLine, Trash2 } from 'lucide-react';
import { sessionsDB } from '@/lib/wrttr/db';
import { countWords, DEFAULT_TARGET, TARGET_MIN, TARGET_MAX } from '@/lib/wrttr/config';
import type { LocalSession } from '@/lib/wrttr/types';

function fmtDate(ms: number) {
  return new Date(ms).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const stateLabel: Record<string, string> = {
  incomplete: 'in session',
  drafting: 'local draft',
};

export function Library() {
  const [sessions, setSessions] = useState<LocalSession[] | null>(null);
  const [target, setTarget] = useState(DEFAULT_TARGET);

  useEffect(() => {
    sessionsDB.all().then((all) =>
      setSessions(all.sort((a, b) => b.updatedAt - a.updatedAt))
    );
  }, []);

  function start() {
    const t = Math.max(TARGET_MIN, Math.min(TARGET_MAX, target || DEFAULT_TARGET));
    window.location.href = `/wrttr/session?target=${t}`;
  }

  async function remove(id: string) {
    if (!confirm('Delete this session? This cannot be undone.')) return;
    await sessionsDB.delete(id);
    setSessions((s) => (s ? s.filter((x) => x.id !== id) : s));
  }

  return (
    <div className="min-h-[100svh] bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <header className="mb-12 text-center">
          <p className="text-xs text-muted-foreground/50 italic tracking-wide mb-2">private</p>
          <h1 className="font-serif text-5xl md:text-6xl font-medium tracking-tight">wrttr</h1>
        </header>

        {/* New session */}
        <div className="rounded-2xl border border-border p-6 mb-12">
          <div className="flex items-center gap-4">
            <label className="text-sm text-muted-foreground">Word target</label>
            <input
              type="number"
              value={target}
              min={TARGET_MIN}
              max={TARGET_MAX}
              step={50}
              onChange={(e) => setTarget(Number(e.target.value))}
              className="w-24 bg-transparent border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 tabular-nums"
            />
            <button
              onClick={start}
              className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <PenLine className="w-4 h-4" />
              New session
            </button>
          </div>
        </div>

        {/* Library list */}
        {sessions === null ? (
          <div className="flex justify-center py-10">
            <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : sessions.length === 0 ? (
          <p className="text-center text-muted-foreground/60 text-sm py-10">
            No sessions yet. Set a target and start writing.
          </p>
        ) : (
          <ul className="space-y-3">
            {sessions.map((s) => {
              const wc = countWords(s.rawText);
              const resumeHref = `/wrttr/session?id=${s.id}`;
              return (
                <li key={s.id} className="group flex items-center gap-4 rounded-xl border border-border px-5 py-4 hover:border-primary/50 transition-colors">
                  <a href={resumeHref} className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-wider text-primary/80 font-mono">
                        {stateLabel[s.state] ?? s.state}
                      </span>
                      <span className="text-xs text-muted-foreground/60">{fmtDate(s.updatedAt)}</span>
                    </div>
                    <div className="truncate mt-1 font-serif text-lg">
                      {s.title || (s.rawText ? s.rawText.slice(0, 60) : 'Empty session')}
                    </div>
                    <div className="text-xs text-muted-foreground/60 mt-1 tabular-nums">
                      {wc} / {s.target} words{s.peekCount ? ` · ${s.peekCount} peeks` : ''}
                    </div>
                  </a>
                  <button
                    onClick={() => remove(s.id)}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <p className="text-xs text-muted-foreground/40 mt-12 text-center">
          Repo drafts, published posts, editor and publish land in the next stages.
        </p>
      </div>
    </div>
  );
}
