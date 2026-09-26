import { useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Magnetic({
  children,
  className,
  strength = 0.28,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    el.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate3d(0,0,0)";
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn("will-change-transform transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]", className)}
    >
      {children}
    </div>
  );
}
