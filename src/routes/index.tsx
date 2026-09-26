import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSeekStore } from "@/lib/store";
import { useCurrentUserState } from "@/lib/supa/use-current-user";
import {
  Anchor,
  ArrowUpRight,
  BookMarked,
  Church,
  Clock,
  CloudRain,
  Heart,
  Leaf,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { canonical, siteStructuredData } from "@/lib/seo";
import { APP_VERSION_LABEL } from "@/lib/version";
import { Magnetic } from "@/components/magnetic";
import { Reveal } from "@/components/reveal";
import { SwapText } from "@/components/swap-text";
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

const POPULAR_BOOKS = [
  { slug: "john", name: "John", chapters: 21 },
  { slug: "romans", name: "Romans", chapters: 16 },
  { slug: "psalms", name: "Psalms", chapters: 150 },
  { slug: "ephesians", name: "Ephesians", chapters: 6 },
  { slug: "matthew", name: "Matthew", chapters: 28 },
  { slug: "1-john", name: "1 John", chapters: 5 },
];

const FEATURED = {
  ref: "John 3:16",
  text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life",
  book: "john",
  chapter: "3",
};

const STATS = [
  { value: "66", label: "Books" },
  { value: "1,189", label: "Chapters" },
  { value: "31,102", label: "Verses" },
  { value: "KJV", label: "Translation" },
];

const STEPS = [
  { n: "01", title: "Seek", body: "Type a verse, a story, or a longing — love, mercy, forgiveness, or a name of God." },
  { n: "02", title: "Receive", body: "Open the chapter. Read slowly. Let the Word speak of the Father's heart." },
  { n: "03", title: "Abide", body: "Save the verses that hold you. Return to them when you need grace again." },
];

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "SEEK — Bible Search & Scripture Discovery" },
      {
        name: "description",
        content:
          "Search and read the King James Bible on SEEK. Find a verse by a half-remembered word, a fragment, or the meaning you meant — all 66 books, 1,189 chapters, free.",
      },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
      { "script:ld+json": siteStructuredData() },
    ],
    links: [{ rel: "canonical", href: canonical("/") }],
  }),
});

function Home() {
  const rememberQuery = useSeekStore((s) => s.rememberQuery);
  const recent = useSeekStore((s) => s.recent);
  const { user } = useCurrentUserState();
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [ready, setReady] = useState(false);
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<"count" | "mark" | "zoom">("count");
  const seekRef = useRef<HTMLSpanElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const siteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = introRef.current;
    // the app shell renders this route twice (desktop + mobile <main>). Only the
    // copy that is actually on screen may drive the intro, otherwise the hidden
    // desktop branch would win the race and mobile would never see it.
    if (!node || node.getClientRects().length === 0) {
      setReady(true);
      return;
    }

    const COUNT_MS = 3000;
    const SEVEN_MS = 700;
    const HOLD_MS = 150;
    const ZOOM_MS = 900;

    const started = performance.now();
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, ms));
    };
    let raf = 0;

    const tick = (now: number) => {
      const p = Math.min(1, (now - started) / COUNT_MS);
      setCount(Math.floor(p * 100)); // linear, so all 3s are actually visible
      if (p >= 1) {
        setCount(100);
        setPhase("mark");
        later(() => setPhase("zoom"), SEVEN_MS + HOLD_MS);
        later(() => setReady(true), SEVEN_MS + HOLD_MS + ZOOM_MS);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      for (const t of timers) window.clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    const seek = seekRef.current;
    const stage = stageRef.current;
    if (!seek || !stage) return;

    const letters = Array.from(seek.querySelectorAll<HTMLElement>("[data-seek-letter]"));
    const mid = (letters.length - 1) / 2;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const paint = () => {
      const rect = stage.getBoundingClientRect();
      // hero is a normal (unpinned) block: one full 0 -> 1 cycle across the
      // hero's own height, so the letters part and reunite as it scrolls away
      const total = Math.max(1, stage.offsetHeight);
      const p = Math.min(1, Math.max(0, -rect.top / total));

      if (reduce) {
        seek.style.transform = "translate3d(-50%, -50%, 0)";
        seek.style.opacity = "1";
        for (const l of letters) l.style.transform = "translate3d(0,0,0)";
        return;
      }

      // apart through the middle of the pinned scroll, then back together
      const wave = Math.sin(p * Math.PI);
      const spread = wave * 34;
      const scale = 1 + wave * 0.05;
      const lift = p * -40;

      for (const l of letters) {
        const dir = Number(l.dataset.seekLetter) - mid;
        l.style.transform = `translate3d(${(dir * spread).toFixed(2)}px, 0, 0)`;
      }
      seek.style.transform = `translate3d(-50%, calc(-50% + ${lift.toFixed(2)}px), 0) scale(${scale.toFixed(3)})`;
      seek.style.opacity = String(1 - Math.max(0, p - 0.55) * 1.5);
    };

    paint();
    // capture phase: mobile scrolls an inner <main>, desktop scrolls the window
    document.addEventListener("scroll", paint, { capture: true, passive: true });
    window.addEventListener("resize", paint);
    return () => {
      document.removeEventListener("scroll", paint, { capture: true });
      window.removeEventListener("resize", paint);
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
        {phase === "mark" || phase === "zoom" ? (
          <>
            <span
              className={cn(
                "seek-bloom",
                phase === "mark" && "is-mark",
                phase === "zoom" && "is-zoom",
              )}
            />
            <span
              className={cn(
                "seek-seven pointer-events-none absolute left-1/2 top-1/2 font-serif text-[clamp(7rem,28vw,20rem)] leading-none text-ink",
                phase === "zoom" && "is-zoom",
              )}
            >
              7
            </span>
          </>
        ) : null}
      </div>

      <div className="pointer-events-none fixed inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="forest-drift h-full w-full object-cover opacity-45 dark:opacity-30"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-paper/70 via-paper/60 via-45% to-paper dark:from-paper/75 dark:via-paper/65 dark:to-paper" />
      </div>

      <div
        ref={siteRef}
        className={cn("home-site relative", phase === "zoom" && !ready && "is-revealing")}
      >
        <div ref={stageRef} className="relative flex min-h-[118dvh] flex-col justify-between px-5 pt-24 pb-10 sm:px-10 lg:pt-28">
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

          <div className="relative flex min-h-[42vh] items-center justify-center">
            <span
                ref={seekRef}
                aria-hidden
                className="seek-drift pointer-events-none absolute left-1/2 top-1/2 font-serif text-[clamp(4.6rem,21vw,17rem)] leading-[0.78] font-medium tracking-[-0.02em] whitespace-nowrap text-ink/12 select-none"
              >
                {["S", "E", "E", "K"].map((ch, i) => (
                  <span
                    key={`${ch}-${i}`}
                    data-seek-letter={i}
                    className="inline-block will-change-transform"
                  >
                    {ch}
                  </span>
                ))}
              </span>

              <form onSubmit={submit} className="relative z-10 w-full max-w-lg px-2">
                <label htmlFor="home-search" className="sr-only">
                  Search the Bible
                </label>
                <div className="group flex items-end gap-3 border-b border-ink/25 pb-3 transition-colors focus-within:border-ink">
                  <Search className="mb-1 size-4 shrink-0 text-ink/60" strokeWidth={1.6} aria-hidden />
                  <input
                    id="home-search"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    autoComplete="off"
                    spellCheck={false}
                    enterKeyHint="search"
                    placeholder="Search love, mercy, a verse…"
                    className="h-10 w-full bg-transparent font-serif text-[1.2rem] text-ink placeholder:text-ink/55 focus:outline-none sm:h-12 sm:text-[1.45rem]"
                  />
                  <button
                    type="submit"
                    aria-label="Search"
                    className="mb-0.5 flex size-10 items-center justify-center rounded-full border border-ink/20 text-ink transition-transform active:scale-[0.96] hover:bg-ink hover:text-paper"
                  >
                    <ArrowUpRight className="size-4" strokeWidth={1.8} />
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                  {EXAMPLES.map((ex) => (
                    <button
                      key={ex.q}
                      type="button"
                      onClick={() => runExample(ex.q)}
                      className="group font-sans text-[11px] tracking-[0.08em] text-ink/70 uppercase hover:text-ink"
                    >
                      <SwapText>{ex.label}</SwapText>
                    </button>
                  ))}
                </div>
              </form>
            </div>

            <div className="flex items-end justify-between gap-4">
              <p className="font-sans text-[11px] tracking-[0.2em] text-ink/70 uppercase">Look up. The Word is near.</p>
              <a href="#start" className="group font-sans text-[11px] tracking-[0.22em] text-ink uppercase">
                <SwapText>Scroll</SwapText>
              </a>
            </div>
        </div>

      <div id="start" className="relative z-10">
        <section className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-10 sm:py-32">
          <Reveal as="p" className="font-sans text-[11px] tracking-[0.22em] text-muted uppercase">
            00 — Gospel
          </Reveal>
          <Reveal delay={80}>
            <p className="mt-8 max-w-4xl font-serif text-[clamp(1.6rem,4.4vw,3.4rem)] leading-[1.12] font-medium text-balance">
              “Beloved, let us love one another: for love is of God.”
            </p>
          </Reveal>
          <Reveal delay={140} as="p" className="mt-4 font-sans text-[12px] tracking-[0.18em] text-muted uppercase">
            1 John 4:7
          </Reveal>

          <div className="mt-16 grid grid-cols-2 gap-8 border-t border-line pt-8 sm:grid-cols-4">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 70} className="min-w-0">
                <p className="font-serif text-[clamp(2rem,5vw,3.4rem)] leading-none tracking-tight">{s.value}</p>
                <p className="mt-2 font-sans text-[11px] tracking-[0.18em] text-muted uppercase">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="border-t border-line">
          <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-10 sm:py-28">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Reveal as="p" className="font-sans text-[11px] tracking-[0.22em] text-muted uppercase">
                  01 — SEEK by the heart
                </Reveal>
                <Reveal delay={80}>
                  <h2 className="mt-4 max-w-xl font-serif text-[clamp(2.2rem,6vw,4.6rem)] leading-[0.95] font-medium">
                    What’s on
                    <br />
                    your heart?
                  </h2>
                </Reveal>
              </div>
              <Reveal delay={120} className="max-w-sm">
                <p className="font-sans text-[14px] leading-relaxed text-muted">
                  Mercy, grace, hope — or the longing beneath them. SEEK finds the verses that answer the feeling behind the word.
                </p>
                <Link to="/search" search={{ q: "love" }} className="group mt-5 inline-flex items-center gap-2 font-sans text-[13px]">
                  <SwapText>Search a longing</SwapText>
                  <ArrowUpRight className="size-4" />
                </Link>
              </Reveal>
            </div>

            <ul className="mt-14">
              {TOPICS.map((t, i) => {
                const Icon = t.Icon;
                return (
                  <li key={t.q} className="border-t border-line last:border-b">
                    <button
                      type="button"
                      onClick={() => runExample(t.q)}
                      className="group flex w-full items-center gap-4 py-5 text-left sm:gap-8 sm:py-6"
                    >
                      <span className="w-8 font-sans text-[11px] tabular-nums text-muted">0{i + 1}</span>
                      <Icon className="size-4 shrink-0 text-forest" strokeWidth={1.6} />
                      <span className="min-w-0 flex-1 font-serif text-[clamp(1.4rem,3.5vw,2.4rem)] leading-none">
                        {t.label}
                      </span>
                      <span className="hidden min-w-0 flex-1 font-sans text-[13px] text-muted sm:block">
                        {t.line}
                      </span>
                      <span className="hidden font-sans text-[11px] tracking-[0.14em] text-muted uppercase md:block">
                        {t.ref}
                      </span>
                      <ArrowUpRight className="size-4 shrink-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section className="border-t border-line">
          <Link
            to="/read/$book/$chapter"
            params={{ book: FEATURED.book, chapter: FEATURED.chapter }}
            search={{ q: undefined }}
            className="group mx-auto block w-full max-w-6xl px-5 py-20 sm:px-10 sm:py-28"
          >
            <Reveal as="p" className="font-sans text-[11px] tracking-[0.22em] text-muted uppercase">
              The heart of the Gospel
            </Reveal>
            <Reveal delay={80}>
              <p className="mt-8 max-w-5xl font-serif text-[clamp(1.45rem,3.6vw,2.8rem)] leading-[1.15] text-pretty">
                “{FEATURED.text}”
              </p>
            </Reveal>
            <p className="mt-8 inline-flex items-center gap-2 font-sans text-[13px] tracking-[0.08em]">
              <SwapText>{`${FEATURED.ref} · Read the chapter`}</SwapText>
              <ArrowUpRight className="size-4" />
            </p>
          </Link>
        </section>

        <section className="border-t border-line">
          <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-10 sm:py-28">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <Reveal as="p" className="font-sans text-[11px] tracking-[0.22em] text-muted uppercase">
                  02 — Read
                </Reveal>
                <Reveal delay={80}>
                  <h2 className="mt-4 max-w-2xl font-serif text-[clamp(2.2rem,6vw,4.4rem)] leading-[0.95] font-medium">
                    The whole King James Bible, open to you.
                  </h2>
                </Reveal>
                <p className="mt-4 max-w-md font-sans text-[14px] text-muted">
                  All 66 books, 1,189 chapters, in calm page and scroll modes.
                </p>
              </div>
              <Magnetic>
                <Link
                  to="/books"
                  className="inline-flex items-center gap-2 rounded-full border border-ink px-6 py-3 font-sans text-[13px] text-ink transition-colors hover:bg-ink hover:text-paper"
                >
                  All 66 books
                  <ArrowUpRight className="size-4" />
                </Link>
              </Magnetic>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-px bg-line sm:grid-cols-3 md:grid-cols-6">
              {POPULAR_BOOKS.map((b, i) => (
                <Link
                  key={b.slug}
                  to="/read/$book/$chapter"
                  params={{ book: b.slug, chapter: "1" }}
                  search={{ q: undefined }}
                  className="group bg-paper px-4 py-8 text-center transition-colors hover:bg-wash"
                >
                  <Reveal delay={i * 40}>
                    <p className="font-serif text-[1.35rem] leading-none">{b.name}</p>
                    <p className="mt-3 font-sans text-[11px] tracking-[0.14em] text-muted uppercase">
                      {b.chapters} chapters
                    </p>
                  </Reveal>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-line">
          <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-10 sm:py-28">
            <Reveal as="p" className="font-sans text-[11px] tracking-[0.22em] text-muted uppercase">
              03 — How it works
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-4 font-serif text-[clamp(2.2rem,6vw,4.4rem)] leading-[0.95] font-medium">
                Seek. Receive.
                <br />
                Abide.
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
              {STEPS.map((s, i) => (
                <Reveal key={s.n} delay={i * 90} className="border-t border-line pt-6">
                  <span className="font-sans text-[11px] tracking-[0.2em] text-muted">{s.n}</span>
                  <p className="mt-4 font-serif text-[2rem] leading-none">{s.title}</p>
                  <p className="mt-4 font-sans text-[14px] leading-relaxed text-muted">{s.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {recent.length > 0 && (
          <section className="border-t border-line">
            <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-10">
              <div className="flex items-center gap-2 text-muted">
                <Clock className="size-3.5" />
                <span className="font-sans text-[11px] tracking-[0.18em] uppercase">Recent searches</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
                {recent.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => runExample(q)}
                    className="group font-serif text-[1.15rem]"
                  >
                    <SwapText>{q}</SwapText>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="border-t border-line bg-ink text-paper">
          <div className="mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col justify-between px-5 py-20 sm:px-10 sm:py-24">
            <Reveal>
              <h2 className="font-serif text-[clamp(3rem,12vw,8.5rem)] leading-[0.86] tracking-tight">
                COME
                <br />
                & SEE
              </h2>
            </Reveal>
            <div className="mt-12 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-md font-sans text-[15px] leading-relaxed text-paper/70">
                Open the King James Bible. Search the love of God, His mercy, and the sacrifice of Christ.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/books"
                  className="inline-flex h-12 items-center rounded-full bg-paper px-6 font-sans text-[13px] text-ink"
                >
                  Browse books
                </Link>
                {!user && (
                  <Link
                    to="/login"
                    search={{ redirect: "/" }}
                    className="inline-flex h-12 items-center rounded-full border border-paper/30 px-6 font-sans text-[13px] text-paper"
                  >
                    Sign in to save
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        <footer id="about" className="border-t border-line bg-paper pb-28 lg:pb-10">
          <div className="mx-auto w-full max-w-6xl px-5 pt-16 sm:px-10">
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <p className="font-sans text-[11px] tracking-[0.2em] text-muted uppercase">Available always</p>
                <p className="mt-3 max-w-sm font-sans text-[14px] leading-relaxed text-muted">
                  A quiet place to search and read the King James Bible — the love of God, His mercy, the sacrifice of Christ, and agape.
                </p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="group mt-6 inline-block font-serif text-[1.15rem]"
                >
                  <SwapText>{CONTACT_EMAIL}</SwapText>
                </a>
              </div>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-2 font-sans text-[13px] text-muted sm:grid-cols-3">
                <li>
                  <Link to="/books" className="group">
                    <SwapText>All 66 books</SwapText>
                  </Link>
                </li>
                <li>
                  <Link to="/search" search={{ q: "" }} className="group">
                    <SwapText>Search</SwapText>
                  </Link>
                </li>
                <li>
                  <Link to="/explore" className="group">
                    <SwapText>Explore</SwapText>
                  </Link>
                </li>
                <li>
                  <Link to="/saved" className="group">
                    <SwapText>Saved verses</SwapText>
                  </Link>
                </li>
                <li>
                  <Link to="/groups" className="group">
                    <SwapText>Groups &amp; classes</SwapText>
                  </Link>
                </li>
                <li>
                  <Link to="/download" className="group">
                    <SwapText>Download</SwapText>
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="group">
                    <SwapText>About SEEK</SwapText>
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="group">
                    <SwapText>Pricing</SwapText>
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="group">
                    <SwapText>FAQ</SwapText>
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="group">
                    <SwapText>Privacy</SwapText>
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="group">
                    <SwapText>Terms</SwapText>
                  </Link>
                </li>
                <li>
                  <Link to="/changelog" className="group">
                    <SwapText>Changelog</SwapText>
                  </Link>
                </li>
                <li>
                  <Link to="/report-bug" className="group">
                    <SwapText>Report a bug</SwapText>
                  </Link>
                </li>
              </ul>
            </div>

            <p className="mt-10 font-sans text-[12px] text-muted">
              King James Version (KJV), 1611 · 66 books · 1,189 chapters · 31,102 verses · Free — no ads, no trackers, no paywall
            </p>

            <div className="mt-5 flex w-full flex-col items-center gap-3 border-t border-line/60 pt-6 text-center">
              <p className="font-sans text-[12px] text-muted">
                © {new Date().getFullYear()} SEEK · King James Version (1611) is public domain
              </p>
              <p className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 font-sans text-[12.5px] text-muted">
                <Link to="/report-bug" className="transition-colors hover:text-ink">
                  Report a bug
                </Link>
                <Link to="/groups" className="transition-colors hover:text-ink">
                  Groups &amp; classes
                </Link>
                <Link
                  to="/changelog"
                  className="transition-colors hover:text-ink"
                  aria-label={`SEEK ${APP_VERSION_LABEL} — what changed`}
                >
                  {APP_VERSION_LABEL}
                </Link>
              </p>
            </div>
          </div>

          <div
            aria-hidden
            className="mt-10 flex justify-center overflow-hidden px-2"
            style={{ height: "clamp(2.4rem, 13.5vw, 10.5rem)" }}
          >
            <p className="seek-wordmark-fade select-none text-center font-serif text-[clamp(4.5rem,28vw,22rem)] leading-[0.8] tracking-[-0.05em] text-ink/15">
              SEEK
            </p>
          </div>
        </footer>
      </div>
      </div>
    </div>
  );
}
