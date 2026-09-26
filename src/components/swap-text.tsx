import { cn } from "@/lib/utils";

export function SwapText({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <span className={cn("relative inline-flex overflow-hidden leading-[1.05]", className)}>
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full group-focus-visible:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0"
      >
        {children}
      </span>
    </span>
  );
}
