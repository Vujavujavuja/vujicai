// Minimal dependency-free IndexedDB wrapper for the writing surface.
// Stores: `sessions` (LocalSession) and `images` (LocalImage, indexed by
// sessionId). §8: the session route talks only to IndexedDB, never the network.
import type { LocalSession, LocalImage } from './types';

const DB_NAME = 'wrttr';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('sessions')) {
        db.createObjectStore('sessions', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('images')) {
        const s = db.createObjectStore('images', { keyPath: 'id' });
        s.createIndex('sessionId', 'sessionId', { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function run<T>(
  store: string,
  mode: IDBTransactionMode,
  fn: (s: IDBObjectStore) => IDBRequest
): Promise<T> {
  return openDB().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(store, mode);
        const req = fn(t.objectStore(store));
        req.onsuccess = () => resolve(req.result as T);
        req.onerror = () => reject(req.error);
        t.oncomplete = () => db.close();
      })
  );
}

export const sessionsDB = {
  get: (id: string) =>
    run<LocalSession | undefined>('sessions', 'readonly', (s) => s.get(id)),
  all: () => run<LocalSession[]>('sessions', 'readonly', (s) => s.getAll()),
  put: (v: LocalSession) =>
    run<IDBValidKey>('sessions', 'readwrite', (s) => s.put(v)),
  delete: (id: string) =>
    run<undefined>('sessions', 'readwrite', (s) => s.delete(id)),
};

export const imagesDB = {
  forSession: (sessionId: string) =>
    openDB().then(
      (db) =>
        new Promise<LocalImage[]>((resolve, reject) => {
          const t = db.transaction('images', 'readonly');
          const req = t.objectStore('images').index('sessionId').getAll(sessionId);
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
          t.oncomplete = () => db.close();
        })
    ),
  put: (v: LocalImage) => run<IDBValidKey>('images', 'readwrite', (s) => s.put(v)),
  delete: (id: string) =>
    run<undefined>('images', 'readwrite', (s) => s.delete(id)),
};

/** §11.4 / M4: ask the browser to keep our data across eviction pressure. */
export async function requestPersist(): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.storage?.persist) {
    try {
      return await navigator.storage.persist();
    } catch {
      return false;
    }
  }
  return false;
}

export function newId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `s_${Date.now()}_${Math.floor(Math.random() * 1e9)}`;
}
