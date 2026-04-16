'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'motion/react';
import Link from 'next/link';
import { ArrowRight, X } from 'lucide-react';
import { Accomplishment } from '@/types';
import { StarButton } from '@/components/ui/star-button';

interface AccomplishmentsStackProps {
  items: Accomplishment[];
}

export function AccomplishmentsStack({ items }: AccomplishmentsStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const lastNavigationTime = useRef(0);
  const navigationCooldown = 400;

  const navigate = useCallback(
    (newDirection: number) => {
      if (expandedId) return;
      const now = Date.now();
      if (now - lastNavigationTime.current < navigationCooldown) return;
      lastNavigationTime.current = now;

      setCurrentIndex((prev) => {
        if (newDirection > 0) {
          return prev === items.length - 1 ? 0 : prev + 1;
        }
        return prev === 0 ? items.length - 1 : prev - 1;
      });
    },
    [items.length, expandedId]
  );

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.y < -threshold) navigate(1);
    else if (info.offset.y > threshold) navigate(-1);
  };

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (expandedId) {
        // Scroll closes the expanded card
        if (Math.abs(e.deltaY) > 30) {
          setExpandedId(null);
        }
        return;
      }
      if (Math.abs(e.deltaY) > 30) {
        if (e.deltaY > 0) navigate(1);
        else navigate(-1);
      }
    },
    [navigate, expandedId]
  );

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // Close expanded on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpandedId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const getCardStyle = (index: number) => {
    const total = items.length;
    let diff = index - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    if (diff === 0) return { y: 0, scale: 1, opacity: 1, zIndex: 5, rotateX: 0 };
    if (diff === -1) return { y: -160, scale: 0.82, opacity: 0.6, zIndex: 4, rotateX: 8 };
    if (diff === -2) return { y: -280, scale: 0.7, opacity: 0.3, zIndex: 3, rotateX: 15 };
    if (diff === 1) return { y: 160, scale: 0.82, opacity: 0.6, zIndex: 4, rotateX: -8 };
    if (diff === 2) return { y: 280, scale: 0.7, opacity: 0.3, zIndex: 3, rotateX: -15 };
    return { y: diff > 0 ? 400 : -400, scale: 0.6, opacity: 0, zIndex: 0, rotateX: diff > 0 ? -20 : 20 };
  };

  const isVisible = (index: number) => {
    const total = items.length;
    let diff = index - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return Math.abs(diff) <= 2;
  };

  const expandedItem = items.find((i) => i.id === expandedId);

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.04] blur-3xl" />
      </div>

      {/* Card Stack */}
      <div className="relative flex h-[500px] w-[320px] items-center justify-center" style={{ perspective: '1200px' }}>
        {items.map((item, index) => {
          if (!isVisible(index)) return null;
          const style = getCardStyle(index);
          const isCurrent = index === currentIndex;
          const isBlurred = expandedId !== null && item.id !== expandedId;

          return (
            <motion.div
              key={item.id}
              className="absolute cursor-grab active:cursor-grabbing"
              animate={{
                y: style.y,
                scale: style.scale,
                opacity: expandedId && !isBlurred ? 0 : isBlurred ? style.opacity * 0.3 : style.opacity,
                rotateX: style.rotateX,
                zIndex: style.zIndex,
                filter: isBlurred ? 'blur(4px)' : 'blur(0px)',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 1 }}
              drag={isCurrent && !expandedId ? 'y' : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              onClick={() => {
                if (isCurrent && !expandedId) {
                  setExpandedId(item.id);
                } else if (!isCurrent && !expandedId) {
                  setCurrentIndex(index);
                }
              }}
              style={{ transformStyle: 'preserve-3d', zIndex: style.zIndex }}
            >
              <div
                className="relative h-[420px] w-[280px] overflow-hidden rounded-3xl bg-card ring-1 ring-border/40 flex flex-col items-center justify-center p-8"
                style={{
                  boxShadow: isCurrent
                    ? '0 25px 50px -12px hsl(var(--primary) / 0.2), 0 0 0 1px hsl(var(--primary) / 0.1)'
                    : '0 10px 30px -10px hsl(var(--foreground) / 0.1)',
                }}
              >
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

                {/* Icon */}
                <div className="relative z-10 flex items-center justify-center w-32 h-32 mb-6 text-primary">
                  <img
                    src={item.icon}
                    alt={item.title}
                    className="w-full h-full object-contain"
                    style={{ filter: 'drop-shadow(0 0 20px hsl(var(--primary) / 0.3))' }}
                    draggable={false}
                  />
                </div>

                {/* Title */}
                <h3 className="relative z-10 font-serif text-2xl font-medium text-center text-foreground mb-2 leading-tight">
                  {item.title}
                </h3>

                {/* Short description */}
                <p className="relative z-10 text-sm text-muted-foreground text-center mb-3">
                  {item.shortDescription}
                </p>

                {/* Date */}
                <p className="relative z-10 text-xs uppercase tracking-widest text-muted-foreground/60 font-mono">
                  {item.date}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation dots */}
      <div className="absolute right-4 md:right-8 top-1/2 flex -translate-y-1/2 flex-col gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (index !== currentIndex && !expandedId) setCurrentIndex(index);
            }}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'h-6 bg-primary' : 'bg-foreground/30 hover:bg-foreground/50'
            }`}
            aria-label={`Go to item ${index + 1}`}
          />
        ))}
      </div>

      {/* Instruction hint */}
      {!expandedId && (
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
            Scroll, drag, or click
          </span>
        </motion.div>
      )}

      {/* Expanded card overlay */}
      <AnimatePresence>
        {expandedItem && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedId(null)}
          >
            <motion.div
              className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-card ring-1 ring-primary/20 p-8 md:p-10 shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                boxShadow: '0 40px 80px -20px hsl(var(--primary) / 0.3), 0 0 0 1px hsl(var(--primary) / 0.15)',
              }}
            >
              <button
                onClick={() => setExpandedId(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 text-primary">
                <img
                  src={expandedItem.icon}
                  alt={expandedItem.title}
                  className="w-full h-full object-contain"
                  style={{ filter: 'drop-shadow(0 0 20px hsl(var(--primary) / 0.3))' }}
                />
              </div>

              <p className="text-xs uppercase tracking-widest text-muted-foreground/60 font-mono text-center mb-2">
                {expandedItem.date}
              </p>
              <h2 className="font-serif text-3xl font-medium text-center mb-4 leading-tight">
                {expandedItem.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed text-center mb-6">
                {expandedItem.longDescription}
              </p>

              {expandedItem.blogSlug && (
                <div className="flex justify-center">
                  <Link href={`/blog/${expandedItem.blogSlug}/`}>
                    <StarButton
                      lightColor="#EC4E02"
                      duration={8}
                      className="rounded-3xl px-6 h-11 text-sm"
                    >
                      Read the story <ArrowRight className="h-3.5 w-3.5" />
                    </StarButton>
                  </Link>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
