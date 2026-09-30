/**
 * Page-to-page transitions.
 *
 * The brief was "transition between page to page and all", so this is
 * deliberately the whole navigation gesture rather than a flourish on one page:
 * the incoming page settles in, the gilt hairline draws itself across the top,
 * and the scroll returns to the top. Three things it will not do:
 *
 *  - it will not run when the visitor has asked for reduced motion, because a
 *    full-viewport animation is exactly the kind of thing that setting exists
 *    to stop;
 *  - it will not delay navigation. The new page is mounted immediately and the
 *    animation is purely presentational, so nothing is ever waiting on it;
 *  - it will not remount on search-param or hash changes, only when the visitor
 *    has actually gone somewhere else. A filter that rewrites the query string
 *    should not replay a page transition;
 *  - it fades only, and never transforms. See the note in styles.css: a
 *    transform here would make this element a containing block for the home
 *    page's fixed background and break the hero-to-footer cover.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [phase, setPhase] = useState<"idle" | "enter">("idle");
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // No animation, but the scroll still belongs at the top of a new page.
    if (reduced) return;

    setPhase("enter");
    const t = window.setTimeout(() => setPhase("idle"), 420);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return (
    <div
      data-page-phase={phase}
      // `key` is what makes the enter animation replay: it is scoped to the
      // path, so a new path means a new element and the animation runs again
      // from the start. Search params are deliberately not part of the key.
      key={pathname}
    >
      {children}
    </div>
  );
}
