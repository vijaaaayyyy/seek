import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useSeekStore } from "@/lib/store";
import { ArrowRight, ChevronRight, Search, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const EXAMPLES = [
  { q: "be not afraid", label: "be not afraid" },
  { q: "Psalm 23", label: "Psalm 23" },
  { q: "prodigal son", label: "prodigal son" },
  { q: "love your enemies", label: "love your enemies" },
  { q: "valley of the shadow", label: "valley of the shadow" },
];

export const Route = createFileRoute("/")({ component: Home });

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

function Home() {
  const rememberQuery = useSeekStore((s) => s.rememberQuery);
  const navigate = useNavigate();
  const [value, setValue] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    rememberQuery(q);
    void navigate({ to: "/search", search: { q } });
  }

  function runExample(q: string) {
    rememberQuery(q);
    void navigate({ to: "/search", search: { q } });
  }

  return (
    <>
      {/* DESKTOP / LAPTOP */}
      <div className="relative hidden min-h-dvh flex-col lg:flex">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_0%,#e8d5b5_0%,transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_70%_100%,#c4a574_0%,transparent_55%)] opacity-70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_15%_80%,#a8b89a_0%,transparent_50%)] opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1a1610]/55" />
          <div className="absolute top-0 left-1/2 h-[55%] w-[80%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(255,240,200,0.35)_0%,transparent_70%)]" />
        </div>

        <header className="relative z-20 mx-auto mt-6 w-full max-w-5xl px-6">
          <div className="flex h-14 items-center justify-between rounded-full bg-[#1c1915]/72 px-5 shadow-[0_8px_40px_rgba(0,0,0,0.25)] ring-1 ring-white/10 backdrop-blur-2xl">
            <Link to="/" className="flex items-center gap-2 text-white">
              <LeafMark className="size-5" />
              <span className="font-serif text-[1.2rem] tracking-[0.06em]">SEEK</span>
            </Link>
            <nav className="flex items-center gap-0.5">
              {[
                { to: "/books", label: "Bible" },
                { to: "/saved", label: "Saved" },
                { to: "/profile", label: "Profile" },
              ].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="rounded-full px-4 py-2 font-sans text-[13px] font-medium text-white/70 transition-colors hover:text-white"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <ThemeToggle className="border-0 bg-white/10 text-white ring-white/15 hover:bg-white/15" />
              <Link
                to="/books"
                className="rounded-full bg-[#e8d54a] px-4 py-2 font-sans text-[13px] font-semibold text-[#1c1915] transition-transform active:scale-95"
              >
                Open Bible
              </Link>
            </div>
          </div>
        </header>

        <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 pb-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 ring-1 ring-white/20 backdrop-blur-md">
            <Sparkles className="size-3.5 text-[#e8d54a]" strokeWidth={2} />
            <span className="font-sans text-[12px] font-medium tracking-wide text-white/90">
              Scripture for every season
            </span>
          </div>

          <h1 className="mt-6 font-serif text-[3.75rem] leading-[1.08] font-medium tracking-tight text-white xl:text-[4.25rem]">
            The Word
            <br />
            <span className="italic text-[#e8d54a]">you were looking for.</span>
          </h1>

          <p className="mt-5 max-w-md font-sans text-[16px] leading-relaxed text-white/75">
            Search Scripture by verse, phrase, feeling, or story — and find the
            place in the King James Bible.
          </p>

          <form onSubmit={submit} className="mt-8 w-full max-w-xl">
            <div className="flex items-center gap-2 rounded-full bg-white/95 p-1.5 shadow-[0_12px_48px_rgba(0,0,0,0.2)] ring-1 ring-black/5">
              <div className="relative min-w-0 flex-1">
                <Search
                  className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-muted"
                  strokeWidth={1.8}
                  aria-hidden
                />
                <input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  enterKeyHint="search"
                  placeholder="Search a verse, phrase, or feeling…"
                  className="h-12 w-full bg-transparent pr-3 pl-11 font-sans text-[15px] text-ink placeholder:text-faint focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="shrink-0 rounded-full bg-[#e8d54a] px-5 py-3 font-sans text-[14px] font-semibold text-[#1c1915] transition-transform active:scale-95"
              >
                Search
              </button>
            </div>
          </form>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.q}
                type="button"
                onClick={() => runExample(ex.q)}
                className="rounded-full bg-white/12 px-3.5 py-1.5 font-sans text-[12.5px] text-white/85 ring-1 ring-white/15 backdrop-blur-md transition-colors hover:bg-white/20"
              >
                “{ex.label}”
              </button>
            ))}
          </div>

          <p className="mt-14 font-serif text-[15px] tracking-[0.14em] text-white/80 uppercase">
            Your word lights my path
          </p>
          <p className="mt-1.5 font-sans text-[11px] tracking-[0.2em] text-white/50 uppercase">
            Psalm 119:105
          </p>
        </div>
      </div>

      {/* MOBILE */}
      <div className="relative -mx-4 -mt-3 flex min-h-[calc(100dvh-8.5rem)] flex-col lg:hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,#f0c49a_0%,transparent_55%)] opacity-80 dark:opacity-30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_80%_100%,#c4a574_0%,transparent_50%)] opacity-60 dark:opacity-20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_10%_90%,#b7cbb8_0%,transparent_50%)] opacity-50 dark:opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/25 dark:to-black/50" />
        </div>

        <div className="relative z-10 flex flex-1 flex-col px-5 pt-1 pb-2">
          <p className="text-center font-sans text-[10px] font-medium tracking-[0.28em] text-muted uppercase">
            Scripture for every season
          </p>

          <h1 className="mt-3 text-center font-serif text-[2.55rem] leading-[1.12] font-medium tracking-tight text-ink">
            The Word
            <br />
            <span className="italic">you were looking for.</span>
          </h1>

          <p className="mx-auto mt-3 max-w-[17rem] text-center font-sans text-[14px] leading-relaxed text-muted">
            Search Scripture by verse, phrase, feeling, or story.
          </p>

          <form onSubmit={submit} className="mx-auto mt-6 w-full max-w-md">
            <label htmlFor="home-search" className="sr-only">
              Search the Bible
            </label>
            <div className="relative flex items-center rounded-full bg-white/90 shadow-[0_8px_32px_rgba(40,30,10,0.14)] ring-1 ring-black/5 backdrop-blur-xl dark:bg-[#1c1f2c]/90 dark:ring-white/10">
              <Search
                className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-muted"
                strokeWidth={1.8}
                aria-hidden
              />
              <input
                id="home-search"
                value={value}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="search"
                placeholder="Search a verse, phrase, or feeling…"
                onChange={(e) => setValue(e.target.value)}
                className="h-13 w-full bg-transparent py-3.5 pr-14 pl-11 font-sans text-[15px] text-ink placeholder:text-faint focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute top-1/2 right-1.5 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#2c3a32] text-white transition-transform duration-150 active:scale-95 dark:bg-[#c5d1c8] dark:text-[#121410]"
              >
                <ArrowRight className="size-4" strokeWidth={2.2} />
              </button>
            </div>
          </form>

          <div className="mx-auto mt-4 flex max-w-md flex-wrap justify-center gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.q}
                type="button"
                onClick={() => runExample(ex.q)}
                className="rounded-full bg-white/70 px-3.5 py-1.5 font-sans text-[12.5px] text-ink/80 shadow-sm ring-1 ring-black/5 backdrop-blur-md transition-transform duration-150 active:scale-[0.97] hover:bg-white/90 dark:bg-white/10 dark:text-ink/90 dark:ring-white/10"
              >
                “{ex.label}”
              </button>
            ))}
          </div>

          <div className="mt-auto flex flex-1 flex-col items-center justify-center py-8">
            <div className="relative text-center">
              <div
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f0c49a]/35 blur-3xl dark:bg-[#f0c49a]/15"
              />
              <p className="relative font-serif text-[17px] tracking-[0.14em] text-ink/90 uppercase">
                Your word
              </p>
              <p className="relative mt-1 font-serif text-[17px] tracking-[0.14em] text-ink/90 uppercase">
                lights my path.
              </p>
              <p className="relative mt-2.5 font-sans text-[10px] tracking-[0.22em] text-muted uppercase">
                Psalm 119:105
              </p>
            </div>
          </div>

          <Link
            to="/books"
            className="mb-1 flex items-center gap-3 rounded-[20px] bg-black/40 px-4 py-3.5 ring-1 ring-white/10 backdrop-blur-xl transition-transform duration-150 active:scale-[0.99] dark:bg-black/50"
          >
            <div className="min-w-0 flex-1">
              <p className="font-sans text-[14px] font-medium text-white">
                Not sure what to search?
              </p>
              <p className="mt-0.5 font-sans text-[12px] leading-snug text-white/70">
                Explore books, read a chapter, or find verses by topic.
              </p>
            </div>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
              <ChevronRight className="size-4" strokeWidth={2} />
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
