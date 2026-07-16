// Client-side image handling for the editor (EDIT-5): resize to <=1600px wide
// and convert to WebP q~0.82 at insert time, so the repo never carries a raw
// phone photo (§11.3).
import { slugify } from '@/lib/markdown';

const MAX_WIDTH = 1600;
const QUALITY = 0.82;

export async function compressToWebp(file: Blob): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_WIDTH / bitmap.width);
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/webp', QUALITY)
  );
  if (!blob) throw new Error('WebP encode failed (browser may not support it)');
  return blob;
}

/** A stable, readable, unique filename derived from the alt text. */
export function imageFilename(alt: string): string {
  const base = slugify(alt).slice(0, 32) || 'image';
  const rand = Math.random().toString(36).slice(2, 7);
  return `${base}-${rand}.webp`;
}
