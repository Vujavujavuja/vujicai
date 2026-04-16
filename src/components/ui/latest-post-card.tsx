'use client';

import { useState, Suspense, lazy } from 'react';
import Link from 'next/link';
import { StarButton } from '@/components/ui/star-button';

const Dithering = lazy(() =>
  import('@paper-design/shaders-react').then((mod) => ({ default: mod.Dithering }))
);

interface LatestPostCardProps {
  title: string;
  description: string;
  href: string;
}

export function LatestPostCard({ title, description, href }: LatestPostCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="w-full flex justify-center items-center px-4 md:px-6 pb-12">
      <div
        className="w-full max-w-4xl relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden rounded-[32px] border border-border bg-card shadow-sm min-h-[280px] md:min-h-[320px] flex flex-col items-center justify-center duration-500">
          <Suspense fallback={<div className="absolute inset-0 bg-muted/20" />}>
            <div className="absolute inset-0 z-0 pointer-events-none opacity-25 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen">
              <Dithering
                colorBack="#00000000"
                colorFront="#EC4E02"
                shape="warp"
                type="4x4"
                speed={isHovered ? 0.4 : 0.1}
                className="size-full"
                minPixelRatio={1}
              />
            </div>
          </Suspense>

          <div className="relative z-10 px-6 max-w-2xl mx-auto text-center flex flex-col items-center py-10">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Latest Post</p>

            <h2 className="font-serif text-2xl md:text-4xl font-medium tracking-tight text-foreground mb-4 leading-[1.1]">
              {title}
            </h2>

            <p className="text-muted-foreground text-sm md:text-base max-w-lg mb-8 leading-relaxed line-clamp-2">
              {description}
            </p>

            <Link href={href}>
              <StarButton
                lightColor="#EC4E02"
                duration={8}
                className="rounded-3xl px-8 h-12 text-sm"
              >
                Read this post
              </StarButton>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
