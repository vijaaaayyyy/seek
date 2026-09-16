import { useEffect, useRef, useState } from "react";

/**
 * YouTube-style: hide chrome when scrolling down, show when scrolling up.
 * Tracks window scroll and nested overflow containers (capture).
 */
export function useHideOnScroll(threshold = 12) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    function readY(target: EventTarget | null): number {
      if (target && target instanceof HTMLElement) return target.scrollTop;
      return window.scrollY;
    }

    function onScroll(e: Event) {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = readY(e.target === document ? window : e.target);
        const delta = y - lastY.current;

        if (y < 48) {
          setHidden(false);
        } else if (delta > threshold) {
          setHidden(true);
        } else if (delta < -threshold) {
          setHidden(false);
        }

        lastY.current = y;
        ticking.current = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, true);
    };
  }, [threshold]);

  return hidden;
}
