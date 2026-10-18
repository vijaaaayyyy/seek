import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useSeekStore } from "@/lib/store";
import { ArrowRight, Search } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { BOOKS } from "@/data/books";

const EXAMPLES = [
  "God so loved the world",
  "mercy",
  "Psalm 23",
  "be not afraid",
  "love one another",
];

const EYEBROW =
  "font-ui text-[12px] font-semibold tracking-[0.18em] uppercase text-[#d4af37]";
const TITLE =
  "mt-4 font-serif text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.1] tracking-[-0.01em] text-[#f5f0e8]";
const BODY = "font-ui text-[16px] leading-[1.7] text-[#d9d0c1]";
const CARD =
  "rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_18px_44px_-24px_rgba(0,0,0,0.7)] transition hover:border-[#d4af37]/45 hover:bg-white/[0.07]";
const TEXT_LINK =
  "font-ui text-[14px] font-semibold tracking-[0.04em] text-[#d4af37] underline decoration-[#d4af37]/50 underline-offset-4 transition hover:decoration-[#d4af37]";
const PRIMARY_BUTTON =
  "inline-flex min-h-12 items-center justify-center rounded-xl bg-[#d4af37] px-7 font-ui text-[15px] font-semibold text-[#1c1612] transition hover:bg-[#e2c04f] active:scale-[0.98]";
const GHOST_BUTTON =
  "inline-flex min-h-12 items-center justify-center rounded-xl border border-[#f5f0e8]/30 px-7 font-ui text-[15px] font-medium text-[#f5f0e8] transition hover:border-[#d4af37] hover:text-[#d4af37] active:scale-[0.98]";
const STAT_VALUE = "font-serif text-[clamp(2rem,4vw,2.75rem)] leading-none text-[#f5f0e8]";
const STAT_LABEL = "mt-2 font-ui text-[12px] tracking-[0.12em] uppercase text-[#b8ad9b]";

/**
 * Compositional home inspired by bleibtgleich.dev:
 * pure field, giant type, thin rules, floating blurred frames,
 * sticky side labels, sparse editorial layout — not a card grid.
 */
export function Home() {
  const rememberQuery = useSeekStore((s) => s.rememberQuery);
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [scrollY, setScrollY] = useState(0);
  const [docH, setDocH] = useState(1);
  const [vh, setVh] = useState(1);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // The shell pins the document and lets an inner <main> scroll on small
    // screens, so the offset has to come from whichever element actually
    // scrolled — reading window.scrollY alone pins this to 0 on mobile.
    const readScroll = (target?: EventTarget | null) => {
      const node = target instanceof HTMLElement ? target : null;
      if (node && node !== document.body && node !== document.documentElement) {
        setScrollY(node.scrollTop);
        setDocH(node.scrollHeight || 1);
        setVh(node.clientHeight || window.innerHeight || 1);
        return;
      }
      setScrollY(window.scrollY || document.documentElement.scrollTop);
      setDocH(document.documentElement.scrollHeight || 1);
      setVh(window.innerHeight || 1);
    };
    const onScroll = (e: Event) => readScroll(e.target);
    const onResize = () => readScroll(null);
    readScroll(null);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onResize);
    };
  }, []);

  function submit(e: FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    rememberQuery(q);
    void navigate({ to: "/search", search: { q } });
  }

  function run(q: string) {
    rememberQuery(q);
    void navigate({ to: "/search", search: { q } });
  }

  // Scroll-driven "seek bible" merge: the two side words travel toward the
  // viewport centre over the back half of the page and stop as one phrase.
  const merge = useMemo(() => {
    const max = Math.max(1, docH - vh);
    const t = Math.min(1, Math.max(0, (scrollY - max * 0.45) / (max * 0.5)));
    return t * t * (3 - 2 * t); // smoothstep
  }, [scrollY, docH, vh]);

  const halfGap = 0.8; // rem of breathing room between the words
  const sideOpacity = 0.35 + merge * 0.65;
  const sideScale = 1 + merge * 0.12;

  // Travel is measured, not guessed: each word starts fully on-screen and only
  // as far out as the viewport allows, so neither hangs past the edge.
  const seekRef = useRef<HTMLSpanElement | null>(null);
  const bibleRef = useRef<HTMLSpanElement | null>(null);
  const [side, setSide] = useState({ wordPx: 0, vwPx: 1 });

  useEffect(() => {
    const measure = () => {
      const a = seekRef.current?.offsetWidth ?? 0;
      const b = bibleRef.current?.offsetWidth ?? 0;
      setSide({ wordPx: Math.max(a, b), vwPx: window.innerWidth || 1 });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const roomPx = Math.max(
    0,
    side.vwPx / 2 - halfGap * 16 - side.wordPx * sideScale - 16,
  );
  const fromCenter = side.wordPx ? (roomPx / side.vwPx) * 100 * (1 - merge) : 0;

  return (
    <div
      ref={rootRef}
      // Explicit colours, not theme tokens: the home cover is always dark, so
      // its text must not follow the light/dark theme setting.
      className="relative min-h-[100dvh] bg-transparent text-[#f5f0e8]"
    >
      {/* seek ←→ bible: slide in from the sides, meet as one phrase, stop */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-6 z-20 h-[clamp(2.5rem,9vw,5rem)]"
        aria-hidden
      >
        <span
          ref={seekRef}
          className="absolute bottom-0 font-serif text-[clamp(2.5rem,9vw,5rem)] tracking-tight text-[#f5f0e8] select-none will-change-transform"
          style={{
            left: "50%",
            opacity: sideOpacity,
            transform: `translateX(calc(-100% - ${halfGap}rem - ${fromCenter}vw)) scale(${sideScale})`,
            transformOrigin: "right bottom",
          }}
        >
          seek
        </span>
        <span
          ref={bibleRef}
          className="absolute bottom-0 font-serif text-[clamp(2.5rem,9vw,5rem)] tracking-tight text-[#f5f0e8] select-none will-change-transform"
          style={{
            left: "50%",
            opacity: sideOpacity,
            transform: `translateX(calc(${halfGap}rem + ${fromCenter}vw)) scale(${sideScale})`,
            transformOrigin: "left bottom",
          }}
        >
          bible
        </span>
      </div>

      <section className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-5 pt-28 pb-16 text-center sm:px-10 lg:px-16">
        <div
          aria-hidden
          className="home-glow pointer-events-none absolute top-[12%] left-1/2 -z-10 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.22),transparent_65%)] blur-2xl"
        />
        <p className={EYEBROW}>Free · King James Version · 66 books</p>
        <h1 className="mt-6 font-serif text-[clamp(5rem,20vw,11rem)] leading-[0.9] tracking-[-0.02em] text-[#f5f0e8]">
          SEEK
        </h1>
        <p className="home-sheen mt-3 font-serif text-[clamp(1.5rem,4vw,2.25rem)] italic">
          Scripture
        </p>
        <p className="mt-6 max-w-xl font-ui text-[17px] leading-[1.7] text-[#d9d0c1]">
          Search a half-remembered word and read the King James Bible, free, with no ads
          and no paywall.
        </p>

        <form onSubmit={submit} className="mt-10 w-full max-w-2xl">
          <label htmlFor="home-search" className="sr-only">
            Search the Bible
          </label>
          <div className="flex items-center gap-2 rounded-2xl border border-[#f5f0e8]/30 bg-[#2a211c] p-2 pl-5 shadow-[0_16px_48px_-16px_rgba(0,0,0,0.7)] transition focus-within:border-[#d4af37] focus-within:ring-4 focus-within:ring-[#d4af37]/25">
            <Search className="size-5 shrink-0 text-[#d4af37]" strokeWidth={1.8} aria-hidden />
            <input
              id="home-search"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              enterKeyHint="search"
              placeholder="A verse, a word, a longing…"
              className="min-w-0 flex-1 bg-transparent py-3 font-ui text-[17px] text-[#f5f0e8] outline-none placeholder:text-[#b8ad9b]"
            />
            <button
              type="submit"
              className="inline-flex h-12 shrink-0 items-center rounded-xl bg-[#d4af37] px-6 font-ui text-[15px] font-semibold text-[#1c1612] transition hover:bg-[#e2c04f] active:scale-[0.98]"
            >
              Search
            </button>
          </div>
        </form>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {EXAMPLES.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => run(q)}
              className="min-h-10 rounded-full border border-[#f5f0e8]/20 bg-[#f5f0e8]/[0.04] px-4 font-ui text-[14px] text-[#e6ddcc] transition hover:border-[#d4af37] hover:text-[#d4af37] active:scale-[0.98]"
            >
              {q}
            </button>
          ))}
        </div>

        <a
          href="#work"
          className="mt-14 inline-flex items-center gap-2 font-ui text-[13px] tracking-[0.16em] text-[#b8ad9b] uppercase transition hover:text-[#d4af37]"
        >
          Explore
          <ArrowRight className="size-4 rotate-90" strokeWidth={1.8} aria-hidden />
        </a>
      </section>

      <section id="work" className="relative z-10 px-5 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-5xl flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className={EYEBROW}>Corpus</p>
            <h2 className={TITLE}>66 books</h2>
          </div>
          <dl className="grid grid-cols-3 gap-4 sm:gap-6">
            {[
              { v: "1,189", l: "Chapters" },
              { v: "31k", l: "Verses" },
              { v: "KJV", l: "Only" },
            ].map((s) => (
              <div key={s.l} className={`${CARD} p-5 text-center`}>
                <dt className={STAT_LABEL}>{s.l}</dt>
                <dd className={`${STAT_VALUE} mt-0`}>{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="relative z-10 px-5 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p className={EYEBROW}>Start somewhere</p>
          <h2 className={TITLE}>Begin a chapter</h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { slug: "genesis", label: "Genesis", note: "Beginnings" },
              { slug: "psalms", label: "Psalms", note: "Songs & laments" },
              { slug: "proverbs", label: "Proverbs", note: "Wisdom" },
              { slug: "isaiah", label: "Isaiah", note: "The great prophet" },
              { slug: "matthew", label: "Matthew", note: "The Gospel" },
              { slug: "hebrews", label: "Hebrews", note: "Faith" },
            ].map((b) => (
              <Link
                key={b.slug}
                to="/read/$book/$chapter"
                params={{ book: b.slug, chapter: "1" }}
                className={`${CARD} group flex items-center justify-between gap-4`}
              >
                <div>
                  <span className="block font-serif text-[1.6rem] leading-tight text-[#f5f0e8]">
                    {b.label}
                  </span>
                  <span className="mt-1 block font-ui text-[14px] text-[#b8ad9b]">{b.note}</span>
                </div>
                <ArrowRight
                  className="size-5 shrink-0 text-[#d4af37] transition group-hover:translate-x-1"
                  strokeWidth={1.8}
                  aria-hidden
                />
              </Link>
            ))}
          </div>
          <Link to="/books" className={`${TEXT_LINK} mt-10 inline-block`}>
            All 66 books
          </Link>
        </div>
      </section>

      <section className="relative z-10 px-5 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className={EYEBROW}>Two ways in</p>
              <h2 className={TITLE}>Search by meaning, or read by reference.</h2>
            </div>
            <div className="flex flex-col gap-10">
              <div>
                <p className={BODY}>
                  Describe what you remember in your own words — a half-heard phrase, a
                  feeling, a theme — and SEEK returns the passages that carry it.
                </p>
                <button
                  type="button"
                  onClick={() => run("comfort in sorrow")}
                  className={`${TEXT_LINK} mt-4`}
                >
                  Try “comfort in sorrow”
                </button>
              </div>
              <div>
                <p className={BODY}>
                  Already know where it is? Open any of the 1,189 chapters in the King James
                  text and read it clean, without ads or interruption.
                </p>
                <Link
                  to="/read/$book/$chapter"
                  params={{ book: "john", chapter: "1" }}
                  className={`${TEXT_LINK} mt-4 inline-block`}
                >
                  Read John 1
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-5 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-5xl flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className={EYEBROW}>Still deciding</p>
            <h2 className={TITLE}>Take it with you</h2>
          </div>
          <dl className="grid grid-cols-2 gap-4 sm:gap-6">
            {[
              { v: "Apps", l: "Download" },
              { v: "KJV", l: "Public domain" },
              { v: "0", l: "Trackers" },
              { v: "∞", l: "Free reads" },
            ].map((s) => (
              <div key={s.l} className={`${CARD} p-5`}>
                <dt className={STAT_LABEL}>{s.l}</dt>
                <dd className={`${STAT_VALUE} mt-0`}>{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="mx-auto mt-10 flex max-w-5xl flex-wrap gap-x-8 gap-y-3">
          <Link to="/download" className={TEXT_LINK}>
            Download
          </Link>
          <Link to="/groups" className="font-ui text-[14px] text-[#d9d0c1] transition hover:text-[#f5f0e8]">
            Reading groups
          </Link>
          <Link to="/faq" className="font-ui text-[14px] text-[#d9d0c1] transition hover:text-[#f5f0e8]">
            FAQ
          </Link>
        </div>
      </section>

      <section className="relative z-10 px-5 py-24 sm:px-10 lg:px-16">
        <blockquote className="mx-auto max-w-3xl border-l-2 border-[#d4af37] pl-6 sm:pl-10">
          <p className={EYEBROW}>Proverbs 3:5</p>
          <p className="mt-6 font-serif text-[clamp(1.6rem,3.6vw,2.4rem)] leading-[1.45] text-[#f5f0e8]">
            Trust in the LORD with all thine heart; and lean not unto thine own
            understanding.
          </p>
          <Link
            to="/read/$book/$chapter"
            params={{ book: "proverbs", chapter: "3" }}
            className={`${TEXT_LINK} mt-8 inline-block`}
          >
            Read the chapter
          </Link>
        </blockquote>
      </section>

      <section className="relative z-10 px-5 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="font-serif text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.1] tracking-[-0.01em] text-[#f5f0e8]">
            The best ideas
            <br />
            <span className="text-[#d4af37] italic">deserve the Word.</span>
          </p>
          <p className="mt-8 max-w-xl font-ui text-[16px] leading-[1.7] text-[#d9d0c1]">
            Search by a half-remembered phrase or the meaning you meant. Read the King James
            Bible — free, no ads, no paywall.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/books" className={PRIMARY_BUTTON}>
              Open the Bible
            </Link>
            <Link to="/about" className={GHOST_BUTTON}>
              About
            </Link>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-5 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p className={EYEBROW}>Seek by meaning</p>
          <ul className="mt-10 divide-y divide-white/10 border-y border-white/10">
            {[
              { q: "love of God", label: "Love", ref: "1 Jn 4:19" },
              { q: "mercy", label: "Mercy", ref: "Ps 136:1" },
              { q: "grace", label: "Grace", ref: "Eph 2:8" },
              { q: "hope", label: "Hope", ref: "Heb 6:19" },
              { q: "peace", label: "Peace", ref: "Phil 4:7" },
              { q: "faith", label: "Faith", ref: "Heb 11:1" },
            ].map((t) => (
              <li key={t.q}>
                <button
                  type="button"
                  onClick={() => run(t.q)}
                  className="group flex min-h-16 w-full items-center justify-between gap-4 py-5 text-left transition hover:pl-2"
                >
                  <span className="font-serif text-[clamp(1.6rem,4vw,2.5rem)] leading-tight text-[#f5f0e8] transition group-hover:text-[#d4af37]">
                    {t.label}
                  </span>
                  <span className="shrink-0 font-ui text-[13px] tracking-wide text-[#b8ad9b]">
                    {t.ref}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative z-10 px-5 py-24 sm:px-10 lg:px-16">
        <blockquote className="mx-auto max-w-3xl border-l-2 border-[#d4af37] pl-6 sm:pl-10">
          <p className={EYEBROW}>John 3:16</p>
          <p className="mt-6 font-serif text-[clamp(1.6rem,3.6vw,2.4rem)] leading-[1.45] text-[#f5f0e8]">
            For God so loved the world, that he gave his only begotten Son, that
            whosoever believeth in him should not perish, but have everlasting life.
          </p>
          <Link
            to="/read/$book/$chapter"
            params={{ book: "john", chapter: "3" }}
            className={`${TEXT_LINK} mt-8 inline-block`}
          >
            Read the chapter
          </Link>
        </blockquote>
      </section>

      <section className="relative z-10 px-5 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <Reveal as="p" className={EYEBROW}>
            What&rsquo;s inside
          </Reveal>
          <Reveal delay={60}>
            <h2 className={`${TITLE} max-w-3xl`}>Everything you need to read it properly.</h2>
          </Reveal>

          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                n: "01",
                t: "The whole Bible",
                d: "All 66 books, 1,189 chapters, in the King James Version of 1906 — complete and in the public domain.",
              },
              {
                n: "02",
                t: "Search by meaning",
                d: "Describe the idea in your own words and find the passages that carry it, not just the exact words.",
              },
              {
                n: "03",
                t: "Search by phrase",
                d: "Half-remember a line and get there quickly. Every word of the KJV is indexed and searchable.",
              },
              {
                n: "04",
                t: "Read it anywhere",
                d: "Install it on a phone or laptop and keep every chapter available without a connection.",
              },
              {
                n: "05",
                t: "Keep what matters",
                d: "Save passages and chapters to your own list so you can come back to them at any time.",
              },
              {
                n: "06",
                t: "Share a passage",
                d: "Send any verse or chapter straight to someone else, formatted and ready to read.",
              },
            ].map((f, i) => (
              <Reveal as="li" key={f.n} delay={i * 60} className={CARD}>
                <p className="font-ui text-[13px] font-semibold tracking-[0.18em] text-[#d4af37]">
                  {f.n}
                </p>
                <h3 className="mt-3 font-serif text-[1.5rem] leading-tight text-[#f5f0e8]">
                  {f.t}
                </h3>
                <p className="mt-3 font-ui text-[15px] leading-[1.7] text-[#d9d0c1]">{f.d}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative z-10 px-5 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <Reveal as="p" className={EYEBROW}>
            How it works
          </Reveal>
          <ol className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              {
                n: "1",
                t: "Ask for what you mean",
                d: "Search a feeling, a theme, or a line you almost remember.",
              },
              {
                n: "2",
                t: "Open the chapter",
                d: "Read it in full, in the KJV, laid out for study rather than skimming.",
              },
              {
                n: "3",
                t: "Keep or pass it on",
                d: "Save it to your list, or share it with whoever you had in mind.",
              },
            ].map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 70} className={`${CARD} flex flex-col gap-4`}>
                <span className="grid size-11 place-items-center rounded-full border border-[#d4af37]/60 font-serif text-[1.25rem] text-[#d4af37]">
                  {s.n}
                </span>
                <h3 className="font-serif text-[1.5rem] leading-tight text-[#f5f0e8]">{s.t}</h3>
                <p className="font-ui text-[15px] leading-[1.7] text-[#d9d0c1]">{s.d}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative z-10 px-5 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <Reveal as="p" className={EYEBROW}>
            Read by reference
          </Reveal>
          <Reveal delay={60}>
            <h2 className={TITLE}>Genesis to Revelation.</h2>
          </Reveal>
          <Reveal delay={120}>
            <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {BOOKS.map((b) => (
                <li key={b.slug}>
                  <Link
                    to="/read/$book/$chapter"
                    params={{ book: b.slug, chapter: "1" }}
                    className="flex min-h-12 items-center rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 font-ui text-[15px] text-[#f5f0e8] transition hover:border-[#d4af37]/60 hover:bg-white/[0.07] hover:text-[#d4af37]"
                  >
                    {b.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={180}>
            <Link to="/books" className={`${TEXT_LINK} mt-10 inline-block`}>
              Browse all 66 books
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="relative z-10 px-5 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <Reveal as="p" className={EYEBROW}>
            Start anywhere
          </Reveal>
          <Reveal delay={60}>
            <p className="mt-4 max-w-4xl font-serif text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.05] tracking-[-0.01em] text-[#f5f0e8]">
              The Word is free.
              <br />
              <span className="text-[#d4af37] italic">So is this.</span>
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-12 flex flex-wrap gap-4">
              <Link to="/books" className={PRIMARY_BUTTON}>
                Read now
              </Link>
              <Link to="/download" className={GHOST_BUTTON}>
                Install the app
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative z-10 px-5 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <Reveal as="p" className={EYEBROW}>
            Write directly
          </Reveal>
          <Reveal delay={60}>
            <h2 className={TITLE}>Contact</h2>
          </Reveal>
          <Reveal delay={120}>
            <a
              href="mailto:vijay.peddenti434@gmail.com"
              className="mt-6 block font-ui text-[clamp(1.05rem,2.5vw,1.35rem)] text-[#f5f0e8] underline decoration-[#d4af37]/60 underline-offset-4 transition hover:decoration-[#d4af37]"
            >
              vijay.peddenti434@gmail.com
            </a>
          </Reveal>
          <Reveal delay={180}>
            <nav className="mt-12 flex flex-wrap gap-x-8 gap-y-3 font-ui text-[14px] text-[#d9d0c1]">
              <Link to="/about" className="transition hover:text-[#d4af37]">
                About
              </Link>
              <Link to="/books" className="transition hover:text-[#d4af37]">
                Bible
              </Link>
              <Link to="/faq" className="transition hover:text-[#d4af37]">
                FAQ
              </Link>
              <Link to="/contact" className="transition hover:text-[#d4af37]">
                Contact
              </Link>
            </nav>
          </Reveal>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 px-5 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center gap-12 text-center">
            <div className="mx-auto max-w-xs">
              <p className="font-serif text-[clamp(1.6rem,4vw,2.25rem)] leading-[1.15] text-[#f5f0e8]">
                The Word,
                <span className="block text-[#d4af37] italic">kept free.</span>
              </p>
              <p className="mt-5 font-ui text-[14px] leading-[1.7] text-[#d9d0c1]">
                The King James Bible, complete and public domain. Search by meaning or read by
                reference — no ads, no paywall, no account required.
              </p>
              <a
                href="mailto:vijay.peddenti434@gmail.com"
                className="mt-5 inline-block font-ui text-[14px] text-[#f5f0e8] underline decoration-[#d4af37]/60 underline-offset-4 transition hover:decoration-[#d4af37]"
              >
                vijay.peddenti434@gmail.com
              </a>
              <dl className="mx-auto mt-8 grid max-w-xs grid-cols-2 gap-x-6 gap-y-4">
                {[
                  { t: "Books", v: "66" },
                  { t: "Chapters", v: "1,189" },
                  { t: "Version", v: "KJV 1906" },
                  { t: "Cost", v: "Free" },
                ].map((s) => (
                  <div key={s.t}>
                    <dt className="font-ui text-[12px] tracking-[0.14em] text-[#b8ad9b] uppercase">
                      {s.t}
                    </dt>
                    <dd className="mt-1 font-serif text-[1.15rem] text-[#f5f0e8]">{s.v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <nav
              aria-label="Footer"
              className="grid w-full grid-cols-2 justify-items-center gap-x-8 gap-y-10 text-center sm:max-w-2xl sm:grid-cols-4"
            >
              {[
                {
                  h: "Read",
                  items: [
                    { l: "All books", to: "/books" },
                    { l: "Explore", to: "/explore" },
                    { l: "Saved", to: "/saved" },
                    { l: "Groups", to: "/groups" },
                  ],
                },
                {
                  h: "Learn",
                  items: [
                    { l: "About", to: "/about" },
                    { l: "FAQ", to: "/faq" },
                    { l: "Pricing", to: "/pricing" },
                    { l: "Changelog", to: "/changelog" },
                  ],
                },
                {
                  h: "Project",
                  items: [
                    { l: "Download", to: "/download" },
                    { l: "Contact", to: "/contact" },
                    { l: "Report a bug", to: "/report-bug" },
                    { l: "Source text", to: "/privacy" },
                  ],
                },
                {
                  h: "Legal",
                  items: [
                    { l: "Terms", to: "/terms" },
                    { l: "Privacy", to: "/privacy" },
                    { l: "Log in", to: "/login" },
                    { l: "Profile", to: "/profile" },
                  ],
                },
              ].map((col) => (
                <div key={col.h}>
                  <p className="font-ui text-[12px] font-semibold tracking-[0.16em] text-[#d4af37] uppercase">
                    {col.h}
                  </p>
                  <ul className="mt-4 space-y-3">
                    {col.items.map((it) => (
                      <li key={it.to + it.l}>
                        <Link
                          to={it.to}
                          className="font-ui text-[14px] text-[#d9d0c1] transition hover:text-[#f5f0e8]"
                        >
                          {it.l}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          <div className="mt-14 flex flex-col items-center gap-2 border-t border-white/10 pt-8 text-center">
            <p className="font-ui text-[13px] text-[#b8ad9b]">
              © {new Date().getFullYear()} SEEK · KJV public domain
            </p>
            <p className="font-ui text-[13px] text-[#b8ad9b]">
              Free · No ads · No paywall · No tracking
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
