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

      // Right-hand edge of the reading column, so the thread can clear it.
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

      // How much open paper there is either side of the content. A page with
      // real margins (the reader, saved, search) sweeps between them and passes
      // behind the card in between; a full-bleed page sweeps the whole width.
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
        meander: wide ? 26 : 5,
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

  // Where the thread sits across the page. It starts on the right, travels
  // through the middle, crosses to the left, and settles back in the middle,
  // so it occupies the centre on open pages and the margins on pages whose
  // content is a solid card. The travel is clamped inside the viewport.
  const lane = (Math.cos(p * Math.PI * 1.5) + 1) / 2;
  const x = lo + lane * Math.max(0, hi - lo);

  // A meandering S that deepens as you descend: the swing travels half a cycle
  // and the bow grows, so the shape at the footer differs from the hero rather
  // than returning to where it started.
  const swing = Math.sin(p * Math.PI * 1.5);
  const reach = meander * (0.55 + 0.45 * swing);
  const drift = swing * meander * 0.7;
  // Never let the stroke or its halo leave the page.
  const lo2 = Math.max(pad, lo);
  const hi2 = Math.min(w - pad, hi);
  const xc = Math.min(Math.max(x, lo2 + reach), Math.max(lo2 + reach, hi2 - reach));
  const d =
    `M ${(xc - reach + drift).toFixed(1)} 0 ` +
    `C ${(xc + reach * 1.7).toFixed(1)} ${(h * 0.34).toFixed(1)}, ` +
    `${(xc - reach * 1.7).toFixed(1)} ${(h * 0.66).toFixed(1)}, ` +
    `${(xc + reach + drift).toFixed(1)} ${h.toFixed(1)}`;

  // grey -> white source: under difference blending that walks the visible
  // stroke from a soft mid-tone to the bold inverse of the paper.
  const grey = Math.round(120 + p * 135);
  const stroke = `rgb(${grey}, ${grey}, ${grey})`;
  const width = (2 + p * 1.2).toFixed(2);

  return (
    <svg
      aria-hidden
      // Above the page so it is visible everywhere, including the full-bleed
      // home page whose wrapper paints an opaque background. mix-blend-difference
      // means the thread inverts whatever it crosses instead of covering it, so
      // words and cards stay readable through a 2px line.
      className="pointer-events-none fixed inset-0 z-30 h-full w-full mix-blend-difference"
      preserveAspectRatio="none"
      viewBox={`0 0 ${w} ${h}`}
    >
      <path d={d} fill="none" opacity={0.16} stroke={stroke} strokeWidth={11} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <path d={d} fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
