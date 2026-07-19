'use client';

import { useEffect, useRef } from 'react';

// Two-tone orange to match the site's dither art.
const SHADES = ['#7a3e12', '#b3591b'];
const SPACE = 1000; // normalized square dot-space
const R = 95; // repel radius
const R2 = R * R;
const STR = 2.6; // repel strength
const K = 0.03; // spring back home
const DAMP = 0.9;
const IDLE = 1.8; // ambient wobble (kept small so the face stays legible)

// 4x4 Bayer matrix (normalized), same ordered dither as the site's dot art.
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
].map((row) => row.map((v) => (v + 0.5) / 16));

/**
 * Renders a photo as a field of orange dither dots that idly drift, scatter
 * away from the cursor, and spring back. The image is rasterised in-browser:
 * a square centre-crop is sampled on a grid, then ordered (Bayer) dithered so
 * darker areas get denser uniform dots and near-white becomes empty space —
 * matching the paper-dither art elsewhere on the site.
 */
export function PhotoDither({
  src,
  alt,
  className,
  cols = 100,
  dotFrac = 0.5,
  contrast = 1.15,
  gamma = 1.0,
  cropBiasY = 0.45,
}: {
  src: string;
  alt: string;
  className?: string;
  cols?: number; // dots across the square
  dotFrac?: number; // dot side as a fraction of the cell (gap between dots)
  contrast?: number;
  gamma?: number;
  cropBiasY?: number; // 0 = crop from top, 0.5 = centre (keeps faces in frame)
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
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let CW = 0;
    let CH = 0;
    let scale = 1;
    let ox = 0;
    let oy = 0;
    const mouse = { x: -1e5, y: -1e5, on: false };
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pitch = SPACE / cols;
    const dotSpace = pitch * dotFrac; // uniform dot size in normalized space

    let N = 0;
    let hx!: Float32Array;
    let hy!: Float32Array;
    let x!: Float32Array;
    let y!: Float32Array;
    let vx!: Float32Array;
    let vy!: Float32Array;
    let phx!: Float32Array;
    let phy!: Float32Array;
    let fx!: Float32Array;
    let fy!: Float32Array;
    let ci!: Uint8Array;

    function buildFromImage(img: HTMLImageElement) {
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const S = Math.min(iw, ih);
      const sx = (iw - S) / 2;
      const sy = Math.min(Math.max(0, (ih - S) * cropBiasY), Math.max(0, ih - S));
      const wc = document.createElement('canvas');
      wc.width = cols;
      wc.height = cols;
      const wctx = wc.getContext('2d');
      if (!wctx) return;
      wctx.drawImage(img, sx, sy, S, S, 0, 0, cols, cols);
      const data = wctx.getImageData(0, 0, cols, cols).data;

      const _hx: number[] = [];
      const _hy: number[] = [];
      const _ci: number[] = [];
      for (let gy = 0; gy < cols; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          const i = (gy * cols + gx) * 4;
          const a = data[i + 3];
          const lum = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
          let val = a < 8 ? 0 : 1 - lum; // darkness drives dots; transparent = empty
          val = Math.min(1, Math.max(0, (val - 0.5) * contrast + 0.5)) ** gamma;
          const scaled = val * (SHADES.length); // levels: none / shade0 / shade1
          const lower = Math.floor(scaled);
          const t = BAYER[gy & 3][gx & 3];
          const idx = Math.min(SHADES.length, Math.max(0, lower + (scaled - lower > t ? 1 : 0)));
          if (idx === 0) continue;
          _hx.push(gx * pitch + pitch / 2);
          _hy.push(gy * pitch + pitch / 2);
          _ci.push(idx - 1);
        }
      }
      N = _hx.length;
      hx = new Float32Array(_hx);
      hy = new Float32Array(_hy);
      x = new Float32Array(N);
      y = new Float32Array(N);
      vx = new Float32Array(N);
      vy = new Float32Array(N);
      phx = new Float32Array(N);
      phy = new Float32Array(N);
      fx = new Float32Array(N);
      fy = new Float32Array(N);
      ci = new Uint8Array(_ci);
      for (let i = 0; i < N; i++) {
        x[i] = hx[i];
        y[i] = hy[i];
        phx[i] = Math.random() * 6.283;
        phy[i] = Math.random() * 6.283;
        fx[i] = 0.12 + Math.random() * 0.38;
        fy[i] = 0.12 + Math.random() * 0.38;
      }
      fit();
    }

    function fit() {
      CW = cv!.clientWidth;
      CH = cv!.clientHeight;
      if (!CW || !CH) return;
      cv!.width = Math.round(CW * dpr);
      cv!.height = Math.round(CH * dpr);
      scale = Math.min(CW, CH) / SPACE;
      ox = (CW - SPACE * scale) / 2;
      oy = (CH - SPACE * scale) / 2;
    }

    function draw() {
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      ctx!.clearRect(0, 0, cv!.width, cv!.height);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const s = Math.max(1, dotSpace * scale);
      for (let c = 0; c < SHADES.length; c++) {
        ctx!.fillStyle = SHADES[c];
        for (let i = 0; i < N; i++) {
          if (ci[i] !== c) continue;
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
      if (running || disposed || !N) return;
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
      if (!running && N) draw();
    });
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) start();
          else stop();
        }
      },
      { rootMargin: '150px' },
    );
    cv.addEventListener('pointermove', onMove);
    cv.addEventListener('pointerleave', onLeave);

    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      if (disposed) return;
      buildFromImage(img);
      ro.observe(cv);
      if (reduce) draw();
      else io.observe(cv);
    };
    img.src = src;

    return () => {
      disposed = true;
      stop();
      ro.disconnect();
      io.disconnect();
      cv.removeEventListener('pointermove', onMove);
      cv.removeEventListener('pointerleave', onLeave);
    };
  }, [src, cols, dotFrac, contrast, gamma, cropBiasY]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={alt}
      className={className}
      style={{ aspectRatio: '1 / 1', touchAction: 'pan-y' }}
    />
  );
}
