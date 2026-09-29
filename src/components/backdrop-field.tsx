import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import {
  bgForPath,
  bgSrc,
  preloadBackgrounds,
  type BgIndex,
} from "@/lib/backgrounds";

/**
 * Immersive backdrop — crossfades photographic BGs on route change + Ken Burns.
 * Legacy p1/p2/p3 kept for API compatibility.
 */
export function BackdropField({
  className,
  base = false,
  intensity = "full",
  p1: _p1,
  p2: _p2,
  p3: _p3,
}: {
  className?: string;
  base?: boolean;
  intensity?: "full" | "soft" | "none";
  p1?: number;
  p2?: number;
  p3?: number;
}) {
  void _p1;
  void _p2;
  void _p3;

  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const target = bgForPath(pathname);
  const [active, setActive] = useState<BgIndex>(target);
  const [incoming, setIncoming] = useState<BgIndex | null>(null);
  const [fadeIn, setFadeIn] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    preloadBackgrounds([0, 2, 3, target]);
  }, []);

  useEffect(() => {
    if (target === active && incoming === null) return;
    setIncoming(target);
    setFadeIn(false);
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setFadeIn(true));
    });
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setActive(target);
      setIncoming(null);
      setFadeIn(false);
      timeoutRef.current = null;
    }, 900);
    return () => {
      cancelAnimationFrame(raf);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [target]); // eslint-disable-line react-hooks/exhaustive-deps

  if (intensity === "none") return null;

  const veilDark =
    intensity === "soft"
      ? "from-black/60 via-black/45 to-black/75"
      : "from-black/42 via-black/30 to-black/60";
  const veilLight =
    intensity === "soft"
      ? "from-white/55 via-white/40 to-white/65"
      : "from-white/38 via-white/24 to-white/52";

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      <div
        key={`base-${active}`}
        className="seek-bg-drift absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{ backgroundImage: `url(${bgSrc(active)})` }}
      />
      {incoming !== null && (
        <div
          key={`in-${incoming}`}
          className={cn(
            "absolute inset-0 bg-cover bg-center bg-no-repeat will-change-opacity transition-opacity duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
            fadeIn ? "opacity-100" : "opacity-0",
          )}
          style={{ backgroundImage: `url(${bgSrc(incoming)})` }}
        />
      )}
      <div className={cn("absolute inset-0 bg-gradient-to-b dark:hidden", veilLight)} />
      <div className={cn("absolute inset-0 hidden bg-gradient-to-b dark:block", veilDark)} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.22)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
      {base && (
        <div className="absolute inset-0 bg-[var(--paper)]/15 dark:bg-[var(--paper)]/25" />
      )}
    </div>
  );
}
