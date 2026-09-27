import { useEffect, useState } from "react";

/**
 * One thread that runs the whole page: it enters as a soft S-curve behind the
 * hero and, as you scroll, bends further and resolves into the exact opposite
 * of the paper colour. The blend mode is what makes "opposite" literal — the
 * stroke is drawn as its own inverse, so it stays legible in either theme.
 */
export function ScrollCurve() {
  const [p, setP] = useState(0);
  const [box, setBox] = useState({ w: 0, h: 0 });

  useEffect(() => {
    // The shell pins the document and lets an inner <main> scroll on small
    // screens, so the offset has to come from whichever element actually moved.
    const read = (target?: EventTarget | null) => {
      const node = target instanceof HTMLElement ? target : null;
      const inner =
        node && node !== document.body && node !== document.documentElement ? node : null;
      const h = inner ? inner.scrollHeight : document.documentElement.scrollHeight;
      const y = inner ? inner.scrollTop : window.scrollY || document.documentElement.scrollTop;
      setBox({ w: window.innerWidth || 1, h: window.innerHeight || 1 });
      setP(Math.min(1, Math.max(0, y / Math.max(1, h - (inner ? inner.clientHeight : window.innerHeight)))));
    };
    const onScroll = (e: Event) => read(e.target);
    const onResize = () => read(null);
    read(null);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const w = box.w;
  const h = box.h;

  // A meandering S that genuinely deepens as you descend: the swing travels
  // through a half cycle (so the shape at the footer differs from the hero) and
  // the bow grows, rather than returning to where it started.
  const swing = Math.sin(p * Math.PI * 1.5) * w * 0.14;
  const bow = (0.18 + p * 0.16) * w;
  const x0 = w * 0.26 + swing;
  const x1 = w * 0.74 - swing;
  const d = `M ${x0.toFixed(1)} 0 C ${(x0 + bow).toFixed(1)} ${(h * 0.34).toFixed(1)}, ${(x1 - bow).toFixed(1)} ${(h * 0.66).toFixed(1)}, ${x1.toFixed(1)} ${h.toFixed(1)}`;

  // grey -> white source: under difference blending that walks the visible
  // stroke from a soft mid-tone to the bold inverse of the paper.
  const grey = Math.round(128 + p * 127);
  const stroke = `rgb(${grey}, ${grey}, ${grey})`;
  const width = (1.25 + p * 1.1).toFixed(2);

  return (
    <svg
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full mix-blend-difference"
      preserveAspectRatio="none"
      viewBox={`0 0 ${w} ${h}`}
    >
      <path d={d} fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
