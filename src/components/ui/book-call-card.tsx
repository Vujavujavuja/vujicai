'use client';

import { useState, Suspense, lazy } from 'react';
import { StarButton } from '@/components/ui/star-button';
import { MagneticText } from '@/components/ui/magnetic-text';

const Dithering = lazy(() =>
  import('@paper-design/shaders-react').then((mod) => ({ default: mod.Dithering }))
);

export const BOOKING_URL = 'https://book.vujic.ai/';

export function BookCallCard() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="w-full relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-[40px] border border-border bg-card shadow-sm min-h-[340px] md:min-h-[400px] flex flex-col items-center justify-center">
        <Suspense fallback={<div className="absolute inset-0 bg-muted/20" />}>
          <div className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-30 mix-blend-multiply dark:mix-blend-screen">
            <Dithering
              colorBack="#00000000"
              colorFront="#c8591e"
              shape="warp"
              type="4x4"
              speed={isHovered ? 0.6 : 0.2}
              className="size-full"
              minPixelRatio={1}
            />
          </div>
        </Suspense>

        <div className="relative z-10 px-6 py-12 max-w-2xl mx-auto text-center flex flex-col items-center">
          <MagneticText
            as="p"
            text="the faster way"
            radius={90}
            strength={14}
            className="text-xs md:text-sm text-muted-foreground/50 italic tracking-wide mb-2"
          />
          <MagneticText
            as="h2"
            text="Book a Call"
            radius={150}
            strength={36}
            className="font-serif text-5xl md:text-7xl font-medium tracking-tight text-foreground mb-6 leading-[1.05]"
          />
          <MagneticText
            as="p"
            text="Pick a time that works and we talk it through."
            radius={110}
            strength={18}
            className="text-muted-foreground text-lg md:text-xl mb-10 leading-relaxed"
          />

          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
            <StarButton lightColor="#c8591e" duration={8} className="rounded-3xl px-10 h-14 text-base">
              Book a Call
            </StarButton>
          </a>
        </div>
      </div>
    </div>
  );
}
