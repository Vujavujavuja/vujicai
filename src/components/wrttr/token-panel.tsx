'use client';

import { useState } from 'react';
import { getToken, setToken, clearToken, verifyToken } from '@/lib/wrttr/github';

export function TokenPanel({ onChange }: { onChange?: () => void }) {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'err'>('idle');
  const [msg, setMsg] = useState('');
  const connected = !!getToken();

  async function connect() {
    if (!value.trim()) return;
    setStatus('checking');
    setToken(value);
    const r = await verifyToken();
    if (r.ok) {
      setValue('');
      setStatus('idle');
      setMsg('');
      onChange?.();
    } else {
      clearToken();
      setStatus('err');
      setMsg(r.error || 'Invalid token.');
    }
  }

  function disconnect() {
    clearToken();
    setStatus('idle');
    setMsg('');
    onChange?.();
  }

  if (connected) {
    return (
      <div className="flex items-center gap-3 text-xs">
        <span className="text-primary">● GitHub connected</span>
        <button onClick={disconnect} className="text-muted-foreground hover:text-primary underline underline-offset-2">
          disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border p-5 mb-8">
      <p className="text-sm text-muted-foreground mb-3">
        Connect a fine-grained GitHub token (Contents: read &amp; write on this repo) to publish.
        It&apos;s stored only in this browser.
      </p>
      <div className="flex gap-2">
        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && connect()}
          placeholder="github_pat_…"
          className="flex-1 bg-transparent border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <button
          onClick={connect}
          disabled={status === 'checking'}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
        >
          {status === 'checking' ? 'checking…' : 'Connect'}
        </button>
      </div>
      {msg && <p className="text-xs mt-2 text-red-400">{msg}</p>}
    </div>
  );
}
