import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";

/**
 * SEEK keeps the document pinned and lets an inner <main> scroll on small
 * screens. Smooth-scrolling that element is what went wrong: the library was
 * created once on mount and captured the page's root div as its content, so
 * after the first navigation it was measuring a detached node and the glide
 * stopped, leaving every page except the landing one unscrollable by touch.
 *
 * The inner scroller is a plain overflow container, so the platform already
 * scrolls it well. Leave it alone and reserve Lenis for the desktop window,
 * which is a stable target that never unmounts.
 */
function innerScrollerPresent(): boolean {
  for (const el of document.querySelectorAll<HTMLElement>("main")) {
    if (el.getBoundingClientRect().width === 0) continue;
    if (/(auto|scroll)/.test(getComputedStyle(el).overflowY)) return true;
  }
  return false;
}

export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    // Small screens scroll an inner <main> natively.
    if (innerScrollerPresent()) return;

    const lenis = new Lenis({
      autoRaf: true,
      // long, heavy glide — reads as inertia rather than a scrollbar jump
      duration: 1.45,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.85,
    });
    (window as Window & { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      lenis.destroy();
      delete (window as Window & { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return children;
}
