import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className={cn(
        "glass relative inline-flex size-11 shrink-0 items-center justify-center rounded-full",
        "transition-[transform,background-color] duration-150 ease-out",
        "active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30",
        className,
      )}
    >
      <span className="relative size-5">
        <Sun
          className={cn(
            "absolute inset-0 size-5 text-ink transition-[opacity,transform,filter] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
            isDark ? "scale-[0.25] opacity-0 blur-[4px]" : "scale-100 opacity-100 blur-none",
          )}
          strokeWidth={1.8}
        />
        <Moon
          className={cn(
            "absolute inset-0 size-5 text-ink transition-[opacity,transform,filter] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
            isDark ? "scale-100 opacity-100 blur-none" : "scale-[0.25] opacity-0 blur-[4px]",
          )}
          strokeWidth={1.8}
        />
      </span>
    </button>
  );
}
