import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Bookmark, Search } from "lucide-react";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import { cn } from "@/lib/utils";

const NAV = [
  {
    to: "/",
    label: "Seek",
    icon: Search,
    match: (p: string) => p === "/" || p.startsWith("/search"),
  },
  {
    to: "/books",
    label: "Books",
    icon: BookOpen,
    match: (p: string) => p.startsWith("/books") || p.startsWith("/read"),
  },
  {
    to: "/saved",
    label: "Saved",
    icon: Bookmark,
    match: (p: string) => p.startsWith("/saved"),
  },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const activeIndex = Math.max(
    0,
    NAV.findIndex((item) => item.match(pathname)),
  );

  return (
    <div className="relative isolate min-h-dvh text-ink">
      <div className="app-atmosphere" aria-hidden />

      <div className="relative z-10 flex min-h-dvh items-stretch justify-center sm:items-center sm:p-4">
        <div className="app-device relative flex h-dvh w-full max-w-[430px] flex-col overflow-hidden sm:h-[min(852px,calc(100dvh-2rem))] sm:rounded-[40px]">
          <header className="sticky top-0 z-30 shrink-0 px-4 pt-[max(0.5rem,env(safe-area-inset-top))] pb-2">
            <div className="glass flex h-14 items-center justify-between rounded-full pl-5 pr-1.5">
              <Link to="/" className="flex min-h-11 items-center gap-2">
                <span className="font-serif text-[1.45rem] leading-none tracking-tight text-ink italic">
                  Seek
                </span>
                <span className="font-sans text-[11px] font-medium tracking-[0.14em] text-muted uppercase">
                  KJV
                </span>
              </Link>
              <div className="flex items-center gap-1.5">
                <UserMenu />
                <ThemeToggle />
              </div>
            </div>
          </header>

          <main className="hide-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-28">
            {children}
          </main>

          <nav
            className="absolute inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
            aria-label="Primary"
          >
            <div className="glass glass-strong relative grid h-[4.25rem] w-full grid-cols-3 rounded-full p-1.5">
              <div
                aria-hidden
                className="absolute top-1.5 bottom-1.5 left-1.5 w-[calc((100%-0.75rem)/3)] rounded-full bg-ink/10 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] dark:bg-paper/14"
                style={{ transform: `translateX(${activeIndex * 100}%)` }}
              />
              {NAV.map((item) => {
                const Icon = item.icon;
                const active = item.match(pathname);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative z-10 flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-full font-sans text-[10px] font-medium tracking-wide transition-colors duration-150",
                      active ? "text-ink" : "text-muted",
                    )}
                  >
                    <Icon
                      className="size-5"
                      strokeWidth={active ? 2.2 : 1.7}
                      fill={active ? "currentColor" : "none"}
                      fillOpacity={active ? 0.18 : 0}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
