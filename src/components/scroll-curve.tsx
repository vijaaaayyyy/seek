import { useEffect, useState } from "react";

/**
 * One thread down the page. It is drawn as a single hairline that fades in
 * below the header and back out before the footer, so it reads as a drawn
 * line rather than a stroke that starts and stops.
 *
 * It travels one slow cycle over the length of the page: it rests in the
 * right-hand margin, glides through the middle, rests in the left margin,
 * glides back through the middle and settles in the right again. The lane is
 * eased so it lingers in the margins and crosses the centre quickly, which
 * keeps the line off the words instead of swinging across them.
 *
 * The reading column is measured at runtime and the travel is clamped to the
 * open paper either side of it, so on a text page the line stays in the
 * gutter. Pages with no gutter (full-bleed home and the phone reader) clamp
 * it to the outer edge.
 */
export function ScrollCurve() {
  const [p, setP] = useState(0);
  const [box, setBox] = useState({ w: 0, h: 0, pad: 0, lo: 0, hi: 0, meander: 0 });

  useEffect(() => {
    // The shell pins the document and lets an inner <main> scroll on small
    // screens, so the offset has to come from whichever element actually moved.
    const progress = (target?: EventTarget | null) => {
      const node = target instanceof HTMLElement ? target : null;
      const inner =
        node && node !== document.body && node !== document.documentElement ? node : null;
      const h = inner ? inner.scrollHeight : document.documentElement.scrollHeight;
      const y = inner ? inner.scrollTop : window.scrollY || document.documentElement.scrollTop;
      const span = h - (inner ? inner.clientHeight : window.innerHeight);
      setP(Math.min(1, Math.max(0, y / Math.max(1, span))));
    };

    const measure = () => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      const wide = w >= 1024;

      // Outer edges of the reading column, so the thread can clear it.
      let right = 0;
      let left = w;
      const main = [...document.querySelectorAll("main")].find(
        (el) => el.getBoundingClientRect().width > 0,
      );
      if (main) {
        for (const el of main.querySelectorAll<HTMLElement>("p,h1,h2,h3,li,article,section")) {
          const b = el.getBoundingClientRect();
          if (b.height < 2 || b.width < 2) continue;
          if (b.right > right) right = b.right;
          if (b.left < left) left = b.left;
        }
      }

      const gutterL = Math.max(0, left);
      const gutterR = Math.max(0, w - right);
      const tight = Math.min(gutterL, gutterR) < 90;
      const pad = wide ? 46 : 16;

      setBox({
        w,
        h,
        pad,
        lo: tight ? pad : Math.max(pad, gutterL / 2),
        hi: tight ? w - pad : Math.min(w - pad, w - gutterR / 2),
        meander: wide ? 22 : 5,
      });
      progress(null);
    };

    const onScroll = (e: Event) => progress(e.target);
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    measure();

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { w, h, pad, lo, hi, meander } = box;
  if (!w || !h) return null;

  // One full cycle down the page: right margin -> centre -> left margin ->
  // centre -> right margin.
  const raw = (Math.cos(p * Math.PI * 2) + 1) / 2;
  // smoothstep on the lane makes it decelerate into each margin and accelerate
  // through the centre, so the line rests beside the text instead of drifting
  // across it.
  const lane = raw * raw * (3 - 2 * raw);
  const x = lo + lane * Math.max(0, hi - lo);

  // A gentle bow that breathes over the same cycle. Small, so the line stays
  // legible as one continuous curve rather than folding back on itself.
  const swing = Math.sin(p * Math.PI * 2);
  const reach = meander * (0.62 + 0.38 * Math.abs(swing));
  const drift = swing * meander * 0.5;

  // Never let the stroke leave the page.
  const lo2 = Math.max(pad, lo);
  const hi2 = Math.min(w - pad, hi);
  const xc = Math.min(Math.max(x, lo2 + reach), Math.max(lo2 + reach, hi2 - reach));
  const d =
    `M ${(xc - reach + drift).toFixed(1)} 0 ` +
    `C ${(xc + reach * 1.6).toFixed(1)} ${(h * 0.34).toFixed(1)}, ` +
    `${(xc - reach * 1.6).toFixed(1)} ${(h * 0.66).toFixed(1)}, ` +
    `${(xc + reach + drift).toFixed(1)} ${h.toFixed(1)}`;

  return (
    <svg
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30 h-full w-full text-ink"
      preserveAspectRatio="none"
      viewBox={`0 0 ${w} ${h}`}
    >
      <defs>
        <linearGradient id="seek-curve-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="0.16" stopColor="currentColor" stopOpacity="0.55" />
          <stop offset="0.84" stopColor="currentColor" stopOpacity="0.55" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={d}
        fill="none"
        stroke="url(#seek-curve-fade)"
        strokeWidth={1.5}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
