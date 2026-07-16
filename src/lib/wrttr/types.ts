// §9 data model — IndexedDB is the hot buffer; the repo is the source of
// truth once committed.

export type SessionState = 'incomplete' | 'drafting';

export interface LocalSession {
  id: string;
  createdAt: number;
  updatedAt: number;
  state: SessionState;
  target: number;
  rawText: string; // unedited blur output, never overwritten after target hit
  peekCount: number;
  durationMs: number;
  title?: string;
  slug?: string;
  excerpt?: string;
  tags?: string[];
  body?: string; // diverges from rawText once edited in the editor
}

export interface LocalImage {
  id: string;
  sessionId: string;
  blob: Blob; // already resized + webp'd (EDIT-5)
  alt: string;
  filename: string;
}

/** Merged library row across the three sources (§7.3). */
export type LibraryState = 'local' | 'incomplete' | 'draft' | 'published';

export interface LibraryItem {
  id: string; // session id (local) or slug (repo)
  state: LibraryState;
  title: string;
  date: number;
  wordCount: number;
  target?: number;
  peekCount?: number;
  slug?: string;
  liveUrl?: string;
}
