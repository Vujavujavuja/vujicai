'use client';

import { Suspense, lazy } from 'react';
import Link from 'next/link';

const Dithering = lazy(() =>
  import('@paper-design/shaders-react').then((mod) => ({ default: mod.Dithering }))
);

const linkClass =
  'block w-full text-center rounded-2xl border border-border/80 bg-background/40 backdrop-blur-sm px-6 py-4 text-lg md:text-xl font-serif text-foreground hover:text-primary hover:border-primary/60 hover:bg-background/60 transition-all duration-300';

export function QrCard() {
  return (
    <section className="min-h-[100svh] w-full flex justify-center items-center px-4 py-8">
      <div className="w-full max-w-md relative">
        <div className="relative overflow-hidden rounded-[40px] border border-border bg-card shadow-sm min-h-[78svh] flex flex-col items-center justify-center">
          <Suspense fallback={<div className="absolute inset-0 bg-muted/20" />}>
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-30 mix-blend-multiply dark:mix-blend-screen">
              <Dithering
                colorBack="#00000000"
                colorFront="#EC4E02"
                shape="warp"
                type="4x4"
                speed={0.25}
                className="size-full"
                minPixelRatio={1}
              />
            </div>
          </Suspense>

          <div className="relative z-10 w-full px-8 flex flex-col items-center">
            <nav className="w-full flex flex-col gap-4">
              <Link href="/" className={linkClass}>
                Who am I?
              </Link>
              <a
                href="https://www.linkedin.com/in/nemanja-vujic-vuja43/"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                LinkedIn
              </a>
              <Link href="/qr/get-in-touch/" className={linkClass}>
                Get in touch
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
