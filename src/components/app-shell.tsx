import { Link, useRouterState } from "@tanstack/react-router";
import { Download, Menu, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { FullMenu } from "@/components/full-menu";
import { ScrollCurve } from "@/components/scroll-curve";
import { BibleFrame } from "@/components/bible-frame";
import { SwapText } from "@/components/swap-text";
import { UserMenu } from "@/components/user-menu";
import { useHideOnScroll } from "@/hooks/use-hide-on-scroll";
import { useInstall } from "@/components/install-provider";
import { applyChrome, readStoredTheme, systemTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isHome) root.classList.add("home-canopy");
    else root.classList.remove("home-canopy");

    const syncChrome = () => {
      const theme = readStoredTheme() ?? systemTheme();
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
      {!isAuthCallback && (
        <FullMenu open={menuOpen} onOpenChange={setMenuOpen} />
      )}
      <ScrollCurve />
      <BibleFrame />

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
                <span className="font-sans text-[1.05rem] tracking-[0.04em] text-ink">
                  SEEK
                </span>
              </Link>
              <nav className="flex items-center gap-0.5">
                {DESKTOP_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={cn(
                      "group flex items-center rounded-full px-3 py-1.5 font-sans text-[12.5px] font-medium transition-colors",
                      pathname.startsWith(link.to)
                        ? "bg-ink/8 text-ink"
                        : "text-muted hover:text-ink",
                    )}
                  >
                    <SwapText>{link.label}</SwapText>
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
                  "absolute top-4 right-24 flex h-12 items-center gap-2 rounded-full px-4 font-sans text-[13px] font-medium shadow-sm ring-1 backdrop-blur-xl transition-all hover:opacity-90 active:scale-[0.98]",
                  isHome
                    ? "bg-white/85 text-ink ring-black/8 dark:bg-black/50 dark:text-[var(--ink)] dark:ring-white/12"
                    : "bg-white/55 text-ink ring-black/5 dark:bg-black/45 dark:text-[var(--ink)] dark:ring-white/10",
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
                {!isAuthCallback && (
                  <button
                    type="button"
                    onClick={() => setMenuOpen((v) => !v)}
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={menuOpen}
                    aria-controls="seek-full-menu"
                    className={cn(
                      "flex size-12 shrink-0 items-center justify-center rounded-full shadow-sm ring-1 backdrop-blur-xl transition-all active:scale-95",
                      isHome
                        ? "bg-white/85 text-ink ring-black/8 dark:bg-black/45 dark:ring-white/12"
                        : "bg-white/70 text-ink ring-black/8 dark:bg-black/45 dark:ring-white/12",
                    )}
                  >
                    {menuOpen ? (
                      <X className="size-[18px]" strokeWidth={1.9} />
                    ) : (
                      <Menu className="size-[18px]" strokeWidth={1.9} />
                    )}
                  </button>
                )}
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
                    <span className="font-sans text-[1.2rem] leading-none tracking-[0.04em] text-ink">
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
                        ? "bg-white/85 text-ink ring-black/8 dark:bg-black/45 dark:text-[var(--ink)] dark:ring-white/12"
                        : "bg-white/70 text-ink ring-black/8 dark:bg-black/45 dark:text-[var(--ink)] dark:ring-white/12",
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
              "hide-scrollbar min-h-0 w-full flex-1 overflow-x-hidden overflow-y-auto px-4 pt-16",
              isRead ? "px-0 pt-16 pb-6" : null,
              isHome ? "px-0 pt-0 pb-6" : "pb-10",
            )}
          >
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}
