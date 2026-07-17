'use client';

import { useEffect, useRef, createElement, Fragment, type ReactNode } from 'react';

type Tag = 'h1' | 'h2' | 'p' | 'span' | 'div';

// Splits text into per-character <span>s (words kept unbreakable) so each
// letter can be transformed independently. Newlines become <br>.
function splitToSpans(text: string): ReactNode {
  const lines = text.split('\n');
  const out: ReactNode[] = [];
  lines.forEach((line, li) => {
    const words = line.split(' ');
    words.forEach((word, wi) => {
      out.push(
        <span
          key={`w-${li}-${wi}`}
          style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
        >
          {word.split('').map((ch, ci) => (
            <span
              key={ci}
              data-ch
              aria-hidden="true"
              style={{ display: 'inline-block', willChange: 'transform' }}
            >
              {ch}
            </span>
          ))}
        </span>,
      );
      if (wi < words.length - 1) out.push(' ');
    });
    if (li < lines.length - 1) out.push(<br key={`br-${li}`} />);
  });
  return out;
}

export function MagneticText({
  text,
  as = 'span',
  className,
  radius = 130,
  strength = 34,
}: {
  text: string;
  as?: Tag;
  className?: string;
  radius?: number; // px around the cursor that letters react within
  strength?: number; // max push distance in px
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const spans = Array.from(root.querySelectorAll<HTMLElement>('[data-ch]'));
    const n = spans.length;
    if (!n) return;

    const homeX = new Float32Array(n);
    const homeY = new Float32Array(n);
    const curX = new Float32Array(n);
    const curY = new Float32Array(n);
    const velX = new Float32Array(n);
    const velY = new Float32Array(n);

    const R = radius;
    const R2 = R * R;
    const PUSH = strength;
    const K = 0.18; // spring toward target
    const DAMP = 0.72; // velocity damping
    const mouse = { x: -1e5, y: -1e5, on: false };

    // Cache each letter's rest centre relative to the root box. Layout is not
    // affected by the transforms we apply, so these stay valid until reflow.
    function measure() {
      for (let i = 0; i < n; i++) spans[i].style.transform = '';
      const cr = root!.getBoundingClientRect();
      for (let i = 0; i < n; i++) {
        const r = spans[i].getBoundingClientRect();
        homeX[i] = r.left - cr.left + r.width / 2;
        homeY[i] = r.top - cr.top + r.height / 2;
      }
      for (let i = 0; i < n; i++) {
        spans[i].style.transform = `translate(${curX[i].toFixed(2)}px,${curY[i].toFixed(2)}px)`;
      }
    }

    let raf = 0;
    let running = false;
    function frame() {
      for (let i = 0; i < n; i++) {
        let tx = 0;
        let ty = 0;
        if (mouse.on) {
          const dx = homeX[i] - mouse.x;
          const dy = homeY[i] - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R2) {
            const d = Math.sqrt(d2) + 0.001;
            const f = (1 - d / R) * PUSH;
            tx = (dx / d) * f;
            ty = (dy / d) * f;
          }
        }
        velX[i] = (velX[i] + (tx - curX[i]) * K) * DAMP;
        velY[i] = (velY[i] + (ty - curY[i]) * K) * DAMP;
        curX[i] += velX[i];
        curY[i] += velY[i];
        spans[i].style.transform = `translate(${curX[i].toFixed(2)}px,${curY[i].toFixed(2)}px)`;
      }
      raf = requestAnimationFrame(frame);
    }
    function start() {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    function onMove(e: PointerEvent) {
      const cr = root!.getBoundingClientRect();
      mouse.x = e.clientX - cr.left;
      mouse.y = e.clientY - cr.top;
      mouse.on = true;
    }
    function onLeave() {
      mouse.on = false;
    }

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    // Only animate while the text is on screen.
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) start();
          else stop();
        }
      },
      { rootMargin: '100px' },
    );
    io.observe(root);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('blur', onLeave);
    // Serif metrics shift once the webfont swaps in — re-measure then.
    if (document.fonts?.ready) document.fonts.ready.then(measure).catch(() => {});

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('blur', onLeave);
    };
  }, [text, radius, strength]);

  return createElement(
    as,
    { ref, className, 'aria-label': text },
    <Fragment>{splitToSpans(text)}</Fragment>,
  );
}
