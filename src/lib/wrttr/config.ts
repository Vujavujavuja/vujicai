// All tunable knobs for the writing surface live here (§7.2.1: "tokens
// tunable in one place"). The blur gradient is the make-or-break decision —
// iterate on these, not on the component.

export const BLUR = {
  sharpWords: 8, // last N words fully legible
  rampWords: 15, // next N words ramp from rampStartPx -> rampEndPx
  rampStartPx: 0.5,
  rampEndPx: 4,
  priorPx: 6, // everything older than the ramp
} as const;

export const DEFAULT_TARGET = 700; // §12.6: a 30-min block is likelier 600–900
export const TARGET_MIN = 100;
export const TARGET_MAX = 3000;
export const AUTOSAVE_MS = 500;

/** Blur (px) for a word `d` positions from the end (0 = the word being typed). */
export function blurFor(d: number): number {
  if (d < BLUR.sharpWords) return 0;
  if (d < BLUR.sharpWords + BLUR.rampWords) {
    const p = (d - BLUR.sharpWords) / Math.max(1, BLUR.rampWords - 1);
    return BLUR.rampStartPx + (BLUR.rampEndPx - BLUR.rampStartPx) * p;
  }
  return BLUR.priorPx;
}

export function countWords(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}
