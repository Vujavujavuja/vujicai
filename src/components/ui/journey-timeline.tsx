'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';
import { cn } from '@/lib/utils';

export interface JourneyStep {
  role: string;
  where?: string | null;
  age: number | string;
  placeholder?: boolean;
}

interface JourneyTimelineProps {
  items: JourneyStep[];
  rowSize?: number;
}

export function JourneyTimeline({ items, rowSize = 4 }: JourneyTimelineProps) {
  return (
    <>
      {/* Desktop snake */}
      <div className="hidden md:block">
        <DesktopSnake items={items} rowSize={rowSize} />
      </div>
      {/* Mobile vertical */}
      <div className="md:hidden">
        <MobileVertical items={items} />
      </div>
    </>
  );
}

/* ================================================================
 *  DESKTOP SNAKE
 * ================================================================ */

const VB_WIDTH = 1000;
const ROW_HEIGHT = 180;
const PADDING_X = 60;
const PADDING_Y = 120;
const CORNER_RADIUS = 28;

interface DotPosition {
  x: number;
  y: number;
  row: number;
  col: number;
}

function DesktopSnake({ items, rowSize }: { items: JourneyStep[]; rowSize: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 85%', 'end 55%'],
  });

  const rows = Math.ceil(items.length / rowSize);
  const vbHeight = PADDING_Y * 2 + (rows - 1) * ROW_HEIGHT;

  const dotPositions: DotPosition[] = items.map((_, i) => {
    const row = Math.floor(i / rowSize);
    const isReversed = row % 2 === 1;
    const posInRow = i % rowSize;
    const col = isReversed ? rowSize - 1 - posInRow : posInRow;
    const x = PADDING_X + ((VB_WIDTH - 2 * PADDING_X) * col) / (rowSize - 1);
    const y = PADDING_Y + row * ROW_HEIGHT;
    return { x, y, row, col };
  });

  const pathD = buildPath(dotPositions);

  const doneItems = items.filter((i) => !i.placeholder).length;
  const maxFillRatio = items.length > 1 ? (doneItems - 1) / (items.length - 1) : 0;
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, maxFillRatio]);

  return (
    <div ref={ref} className="relative w-full">
      <div
        className="relative w-full"
        style={{ aspectRatio: `${VB_WIDTH} / ${vbHeight}` }}
      >
        <svg
          viewBox={`0 0 ${VB_WIDTH} ${vbHeight}`}
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          <path
            d={pathD}
            stroke="hsl(var(--border))"
            strokeOpacity={0.6}
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <motion.path
            d={pathD}
            stroke="hsl(var(--primary))"
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            style={{ pathLength }}
          />
        </svg>

        {items.map((item, i) => {
          const pos = dotPositions[i];
          const leftPct = (pos.x / VB_WIDTH) * 100;
          const topPct = (pos.y / vbHeight) * 100;
          return (
            <DesktopDot
              key={i}
              item={item}
              index={i}
              totalItems={items.length}
              doneItems={doneItems}
              progress={scrollYProgress}
              left={leftPct}
              top={topPct}
              row={pos.row}
            />
          );
        })}
      </div>
    </div>
  );
}

function buildPath(positions: DotPosition[]): string {
  if (positions.length === 0) return '';
  if (positions.length === 1) return `M ${positions[0].x} ${positions[0].y}`;

  let d = `M ${positions[0].x} ${positions[0].y}`;
  for (let i = 1; i < positions.length; i++) {
    const prev = positions[i - 1];
    const curr = positions[i];

    if (prev.row === curr.row) {
      d += ` L ${curr.x} ${curr.y}`;
    } else {
      const turnOnRight = prev.col >= curr.col;
      if (turnOnRight) {
        const pivotX = prev.x + CORNER_RADIUS;
        d += ` L ${pivotX - CORNER_RADIUS / 2} ${prev.y}`;
        d += ` Q ${pivotX} ${prev.y}, ${pivotX} ${prev.y + CORNER_RADIUS / 2}`;
        d += ` L ${pivotX} ${curr.y - CORNER_RADIUS / 2}`;
        d += ` Q ${pivotX} ${curr.y}, ${pivotX - CORNER_RADIUS / 2} ${curr.y}`;
        d += ` L ${curr.x} ${curr.y}`;
      } else {
        const pivotX = prev.x - CORNER_RADIUS;
        d += ` L ${pivotX + CORNER_RADIUS / 2} ${prev.y}`;
        d += ` Q ${pivotX} ${prev.y}, ${pivotX} ${prev.y + CORNER_RADIUS / 2}`;
        d += ` L ${pivotX} ${curr.y - CORNER_RADIUS / 2}`;
        d += ` Q ${pivotX} ${curr.y}, ${pivotX + CORNER_RADIUS / 2} ${curr.y}`;
        d += ` L ${curr.x} ${curr.y}`;
      }
    }
  }
  return d;
}

interface DesktopDotProps {
  item: JourneyStep;
  index: number;
  totalItems: number;
  doneItems: number;
  progress: MotionValue<number>;
  left: number;
  top: number;
  row: number;
}

function DesktopDot({ item, index, totalItems, doneItems, progress, left, top, row }: DesktopDotProps) {
  const positionRatio = totalItems > 1 ? index / (totalItems - 1) : 0;
  const maxFillRatio = totalItems > 1 ? (doneItems - 1) / (totalItems - 1) : 0;
  const threshold =
    maxFillRatio > 0 && !item.placeholder ? positionRatio / maxFillRatio : Infinity;

  const opacity = useTransform(
    progress,
    [Math.max(0, threshold - 0.04), Math.min(1, threshold)],
    [0, 1]
  );

  const isOddRow = row % 2 === 1;

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${left}%`, top: `${top}%` }}
    >
      {/* Role/company label: ABOVE for even rows, BELOW for odd rows so they
          don't invade the adjacent row's space */}
      <div
        className={cn(
          'absolute whitespace-nowrap',
          isOddRow ? 'top-full pt-4' : 'bottom-full pb-4'
        )}
        style={{
          left: '50%',
          transform: isOddRow
            ? 'translateX(-20%) rotate(35deg)'
            : 'translateX(-20%) rotate(-35deg)',
          transformOrigin: isOddRow ? 'top left' : 'bottom left',
        }}
      >
        <div className="flex flex-col leading-tight">
          <span
            className={cn(
              'text-sm md:text-base font-serif font-medium',
              item.placeholder ? 'text-primary italic' : 'text-foreground'
            )}
          >
            {item.role}
          </span>
          {item.where && !item.placeholder && (
            <span className="text-[10px] md:text-xs text-muted-foreground/60 font-sans">
              {item.where}
            </span>
          )}
        </div>
      </div>

      {/* Dot */}
      <div
        className={cn(
          'relative h-4 w-4 rounded-full ring-4 ring-background',
          item.placeholder
            ? 'bg-transparent border-2 border-dashed border-primary/50'
            : 'bg-border'
        )}
      >
        {!item.placeholder && (
          <motion.div
            style={{ opacity }}
            className="absolute inset-0 rounded-full bg-primary"
          />
        )}
      </div>

      {/* Age caption: BELOW for even rows, ABOVE for odd rows — always in the
          "inside" gap between rows */}
      <span
        className={cn(
          'absolute left-1/2 -translate-x-1/2 font-mono text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground/80 whitespace-nowrap',
          isOddRow ? 'bottom-full mb-3' : 'top-full mt-3'
        )}
      >
        Age {item.age}
      </span>
    </div>
  );
}

/* ================================================================
 *  MOBILE VERTICAL
 * ================================================================ */

function MobileVertical({ items }: { items: JourneyStep[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'end 50%'],
  });

  const doneItems = items.filter((i) => !i.placeholder).length;
  const maxFillRatio = items.length > 1 ? (doneItems - 1) / (items.length - 1) : 0;
  const railHeight = useTransform(scrollYProgress, [0, 1], [0, maxFillRatio]);

  return (
    <div ref={ref} className="relative pl-8">
      {/* Base rail (vertical) */}
      <div className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-border/60 rounded-full" />
      {/* Animated orange fill */}
      <motion.div
        className="absolute left-[9px] top-2 w-[2px] bg-primary rounded-full origin-top"
        style={{
          scaleY: railHeight,
          height: 'calc(100% - 1rem)',
        }}
      />

      <ol className="space-y-8">
        {items.map((item, i) => (
          <MobileDot
            key={i}
            item={item}
            index={i}
            totalItems={items.length}
            doneItems={doneItems}
            progress={scrollYProgress}
          />
        ))}
      </ol>
    </div>
  );
}

interface MobileDotProps {
  item: JourneyStep;
  index: number;
  totalItems: number;
  doneItems: number;
  progress: MotionValue<number>;
}

function MobileDot({ item, index, totalItems, doneItems, progress }: MobileDotProps) {
  const positionRatio = totalItems > 1 ? index / (totalItems - 1) : 0;
  const maxFillRatio = totalItems > 1 ? (doneItems - 1) / (totalItems - 1) : 0;
  const threshold =
    maxFillRatio > 0 && !item.placeholder ? positionRatio / maxFillRatio : Infinity;

  const opacity = useTransform(
    progress,
    [Math.max(0, threshold - 0.04), Math.min(1, threshold)],
    [0, 1]
  );

  return (
    <li className="relative">
      {/* Dot */}
      <div
        className={cn(
          'absolute -left-8 top-1 h-4 w-4 rounded-full ring-4 ring-background',
          item.placeholder
            ? 'bg-transparent border-2 border-dashed border-primary/50'
            : 'bg-border'
        )}
      >
        {!item.placeholder && (
          <motion.div
            style={{ opacity }}
            className="absolute inset-0 rounded-full bg-primary"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-0.5">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/80">
          Age {item.age}
        </span>
        <span
          className={cn(
            'font-serif text-lg font-medium leading-tight',
            item.placeholder ? 'text-primary italic' : 'text-foreground'
          )}
        >
          {item.role}
        </span>
        {item.where && !item.placeholder && (
          <span className="text-xs text-muted-foreground/70">{item.where}</span>
        )}
      </div>
    </li>
  );
}
