'use client';

import { useCallback, useEffect, useState } from 'react';
import { PenLine, Trash2, RefreshCw, ExternalLink, ArrowDownToLine } from 'lucide-react';
import { sessionsDB } from '@/lib/wrttr/db';
import { countWords, DEFAULT_TARGET, TARGET_MIN, TARGET_MAX } from '@/lib/wrttr/config';
import {
  getLibraryItems,
  unpublishFromRepo,
  deleteFromRepo,
  invalidateLibraryCache,
  WrttrError,
} from '@/lib/wrttr/github';
import type { LocalSession, LibraryItem, LibraryState } from '@/lib/wrttr/types';

function fmtDate(ms: number) {
  if (!ms) return '';
  return new Date(ms).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const STATE_META: Record<LibraryState, { label: string; cls: string }> = {
  local: { label: 'local draft', cls: 'text-muted-foreground' },
  incomplete: { label: 'in session', cls: 'text-muted-foreground/80' },
  draft: { label: 'repo draft', cls: 'text-primary/70' },
  published: { label: 'published', cls: 'text-primary' },
};

export function Library() {
  const [sessions, setSessions] = useState<LocalSession[] | null>(null);
  const [repoItems, setRepoItems] = useState<LibraryItem[]>([]);
  const [repoLoading, setRepoLoading] = useState(false);
  const [repoErr, setRepoErr] = useState('');
  const [target, setTarget] = useState(DEFAULT_TARGET);
  const [acting, setActing] = useState<string | null>(null);

  const loadLocal = useCallback(() => {
    sessionsDB.all().then((all) => setSessions(all.sort((a, b) => b.updatedAt - a.updatedAt)));
  }, []);

  const loadRepo = useCallback(async (force = false) => {
    setRepoLoading(true);
    setRepoErr('');
    try {
      setRepoItems(await getLibraryItems(force));
    } catch (e) {
      setRepoErr((e as WrttrError).message);
    } finally {
      setRepoLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLocal();
    loadRepo(false);
  }, [loadLocal, loadRepo]);

  function start() {
    const t = Math.max(TARGET_MIN, Math.min(TARGET_MAX, target || DEFAULT_TARGET));
    window.location.href = `/wrttr/session?target=${t}`;
  }

  async function removeLocal(id: string) {
    if (!confirm('Delete this session? This cannot be undone.')) return;
    await sessionsDB.delete(id);
    loadLocal();
  }

  async function repoAction(fn: () => Promise<unknown>, slug: string) {
    setActing(slug);
    setRepoErr('');
    try {
      await fn();
      invalidateLibraryCache();
      await loadRepo(true);
    } catch (e) {
      setRepoErr((e as WrttrError).message);
    } finally {
      setActing(null);
    }
  }

  const localItems: LibraryItem[] = (sessions || []).map((s) => {
    const text = s.body ?? s.rawText;
    return {
      id: s.id,
      state: s.state === 'drafting' ? 'local' : 'incomplete',
      title: s.title || text.slice(0, 60) || 'Empty session',
      date: s.updatedAt,
      wordCount: countWords(text),
      target: s.target,
      peekCount: s.peekCount,
      slug: s.slug,
    };
  });
  const all = [...localItems, ...repoItems].sort((a, b) => b.date - a.date);
  const ready = sessions !== null;

  return (
    <div className="min-h-[100svh] bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <header className="mb-10 text-center">
          <p className="text-xs text-muted-foreground/50 italic tracking-wide mb-2">private</p>
          <h1 className="font-serif text-5xl md:text-6xl font-medium tracking-tight">wrttr</h1>
        </header>

        {/* New session */}
        <div className="rounded-2xl border border-border p-6 mb-8">
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

        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs uppercase tracking-wider text-muted-foreground/60">Library</h2>
          <button
            onClick={() => loadRepo(true)}
            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${repoLoading ? 'animate-spin' : ''}`} />
            refresh
          </button>
        </div>
        {repoErr && <p className="text-xs text-red-400 mb-3">{repoErr}</p>}

        {!ready ? (
          <div className="flex justify-center py-10">
            <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : all.length === 0 ? (
          <p className="text-center text-muted-foreground/60 text-sm py-10">
            No sessions yet. Set a target and start writing.
          </p>
        ) : (
          <ul className="space-y-3">
            {all.map((item) => {
              const meta = STATE_META[item.state];
              const isLocal = item.state === 'local' || item.state === 'incomplete';
              const href =
                item.state === 'local'
                  ? `/wrttr/edit?id=${item.id}`
                  : item.state === 'incomplete'
                    ? `/wrttr/session?id=${item.id}`
                    : item.liveUrl || undefined;
              const busy = acting === item.slug;
              return (
                <li
                  key={`${item.state}-${item.id}`}
                  className="group flex items-center gap-4 rounded-xl border border-border px-5 py-4 hover:border-primary/40 transition-colors"
                >
                  <a
                    href={href}
                    target={item.state === 'published' ? '_blank' : undefined}
                    rel={item.state === 'published' ? 'noopener noreferrer' : undefined}
                    className="flex-1 min-w-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-xs uppercase tracking-wider font-mono ${meta.cls}`}>{meta.label}</span>
                      {item.date > 0 && <span className="text-xs text-muted-foreground/50">{fmtDate(item.date)}</span>}
                    </div>
                    <div className="truncate mt-1 font-serif text-lg">{item.title}</div>
                    <div className="text-xs text-muted-foreground/60 mt-1 tabular-nums">
                      {item.wordCount} words
                      {item.target ? ` / ${item.target}` : ''}
                      {item.peekCount ? ` · ${item.peekCount} peeks` : ''}
                    </div>
                  </a>

                  <div className="flex items-center gap-3 shrink-0">
                    {item.state === 'published' && (
                      <button
                        onClick={() => repoAction(() => unpublishFromRepo(item.slug!), item.slug!)}
                        disabled={busy}
                        title="Unpublish (move back to drafts)"
                        className="text-xs text-muted-foreground hover:text-primary transition-colors disabled:opacity-40 flex items-center gap-1"
                      >
                        <ArrowDownToLine className="w-3.5 h-3.5" />
                        {busy ? '…' : 'unpublish'}
                      </button>
                    )}
                    {item.state === 'published' && item.liveUrl && (
                      <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary" title="View live">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() =>
                        isLocal
                          ? removeLocal(item.id)
                          : confirm(`Delete ${item.state} "${item.title}"? This cannot be undone.`) &&
                            repoAction(() => deleteFromRepo(item.slug!, item.state as 'draft' | 'published'), item.slug!)
                      }
                      disabled={busy}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-all disabled:opacity-40"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
