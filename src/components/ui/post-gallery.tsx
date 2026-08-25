'use client';

import { useEffect, useRef, useState } from 'react';
import { CardStack, type CardStackItem } from '@/components/ui/card-stack';
import type { GalleryImage } from '@/types';

/**
 * A metadata-driven photo carousel for a Thought. Wraps the fan-style CardStack
 * and sizes the cards to the available width so the fan fits on any screen. The
 * overflow is clipped so the arced side cards never push the page sideways.
 */
export function PostGallery({ items }: { items: GalleryImage[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const cardWidth = Math.round(Math.max(240, Math.min(480, w * 0.8)));
  const cardHeight = Math.round(cardWidth * 0.66); // ~3:2, matches the photos

  const cards: CardStackItem[] = items.map((it, i) => ({ id: i, ...it }));

  return (
    <figure ref={ref} className="my-12 overflow-hidden">
      {w > 0 && (
        <CardStack
          items={cards}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          maxVisible={Math.min(items.length, 5)}
          overlap={0.5}
          spreadDeg={14}
          loop
          autoAdvance
          intervalMs={4200}
          pauseOnHover
          showDots
        />
      )}
    </figure>
  );
}
