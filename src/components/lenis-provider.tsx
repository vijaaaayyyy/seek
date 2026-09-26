import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";

/**
 * SEEK scrolls an inner <main> on small screens (the app shell keeps the
 * document fixed so the bottom nav can stay pinned) and the window on large
 * ones. Lenis has to drive whichever element actually scrolls, otherwise the
 * smooth inertia silently does nothing on mobile.
 */
function findScroller(): HTMLElement | null {
  const candidates = document.querySelectorAll<HTMLElement>("main, [data-lenis-scroller]");
  for (const el of candidates) {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") continue;
    if (!/(auto|scroll)/.test(cs.overflowY)) continue;
    if (el.scrollHeight > el.clientHeight + 4) return el;
  }
  return null;
}

export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let lenis: Lenis | null = null;
    let cancelled = false;
    const timers: number[] = [];

    const start = (scroller: HTMLElement | null) => {
      if (cancelled || lenis) return;
      lenis = new Lenis({
        autoRaf: true,
        // long, heavy glide — reads as inertia rather than a scrollbar jump
        duration: 1.45,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        lerp: 0.085,
        smoothWheel: true,
        wheelMultiplier: 0.85,
        syncTouch: true,
        syncTouchLerp: 0.075,
        touchMultiplier: 1.1,
        ...(scroller
          ? { wrapper: scroller, content: (scroller.firstElementChild as HTMLElement) ?? scroller }
          : {}),
      });
      (window as Window & { __lenis?: Lenis }).__lenis = lenis;
    };

    // The inner scroller only becomes measurable after the shell lays out, so
    // probe across the first few frames instead of deciding on mount.
    start(findScroller());
    if (!lenis) {
      for (const delay of [80, 240, 600, 1200]) {
        timers.push(
          window.setTimeout(() => {
            if (!lenis) start(findScroller());
          }, delay),
        );
      }
    }

    return () => {
      cancelled = true;
      for (const t of timers) window.clearTimeout(t);
      lenis?.destroy();
      delete (window as Window & { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return children;
}
