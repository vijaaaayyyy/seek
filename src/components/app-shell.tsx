import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Bookmark, Home } from "lucide-react";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import { cn } from "@/lib/utils";

const NAV = [
  {
    to: "/",
    label: "Home",
    icon: Home,
    match: (p: string) => p === "/" || p.startsWith("/search"),
  },
  {
    to: "/books",
    label: "Bible",
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
  const isHome = pathname === "/";
  const activeIndex = Math.max(
    0,
    NAV.findIndex((item) => item.match(pathname)),
  );

  return (
    <div className="relative isolate min-h-dvh text-ink">
      {!isHome && <div className="app-atmosphere" aria-hidden />}

      <div className="relative z-10 flex min-h-dvh items-stretch justify-center sm:items-center sm:p-4">
        <div
          className={cn(
            "app-device relative flex h-dvh w-full max-w-[430px] flex-col overflow-hidden sm:h-[min(852px,calc(100dvh-2rem))] sm:rounded-[40px]",
            isHome && "bg-transparent",
          )}
        >
          <header className="sticky top-0 z-30 shrink-0 px-4 pt-[max(0.5rem,env(safe-area-inset-top))] pb-2">
            <div
              className={cn(
                "flex h-14 items-center justify-between rounded-full pl-5 pr-1.5",
                isHome
                  ? "bg-white/55 shadow-sm ring-1 ring-black/5 backdrop-blur-xl dark:bg-black/35 dark:ring-white/10"
                  : "glass",
              )}
            >
              <Link to="/" className="flex min-h-11 items-center gap-2">
                <span
                  className="inline-flex size-6 items-center justify-center text-forest"
                  aria-hidden
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="size-5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 21c-1.5-1.2-6-5.2-6-9.5A4.5 4.5 0 0 1 12 7.2 4.5 4.5 0 0 1 18 11.5c0 4.3-4.5 8.3-6 9.5Z" />
                    <path d="M12 11.5V7.2" />
                  </svg>
                </span>
                <span className="font-serif text-[1.35rem] leading-none tracking-[0.04em] text-ink">
                  SEEK
                </span>
              </Link>
              <div className="flex items-center gap-1.5">
                <ThemeToggle />
                <UserMenu />
              </div>
            </div>
          </header>

          <main
            className={cn(
              "hide-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-28",
              isHome && "overflow-hidden",
            )}
          >
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
