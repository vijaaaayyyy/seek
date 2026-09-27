import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const CONTACT_EMAIL = "vijay.peddenti434@gmail.com";

const LINKS = [
  { n: "1", label: "Home", to: "/" as const, match: (p: string) => p === "/" },
  { n: "2", label: "Bible", to: "/books" as const, match: (p: string) => p.startsWith("/books") || p.startsWith("/read") },
  { n: "3", label: "Explore", to: "/explore" as const, match: (p: string) => p.startsWith("/explore") || p.startsWith("/search") },
  { n: "4", label: "Saved", to: "/saved" as const, match: (p: string) => p.startsWith("/saved") },
  { n: "5", label: "About", to: "/about" as const, match: (p: string) => p.startsWith("/about") },
  { n: "6", label: "Contact", to: "/contact" as const, match: (p: string) => p.startsWith("/contact") },
] as const;

export function FullMenu() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed top-4 right-4 z-[70] flex h-9 items-center rounded-full px-4 font-sans text-[13px] font-medium tracking-wide shadow-sm ring-1 transition-colors",
          open
            ? "bg-ink text-paper ring-ink"
            : "bg-white/90 text-ink ring-black/10 backdrop-blur-md hover:bg-white dark:bg-black/60 dark:text-ink dark:ring-white/15",
        )}
        aria-expanded={open}
        aria-controls="seek-full-menu"
      >
        {open ? "Close" : "Menu"}
      </button>

      <div
        id="seek-full-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={cn(
          "fixed inset-0 z-[60] flex flex-col bg-[#f5f5f5] transition-[opacity,visibility] duration-400 ease-out dark:bg-[#0c0d12]",
          open ? "visible opacity-100" : "invisible opacity-0 pointer-events-none",
        )}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div
            className={cn(
              "absolute top-[8%] right-[6%] h-[42vmin] w-[36vmin] rounded-sm bg-[#e8e8e8] transition-transform duration-700 ease-out dark:bg-[#1a1c26]",
              open ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0",
            )}
          />
          <div
            className={cn(
              "absolute top-[28%] right-[28%] h-[28vmin] w-[24vmin] rounded-sm bg-[#dcdcdc] transition-transform duration-700 delay-75 ease-out dark:bg-[#222636]",
              open ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0",
            )}
          />
          <div
            className={cn(
              "absolute bottom-[18%] left-[8%] h-[22vmin] w-[32vmin] rounded-sm bg-[#e0e0e0]/blur-[2px] transition-all duration-700 delay-100 ease-out dark:bg-[#181a22]",
              open ? "translate-y-0 opacity-70" : "translate-y-8 opacity-0",
            )}
          />
        </div>

        <div className="relative z-10 flex flex-1 flex-col justify-between px-6 pb-10 pt-20 sm:px-12 lg:px-16">
          <nav className="flex flex-col gap-1 sm:gap-2">
            {LINKS.map((link, i) => {
              const active = link.match(pathname);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "group flex items-baseline gap-4 sm:gap-6 transition-transform duration-500 ease-out",
                    open ? "translate-x-0 opacity-100" : "-translate-x-6 opacity-0",
                  )}
                  style={{ transitionDelay: open ? `${80 + i * 55}ms` : "0ms" }}
                >
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-medium tabular-nums sm:size-8 sm:text-[12px]",
                      active
                        ? "border-ink bg-ink text-paper"
                        : "border-ink/25 text-ink/50 group-hover:border-ink/60 group-hover:text-ink",
                    )}
                  >
                    {link.n}
                  </span>
                  <span
                    className={cn(
                      "font-sans text-[clamp(2.4rem,9vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.03em]",
                      active ? "text-ink" : "text-ink/35 group-hover:text-ink",
                    )}
                  >
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div
            className={cn(
              "mt-10 max-w-md transition-all duration-500 delay-300 ease-out",
              open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
            )}
          >
            <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-ink/45">
              Write directly
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-2 block font-serif text-[clamp(1.15rem,3.2vw,1.65rem)] leading-snug text-ink underline-offset-4 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
            <p className="mt-4 max-w-xs font-sans text-[13px] leading-relaxed text-ink/55">
              Available for selected projects & feedback on SEEK.
            </p>
          </div>
        </div>

        <span
          className="pointer-events-none absolute bottom-6 left-4 select-none font-sans text-[clamp(2rem,8vw,4rem)] font-medium tracking-tight text-ink/[0.06] sm:left-8"
          aria-hidden
        >
          seek
        </span>
        <span
          className="pointer-events-none absolute right-4 bottom-6 select-none font-sans text-[clamp(2rem,8vw,4rem)] font-medium tracking-tight text-ink/[0.06] sm:right-8"
          aria-hidden
        >
          bible
        </span>
      </div>
    </>
  );
}
