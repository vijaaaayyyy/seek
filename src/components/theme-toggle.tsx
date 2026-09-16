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
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "relative flex h-9 w-[4.5rem] shrink-0 items-center rounded-full ring-1 ring-black/10 px-1 transition-[transform,background-color] duration-200 dark:ring-white/15",
        "active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-1 left-1 size-7 rounded-full bg-white shadow-sm ring-1 ring-black/10 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] dark:bg-[#2b2e37] dark:ring-white/15",
          isDark && "translate-x-[2.25rem]",
        )}
      />
      <span className="relative z-10 flex h-full flex-1 items-center justify-center">
        <Sun
          className={cn(
            "size-[18px] transition-colors duration-200",
            isDark ? "text-muted" : "text-ink",
          )}
          strokeWidth={1.9}
          fill={isDark ? "none" : "currentColor"}
          fillOpacity={isDark ? 0 : 0.18}
        />
      </span>
      <span className="relative z-10 flex h-full flex-1 items-center justify-center">
        <Moon
          className={cn(
            "size-[18px] transition-colors duration-200",
            isDark ? "text-ink" : "text-muted",
          )}
          strokeWidth={1.9}
          fill={!isDark ? "none" : "currentColor"}
          fillOpacity={isDark ? 0.18 : 0}
        />
      </span>
    </button>
  );
}