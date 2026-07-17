'use client';

import { useEffect, useRef } from 'react';

type Scene = { w: number; h: number; dot: number; pts: [number, number, number][] };
type DitherData = { colors: string[]; scenes: Record<string, Scene> };

// One fetch shared by every <DitherCanvas> on the page.
let dataPromise: Promise<DitherData> | null = null;
function loadData(): Promise<DitherData> {
  if (!dataPromise) {
    dataPromise = fetch('/dither-dots.json').then((r) => {
      if (!r.ok) throw new Error(`dither-dots.json ${r.status}`);
      return r.json();
    });
  }
  return dataPromise;
}

// Physics — ported verbatim from the paper-dither interactive prototype.
const R = 240;
const R2 = R * R;
const STR = 2.6; // repel strength
const K = 0.028; // spring back to home
const DAMP = 0.9; // velocity damping
const IDLE = 2.2; // ambient wobble amplitude

type SceneKey = 'skyline' | 'squat' | 'desk';

export function DitherCanvas({
  scene,
  label,
  className,
  dotMul = 1.7,
}: {
  scene: SceneKey;
  label: string;
  className?: string;
  dotMul?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    let disposed = false;
    let running = false;
    let raf = 0;

    let colors: string[] = [];
    let sc: Scene | null = null;
    let N = 0;
    let dotBase = 7;
    let hx!: Float32Array, hy!: Float32Array; // home
    let x!: Float32Array, y!: Float32Array; // current
    let vx!: Float32Array, vy!: Float32Array; // velocity
    let phx!: Float32Array, phy!: Float32Array; // wobble phase
    let fx!: Float32Array, fy!: Float32Array; // wobble freq
    let col!: Uint8Array;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let CW = 0;
    let CH = 0;
    let scale = 1;
    let ox = 0;
    let oy = 0;
    const mouse = { x: -1e5, y: -1e5, on: false };
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function fit() {
      if (!sc) return;
      CW = cv!.clientWidth;
      CH = cv!.clientHeight;
      if (CW === 0 || CH === 0) return;
      cv!.width = Math.round(CW * dpr);
      cv!.height = Math.round(CH * dpr);
      scale = Math.min(CW / sc.w, CH / sc.h) * 0.98;
      ox = (CW - sc.w * scale) / 2;
      oy = (CH - sc.h * scale) / 2;
    }

    function draw() {
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.clearRect(0, 0, cv!.width, cv!.height);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const s = Math.max(2, dotBase * scale * dotMul);
      for (let c = 0; c < colors.length; c++) {
        ctx!.fillStyle = colors[c];
        for (let i = 0; i < N; i++) {
          if (col[i] !== c) continue;
          ctx!.fillRect(ox + x[i] * scale - s / 2, oy + y[i] * scale - s / 2, s, s);
        }
      }
    }

    let t0 = 0;
    function frame(now: number) {
      const t = (now - t0) * 0.001;
      for (let i = 0; i < N; i++) {
        const ix = hx[i] + IDLE * Math.sin(t * fx[i] + phx[i]);
        const iy = hy[i] + IDLE * Math.cos(t * fy[i] + phy[i]);
        let ax = (ix - x[i]) * K;
        let ay = (iy - y[i]) * K;
        if (mouse.on) {
          const dx = x[i] - mouse.x;
          const dy = y[i] - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R2) {
            const d = Math.sqrt(d2) + 0.01;
            const f = (1 - d / R) * STR;
            ax += (dx / d) * f;
            ay += (dy / d) * f;
          }
        }
        vx[i] = (vx[i] + ax) * DAMP;
        vy[i] = (vy[i] + ay) * DAMP;
        x[i] += vx[i];
        y[i] += vy[i];
      }
      draw();
      if (running) raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running || disposed || !sc) return;
      running = true;
      t0 = performance.now();
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    function toSpace(cx: number, cy: number): [number, number] {
      return [(cx - ox) / scale, (cy - oy) / scale];
    }
    function onMove(e: PointerEvent) {
      const r = cv!.getBoundingClientRect();
      const p = toSpace(e.clientX - r.left, e.clientY - r.top);
      mouse.x = p[0];
      mouse.y = p[1];
      mouse.on = true;
    }
    function onLeave() {
      mouse.on = false;
      mouse.x = -1e5;
      mouse.y = -1e5;
    }

    const ro = new ResizeObserver(() => {
      fit();
      if (!running && sc) draw();
    });
    // Only spend a RAF loop while the art is actually on screen.
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) start();
          else stop();
        }
      },
      { rootMargin: '200px' },
    );

    cv.addEventListener('pointermove', onMove);
    cv.addEventListener('pointerleave', onLeave);

    loadData()
      .then((data) => {
        if (disposed) return;
        colors = data.colors;
        sc = data.scenes[scene];
        if (!sc) return;
        N = sc.pts.length;
        dotBase = sc.dot;
        hx = new Float32Array(N);
        hy = new Float32Array(N);
        x = new Float32Array(N);
        y = new Float32Array(N);
        vx = new Float32Array(N);
        vy = new Float32Array(N);
        phx = new Float32Array(N);
        phy = new Float32Array(N);
        fx = new Float32Array(N);
        fy = new Float32Array(N);
        col = new Uint8Array(N);
        for (let i = 0; i < N; i++) {
          const p = sc.pts[i];
          hx[i] = p[0];
          hy[i] = p[1];
          x[i] = p[0];
          y[i] = p[1];
          col[i] = p[2];
          phx[i] = Math.random() * 6.283;
          phy[i] = Math.random() * 6.283;
          fx[i] = 0.12 + Math.random() * 0.38;
          fy[i] = 0.12 + Math.random() * 0.38;
        }
        fit();
        ro.observe(cv);
        if (reduce) {
          draw(); // static single frame, honours reduced-motion
        } else {
          io.observe(cv);
        }
      })
      .catch(() => {
        /* decorative — fail silently */
      });

    return () => {
      disposed = true;
      stop();
      io.disconnect();
      ro.disconnect();
      cv.removeEventListener('pointermove', onMove);
      cv.removeEventListener('pointerleave', onLeave);
    };
  }, [scene, dotMul]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={label}
      className={className}
      style={{ aspectRatio: '2888 / 2056', touchAction: 'pan-y' }}
    />
  );
}
