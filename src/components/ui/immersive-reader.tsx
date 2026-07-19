'use client';

import { useEffect } from 'react';

/**
 * Distraction-free reading. While mounted it puts the document in `immersive`
 * mode: the site chrome (left sidebar, mobile nav) retreats to its edge and
 * only slides back when the cursor comes near that edge. Touch devices (no
 * hover) keep the chrome visible. All the actual hiding lives in globals.css.
 */
export function ImmersiveReader({ edge = 130 }: { edge?: number }) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('immersive');

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine) {
      // No cursor to hover with — keep everything revealed.
      root.classList.add('reveal-left', 'reveal-bottom', 'reveal-top');
      return () => {
        root.classList.remove('immersive', 'reveal-left', 'reveal-bottom', 'reveal-top');
      };
    }

    const onMove = (e: PointerEvent) => {
      root.classList.toggle('reveal-left', e.clientX <= edge);
      root.classList.toggle('reveal-top', e.clientY <= edge);
      root.classList.toggle('reveal-bottom', e.clientY >= window.innerHeight - edge);
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onMove);
      root.classList.remove('immersive', 'reveal-left', 'reveal-top', 'reveal-bottom');
    };
  }, [edge]);

  return null;
}
