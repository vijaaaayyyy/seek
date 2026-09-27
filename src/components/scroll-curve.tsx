import { useEffect, useState } from "react";

/**
 * One thread that runs the whole page beside the content: it enters at the top
 * as a soft S and, as you scroll, swings further and resolves into the exact
 * opposite of the paper colour. The blend mode is what makes "opposite"
 * literal, so the line stays legible in either theme.
 *
 * It is deliberately kept in the margin. The reading column is measured at
 * runtime and the thread is placed beyond it, so on a text page it runs beside
 * the words rather than across them. Pages with no margin (full-bleed home and
 * reader on a phone) fall back to hugging the outer edge.
 */
export function ScrollCurve() {
  const [p, setP] = useState(0);
  const [box, setBox] = useState({ w: 0, h: 0, cx: 0, meander: 0 });

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

      // Right-hand edge of the reading column, so the thread can clear it.
      let right = 0;
      const main = [...document.querySelectorAll("main")].find(
        (el) => el.getBoundingClientRect().width > 0,
      );
      if (main) {
        for (const el of main.querySelectorAll<HTMLElement>("p,h1,h2,h3,li,article,section")) {
          const b = el.getBoundingClientRect();
          if (b.height < 2 || b.width < 2) continue;
          if (b.right > right) right = b.right;
        }
      }

      // Sit in the margin beside the column. Centre of the free space when
      // there is some; otherwise clamp inside the viewport.
      const cx = wide
        ? Math.min(w - 56, Math.max((right + w) / 2, w * 0.7))
        : w - 7;

      setBox({ w, h, cx, meander: wide ? 26 : 5 });
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

  const { w, h, cx, meander } = box;
  if (!w || !h) return null;

  // A meandering S that deepens as you descend: the swing travels half a cycle
  // and the bow grows, so the shape at the footer differs from the hero rather
  // than returning to where it started.
  const swing = Math.sin(p * Math.PI * 1.5);
  const reach = meander * (0.55 + 0.45 * swing);
  const drift = swing * meander * 0.7;
  const d =
    `M ${(cx - reach + drift).toFixed(1)} 0 ` +
    `C ${(cx + reach * 1.7).toFixed(1)} ${(h * 0.34).toFixed(1)}, ` +
    `${(cx - reach * 1.7).toFixed(1)} ${(h * 0.66).toFixed(1)}, ` +
    `${(cx + reach + drift).toFixed(1)} ${h.toFixed(1)}`;

  // grey -> white source: under difference blending that walks the visible
  // stroke from a soft mid-tone to the bold inverse of the paper.
  const grey = Math.round(120 + p * 135);
  const stroke = `rgb(${grey}, ${grey}, ${grey})`;
  const width = (2 + p * 1.2).toFixed(2);

  return (
    <svg
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30 h-full w-full mix-blend-difference"
      preserveAspectRatio="none"
      viewBox={`0 0 ${w} ${h}`}
    >
      <path d={d} fill="none" opacity={0.16} stroke={stroke} strokeWidth={11} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <path d={d} fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
