import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Bookmark, Search } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Seek", icon: Search, match: (p: string) => p === "/" || p.startsWith("/search") },
  { to: "/books", label: "Books", icon: BookOpen, match: (p: string) => p.startsWith("/books") || p.startsWith("/read") },
  { to: "/saved", label: "Saved", icon: Bookmark, match: (p: string) => p.startsWith("/saved") },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-dvh flex-col bg-paper text-ink">
      <header className="sticky top-0 z-30 border-b border-line/80 bg-paper/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:h-16 sm:px-6">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="font-serif text-xl tracking-tight text-ink italic">Seek</span>
            <span className="hidden font-sans text-xs tracking-wide text-muted sm:inline">
              King James
            </span>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {NAV.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "inline-flex h-10 items-center rounded-md px-3 font-sans text-sm transition-colors",
                    active ? "bg-wash text-ink" : "text-muted hover:bg-wash hover:text-ink",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-24 sm:px-6 sm:pb-16">
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm sm:hidden">
        <div className="grid grid-cols-3">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = item.match(pathname);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 font-sans text-[11px] tracking-wide",
                  active ? "text-ink" : "text-muted",
                )}
              >
                <Icon className="size-4" strokeWidth={active ? 2.2 : 1.8} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
