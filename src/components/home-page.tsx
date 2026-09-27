import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSeekStore } from "@/lib/store";
import { useCurrentUserState } from "@/lib/supa/use-current-user";
import { ArrowUpRight, Search } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SwapText } from "@/components/swap-text";
import { HomeSections } from "@/components/home-sections";
import { cn } from "@/lib/utils";

const EXAMPLES = [
  { q: "God so loved the world", label: "God so loved the world" },
  { q: "mercy", label: "mercy" },
  { q: "agape", label: "love one another" },
  { q: "sacrifice", label: "sacrifice" },
  { q: "Psalm 23", label: "Psalm 23" },
  { q: "be not afraid", label: "be not afraid" },
];

export function Home() {
  const rememberQuery = useSeekStore((s) => s.rememberQuery);
  const recent = useSeekStore((s) => s.recent);
  const { user } = useCurrentUserState();
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [ready, setReady] = useState(false);
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<"count" | "mark" | "zoom">("count");
  const introRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = introRef.current;
    if (!node || node.getClientRects().length === 0) {
      setReady(true);
      return;
    }
    const COUNT_MS = 2400;
    const started = performance.now();
    let raf = 0;
    const timers: number[] = [];
    const tick = (now: number) => {
      const p = Math.min(1, (now - started) / COUNT_MS);
      setCount(Math.floor(p * 100));
      if (p >= 1) {
        setCount(100);
        setPhase("mark");
        timers.push(window.setTimeout(() => setPhase("zoom"), 700));
        timers.push(window.setTimeout(() => setReady(true), 1600));
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, []);

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
    <div className="relative overflow-x-clip bg-paper">
      <div
        ref={introRef}
        className={cn(
          "preloader fixed inset-0 z-[80] flex items-end justify-between bg-paper px-6 py-6 text-ink sm:px-10",
          phase === "zoom" && "is-zoom",
          ready && "is-done",
          !ready && "pointer-events-auto",
        )}
        aria-hidden={ready}
      >
        <span className="font-serif text-[clamp(3rem,12vw,8rem)] leading-none tracking-tight">
          SEEK
        </span>
        <span className="font-sans text-[clamp(2rem,8vw,5rem)] leading-none tabular-nums">
          {count}%
        </span>
      </div>

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-paper">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,color-mix(in_oklab,var(--orb-a)_35%,transparent),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_60%,color-mix(in_oklab,var(--orb-b)_28%,transparent),transparent_50%)]" />
        <div className="absolute -left-[8%] top-[18%] h-[28vmin] w-[36vmin] rounded-sm bg-ink/[0.03] blur-[1px] dark:bg-ink/[0.06]" />
        <div className="absolute right-[6%] top-[12%] h-[34vmin] w-[28vmin] rounded-sm bg-ink/[0.035] blur-sm dark:bg-ink/[0.07]" />
        <div className="absolute bottom-[22%] left-[18%] h-[20vmin] w-[30vmin] rounded-sm bg-ink/[0.025] blur-[2px] dark:bg-ink/[0.05]" />
        <div className="absolute right-[20%] bottom-[40%] h-[16vmin] w-[22vmin] rounded-sm bg-ink/[0.02] blur-[1px] dark:bg-ink/[0.05]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-paper/80" />
      </div>

      <div
        className={cn(
          "home-site relative",
          !ready && phase === "zoom" && "is-revealing",
        )}
      >
        <section className="relative flex min-h-[100dvh] flex-col justify-between px-5 pt-28 pb-12 sm:px-10 lg:pt-32 lg:pb-16">
          <div className="flex items-start justify-between gap-6">
            <Reveal
              as="p"
              className="max-w-[14rem] font-sans text-[11px] leading-relaxed tracking-[0.18em] text-ink/70 uppercase sm:text-[12px]"
            >
              Love · Mercy
              <br />
              Sacrifice · Agape
            </Reveal>
            <Reveal
              delay={80}
              as="p"
              className="max-w-[16rem] text-right font-sans text-[12px] leading-relaxed text-ink/70 sm:text-[13px]"
            >
              The whole King James Bible —
              <br />
              search a half-remembered word.
            </Reveal>
          </div>

          <div className="relative flex flex-1 flex-col items-center justify-center py-20">
            <h1
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-sans text-[clamp(5rem,22vw,14rem)] font-medium leading-none tracking-[-0.04em] text-ink/[0.06]"
              aria-hidden
            >
              SEEK
            </h1>

            <form onSubmit={submit} className="relative z-10 w-full max-w-xl px-2">
              <label htmlFor="home-search" className="sr-only">
                Search the Bible
              </label>
              <div className="group flex items-end gap-3 border-b border-ink/25 pb-3 transition-colors focus-within:border-ink">
                <Search
                  className="mb-1 size-5 shrink-0 text-ink/55"
                  strokeWidth={1.6}
                  aria-hidden
                />
                <input
                  id="home-search"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  enterKeyHint="search"
                  placeholder="Search love, mercy, a verse…"
                  className="h-11 w-full bg-transparent font-serif text-[1.35rem] leading-snug text-ink outline-none placeholder:text-ink/40 sm:h-12 sm:text-[1.55rem]"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="mb-0.5 flex size-10 items-center justify-center rounded-full border border-ink/20 text-ink transition hover:bg-ink hover:text-paper active:scale-[0.96]"
                >
                  <ArrowUpRight className="size-4" strokeWidth={1.8} />
                </button>
              </div>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex.q}
                    type="button"
                    onClick={() => runExample(ex.q)}
                    className="font-sans text-[11px] tracking-[0.1em] text-ink/60 uppercase transition hover:text-ink"
                  >
                    <SwapText>{ex.label}</SwapText>
                  </button>
                ))}
              </div>
            </form>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <p className="font-sans text-[11px] tracking-[0.2em] text-ink/55 uppercase">
              Look up. The Word is near.
            </p>
            <a
              href="#start"
              className="font-sans text-[11px] tracking-[0.22em] text-ink/55 uppercase transition hover:text-ink"
            >
              Scroll ↓
            </a>
          </div>
        </section>

        <HomeSections
          recent={recent}
          runExample={runExample}
          userEmail={user?.email}
        />
      </div>
    </div>
  );
}
