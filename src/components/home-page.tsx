import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useSeekStore } from "@/lib/store";
import { Search } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { BOOKS } from "@/data/books";

const EXAMPLES = [
  "God so loved the world",
  "mercy",
  "Psalm 23",
  "be not afraid",
  "love one another",
];

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

  const p1 = scrollY * 0.12;
  const p2 = scrollY * 0.08;
  const p3 = scrollY * 0.15;

  // Scroll-driven "seek bible" merge: the two side words travel toward the
  // viewport centre over the back half of the page and stop as one phrase.
  const merge = useMemo(() => {
    const max = Math.max(1, docH - vh);
    const t = Math.min(1, Math.max(0, (scrollY - max * 0.45) / (max * 0.5)));
    return t * t * (3 - 2 * t); // smoothstep
  }, [scrollY, docH, vh]);

  const halfGap = 0.8; // rem of breathing room between the words
  const sideOpacity = 0.14 + merge * 0.5;
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
        // Transparent on purpose: `HomeBackdrop` is mounted once in the root,
        // above both of the shell's layout branches, and supplies the cover from
        // behind. If the image or video is missing, the wash layer composites
        // over the body's own leather, so a failed asset degrades to plain calf
        // rather than to a hole.
        className="relative min-h-[100dvh] bg-transparent text-[var(--ink)]"
      >

      {/* seek ←→ bible: slide in from the sides, meet as one phrase, stop */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-6 z-20 h-[clamp(2.5rem,9vw,5rem)]"
        aria-hidden
      >
        <span
          ref={seekRef}
          className="absolute bottom-0 select-none font-sans text-[clamp(2.5rem,9vw,5rem)] font-medium tracking-tight text-cover-ink [text-shadow:0_2px_18px_rgba(0,0,0,0.5)] will-change-transform"
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
          className="absolute bottom-0 select-none font-sans text-[clamp(2.5rem,9vw,5rem)] font-medium tracking-tight text-cover-ink [text-shadow:0_2px_18px_rgba(0,0,0,0.5)] will-change-transform"
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

      <section className="relative z-10 flex min-h-[100dvh] flex-col px-5 pt-20 pb-10 sm:px-10 lg:px-16">
        <div className="flex items-start justify-between gap-6">
          <div className="flex gap-6">
            <div className="hidden h-16 w-12 bg-cover-ink/80 sm:block" aria-hidden />
            <div className="border-l border-cover-ink/30 pl-4">
              <p className="font-sans text-[12px] leading-snug text-cover-ink/85">
                Free · KJV
                <br />
                66 books
              </p>
            </div>
          </div>
          <p className="max-w-[10rem] text-right font-sans text-[12px] leading-snug text-cover-ink/80">
            Search a half-
            <br />
            remembered word
          </p>
        </div>

        <div className="relative flex flex-1 flex-col items-center justify-center">
          <h1 className="pointer-events-none absolute left-1/2 top-[38%] z-0 -translate-x-1/2 -translate-y-1/2 select-none text-center font-sans text-[clamp(4.5rem,18vw,13rem)] font-medium leading-[0.85] tracking-[-0.04em] text-cover-ink [text-shadow:0_2px_24px_rgba(0,0,0,0.55)]">
            SEEK
          </h1>
          {/* The word behind the search field. It is a watermark, not a second
              heading, so it stays a faint echo of the ink rather than a solid
              one - this used to be `text-black/15`, a leftover from when the
              site had a light background, where low-alpha *black* read as a
              whisper. On dark calf that same trick is invisible, so it has to be
              low-alpha *ink* to stay a whisper. */}
          <p className="pointer-events-none absolute left-1/2 top-[48%] z-0 -translate-x-1/2 select-none font-sans text-[clamp(2.5rem,10vw,7rem)] font-medium leading-none tracking-[-0.03em] text-cover-ink/15">
            Scripture
          </p>

        <div className="relative z-10 mt-[34vh] w-full max-w-md">
          {/* The field sits on the photograph, so it is a light frosted pill with
              dark ink rather than the palette's own field. A transparent field
              with `text-cover-ink` put dark text straight onto the image, which is
              where "can't see the text" came from. */}
          <form onSubmit={submit}>
            <label htmlFor="home-search" className="sr-only">
              Search the Bible
            </label>
            <div className="search-pill-on-cover flex items-center gap-3 rounded-full px-4 pb-0 shadow-sm">
              <Search className="size-4 shrink-0 opacity-60" strokeWidth={1.6} />
              <input
                id="home-search"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                enterKeyHint="search"
                placeholder="A verse, a word, a longing…"
                className="h-12 w-full bg-transparent font-sans text-[1.05rem] text-[#1c1611] outline-none placeholder:text-[#5c5147]"
              />
            </div>
          </form>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
            {EXAMPLES.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => run(q)}
                className="font-sans text-[11px] tracking-wide text-cover-ink/85 transition hover:text-cover-ink"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto flex items-end justify-between pt-10">
        <p className="font-sans text-[12px] text-cover-ink/85">
          Designer
          <br />& the Word
        </p>
        <a
          href="#work"
          className="font-sans text-[12px] tracking-[0.16em] text-cover-ink/85 uppercase"
        >
          Scroll
        </a>
      </div>
      </section>

      <section
        id="work"
        className="relative z-10 min-h-[80dvh]px-5 py-28 sm:px-10 lg:px-16"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-20 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-sans text-[11px] tracking-[0.2em] text-cover-ink-soft uppercase">
              Corpus
            </p>
            <h2 className="mt-4 font-sans text-[clamp(3.5rem,12vw,9rem)] font-medium leading-[0.9] tracking-[-0.04em]">
              66
              <span className="block text-cover-ink-soft">books</span>
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-10 sm:gap-16">
            {[
              { v: "1,189", l: "Chapters" },
              { v: "31k", l: "Verses" },
              { v: "KJV", l: "Only" },
            ].map((s) => (
              <div key={s.l}>
                <p className="font-sans text-[clamp(1.75rem,4vw,2.75rem)] font-medium tracking-tight">
                  {s.v}
                </p>
                <p className="mt-1 font-sans text-[11px] tracking-[0.16em] text-cover-ink-soft uppercase">
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-5 py-28 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="font-sans text-[11px] tracking-[0.2em] text-cover-ink-soft uppercase">
            Start somewhere
          </p>
          <h2 className="mt-4 font-sans text-[clamp(2.5rem,8vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.03em]">
            Begin a
            <span className="block text-cover-ink-soft">chapter</span>
          </h2>
          <div className="mt-14 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
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
                className="group flex items-baseline justify-between gap-4"
              >
                <span className="font-sans text-[clamp(1.35rem,3vw,1.9rem)] font-medium tracking-tight transition group-hover:opacity-60">
                  {b.label}
                </span>
                <span className="shrink-0 font-sans text-[12px] text-cover-ink-soft">
                  {b.note}
                </span>
              </Link>
            ))}
          </div>
          <Link
            to="/books"
            className="mt-14 inline-block font-sans text-[12px] tracking-[0.16em] uppercase underline underline-offset-4"
          >
            All 66 books
          </Link>
        </div>
      </section>

      <section className="relative z-10 px-5 py-28 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="font-sans text-[11px] tracking-[0.2em] text-cover-ink-soft uppercase">
                Two ways in
              </p>
              <h2 className="mt-4 font-sans text-[clamp(2rem,6vw,3.5rem)] font-medium leading-[1] tracking-[-0.03em]">
                Search by meaning, or read by reference.
              </h2>
            </div>
            <div className="flex flex-col gap-8">
              <div>
                <p className="font-sans text-[15px] leading-relaxed text-cover-ink/80">
                  Describe what you remember in your own words — a half-heard phrase,
                  a feeling, a theme — and SEEK returns the passages that carry it.
                </p>
                <button
                  type="button"
                  onClick={() => run("comfort in sorrow")}
                  className="mt-4 font-sans text-[13px] tracking-[0.12em] uppercase underline underline-offset-4"
                >
                  Try “comfort in sorrow”
                </button>
              </div>
              <div>
                <p className="font-sans text-[15px] leading-relaxed text-cover-ink/80">
                  Already know where it is? Open any of the 1,189 chapters in the King
                  James text and read it clean, without ads or interruption.
                </p>
                <Link
                  to="/read/$book/$chapter"
                  params={{ book: "john", chapter: "1" }}
                  className="mt-4 inline-block font-sans text-[13px] tracking-[0.12em] uppercase underline underline-offset-4"
                >
                  Read John 1
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-5 py-32 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-5xl flex-col gap-20 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-sans text-[11px] tracking-[0.2em] text-cover-ink-soft uppercase">
              Still deciding
            </p>
            <h2 className="mt-4 font-sans text-[clamp(2.5rem,8vw,5rem)] font-medium leading-[0.95] tracking-[-0.03em]">
              Take it
              <span className="block text-cover-ink-soft">with you</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            {[
              { v: "Apps", l: "Download" },
              { v: "KJV", l: "Public domain" },
              { v: "0", l: "Trackers" },
              { v: "∞", l: "Free reads" },
            ].map((s) => (
              <div key={s.l}>
                <p className="font-sans text-[clamp(1.75rem,4vw,2.75rem)] font-medium tracking-tight">
                  {s.v}
                </p>
                <p className="mt-1 font-sans text-[11px] tracking-[0.16em] text-cover-ink-soft uppercase">
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-14 flex max-w-5xl flex-wrap gap-x-8 gap-y-3">
          <Link to="/download" className="font-sans text-[12px] tracking-[0.16em] uppercase underline underline-offset-4">
            Download
          </Link>
          <Link to="/groups" className="font-sans text-[12px] tracking-[0.16em] uppercase text-cover-ink/80">
            Reading groups
          </Link>
          <Link to="/faq" className="font-sans text-[12px] tracking-[0.16em] uppercase text-cover-ink/80">
            FAQ
          </Link>
        </div>
      </section>

      <section className="relative z-10 px-5 py-32 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <p className="font-sans text-[11px] tracking-[0.2em] text-cover-ink-soft uppercase">
            Proverbs 3:5
          </p>
          <p className="mt-8 font-sans text-[clamp(1.35rem,3.5vw,2.25rem)] font-medium leading-[1.25] tracking-[-0.02em]">
            Trust in the LORD with all thine heart; and lean not unto thine own
            understanding.
          </p>
          <Link
            to="/read/$book/$chapter"
            params={{ book: "proverbs", chapter: "3" }}
            className="mt-10 inline-block font-sans text-[12px] tracking-[0.16em] uppercase underline underline-offset-4"
          >
            Read the chapter
          </Link>
        </div>
      </section>

      <section className="relative z-10 px-5 py-32 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex gap-8">
            <div className="hidden w-px self-stretch bg-cover-ink/20 sm:block" />
            <div>
              <p className="font-sans text-[clamp(2rem,6vw,4.5rem)] font-medium leading-[1.05] tracking-[-0.03em]">
                the
                <br />
                best
                <br />
                ideas deserve
                <br />
                <span className="text-cover-ink-soft">the Word.</span>
              </p>
              <p className="mt-10 max-w-sm font-sans text-[14px] leading-relaxed text-cover-ink-soft">
                Search by a half-remembered phrase or the meaning you meant.
                Read the King James Bible — free, no ads, no paywall.
              </p>
              <div className="mt-10 flex flex-wrap gap-6">
                <Link
                  to="/books"
                  className="font-sans text-[13px] tracking-[0.12em] uppercase underline underline-offset-4"
                >
                  Open the Bible
                </Link>
                <Link
                  to="/about"
                  className="font-sans text-[13px] tracking-[0.12em] text-cover-ink/80 uppercase"
                >
                  About
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-5 py-28 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="font-sans text-[11px] tracking-[0.2em] text-cover-ink-soft uppercase">
            Seek by meaning
          </p>
          <ul className="mt-12 divide-y divide-cover-ink/15">
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
                  className="group flex w-full items-baseline justify-between gap-4 py-6 text-left"
                >
                  <span className="font-sans text-[clamp(1.5rem,4vw,2.5rem)] font-medium tracking-tight transition group-hover:opacity-60">
                    {t.label}
                  </span>
                  <span className="shrink-0 font-sans text-[12px] tracking-wide text-cover-ink-soft">
                    {t.ref}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative z-10 px-5 py-32 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <p className="font-sans text-[11px] tracking-[0.2em] text-cover-ink-soft uppercase">
            John 3:16
          </p>
          <p className="mt-8 font-sans text-[clamp(1.35rem,3.5vw,2.25rem)] font-medium leading-[1.25] tracking-[-0.02em]">
            For God so loved the world, that he gave his only begotten Son, that
            whosoever believeth in him should not perish, but have everlasting
            life.
          </p>
          <Link
            to="/read/$book/$chapter"
            params={{ book: "john", chapter: "3" }}
            className="mt-10 inline-block font-sans text-[12px] tracking-[0.16em] uppercase underline underline-offset-4"
          >
            Read the chapter
          </Link>
        </div>
      </section>

      <section className="relative z-10 px-5 py-28 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <Reveal
            as="p"
            className="font-sans text-[11px] tracking-[0.2em] text-cover-ink-soft uppercase"
          >
            What&rsquo;s inside
          </Reveal>
          <Reveal delay={60}>
            <h2 className="mt-4 max-w-3xl font-sans text-[length:var(--type-title)] font-medium leading-[0.95] tracking-[-0.03em]">
              Everything you need to read it properly.
            </h2>
          </Reveal>

          <ul className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
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
              <Reveal as="li" key={f.n} delay={i * 60}>
                <p className="font-sans text-[12px] tracking-[0.18em] text-cover-ink-soft">
                  {f.n}
                </p>
                <h3 className="mt-3 font-sans text-[1.15rem] font-medium tracking-[-0.02em]">
                  {f.t}
                </h3>
                <p className="mt-3 font-sans text-[14px] leading-relaxed text-cover-ink-soft">
                  {f.d}
                </p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative z-10 px-5 py-28 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <Reveal
            as="p"
            className="font-sans text-[11px] tracking-[0.2em] text-cover-ink-soft uppercase"
          >
            How it works
          </Reveal>
          <ol className="mt-14 divide-y divide-cover-ink/15">
            {[
              {
                n: "01",
                t: "Ask for what you mean",
                d: "Search a feeling, a theme, or a line you almost remember.",
              },
              {
                n: "02",
                t: "Open the chapter",
                d: "Read it in full, in the KJV, laid out for study rather than skimming.",
              },
              {
                n: "03",
                t: "Keep or pass it on",
                d: "Save it to your list, or share it with whoever you had in mind.",
              },
            ].map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 70}>
                <div className="flex flex-col gap-3 py-8 sm:flex-row sm:gap-10">
                  <p className="font-sans text-[clamp(1.5rem,4vw,2.5rem)] font-medium tracking-tight sm:w-16">
                    {s.n}
                  </p>
                  <h3 className="font-sans text-[clamp(1.15rem,2.5vw,1.5rem)] font-medium tracking-[-0.02em] sm:w-64">
                    {s.t}
                  </h3>
                  <p className="max-w-md font-sans text-[14px] leading-relaxed text-cover-ink-soft sm:ml-auto">
                    {s.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative z-10 px-5 py-28 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <Reveal
            as="p"
            className="font-sans text-[11px] tracking-[0.2em] text-cover-ink-soft uppercase"
          >
            Read by reference
          </Reveal>
          <Reveal delay={60}>
            <h2 className="mt-4 font-sans text-[length:var(--type-title)] font-medium leading-[0.95] tracking-[-0.03em]">
              Genesis to Revelation.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <ul className="mt-14 flex flex-wrap gap-x-3 gap-y-2">
              {BOOKS.map((b) => (
                <li key={b.slug}>
                  <Link
                    to="/read/$book/$chapter"
                    params={{ book: b.slug, chapter: "1" }}
                    className="inline-block border border-cover-ink/25 px-4 py-2 font-sans text-[13px] transition hover:border-cover-ink/60 hover:opacity-70"
                  >
                    {b.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={180}>
            <Link
              to="/books"
              className="mt-12 inline-block font-sans text-[12px] tracking-[0.16em] uppercase underline underline-offset-4"
            >
              Browse all 66 books
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="relative z-10 px-5 py-32 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <Reveal
            as="p"
            className="font-sans text-[11px] tracking-[0.2em] text-cover-ink-soft uppercase"
          >
            Start anywhere
          </Reveal>
          <Reveal delay={60}>
            <p className="mt-4 max-w-4xl font-sans text-[clamp(2.5rem,8vw,6rem)] font-medium leading-[0.95] tracking-[-0.03em]">
              The Word is free.
              <br />
              <span className="text-cover-ink-soft">So is this.</span>
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-14 flex flex-wrap gap-4">
              <Link
                to="/books"
                className="border border-black bg-black px-7 py-3.5 font-sans text-[12px] tracking-[0.16em] text-white uppercase transition hover:opacity-75"
              >
                Read now
              </Link>
              <Link
                to="/download"
                className="border border-cover-ink/35 px-7 py-3.5 font-sans text-[12px] tracking-[0.16em] uppercase transition hover:border-cover-ink/70"
              >
                Install the app
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative z-10 px-5 py-32 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <Reveal
            as="p"
            className="font-sans text-[11px] tracking-[0.2em] text-cover-ink-soft uppercase"
          >
            Write directly
          </Reveal>
          <Reveal delay={60}>
            <h2 className="mt-4 font-sans text-[length:var(--type-title)] font-medium leading-[0.95] tracking-[-0.03em]">
              Contact
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <a
              href="mailto:vijay.peddenti434@gmail.com"
              className="mt-8 block font-sans text-[clamp(1rem,2.5vw,1.35rem)] underline underline-offset-4"
            >
              vijay.peddenti434@gmail.com
            </a>
          </Reveal>
          <Reveal delay={180}>
            <div className="mt-16 flex flex-wrap gap-x-8 gap-y-3 font-sans text-[13px] text-cover-ink/80">
              <Link to="/about" className="hover:text-cover-ink">
                About
              </Link>
              <Link to="/books" className="hover:text-cover-ink">
                Bible
              </Link>
              <Link to="/faq" className="hover:text-cover-ink">
                FAQ
              </Link>
              <Link to="/contact" className="hover:text-cover-ink">
                Contact
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="relative z-10 px-5 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-12 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-xs">
              <p className="font-sans text-[clamp(1.5rem,4vw,2.25rem)] font-medium leading-[1.1] tracking-[-0.02em]">
                The Word,
                <span className="block text-cover-ink-soft">kept free.</span>
              </p>
              <p className="mt-5 font-sans text-[13px] leading-relaxed text-cover-ink/80">
                The King James Bible, complete and public domain. Search by meaning or
                read by reference — no ads, no paywall, no account required.
              </p>
              <a
                href="mailto:vijay.peddenti434@gmail.com"
                className="mt-5 inline-block font-sans text-[13px] underline underline-offset-4"
              >
                vijay.peddenti434@gmail.com
              </a>
              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4">
                {[
                  { t: "Books", v: "66" },
                  { t: "Chapters", v: "1,189" },
                  { t: "Version", v: "KJV 1906" },
                  { t: "Cost", v: "Free" },
                ].map((s) => (
                  <div key={s.t}>
                    <dt className="font-sans text-[11px] tracking-[0.18em] text-cover-ink-soft uppercase">
                      {s.t}
                    </dt>
                    <dd className="mt-1 font-sans text-[15px] font-medium tracking-[-0.01em]">
                      {s.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <nav aria-label="Footer" className="grid flex-1 grid-cols-2 gap-x-8 gap-y-10 sm:max-w-md sm:grid-cols-4">
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
                  <p className="font-sans text-[11px] tracking-[0.2em] text-cover-ink-soft uppercase">
                    {col.h}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {col.items.map((it) => (
                      <li key={it.to + it.l}>
                        <Link
                          to={it.to}
                          className="font-sans text-[13px] text-cover-ink/80 transition hover:text-cover-ink"
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

          <div className="mt-16 flex flex-col items-center gap-2 border-t border-black/10 pt-8 text-center">
            <p className="font-sans text-[12px] text-cover-ink-soft">
              © {new Date().getFullYear()} SEEK · KJV public domain
            </p>
            <p className="font-sans text-[12px] text-cover-ink-soft">
              Free · No ads · No paywall · No tracking
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
