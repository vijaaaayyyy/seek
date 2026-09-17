import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useSeekStore } from "@/lib/store";
import { useCurrentUserState } from "@/lib/supa/use-current-user";
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
} from "lucide-react";
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

const STEPS = [
  { n: "01", title: "Seek", body: "Type a verse, a story, or a longing — love, mercy, forgiveness, or a name of God." },
  { n: "02", title: "Receive", body: "Open the chapter. Read slowly. Let the Word speak of the Father's heart." },
  { n: "03", title: "Abide", body: "Save the verses that hold you. Return to them when you need grace again." },
];

const FEATURES = [
  { icon: Heart, title: "Rooted in agape", body: "Search the love that gives — God's self-giving love from Genesis to Revelation." },
  { icon: Search, title: "Search by meaning", body: "Find verses on mercy, sacrifice, grace, and hope — by phrase or feeling." },
  { icon: BookOpen, title: "Read every book", body: "The complete King James Bible with scroll and page modes." },
  { icon: Bookmark, title: "Save what matters", body: "Bookmark verses of comfort and conviction." },
  { icon: Moon, title: "Day & night", body: "A calm reading space that switches cleanly between light and dark." },
  { icon: Shield, title: "Private by design", body: "Your searches stay on your device. Sign in only if you want synced saves." },
];

export const Route = createFileRoute("/")({ component: Home });

function LeafMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 21c-1.5-1.2-6-5.2-6-9.5A4.5 4.5 0 0 1 12 7.2 4.5 4.5 0 0 1 18 11.5c0 4.3-4.5 8.3-6 9.5Z" />
      <path d="M12 11.5V7.2" />
    </svg>
  );
}

const card =
  "rounded-3xl border border-white/20 bg-white/90 text-ink shadow-[0_8px_28px_rgba(0,0,0,0.14)] backdrop-blur-md dark:border-white/12 dark:bg-[#1a1c26]/92 dark:text-[#f5f0e8]";

function Home() {
  const rememberQuery = useSeekStore((s) => s.rememberQuery);
  const recent = useSeekStore((s) => s.recent);
  const { user } = useCurrentUserState();
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
    <div className="relative">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
        <img
          src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1920&q=85"
          alt=""
          className="forest-drift"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_35%,transparent_0%,rgba(4,12,8,0.35)_50%,rgba(4,12,8,0.72)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      </div>

      <section className="relative z-10">
        <div className="flex min-h-[88dvh] flex-col items-center justify-center px-6 pt-24 pb-10 text-center sm:min-h-[90dvh]">
          <div className="flex items-center gap-2 text-white/90">
            <LeafMark className="size-5 text-[#9cc49f]" />
            <span className="font-serif text-[1.2rem] tracking-[0.06em]">SEEK</span>
          </div>
          <p className="mt-6 font-sans text-[11px] font-medium tracking-[0.24em] text-white/85 uppercase">
            Love · Mercy · Sacrifice · Agape
          </p>
          <h1 className="mt-3 font-serif text-[2.6rem] leading-[1.12] font-medium tracking-tight text-white drop-shadow-md sm:text-[3.5rem]">
            Look up.<br /><span className="italic">The Word is near.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md font-sans text-[14.5px] leading-relaxed text-white/90">
            The whole King James Bible — search a half-remembered word, a fragment, or the meaning you meant.
          </p>

          <form onSubmit={submit} className="mt-8 w-full max-w-md">
            <div className="relative flex items-center rounded-full bg-white/80 p-1.5 shadow-[0_8px_28px_rgba(0,0,0,0.2)] ring-1 ring-white/35 backdrop-blur-md focus-within:ring-white/55">
              <Search className="pointer-events-none absolute top-1/2 left-5 size-[18px] -translate-y-1/2 text-[#1c1915]/50" strokeWidth={1.8} aria-hidden />
              <label htmlFor="home-search" className="sr-only">Search the Bible</label>
              <input
                id="home-search"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                enterKeyHint="search"
                placeholder="Search love, mercy, a verse…"
                className="h-12 w-full bg-transparent py-3 pr-14 pl-11 font-sans text-[15px] text-[#1c1915] placeholder:text-[#1c1915]/50 focus:outline-none"
              />
              <button type="submit" aria-label="Search" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#1c1915] text-[#f7f5f0] transition-transform active:scale-95">
                <ArrowRight className="size-4" strokeWidth={2.2} />
              </button>
            </div>
          </form>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.q}
                type="button"
                onClick={() => runExample(ex.q)}
                className="rounded-full bg-white/12 px-3.5 py-1.5 font-sans text-[12.5px] text-white/95 ring-1 ring-white/25 backdrop-blur-md transition-colors hover:bg-white/25"
              >
                “{ex.label}”
              </button>
            ))}
          </div>

          <a href="#start" className="mt-10 flex flex-col items-center gap-1.5 text-white/70 transition-colors hover:text-white">
            <span className="font-sans text-[10.5px] tracking-[0.22em] uppercase">Scroll</span>
            <ChevronRight className="size-4 -rotate-90" strokeWidth={1.6} />
          </a>
        </div>
      </section>

      <div id="start" className="relative z-10 scroll-mt-8 px-5 pb-16 sm:px-6">
        <div className="mx-auto w-full max-w-5xl">
          <div className={cn(card, "mx-auto max-w-2xl px-6 py-8 text-center")}>
            <div className="mx-auto flex size-10 items-center justify-center rounded-full border border-forest/30 text-forest">
              <Heart className="size-4" strokeWidth={1.8} fill="currentColor" fillOpacity={0.15} />
            </div>
            <p className="mt-4 font-serif text-[1.35rem] leading-snug sm:text-[1.55rem]">
              “Beloved, let us love one another: for love is of God.”
            </p>
            <p className="mt-2.5 font-sans text-[11px] tracking-[0.16em] text-muted uppercase">1 John 4:7</p>
            <div className="mx-auto mt-8 grid max-w-md grid-cols-4 gap-2 border-t border-line/60 pt-6">
              {STATS.map((s) => (
                <div key={s.label} className="px-1 text-center">
                  <p className="font-serif text-[1.25rem] font-medium tabular-nums">{s.value}</p>
                  <p className="mt-0.5 font-sans text-[10px] tracking-[0.12em] text-muted uppercase">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/read/$book/$chapter"
            params={{ book: FEATURED.book, chapter: FEATURED.chapter }}
            search={{ q: undefined }}
            className={cn(card, "group mt-8 block px-6 py-10 text-center sm:px-10")}
          >
            <span className="inline-flex items-center gap-1.5 text-forest">
              <Heart className="size-3.5" strokeWidth={2} fill="currentColor" />
              <span className="font-sans text-[10px] font-semibold tracking-[0.16em] uppercase">The heart of the Gospel</span>
            </span>
            <p className="mx-auto mt-4 max-w-2xl font-serif text-[1.3rem] leading-snug text-balance sm:text-[1.5rem]">
              “{FEATURED.text}”
            </p>
            <p className="mt-4 inline-flex items-center gap-1 font-sans text-[12.5px] text-muted transition-colors group-hover:text-ink">
              {FEATURED.ref} · Read the chapter <ChevronRight className="size-3.5" />
            </p>
          </Link>

          <section className="mt-16 grid gap-8 lg:grid-cols-12 lg:gap-12">
            <div className={cn(card, "p-6 lg:col-span-5")}>
              <span className="font-sans text-[11px] font-semibold tracking-[0.18em] text-forest">01 · Seek by the heart</span>
              <h2 className="mt-3 font-serif text-[2rem] leading-tight font-medium sm:text-[2.3rem]">What's on your heart?</h2>
              <p className="mt-3 font-sans text-[14px] leading-relaxed text-muted">
                Mercy, grace, hope — or the longing beneath them. SEEK finds the verses that answer the feeling behind the word.
              </p>
              <Link to="/search" search={{ q: "love" }} className="mt-5 inline-flex items-center gap-1.5 font-sans text-[13px] font-semibold text-forest">
                Search a longing <ChevronRight className="size-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:col-span-7">
              {TOPICS.map((t) => (
                <button
                  key={t.q}
                  type="button"
                  onClick={() => runExample(t.q)}
                  className={cn(card, "flex flex-col items-center gap-1.5 px-2 py-4 transition-transform hover:-translate-y-0.5")}
                >
                  <span className="text-xl leading-none">{t.emoji}</span>
                  <span className="font-sans text-[12px] font-medium">{t.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <div className="flex flex-col gap-6 md:flex-row-reverse md:items-end md:justify-between">
              <div className={cn(card, "max-w-xl p-6")}>
                <span className="font-sans text-[11px] font-semibold tracking-[0.18em] text-forest">02 · Read</span>
                <h2 className="mt-3 font-serif text-[2rem] leading-tight font-medium sm:text-[2.3rem]">The whole King James Bible, open to you.</h2>
                <p className="mt-3 font-sans text-[14px] leading-relaxed text-muted">
                  All 66 books, 1,189 chapters, in calm page and scroll modes.
                </p>
              </div>
              <Link to="/books" className="inline-flex shrink-0 items-center gap-1 rounded-full bg-forest px-5 py-2.5 font-sans text-[13px] font-medium text-forest-fg hover:opacity-90">
                All 66 books <ChevronRight className="size-4" />
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 md:grid-cols-6">
              {POPULAR_BOOKS.map((b) => (
                <Link
                  key={b.slug}
                  to="/read/$book/$chapter"
                  params={{ book: b.slug, chapter: "1" }}
                  search={{ q: undefined }}
                  className={cn(card, "px-3 py-4 text-center transition-transform hover:-translate-y-0.5")}
                >
                  <p className="font-serif text-[15px] font-medium">{b.name}</p>
                  <p className="mt-1 font-sans text-[11px] text-muted">{b.chapters} chapters</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <div className={cn(card, "max-w-xl p-6")}>
              <span className="font-sans text-[11px] font-semibold tracking-[0.18em] text-forest">03 · How it works</span>
              <h2 className="mt-3 font-serif text-[2rem] leading-tight font-medium sm:text-[2.3rem]">Seek. Receive. Abide.</h2>
              <p className="mt-3 font-sans text-[14px] leading-relaxed text-muted">
                Three movements from a longing to the Word that stays with you.
              </p>
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {STEPS.map((s) => (
                <div key={s.n} className={cn(card, "p-6")}>
                  <span className="font-sans text-[12px] font-semibold tracking-[0.18em] text-forest">{s.n}</span>
                  <p className="mt-3 font-serif text-[1.25rem]">{s.title}</p>
                  <p className="mt-2 font-sans text-[13.5px] leading-relaxed text-muted">{s.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <div className="flex flex-col gap-6 md:flex-row-reverse md:items-end md:justify-between">
              <div className={cn(card, "max-w-xl p-6")}>
                <span className="font-sans text-[11px] font-semibold tracking-[0.18em] text-forest">04 · Why Seek</span>
                <h2 className="mt-3 font-serif text-[2rem] leading-tight font-medium sm:text-[2.3rem]">A quiet place for the Gospel.</h2>
                <p className="mt-3 font-sans text-[14px] leading-relaxed text-muted">
                  Everything built to point you to Him, nothing to get in the way.
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className={cn(card, "p-5")}>
                    <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-forest/10 text-forest">
                      <Icon className="size-[18px]" strokeWidth={1.8} />
                    </span>
                    <p className="mt-4 font-serif text-[1.1rem]">{f.title}</p>
                    <p className="mt-1.5 font-sans text-[13px] leading-relaxed text-muted">{f.body}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {recent.length > 0 && (
            <section className={cn(card, "mt-12 p-5")}>
              <div className="flex items-center gap-1.5 text-muted">
                <Clock className="size-3.5" strokeWidth={2} />
                <span className="font-sans text-[10px] font-semibold tracking-[0.14em] uppercase">Recent searches</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {recent.map((q) => (
                  <button key={q} type="button" onClick={() => runExample(q)} className="rounded-full border border-line px-3.5 py-1.5 font-sans text-[13px] hover:bg-wash">
                    {q}
                  </button>
                ))}
              </div>
            </section>
          )}

          <section className={cn(card, "mt-16 px-8 py-10 text-center")}>
            <h2 className="font-serif text-[1.8rem] font-medium tracking-tight">Come and see</h2>
            <p className="mx-auto mt-2 max-w-md font-sans text-[14px] leading-relaxed text-muted">
              Open the King James Bible. Search the love of God, His mercy, and the sacrifice of Christ.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
              <Link to="/books" className="inline-flex h-10 items-center rounded-full bg-ink px-6 font-sans text-[13px] font-medium text-paper dark:bg-[#f5f0e8] dark:text-[#0c0d12]">
                Browse books
              </Link>
              {!user && (
                <Link to="/login" search={{ redirect: "/" }} className="inline-flex h-10 items-center rounded-full border border-line px-6 font-sans text-[13px] font-medium">
                  Sign in to save
                </Link>
              )}
            </div>
          </section>

          <section id="about" className={cn(card, "mt-10 p-6 sm:p-8")}>
            <p className="font-sans text-[11px] font-semibold tracking-[0.12em] text-muted uppercase">About SEEK</p>
            <h2 className="mt-2 font-serif text-[1.5rem] font-medium">Built to point you to Him</h2>
            <p className="mt-3 max-w-2xl font-sans text-[14px] leading-relaxed text-muted">
              SEEK is a quiet place to search and read the King James Bible — the love of God, His mercy toward sinners, the sacrifice of Christ, and the agape that never ends. Scripture text is public domain.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-line/60 bg-wash/50 p-4">
                <p className="font-sans text-[11px] font-semibold tracking-wide text-forest uppercase">Contact</p>
                <p className="mt-1.5 font-sans text-[14px]">
                  <a href={`mailto:${CONTACT_EMAIL}`} className="underline-offset-2 hover:underline">{CONTACT_EMAIL}</a>
                </p>
              </div>
              <div className="rounded-2xl border border-line/60 bg-wash/50 p-4">
                <p className="font-sans text-[11px] font-semibold tracking-wide text-forest uppercase">Report a bug</p>
                <p className="mt-1.5 font-sans text-[14px]">
                  <a href={`mailto:${CONTACT_EMAIL}?subject=SEEK%20bug%20report`} className="underline-offset-2 hover:underline">
                    Send a bug report
                  </a>
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-1 border-t border-line/60 pt-4 font-sans text-[12px] text-muted">
              <p>Scripture text: King James Version (public domain).</p>
              <p>© {new Date().getFullYear()} SEEK · Design and software rights reserved.</p>
            </div>
          </section>

          <footer className="mt-10 border-t border-white/20 pt-6 pb-2">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex items-center gap-2 text-white">
                <LeafMark className="size-4 text-[#9cc49f]" />
                <span className="font-serif text-[1.05rem] tracking-[0.04em]">SEEK</span>
              </div>
              <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1 font-sans text-[13px] text-white/80">
                <Link to="/books" className="hover:text-white">Bible</Link>
                <Link to="/saved" className="hover:text-white">Saved</Link>
                <a href="#about" className="hover:text-white">About</a>
                <a href={`mailto:${CONTACT_EMAIL}?subject=SEEK%20bug%20report`} className="hover:text-white">Report a bug</a>
              </nav>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
