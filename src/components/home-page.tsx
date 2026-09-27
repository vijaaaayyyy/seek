import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSeekStore } from "@/lib/store";
import { useCurrentUserState } from "@/lib/supa/use-current-user";
import {
  Anchor,
  BookMarked,
  Church,
  CloudRain,
  Heart,
  Leaf,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { APP_VERSION_LABEL } from "@/lib/version";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

const CONTACT_EMAIL = "vijay.peddenti434@gmail.com";

const EXAMPLES = [
  { q: "God so loved the world", label: "God so loved the world" },
  { q: "mercy", label: "mercy" },
  { q: "agape", label: "love one another" },
  { q: "sacrifice", label: "sacrifice" },
  { q: "Psalm 23", label: "Psalm 23" },
];

const TOPICS = [
  { q: "love of God", label: "Love", line: "He first loved us.", ref: "1 Jn 4:19", Icon: Heart },
  { q: "mercy", label: "Mercy", line: "His mercy endureth for ever.", ref: "Ps 136:1", Icon: CloudRain },
  { q: "grace", label: "Grace", line: "By grace are ye saved.", ref: "Eph 2:8", Icon: Sparkles },
  { q: "sacrifice", label: "Sacrifice", line: "He gave His only Son.", ref: "Jn 3:16", Icon: Church },
  { q: "forgiveness", label: "Forgiveness", line: "Cleanse us from our sins.", ref: "1 Jn 1:9", Icon: Users },
  { q: "hope", label: "Hope", line: "An anchor of the soul.", ref: "Heb 6:19", Icon: Anchor },
  { q: "peace", label: "Peace", line: "That passeth understanding.", ref: "Phil 4:7", Icon: Leaf },
  { q: "faith", label: "Faith", line: "Substance of things hoped for.", ref: "Heb 11:1", Icon: BookMarked },
];

const STATS = [
  { value: "66", label: "Books" },
  { value: "1,189", label: "Chapters" },
  { value: "31,102", label: "Verses" },
  { value: "KJV", label: "Translation" },
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
        <span className="font-serif text-[clamp(3rem,12vw,8rem)] leading-none tracking-tight">SEEK</span>
        <span className="font-sans text-[clamp(2rem,8vw,5rem)] leading-none tabular-nums">{count}%</span>
      </div>

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-paper">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,color-mix(in_oklab,var(--orb-a)_35%,transparent),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_60%,color-mix(in_oklab,var(--orb-b)_28%,transparent),transparent_50%)]" />
        <div className="absolute -left-[8%] top-[18%] h-[28vmin] w-[36vmin] rounded-sm bg-ink/[0.03] blur-[1px] dark:bg-ink/[0.06]" />
        <div className="absolute right-[6%] top-[12%] h-[34vmin] w-[28vmin] rounded-sm bg-ink/[0.035] blur-sm dark:bg-ink/[0.07]" />
        <div className="absolute bottom-[22%] left-[18%] h-[20vmin] w-[30vmin] rounded-sm bg-ink/[0.025] blur-[2px] dark:bg-ink/[0.05]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-paper/80" />
      </div>

      <div className={cn("home-site relative", !ready && phase === "zoom" && "is-revealing")}>
        <section className="relative flex min-h-[100dvh] flex-col justify-between px-5 pt-24 pb-16 sm:px-10 lg:pt-28">
          <div className="flex items-start justify-between gap-6">
            <Reveal as="p" className="max-w-[14rem] font-sans text-[11px] leading-relaxed tracking-[0.18em] text-ink/70 uppercase sm:text-[12px]">
              Love · Mercy
              <br />
              Sacrifice · Agape
            </Reveal>
            <Reveal delay={80} as="p" className="max-w-[16rem] text-right font-sans text-[12px] leading-relaxed text-ink/70 sm:text-[13px]">
              The whole King James Bible —
              <br />
              search a half-remembered word.
            </Reveal>
          </div>

          <div className="relative flex flex-1 flex-col items-center justify-center py-16">
            <h1 className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-sans text-[clamp(4rem,18vw,12rem)] font-medium leading-none tracking-[-0.04em] text-ink/[0.07] select-none">
              SEEK
            </h1>
            <form onSubmit={submit} className="relative z-10 w-full max-w-lg px-2">
              <label htmlFor="home-search" className="sr-only">Search the Bible</label>
              <div className="group flex items-end gap-3 border-b border-ink/25 pb-3 transition-colors focus-within:border-ink">
                <Search className="mb-1 size-4 shrink-0 text-ink/60" strokeWidth={1.6} aria-hidden />
                <input
                  id="home-search"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  autoComplete="off"
                  placeholder="A verse, a word, a longing…"
                  className="w-full bg-transparent font-serif text-[1.35rem] leading-snug text-ink outline-none placeholder:text-ink/35 sm:text-[1.5rem]"
                />
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex.q}
                    type="button"
                    onClick={() => runExample(ex.q)}
                    className="rounded-full border border-ink/15 px-3 py-1 font-sans text-[12px] text-ink/70 transition hover:border-ink/40 hover:text-ink"
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            </form>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <p className="font-sans text-[12px] text-ink/50">
              {user ? `Signed in · ${user.email ?? "account"}` : "Free · No ads · KJV"}
            </p>
            <p className="font-sans text-[11px] tracking-wide text-ink/40">{APP_VERSION_LABEL}</p>
          </div>
        </section>

        <section className="border-t border-ink/10 px-5 py-20 sm:px-10">
          <Reveal as="h2" className="font-sans text-[clamp(2rem,6vw,3.5rem)] font-medium tracking-[-0.03em] text-ink">
            Topics
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TOPICS.map((t, i) => (
              <Reveal key={t.q} delay={i * 40}>
                <button
                  type="button"
                  onClick={() => runExample(t.q)}
                  className="group flex w-full flex-col items-start rounded-2xl border border-ink/10 bg-white/40 p-5 text-left transition hover:border-ink/25 hover:bg-white/70 dark:bg-white/5 dark:hover:bg-white/10"
                >
                  <t.Icon className="size-5 text-ink/50 transition group-hover:text-ink" strokeWidth={1.5} />
                  <span className="mt-4 font-sans text-[15px] font-medium text-ink">{t.label}</span>
                  <span className="mt-1 font-serif text-[14px] italic text-ink/55">{t.line}</span>
                  <span className="mt-3 font-sans text-[11px] tracking-wide text-ink/40">{t.ref}</span>
                </button>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="border-t border-ink/10 px-5 py-20 sm:px-10">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {STATS.map((s) => (
              <Reveal key={s.label}>
                <p className="font-sans text-[clamp(2rem,5vw,3rem)] font-medium tracking-tight text-ink">{s.value}</p>
                <p className="mt-1 font-sans text-[12px] uppercase tracking-[0.16em] text-ink/45">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="border-t border-ink/10 px-5 py-20 sm:px-10">
          <Reveal as="h2" className="font-sans text-[clamp(2rem,6vw,3.5rem)] font-medium tracking-[-0.03em]">
            Write directly
          </Reveal>
          <Reveal delay={60} as="p" className="mt-4 max-w-md font-sans text-[14px] leading-relaxed text-ink/60">
            Available for feedback on SEEK.
          </Reveal>
          <Reveal delay={100}>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-6 inline-block font-serif text-[clamp(1.2rem,3vw,1.75rem)] text-ink underline-offset-4 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </Reveal>
          {recent.length > 0 && (
            <div className="mt-14">
              <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-ink/40">Recent</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {recent.slice(0, 6).map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => runExample(q)}
                    className="rounded-full border border-ink/12 px-3 py-1 font-sans text-[12px] text-ink/65 hover:border-ink/30"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        <footer className="border-t border-ink/10 px-5 py-10 sm:px-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-sans text-[12px] text-ink/40">© {new Date().getFullYear()} SEEK</p>
            <div className="flex gap-4 font-sans text-[12px] text-ink/50">
              <Link to="/about" className="hover:text-ink">About</Link>
              <Link to="/privacy" className="hover:text-ink">Privacy</Link>
              <Link to="/terms" className="hover:text-ink">Terms</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
