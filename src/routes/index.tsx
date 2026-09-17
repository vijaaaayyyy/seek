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
  { q: "love of God", label: "Love", emoji: "❤️", line: "He first loved us.", ref: "1 Jn 4:19", tint: "from-rose-200/70 to-orange-100/40" },
  { q: "mercy", label: "Mercy", emoji: "🕊️", line: "His mercy endureth for ever.", ref: "Ps 136:1", tint: "from-sky-200/70 to-indigo-100/40" },
  { q: "grace", label: "Grace", emoji: "✨", line: "By grace are ye saved.", ref: "Eph 2:8", tint: "from-violet-200/70 to-fuchsia-100/40" },
  { q: "sacrifice", label: "Sacrifice", emoji: "✝️", line: "He gave His only Son.", ref: "Jn 3:16", tint: "from-amber-200/70 to-yellow-100/40" },
  { q: "forgiveness", label: "Forgiveness", emoji: "🤝", line: "Cleanse us from our sins.", ref: "1 Jn 1:9", tint: "from-teal-200/70 to-emerald-100/40" },
  { q: "hope", label: "Hope", emoji: "🌅", line: "An anchor of the soul.", ref: "Heb 6:19", tint: "from-cyan-200/70 to-blue-100/40" },
  { q: "peace", label: "Peace", emoji: "🌿", line: "That passeth understanding.", ref: "Phil 4:7", tint: "from-green-200/70 to-lime-100/40" },
  { q: "faith", label: "Faith", emoji: "🙏", line: "Substance of things hoped for.", ref: "Heb 11:1", tint: "from-orange-200/70 to-amber-100/40" },
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

export const Route = createFileRoute("/")({ component: Home });

function LeafMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 21c-1.5-1.2-6-5.2-6-9.5A4.5 4.5 0 0 1 12 7.2 4.5 4.5 0 0 1 18 11.5c0 4.3-4.5 8.3-6 9.5Z" />
      <path d="M12 11.5V7.2" />
    </svg>
  );
}

const tile =
  "rounded-3xl bg-surface p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:bg-white/[0.03]";
const linkTile =
  "rounded-3xl bg-surface p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(0,0,0,0.09)] dark:bg-white/[0.03] dark:hover:bg-white/5";

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
    <div className="relative bg-paper">
      <div
        className="forest-melt pointer-events-none absolute inset-x-0 top-0 z-0 h-[calc(100dvh+16rem)] overflow-hidden sm:h-[calc(100dvh+20rem)]"
        aria-hidden
      >
        <img
          src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="forest-drift"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/58 via-black/32 via-[46%] to-transparent" />
      </div>

      <section className="relative z-10">
        <div className="flex min-h-[84dvh] flex-col items-center justify-center px-6 pt-24 pb-8 text-center sm:min-h-[86dvh]">
          <div className="flex items-center gap-2 text-white/90">
            <LeafMark className="size-5 text-[#9cc49f]" />
            <span className="font-serif text-[1.2rem] tracking-[0.06em]">SEEK</span>
          </div>
          <p className="mt-6 font-sans text-[11px] font-medium tracking-[0.24em] text-white/80 uppercase">Love · Mercy · Sacrifice · Agape</p>
          <h1 className="mt-3 font-serif text-[2.6rem] leading-[1.12] font-medium tracking-tight text-white drop-shadow-md sm:text-[3.4rem]">
            Look up.<br /><span className="italic">The Word is near.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md font-sans text-[14.5px] leading-relaxed text-white/85">
            The whole King James Bible — search a half-remembered word, a fragment, or the meaning you meant.
          </p>

          <form onSubmit={submit} className="mt-8 w-full max-w-md">
            <div className="relative flex items-center rounded-full bg-white/95 p-1.5 shadow-[0_8px_28px_rgba(0,0,0,0.28)] ring-1 ring-white/30 focus-within:ring-white/50">
              <Search className="pointer-events-none absolute top-1/2 left-5 size-[18px] -translate-y-1/2 text-[#1c1915]/45" strokeWidth={1.8} aria-hidden />
              <label htmlFor="home-search" className="sr-only">Search the Bible</label>
              <input
                id="home-search"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                enterKeyHint="search"
                placeholder="Search love, mercy, a verse…"
                className="h-12 w-full bg-transparent py-3 pr-16 pl-11 font-sans text-[15px] text-[#1c1915] placeholder:text-[#1c1915]/55 focus:outline-none"
              />
              <button type="submit" aria-label="Search" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ink text-paper transition-transform active:scale-95">
                <ArrowRight className="size-4" strokeWidth={2.2} />
              </button>
            </div>
          </form>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {EXAMPLES.map((ex) => (
              <button key={ex.q} type="button" onClick={() => runExample(ex.q)} className="rounded-full bg-white/12 px-3.5 py-1.5 font-sans text-[12.5px] text-white/95 ring-1 ring-white/25 backdrop-blur-md transition-colors hover:bg-white/25">
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

      <div id="start" className="relative z-10 scroll-mt-8">
        <div className="mx-auto w-full max-w-5xl px-5 pt-2 pb-10 sm:px-6 sm:pt-4">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto flex size-10 items-center justify-center rounded-full border border-forest/25 text-forest">
              <Heart className="size-4" strokeWidth={1.8} fill="currentColor" fillOpacity={0.15} />
            </div>
            <p className="mt-4 font-serif text-[1.35rem] leading-snug text-ink sm:text-[1.55rem]">
              “Beloved, let us love one another: for love is of God.”
            </p>
            <p className="mt-2.5 font-sans text-[11px] tracking-[0.16em] text-muted uppercase">1 John 4:7</p>
          </div>

          <div className="mx-auto mt-12 grid max-w-2xl grid-cols-4 divide-x divide-line/70">
            {STATS.map((s) => (
              <div key={s.label} className="px-2 text-center">
                <p className="font-serif text-[1.4rem] font-medium text-ink tabular-nums">{s.value}</p>
                <p className="mt-0.5 font-sans text-[10px] tracking-[0.14em] text-muted uppercase">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative bg-paper">
          <div className="mx-auto w-full max-w-5xl px-5 pb-20 sm:px-6">
            <section className="mt-8">
              <Link
                to="/read/$book/$chapter"
                params={{ book: FEATURED.book, chapter: FEATURED.chapter }}
                search={{ q: undefined }}
                className="group relative block overflow-hidden rounded-3xl bg-gradient-to-br from-forest/8 via-transparent to-transparent px-6 pt-10 pb-8 text-center sm:px-10"
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
            </section>

            <section className="mt-28">
              <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
                <div className="lg:col-span-5">
                  <span className="font-sans text-[11px] font-semibold tracking-[0.18em] text-forest">01 · Seek by the heart</span>
                  <h2 className="mt-4 font-serif text-[2.1rem] leading-[1.12] font-medium text-ink sm:text-[2.6rem]">What's on your heart?</h2>
                  <p className="mt-3 font-sans text-[14px] leading-relaxed text-muted">
                    Mercy, grace, hope — or the longing beneath them. SEEK finds the verses that answer the feeling behind the word.
                  </p>
                  <Link to="/search" search={{ q: "love" }} className="mt-5 inline-flex items-center gap-1.5 font-sans text-[13px] font-semibold text-forest">
                    Search a longing <ChevronRight className="size-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-3 lg:col-span-7">
                  {TOPICS.map((t) => (
                    <button
                      key={t.q}
                      type="button"
                      onClick={() => runExample(t.q)}
                      className="group relative flex flex-col items-start overflow-hidden rounded-3xl bg-surface p-4 text-left shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-1 dark:bg-white/[0.03] sm:p-5"
                    >
                      <span aria-hidden className={cn("pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b", t.tint)} />
                      <span className="relative text-xl">{t.emoji}</span>
                      <span className="relative mt-3 font-serif text-[1.1rem] font-medium text-ink">{t.label}</span>
                      <span className="relative mt-0.5 font-sans text-[11.5px] text-muted">{t.line}</span>
                      <span className="relative mt-2 font-sans text-[10px] font-semibold tracking-[0.14em] text-forest/80 uppercase">{t.ref}</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="mt-24">
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl">
                  <span className="font-sans text-[11px] font-semibold tracking-[0.18em] text-forest">02 · Read</span>
                  <h2 className="mt-4 font-serif text-[2.1rem] font-medium text-ink sm:text-[2.6rem]">The whole King James Bible, open to you.</h2>
                  <p className="mt-3 max-w-md font-sans text-[14px] text-muted">All 66 books, 1,189 chapters, in calm page and scroll modes.</p>
                </div>
                <Link to="/books" className="inline-flex items-center gap-1 rounded-full bg-forest px-5 py-2.5 font-sans text-[13px] font-medium text-forest-fg">
                  All 66 books <ChevronRight className="size-4" />
                </Link>
              </div>
              <div className="mt-9 grid grid-cols-3 gap-3 md:grid-cols-6">
                {POPULAR_BOOKS.map((b) => (
                  <Link key={b.slug} to="/read/$book/$chapter" params={{ book: b.slug, chapter: "1" }} search={{ q: undefined }} className={cn(linkTile, "px-3 py-4 text-center")}>
                    <p className="font-serif text-[15px] font-medium">{b.name}</p>
                    <p className="mt-1 font-sans text-[11px] text-muted">{b.chapters} chapters</p>
                  </Link>
                ))}
              </div>
            </section>

            <section className="mt-24">
              <span className="font-sans text-[11px] font-semibold tracking-[0.18em] text-forest">03 · How it works</span>
              <h2 className="mt-4 font-serif text-[2.1rem] font-medium text-ink sm:text-[2.6rem]">Seek. Receive. Abide.</h2>
              <div className="mt-9 grid gap-3 md:grid-cols-3">
                {STEPS.map((s) => (
                  <div key={s.n} className={cn(linkTile, "p-6")}>
                    <span className="font-sans text-[12px] font-semibold tracking-[0.18em] text-forest">{s.n}</span>
                    <p className="mt-3 font-serif text-[1.25rem]">{s.title}</p>
                    <p className="mt-2 font-sans text-[13.5px] text-muted">{s.body}</p>
                  </div>
                ))}
              </div>
            </section>

            {recent.length > 0 && (
              <section className="mt-16">
                <div className="flex items-center gap-1.5 text-muted">
                  <Clock className="size-3.5" />
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

            <section className="mt-16 rounded-3xl bg-surface px-8 py-10 text-center dark:bg-white/[0.03]">
              <h2 className="font-serif text-[1.8rem] font-medium">Come and see</h2>
              <p className="mx-auto mt-2 max-w-md font-sans text-[14px] text-muted">Open the King James Bible. Search the love of God, His mercy, and the sacrifice of Christ.</p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
                <Link to="/books" className="inline-flex h-10 items-center rounded-full bg-ink px-6 font-sans text-[13px] font-medium text-paper dark:bg-[#f5f0e8] dark:text-[#0c0d12]">Browse books</Link>
                {!user && (
                  <Link to="/login" search={{ redirect: "/" }} className="inline-flex h-10 items-center rounded-full border border-line px-6 font-sans text-[13px] font-medium">Sign in to save</Link>
                )}
              </div>
            </section>

            <footer id="about" className="relative mt-20 overflow-hidden border-t border-line/60 pt-16 pb-8">
              {/* Half-visible SEEK fade */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden select-none"
              >
                <span className="translate-y-[42%] font-serif text-[clamp(5.5rem,22vw,11rem)] leading-none font-medium tracking-[0.04em] text-ink/[0.06] dark:text-paper/[0.07]">
                  SEEK
                </span>
              </div>

              <div className="relative z-10 mx-auto flex max-w-lg flex-col items-center text-center">
                <div className="flex items-center gap-2 text-forest">
                  <LeafMark className="size-4" />
                  <span className="font-serif text-[1.15rem] tracking-[0.06em] text-ink">SEEK</span>
                </div>

                <p className="mt-5 max-w-sm font-sans text-[14px] leading-relaxed text-muted">
                  A quiet place to search and read the King James Bible — the love of God, His mercy, the sacrifice of Christ, and agape.
                </p>

                <nav className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-sans text-[13px] text-ink/80">
                  <Link to="/books" className="transition-colors hover:text-forest">Bible</Link>
                  <Link to="/saved" className="transition-colors hover:text-forest">Saved</Link>
                  <Link to="/download" className="transition-colors hover:text-forest">Download</Link>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="transition-colors hover:text-forest">Contact</a>
                  <a href={`mailto:${CONTACT_EMAIL}?subject=SEEK%20bug%20report`} className="transition-colors hover:text-forest">Report a bug</a>
                </nav>

                <p className="mt-4 font-sans text-[13px] text-muted">
                  <a href={`mailto:${CONTACT_EMAIL}`} className="underline-offset-4 hover:underline">{CONTACT_EMAIL}</a>
                </p>

                <p className="mt-8 font-sans text-[11.5px] tracking-[0.04em] text-muted/80">
                  © {new Date().getFullYear()} SEEK · KJV public domain
                </p>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
