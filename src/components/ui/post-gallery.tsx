'use client';

import { useEffect, useRef, useState } from 'react';
import { CardStack, type CardStackItem } from '@/components/ui/card-stack';
import type { GalleryImage, GalleryOptions } from '@/types';

/**
 * A metadata-driven carousel for a Thought. Wraps the fan-style CardStack and
 * sizes the cards to the available width so the fan fits on any screen. The
 * overflow is clipped so the arced side cards never push the page sideways.
 *
 * Handles both shapes we publish: 3:2 photos with an overlaid caption, and
 * portrait 4:5 slides that already carry their own typography (captions off).
 */
export function PostGallery({
  items,
  options,
}: {
  items: GalleryImage[];
  options?: GalleryOptions;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);

  const aspect = options?.aspect ?? 0.66;
  const maxWidth = options?.maxWidth ?? 480;
  const captions = options?.captions ?? true;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const cardWidth = Math.round(Math.max(240, Math.min(maxWidth, w * 0.8)));
  const cardHeight = Math.round(cardWidth * aspect);

  const cards: CardStackItem[] = items.map((it, i) => ({ id: i, ...it }));

  return (
    <figure ref={ref} className="my-12 overflow-hidden">
      {w > 0 && (
        <CardStack
          items={cards}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          maxVisible={Math.min(items.length, 3)}
          overlap={0.5}
          spreadDeg={14}
          loop
          autoAdvance
          intervalMs={4200}
          pauseOnHover
          showDots
          renderCard={
            captions
              ? undefined
              : (item) => (
                  // Slides carry their own text, so no caption overlay — just
                  // the artwork, with the title kept as the alt text.
                  <img
                    src={item.imageSrc}
                    alt={item.title}
                    className="h-full w-full object-cover"
                    draggable={false}
                    loading="eager"
                  />
                )
          }
        />
      )}
    </figure>
  );
}
