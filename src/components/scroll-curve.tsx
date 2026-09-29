import { useEffect, useRef, useState } from "react";

type Box = { w: number; h: number; pad: number; lo: number; hi: number; meander: number };

/**
 * One thread down the page, drawn as a living string.
 *
 * Scroll decides where it sits: it runs a single slow cycle over the length of
 * the page, resting in the right-hand margin, gliding through the middle,
 * resting in the left margin, then back again. The lane is eased so it lingers
 * in the margins and crosses the centre quickly, which keeps the line in the
 * gutter instead of swinging across the words.
 *
 * On top of that it never sits still. Three phase-shifted waves are pushed
 * sideways along the string at a slow, irregular rate, so it drifts and
 * undulates the way a thread does in a draught. That motion is written straight
 * to the path on every frame, not through state, so the page never re-renders
 * just because the string moved.
 *
 * The line is also a boundary. The ground it has already crossed is filled with
 * the inverse of the theme — dark ink in a light theme, pale paper in a dark one
 * — so the background turns negative behind it and the hairline is the edge
 * doing the turning.
 */
function build(p: number, t: number, w: number, h: number, pad: number, lo: number, hi: number, meander: number) {
  const raw = (Math.cos(p * Math.PI * 2) + 1) / 2;
  const lane = raw * raw * (3 - 2 * raw);
  const swing = Math.sin(p * Math.PI * 2);

  // A draught: two slow beats that never quite line up, so the drift is
  // irregular rather than a metronome.
  const air = Math.sin(t * 0.62) * 0.6 + Math.sin(t * 0.31 + 2.1) * 0.4;
  const wave = t * 1.15;

  const reach = meander * (0.62 + 0.38 * Math.abs(swing)) * (1 + 0.12 * air);
  const base = lo + lane * Math.max(0, hi - lo) + air * meander * 0.3;

  // Never let the stroke leave the page.
  const lo2 = Math.max(pad, lo);
  const hi2 = Math.min(w - pad, hi);
  const xc = Math.min(Math.max(base, lo2 + reach), Math.max(lo2 + reach, hi2 - reach));
  const drift = swing * meander * 0.5;

  // Travelling wave: the two ends and the middle of the curve are each pushed
  // on their own phase, which is what makes a taut line read as a string in
  // moving air rather than a shape being redrawn.
  const wEnd0 = Math.sin(wave) * meander * 0.3;
  const wMid = Math.sin(wave - 2) * meander * 0.5;
  const wEnd1 = Math.sin(wave - 4) * meander * 0.3;

  const x0 = xc - reach + drift + wEnd0;
  const x1 = xc + reach + drift + wEnd1;
  const seg =
    `C ${(xc + reach * 1.6 + wMid).toFixed(1)} ${(h * 0.34).toFixed(1)}, ` +
    `${(xc - reach * 1.6 + wMid).toFixed(1)} ${(h * 0.66).toFixed(1)}, ` +
    `${x1.toFixed(1)} ${h.toFixed(1)}`;
  const d = `M ${x0.toFixed(1)} 0 ${seg}`;

  // The ground behind the line: left of it while it travels right, right of it
  // while it travels left. The fill shares the curve's edge exactly, so the
  // hairline always sits on the boundary of the inversion.
  const heading = -Math.sin(p * Math.PI * 2);
  const edge = heading >= 0 ? 0 : w;
  const wash = `M ${edge} 0 L ${x0.toFixed(1)} 0 ${seg} L ${x1.toFixed(1)} ${h} L ${edge} ${h} Z`;

  return { d, wash };
}

export function ScrollCurve() {
  const [p, setP] = useState(0);
  const [box, setBox] = useState<Box>({ w: 0, h: 0, pad: 0, lo: 0, hi: 0, meander: 0 });

  const pRef = useRef(0);
  const boxRef = useRef<Box>(box);
  const edgeRef = useRef<SVGPathElement | null>(null);
  const washRef = useRef<SVGPathElement | null>(null);

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
      const next = Math.min(1, Math.max(0, y / Math.max(1, span)));
      pRef.current = next;
      setP(next);
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

      const next: Box = {
        w,
        h,
        pad,
        lo: tight ? pad : Math.max(pad, gutterL / 2),
        hi: tight ? w - pad : Math.min(w - pad, w - gutterR / 2),
        meander: wide ? 22 : 5,
      };
      boxRef.current = next;
      setBox(next);
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

  // The idle life of the string, written straight to the DOM so that moving
  // it never re-renders the page it is lying on top of.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const b = boxRef.current;
      const edge = edgeRef.current;
      if (b.w && b.h && edge && washRef.current) {
        const t = (now - start) / 1000;
        const { d, wash } = build(pRef.current, t, b.w, b.h, b.pad, b.lo, b.hi, b.meander);
        edge.setAttribute("d", d);
        washRef.current.setAttribute("d", wash);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const { w, h, pad, lo, hi, meander } = box;
  if (!w || !h) return null;
  const { d, wash } = build(p, 0, w, h, pad, lo, hi, meander);

  return (
    <svg
      aria-hidden
      // Above the page so it is visible everywhere, including the full-bleed
      // home page whose wrapper paints an opaque background. The wash is the
      // inverse of the theme at low strength, so words stay readable through it.
      className="pointer-events-none fixed inset-0 z-30 h-full w-full text-ink dark:text-paper"
      preserveAspectRatio="none"
      viewBox={`0 0 ${w} ${h}`}
    >
      <defs>
        <linearGradient id="seek-curve-wash" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="0.22" stopColor="currentColor" stopOpacity="0.2" />
          <stop offset="0.78" stopColor="currentColor" stopOpacity="0.2" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="seek-curve-edge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="0.18" stopColor="currentColor" stopOpacity="0.9" />
          <stop offset="0.82" stopColor="currentColor" stopOpacity="0.9" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path ref={washRef} d={wash} fill="url(#seek-curve-wash)" />
      <path
        ref={edgeRef}
        d={d}
        fill="none"
        stroke="url(#seek-curve-edge)"
        strokeWidth={1.75}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
