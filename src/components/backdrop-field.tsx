import { cn } from "@/lib/utils";

/**
 * The one background every page shares: soft neutral blocks drifting on a
 * plain paper field. Home passes scroll progress for the parallax drift;
 * every other page renders the same field, still.
 */
export function BackdropField({
  p1,
  p2,
  p3,
  className,
  base = false,
}: {
  p1?: number;
  p2?: number;
  p3?: number;
  className?: string;
  base?: boolean;
}) {
  const drift = (v: number | undefined, factor: number) =>
    v === undefined ? undefined : { transform: `translate3d(0, ${v * factor}px, 0)` };

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 overflow-hidden",
        base && "bg-[var(--paper)]",
        className,
      )}
    >
      <div
        className="absolute left-[4%] top-[18%] h-[22vmin] w-[32vmin] rounded-sm bg-black/10 blur-[18px] dark:bg-white/8"
        style={drift(p1, 0.4)}
      />
      <div
        className="absolute right-[6%] top-[28%] h-[26vmin] w-[34vmin] rounded-sm bg-black/12 blur-[22px] dark:bg-white/10"
        style={drift(p2, -0.5)}
      />
      <div
        className="absolute bottom-[12%] left-[18%] h-[18vmin] w-[28vmin] rounded-sm bg-black/8 blur-[16px] dark:bg-white/6"
        style={drift(p3, 0.3)}
      />
      <div
        className="absolute left-[12%] top-[8%] h-[14vmin] w-[11vmin] bg-black dark:bg-white"
        style={drift(p2, 0.25)}
      />
    </div>
  );
}
