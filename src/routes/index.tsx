import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useSeekStore } from "@/lib/store";
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  ChevronRight,
  Clock,
  Heart,
  Moon,
  Search,
  Shield,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useHideOnScroll } from "@/hooks/use-hide-on-scroll";
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
  { q: "love of God", label: "Love", emoji: "❤️" },
  { q: "mercy", label: "Mercy", emoji: "🕊️" },
  { q: "grace", label: "Grace", emoji: "✨" },
  { q: "sacrifice", label: "Sacrifice", emoji: "✝️" },
  { q: "forgiveness", label: "Forgiveness", emoji: "🤝" },
  { q: "hope", label: "Hope", emoji: "🌅" },
  { q: "peace", label: "Peace", emoji: "🌿" },
  { q: "faith", label: "Faith", emoji: "🙏" },
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
  text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
  book: "john",
  chapter: "3",
};

const STATS = [
  { value: "66", label: "Books" },
  { value: "1,189", label: "Chapters" },
  { value: "31,102", label: "Verses" },
  { value: "KJV", label: "Translation" },
];

const FEATURES = [
  {
    icon: Heart,
    title: "Rooted in agape",
    body: "Search the love that gives — God's self-giving love revealed in Scripture from Genesis to Revelation.",
  },
  {
    icon: Search,
    title: "Search by meaning",
    body: "Find verses on mercy, sacrifice, grace, and hope — by phrase, topic, or the feeling on your heart.",
  },
  {
    icon: BookOpen,
    title: "Read every book",
    body: "The complete King James Bible with scroll and page modes, so you can dwell in the Word.",
  },
  {
    icon: Bookmark,
    title: "Save what matters",
    body: "Bookmark verses of comfort and conviction. Keep them close when you need them most.",
  },
  {
    icon: Moon,
    title: "Day & night",
    body: "A calm reading space that switches cleanly between light and dark.",
  },
  {
    icon: Shield,
    title: "Private by design",
    body: "Your searches stay on your device. Sign in only if you want synced saves.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Seek",
    body: "Type a verse, a story, or a longing — love, mercy, forgiveness, or a name of God.",
  },
  {
    n: "02",
    title: "Receive",
    body: "Open the chapter. Read slowly. Let the Word speak of the Father's heart.",
  },
  {
    n: "03",
    title: "Abide",
    body: "Save the verses that hold you. Return to them when you need grace again.",
  },
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
  const recent = useSeekStore((s) => s.recent);
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const navHidden = useHideOnScroll(14);

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
      {/* ── DESKTOP ── */}
      <div className="relative hidden lg:block">
        {/* Full-viewport canopy hero */}
        <section className="relative flex min-h-dvh flex-col overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <picture>
              <source srcSet="/canopy-hero.webp" type="image/webp" />
              <img
                src="/canopy-hero.jpg"
                alt=""
                className="h-full w-full object-cover object-[center_40%]"
                decoding="async"
                fetchPriority="high"
              />
            </picture>
            {/* Soft vignette — keep center sky open for the search */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_50%_42%,transparent_0%,rgba(8,12,10,0.18)_65%,rgba(8,12,10,0.5)_100%)]" />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/45 to-transparent" />
          </div>

          {/* Notion-light glass nav over photo */}
          <header
            className={cn(
              "fixed top-0 right-0 left-0 z-30 flex justify-center px-4 pt-4 transition-transform duration-300 ease-out will-change-transform",
              navHidden ? "-translate-y-[140%]" : "translate-y-0",
            )}
          >
            <div className="flex h-11 w-fit max-w-[min(100%,40rem)] items-center gap-1 rounded-full bg-white/85 px-2.5 shadow-sm ring-1 ring-black/8 backdrop-blur-xl dark:bg-black/50 dark:ring-white/12">
              <Link to="/" className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-ink">
                <LeafMark className="size-4 text-forest" />
                <span className="font-serif text-[1.05rem] tracking-[0.04em]">SEEK</span>
              </Link>
              <nav className="flex items-center gap-0.5">
                {[
                  { to: "/books" as const, label: "Bible" },
                  { to: "/saved" as const, label: "Saved" },
                  { to: "/profile" as const, label: "Profile" },
                ].map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    className="rounded-full px-3 py-1.5 font-sans text-[12.5px] font-medium text-muted transition-colors hover:text-ink"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
              <div className="ml-1 flex items-center gap-1 border-l border-line pl-2">
                <ThemeToggle />
                <Link
                  to="/login"
                  search={{ redirect: "/" }}
                  className="rounded-full bg-ink px-3.5 py-1.5 font-sans text-[12.5px] font-medium text-paper transition-opacity hover:opacity-90"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </header>

          {/* Center gap — search in the open sky */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-20 pt-24 text-center">
            <p className="font-sans text-[11px] font-medium tracking-[0.22em] text-white/90 uppercase drop-shadow-sm">
              Love · Mercy · Sacrifice · Agape
            </p>
            <h1 className="mt-3 font-serif text-[3.5rem] leading-[1.08] font-medium tracking-tight text-white drop-shadow-md xl:text-[4.25rem]">
              Look up.
              <br />
              <span className="italic">The Word is near.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-md font-sans text-[15px] leading-relaxed text-white/90 drop-shadow-sm">
              Search Scripture for the love that never fails — the mercy that
              meets us, the sacrifice that saves, the agape of God.
            </p>

            <form onSubmit={submit} className="mt-8 w-full max-w-md">
              <div className="flex items-center gap-0 rounded-full bg-white/95 p-1.5 shadow-[0_16px_48px_rgba(0,0,0,0.28)] ring-1 ring-black/5">
                <label htmlFor="desktop-home-search" className="sr-only">
                  Search the Bible
                </label>
                <input
                  id="desktop-home-search"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  enterKeyHint="search"
                  placeholder="Search love, mercy, a verse…"
                  className="h-11 min-w-0 flex-1 bg-transparent px-4 font-sans text-[15px] text-ink placeholder:text-faint focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="flex size-11 shrink-0 items-center justify-center rounded-full bg-ink text-paper transition-transform active:scale-95"
                >
                  <ArrowRight className="size-4" strokeWidth={2.2} />
                </button>
              </div>
            </form>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.q}
                  type="button"
                  onClick={() => runExample(ex.q)}
                  className="rounded-full bg-white/20 px-3.5 py-1.5 font-sans text-[12.5px] text-white ring-1 ring-white/35 backdrop-blur-md transition-colors hover:bg-white/30"
                >
                  “{ex.label}”
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Content — cream / theme surface below */}
        <section className="relative bg-paper px-6 pt-12 pb-16 text-ink">
          <div className="mx-auto max-w-5xl">
            <p className="mx-auto max-w-2xl text-center font-serif text-[1.35rem] leading-snug text-ink">
              “Beloved, let us love one another: for love is of God.”
              <span className="mt-2 block font-sans text-[13px] text-muted">
                1 John 4:7
              </span>
            </p>

            <div className="mx-auto mt-10 grid max-w-2xl grid-cols-4 gap-3">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-line bg-surface px-2 py-3.5 text-center"
                >
                  <p className="font-serif text-[1.35rem] font-medium text-ink tabular-nums">
                    {s.value}
                  </p>
                  <p className="mt-0.5 font-sans text-[10px] tracking-wide text-muted uppercase">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <Link
                to="/read/$book/$chapter"
                params={{ book: FEATURED.book, chapter: FEATURED.chapter }}
                search={{ q: undefined }}
                className="group rounded-xl border border-line bg-surface p-5 text-left transition-colors hover:bg-wash"
              >
                <div className="flex items-center gap-2 text-forest">
                  <Heart className="size-3.5" strokeWidth={2} fill="currentColor" />
                  <span className="font-sans text-[11px] font-semibold tracking-[0.12em] uppercase">
                    The heart of the Gospel
                  </span>
                </div>
                <p className="mt-3 font-serif text-[1.15rem] leading-snug text-ink text-balance">
                  “{FEATURED.text}”
                </p>
                <p className="mt-2 font-sans text-[13px] text-muted">{FEATURED.ref}</p>
                <span className="mt-3 inline-flex items-center gap-1 font-sans text-[13px] font-medium text-muted group-hover:text-ink">
                  Read chapter <ChevronRight className="size-3.5" />
                </span>
              </Link>

              <div className="rounded-xl border border-line bg-surface p-5">
                <div className="flex items-center gap-2 text-muted">
                  <Sparkles className="size-3.5" strokeWidth={2} />
                  <span className="font-sans text-[11px] font-semibold tracking-[0.12em] uppercase">
                    Seek by the heart
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {TOPICS.map((t) => (
                    <button
                      key={t.q}
                      type="button"
                      onClick={() => runExample(t.q)}
                      className="flex flex-col items-center gap-1 rounded-lg border border-line bg-paper px-1.5 py-2.5 transition-colors hover:bg-wash"
                    >
                      <span className="text-base leading-none">{t.emoji}</span>
                      <span className="font-sans text-[11px] font-medium text-ink">
                        {t.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <section className="mt-4 rounded-xl border border-line bg-surface p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted">
                  <BookOpen className="size-3.5" strokeWidth={2} />
                  <span className="font-sans text-[11px] font-semibold tracking-[0.12em] uppercase">
                    Books of love & mercy
                  </span>
                </div>
                <Link
                  to="/books"
                  className="font-sans text-[13px] font-medium text-forest hover:underline"
                >
                  All 66 books →
                </Link>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 md:grid-cols-6">
                {POPULAR_BOOKS.map((b) => (
                  <Link
                    key={b.slug}
                    to="/read/$book/$chapter"
                    params={{ book: b.slug, chapter: "1" }}
                    search={{ q: undefined }}
                    className="rounded-lg border border-line bg-paper px-3 py-3 text-center transition-colors hover:bg-wash"
                  >
                    <p className="font-serif text-[14px] font-medium text-ink">{b.name}</p>
                    <p className="mt-0.5 font-sans text-[11px] text-muted">{b.chapters} ch.</p>
                  </Link>
                ))}
              </div>
            </section>

            <section className="mt-14">
              <p className="text-center font-sans text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">
                How it works
              </p>
              <h2 className="mt-2 text-center font-serif text-[1.75rem] font-medium text-ink">
                Seek. Receive. Abide.
              </h2>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {STEPS.map((s) => (
                  <div
                    key={s.n}
                    className="rounded-xl border border-line bg-surface p-5"
                  >
                    <p className="font-sans text-[12px] font-semibold tracking-[0.16em] text-forest">
                      {s.n}
                    </p>
                    <p className="mt-1.5 font-serif text-[1.15rem] text-ink">{s.title}</p>
                    <p className="mt-1.5 font-sans text-[13.5px] leading-relaxed text-muted">
                      {s.body}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-14">
              <p className="text-center font-sans text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">
                Why Seek
              </p>
              <h2 className="mt-2 text-center font-serif text-[1.75rem] font-medium text-ink">
                A quiet place for the Gospel
              </h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {FEATURES.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div
                      key={f.title}
                      className="rounded-xl border border-line bg-surface p-5"
                    >
                      <span className="inline-flex size-9 items-center justify-center rounded-md bg-wash text-forest">
                        <Icon className="size-4" strokeWidth={1.8} />
                      </span>
                      <p className="mt-3 font-serif text-[1.05rem] text-ink">{f.title}</p>
                      <p className="mt-1 font-sans text-[13px] leading-relaxed text-muted">
                        {f.body}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {recent.length > 0 && (
              <section className="mt-10 rounded-xl border border-line bg-surface p-5">
                <div className="flex items-center gap-2 text-muted">
                  <Clock className="size-3.5" strokeWidth={2} />
                  <span className="font-sans text-[11px] font-semibold tracking-[0.12em] uppercase">
                    Recent searches
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {recent.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => runExample(q)}
                      className="rounded-md border border-line bg-paper px-3 py-1.5 font-sans text-[13px] text-ink transition-colors hover:bg-wash"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </section>
            )}

            <section className="mt-14 rounded-xl border border-line bg-surface px-8 py-10 text-center">
              <h2 className="font-serif text-[1.85rem] font-medium text-ink">
                Come and see
              </h2>
              <p className="mx-auto mt-2 max-w-md font-sans text-[14px] text-muted">
                Open the King James Bible. Search the love of God, His mercy, and the
                sacrifice of Christ — and keep the verses that hold you.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                <Link
                  to="/books"
                  className="inline-flex h-10 items-center rounded-md bg-ink px-5 font-sans text-[13px] font-medium text-paper transition-opacity hover:opacity-90"
                >
                  Browse books
                </Link>
                <Link
                  to="/login"
                  search={{ redirect: "/" }}
                  className="inline-flex h-10 items-center rounded-md border border-line bg-paper px-5 font-sans text-[13px] font-medium text-ink transition-colors hover:bg-wash"
                >
                  Sign in to save
                </Link>
              </div>
            </section>

            <section
              id="about"
              className="mt-14 rounded-xl border border-line bg-surface p-6 md:p-8"
            >
              <p className="font-sans text-[11px] font-semibold tracking-[0.12em] text-muted uppercase">
                About SEEK
              </p>
              <h2 className="mt-2 font-serif text-[1.5rem] font-medium text-ink">
                Built to point you to Him
              </h2>
              <p className="mt-3 max-w-2xl font-sans text-[14px] leading-relaxed text-muted">
                SEEK is a quiet place to search and read the King James Bible — the love of
                God, His mercy toward sinners, the sacrifice of Christ, and the agape that
                never ends. Scripture text is public domain. SEEK is independent and not
                affiliated with any denomination.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-line bg-paper p-4">
                  <p className="font-sans text-[11px] font-semibold tracking-wide text-forest uppercase">
                    Contact
                  </p>
                  <p className="mt-1.5 font-sans text-[14px] text-ink">
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="underline-offset-2 hover:underline"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </p>
                </div>
                <div className="rounded-lg border border-line bg-paper p-4">
                  <p className="font-sans text-[11px] font-semibold tracking-wide text-forest uppercase">
                    Report a bug
                  </p>
                  <p className="mt-1.5 font-sans text-[14px] text-ink">
                    <a
                      href={`mailto:${CONTACT_EMAIL}?subject=SEEK%20bug%20report&body=Page%20URL%3A%0AWhat%20happened%3A%0AWhat%20you%20expected%3A%0A`}
                      className="underline-offset-2 hover:underline"
                    >
                      Send a bug report
                    </a>
                  </p>
                </div>
              </div>
              <div className="mt-5 space-y-1 border-t border-line pt-4 font-sans text-[12px] text-faint">
                <p>Scripture text: King James Version (public domain).</p>
                <p>
                  © {new Date().getFullYear()} SEEK · Design and software rights reserved.
                </p>
              </div>
            </section>

            <footer className="mt-10 border-t border-line pt-6 pb-2">
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="flex items-center gap-2 text-ink">
                  <LeafMark className="size-4 text-forest" />
                  <span className="font-serif text-[1.05rem] tracking-[0.04em]">SEEK</span>
                </div>
                <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1 font-sans text-[13px] text-muted">
                  <Link to="/books" className="hover:text-ink">
                    Bible
                  </Link>
                  <Link to="/saved" className="hover:text-ink">
                    Saved
                  </Link>
                  <a href="#about" className="hover:text-ink">
                    About
                  </a>
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=SEEK%20bug%20report`}
                    className="hover:text-ink"
                  >
                    Report a bug
                  </a>
                </nav>
              </div>
            </footer>
          </div>
        </section>
      </div>

      {/* ── MOBILE ── */}
      <div className="relative -mx-4 -mt-3 flex flex-col lg:hidden">
        <div className="relative overflow-hidden px-5 pb-8 pt-2">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <picture>
              <source srcSet="/canopy-hero.webp" type="image/webp" />
              <img
                src="/canopy-hero.jpg"
                alt=""
                className="h-full w-full object-cover object-[center_35%]"
                decoding="async"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/30 to-black/45" />
          </div>

          <p className="text-center font-sans text-[10px] font-medium tracking-[0.22em] text-white/90 uppercase">
            Love · Mercy · Sacrifice · Agape
          </p>
          <h1 className="mt-3 text-center font-serif text-[2.4rem] leading-[1.12] font-medium tracking-tight text-white">
            Look up.
            <br />
            <span className="italic">The Word is near.</span>
          </h1>
          <p className="mx-auto mt-3 max-w-[18rem] text-center font-sans text-[14px] leading-relaxed text-white/90">
            Search the love of God, His mercy, and the sacrifice of Christ.
          </p>

          <form onSubmit={submit} className="mx-auto mt-5 w-full max-w-md">
            <div className="relative flex items-center rounded-full bg-white/95 shadow-lg ring-1 ring-black/5">
              <Search
                className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-muted"
                strokeWidth={1.8}
                aria-hidden
              />
              <input
                value={value}
                autoComplete="off"
                spellCheck={false}
                enterKeyHint="search"
                placeholder="Search love, mercy, a verse…"
                onChange={(e) => setValue(e.target.value)}
                className="h-12 w-full bg-transparent py-3 pr-14 pl-11 font-sans text-[15px] text-ink placeholder:text-faint focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute top-1/2 right-1.5 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-paper"
              >
                <ArrowRight className="size-4" strokeWidth={2.2} />
              </button>
            </div>
          </form>

          <div className="mx-auto mt-3.5 flex max-w-md flex-wrap justify-center gap-2 pb-6">
            {EXAMPLES.slice(0, 3).map((ex) => (
              <button
                key={ex.q}
                type="button"
                onClick={() => runExample(ex.q)}
                className="rounded-full bg-white/20 px-3 py-1.5 font-sans text-[12px] text-white ring-1 ring-white/30 backdrop-blur-md"
              >
                “{ex.label}”
              </button>
            ))}
          </div>
        </div>

        <div className="bg-paper px-5 pt-6 pb-8 text-ink">
          <Link
            to="/read/$book/$chapter"
            params={{ book: FEATURED.book, chapter: FEATURED.chapter }}
            search={{ q: undefined }}
            className="block rounded-xl border border-line bg-surface p-4"
          >
            <div className="flex items-center gap-1.5 text-forest">
              <Heart className="size-3.5" strokeWidth={2} fill="currentColor" />
              <span className="font-sans text-[10px] font-semibold tracking-[0.14em] uppercase">
                The heart of the Gospel
              </span>
            </div>
            <p className="mt-2 font-serif text-[1.05rem] leading-snug text-ink">
              “{FEATURED.text}”
            </p>
            <p className="mt-2 font-sans text-[12px] text-muted">{FEATURED.ref}</p>
          </Link>

          <section className="mt-5">
            <p className="mb-2.5 font-sans text-[11px] font-medium tracking-[0.14em] text-muted uppercase">
              Seek by the heart
            </p>
            <div className="grid grid-cols-4 gap-2">
              {TOPICS.map((t) => (
                <button
                  key={t.q}
                  type="button"
                  onClick={() => runExample(t.q)}
                  className="flex flex-col items-center gap-1 rounded-lg border border-line bg-surface px-1 py-2.5 transition-colors active:bg-wash"
                >
                  <span className="text-base leading-none">{t.emoji}</span>
                  <span className="font-sans text-[11px] font-medium text-ink">{t.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="mt-6">
            <div className="mb-2.5 flex items-center justify-between">
              <p className="font-sans text-[11px] font-medium tracking-[0.14em] text-muted uppercase">
                Books of love & mercy
              </p>
              <Link to="/books" className="font-sans text-[12px] font-medium text-forest">
                All →
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {POPULAR_BOOKS.map((b) => (
                <Link
                  key={b.slug}
                  to="/read/$book/$chapter"
                  params={{ book: b.slug, chapter: "1" }}
                  search={{ q: undefined }}
                  className="rounded-lg border border-line bg-surface px-2 py-3 text-center"
                >
                  <p className="font-serif text-[13px] font-medium text-ink">{b.name}</p>
                  <p className="mt-0.5 font-sans text-[10px] text-muted">{b.chapters} ch.</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-6 rounded-xl border border-line bg-surface p-4">
            <p className="font-sans text-[11px] font-semibold tracking-[0.12em] text-muted uppercase">
              How it works
            </p>
            <div className="mt-3 space-y-3">
              {STEPS.map((s) => (
                <div key={s.n} className="flex gap-3">
                  <span className="font-sans text-[12px] font-semibold tracking-[0.12em] text-forest">
                    {s.n}
                  </span>
                  <div>
                    <p className="font-serif text-[15px] text-ink">{s.title}</p>
                    <p className="mt-0.5 font-sans text-[13px] leading-relaxed text-muted">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="about" className="mt-6 rounded-xl border border-line bg-surface p-4">
            <p className="font-sans text-[11px] font-semibold tracking-[0.12em] text-muted uppercase">
              About SEEK
            </p>
            <p className="mt-2 font-sans text-[13px] leading-relaxed text-muted">
              A quiet place to search and read the King James Bible — God's love, mercy, the
              sacrifice of Christ, and agape that never ends.
            </p>
            <div className="mt-3 space-y-1 font-sans text-[13px]">
              <p>
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-forest underline-offset-2 hover:underline">
                  {CONTACT_EMAIL}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=SEEK%20bug%20report`}
                  className="text-muted underline-offset-2 hover:underline"
                >
                  Report a bug
                </a>
              </p>
            </div>
          </section>

          <footer className="mt-8 border-t border-line pt-4 pb-2 text-center">
            <div className="flex items-center justify-center gap-2 text-ink">
              <LeafMark className="size-4 text-forest" />
              <span className="font-serif text-[1rem] tracking-[0.04em]">SEEK</span>
            </div>
            <p className="mt-2 font-sans text-[11px] text-faint">
              © {new Date().getFullYear()} · KJV public domain
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
