import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Bookmark, Download, Home, UserRound } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import { useHideOnScroll } from "@/hooks/use-hide-on-scroll";
import { useInstall } from "@/components/install-provider";
import { applyChrome, readStoredTheme, systemTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const MOBILE_NAV = [
  {
    to: "/",
    label: "Home",
    icon: Home,
    match: (p: string) =>
      p === "/" || p.startsWith("/search") || p.startsWith("/explore"),
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
  {
    to: "/profile",
    label: "Profile",
    icon: UserRound,
    match: (p: string) => p.startsWith("/profile") || p.startsWith("/login"),
  },
] as const;

const DESKTOP_LINKS = [
  { to: "/books", label: "Bible" },
  { to: "/saved", label: "Saved" },
  { to: "/profile", label: "Profile" },
] as const;

function LeafMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 21c-1.5-1.2-6-5.2-6-9.5A4.5 4.5 0 0 1 12 7.2 4.5 4.5 0 0 1 18 11.5c0 4.3-4.5 8.3-6 9.5Z" />
      <path d="M12 11.5V7.2" />
    </svg>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";
  const isAuthCallback = pathname.startsWith("/auth/callback");
  const isRead = pathname.startsWith("/read");
  const isLogin = pathname.startsWith("/login");
  const navHidden = useHideOnScroll(10);
  const { status: installStatus } = useInstall();
  const isInstalled = installStatus === "installed";
  const activeIndex = Math.max(
    0,
    MOBILE_NAV.findIndex((item) => item.match(pathname)),
  );

  useEffect(() => {
    const root = document.documentElement;
    if (isHome) root.classList.add("home-canopy");
    else root.classList.remove("home-canopy");

    const syncChrome = () => {
      const theme = readStoredTheme() ?? systemTheme();
      // Dark mode OR home forest → dark system status bar (light time/battery icons)
      applyChrome(theme, { darkSurface: isHome || theme === "dark" });
    };

    syncChrome();
    window.addEventListener("seek-theme", syncChrome);
    window.addEventListener("storage", syncChrome);

    return () => {
      window.removeEventListener("seek-theme", syncChrome);
      window.removeEventListener("storage", syncChrome);
      root.classList.remove("home-canopy");
      const t = readStoredTheme() ?? systemTheme();
      applyChrome(t, { darkSurface: t === "dark" });
    };
  }, [isHome]);

  return (
    <div
      className={cn(
        "relative isolate min-h-dvh overflow-x-hidden text-ink",
        isHome && "bg-transparent",
      )}
    >
      {!isHome && <div className="app-atmosphere" aria-hidden />}

      <div className="relative z-10 hidden min-h-dvh flex-col lg:flex">
        {!isAuthCallback && (
          <header
            className={cn(
              "fixed top-0 right-0 left-0 z-40 flex items-center justify-center px-4 pt-4 pb-2 transition-transform duration-300 ease-out will-change-transform",
              navHidden ? "-translate-y-[120%]" : "translate-y-0",
            )}
          >
            <div
              className={cn(
                "flex h-12 w-fit max-w-[min(100%,40rem)] items-center gap-1 rounded-full px-2.5 shadow-sm ring-1 backdrop-blur-xl",
                isHome
                  ? "bg-white/85 ring-black/8 dark:bg-black/50 dark:ring-white/12"
                  : "bg-white/55 ring-black/5 dark:bg-black/45 dark:ring-white/10",
              )}
            >
              <Link
                to="/"
                className="flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5"
              >
                <LeafMark className="size-4 text-forest" />
                <span className="font-serif text-[1.05rem] tracking-[0.04em] text-ink">
                  SEEK
                </span>
              </Link>
              <nav className="flex items-center gap-0.5">
                {DESKTOP_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={cn(
                      "rounded-full px-3 py-1.5 font-sans text-[12.5px] font-medium transition-colors",
                      pathname.startsWith(link.to)
                        ? "bg-ink/8 text-ink"
                        : "text-muted hover:text-ink",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="ml-1 flex items-center gap-1 border-l border-line/80 pl-2">
                <ThemeToggle />
                <UserMenu />
              </div>
            </div>
            {!isInstalled && (
              <Link
                to="/download"
                title="Download the app"
                aria-label="Download the app"
                className={cn(
                  "absolute top-4 right-4 flex h-12 items-center gap-2 rounded-full px-4 font-sans text-[13px] font-medium shadow-sm ring-1 backdrop-blur-xl transition-all hover:opacity-90 active:scale-[0.98]",
                  isHome
                    ? "bg-white/85 text-ink ring-black/8 dark:bg-black/50 dark:text-[#f5f0e8] dark:ring-white/12"
                    : "bg-white/55 text-ink ring-black/5 dark:bg-black/45 dark:text-[#f5f0e8] dark:ring-white/10",
                )}
              >
                <Download className="size-[18px]" strokeWidth={1.9} />
                <span className="hidden sm:inline">Download</span>
              </Link>
            )}
          </header>
        )}
        <main
          className={cn(
            "flex-1",
            !isHome && "mx-auto w-full max-w-5xl px-6 pt-20 pb-16",
            isHome && "pt-0",
            isAuthCallback && "flex items-center justify-center",
            isLogin && "pt-20",
          )}
        >
          {children}
        </main>
      </div>

      <div className="relative z-10 flex min-h-dvh w-full items-stretch lg:hidden">
        <div
          className={cn(
            "relative flex h-dvh w-full flex-col overflow-x-hidden overflow-y-hidden",
            isHome ? "bg-transparent" : "app-device",
          )}
        >
          {!isAuthCallback && (
            <header
              className={cn(
                "fixed top-0 right-0 left-0 z-30 w-full shrink-0 px-3 pt-[max(0.5rem,env(safe-area-inset-top))] pb-2 transition-transform duration-300 ease-out will-change-transform",
                navHidden ? "-translate-y-[120%]" : "translate-y-0",
              )}
            >
              <div className="flex h-12 w-full items-center gap-2">
                <div
                  className={cn(
                    "flex h-12 min-w-0 flex-1 items-center justify-between rounded-full pl-4 pr-1.5",
                    isHome
                      ? "bg-white/85 shadow-sm ring-1 ring-black/8 backdrop-blur-xl dark:bg-black/45 dark:ring-white/12"
                      : "glass",
                  )}
                >
                  <Link to="/" className="flex min-h-10 items-center gap-1.5">
                    <LeafMark className="size-4 text-forest" />
                    <span className="font-serif text-[1.2rem] leading-none tracking-[0.04em] text-ink">
                      SEEK
                    </span>
                  </Link>
                  <div className="flex items-center gap-1">
                    <ThemeToggle />
                    <UserMenu />
                  </div>
                </div>
                {!isInstalled && (
                  <Link
                    to="/download"
                    title="Download the app"
                    aria-label="Download the app"
                    className={cn(
                      "flex size-12 shrink-0 items-center justify-center rounded-full shadow-sm ring-1 backdrop-blur-xl transition-all active:scale-95",
                      isHome
                        ? "bg-white/85 text-ink ring-black/8 dark:bg-black/45 dark:text-[#f5f0e8] dark:ring-white/12"
                        : "bg-white/70 text-ink ring-black/8 dark:bg-black/45 dark:text-[#f5f0e8] dark:ring-white/12",
                    )}
                  >
                    <Download className="size-[18px]" strokeWidth={1.9} />
                  </Link>
                )}
              </div>
            </header>
          )}

          <main
            className={cn(
              "hide-scrollbar min-h-0 w-full flex-1 overflow-x-hidden overflow-y-auto px-4 pt-16 pb-28",
              isRead && "px-0 pt-16",
              isHome && "px-0 pt-0 pb-28",
            )}
          >
            {children}
          </main>

          {!isAuthCallback && (
            <nav
              className={cn(
                "absolute inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform duration-300 ease-out",
                navHidden ? "translate-y-[140%]" : "translate-y-0",
              )}
              aria-label="Primary"
            >
              <div className="glass glass-strong relative grid h-[4rem] w-full max-w-[min(100%,28rem)] grid-cols-4 rounded-full p-1.5">
                <div
                  aria-hidden
                  className="absolute top-1.5 bottom-1.5 left-1.5 w-[calc((100%-0.75rem)/4)] rounded-full bg-ink/10 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] dark:bg-paper/14"
                  style={{ transform: `translateX(${activeIndex * 100}%)` }}
                />
                {MOBILE_NAV.map((item) => {
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
          )}
        </div>
      </div>
    </div>
  );
}
