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

function SectionHeader({ label, title, sub }: { label: string; title: string; sub?: string }) {
  return (
    <div className="text-center">
      <span className="inline-flex items-center gap-2">
        <span className="h-px w-6 bg-forest/40" aria-hidden />
        <span className="font-sans text-[11px] font-semibold tracking-[0.18em] text-forest uppercase">{label}</span>
        <span className="h-px w-6 bg-forest/40" aria-hidden />
      </span>
      <h2 className="mt-3 font-serif text-[1.7rem] leading-tight font-medium tracking-tight text-ink sm:text-[2rem]">{title}</h2>
      {sub && <p className="mx-auto mt-2 max-w-md font-sans text-[13.5px] leading-relaxed text-muted">{sub}</p>}
    </div>
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
      {/* Forest spans the hero and first content so the photo dissolves into the page */}
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

      {/* First block sits in the forest melt — no hard cream cut */}
      <div id="start" className="relative z-10 scroll-mt-8">
        <div className="mx-auto w-full max-w-5xl px-5 pt-2 pb-10 sm:px-6 sm:pt-4">
          {/* The heart of the Gospel */}
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto flex size-10 items-center justify-center rounded-full border border-forest/25 text-forest">
              <Heart className="size-4" strokeWidth={1.8} fill="currentColor" fillOpacity={0.15} />
            </div>
            <p className="mt-4 font-serif text-[1.35rem] leading-snug text-ink sm:text-[1.55rem]">
              “Beloved, let us love one another: for love is of God.”
            </p>
            <p className="mt-2.5 font-sans text-[11px] tracking-[0.16em] text-muted uppercase">1 John 4:7</p>
          </div>

          {/* Stats — quiet row */}
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
        <div className="mx-auto w-full max-w-5xl px-5 pb-6 sm:px-6">
          {/* The heart of the Gospel — featured verse */}
          <section className="mt-8">
            <Link
              to="/read/$book/$chapter"
              params={{ book: FEATURED.book, chapter: FEATURED.chapter }}
              search={{ q: undefined }}
              className="group relative block overflow-hidden rounded-3xl bg-gradient-to-br from-forest/8 via-transparent to-transparent px-6 pt-10 pb-8 text-center sm:px-10"
            >
              <span aria-hidden className="pointer-events-none absolute top-1 left-4 font-serif text-[4.5rem] leading-none text-forest/15 select-none">“</span>
              <span aria-hidden className="pointer-events-none absolute -bottom-6 right-4 font-serif text-[4.5rem] leading-none text-forest/15 select-none">”</span>
              <span className="inline-flex items-center gap-1.5 text-forest">
                <Heart className="size-3.5" strokeWidth={2} fill="currentColor" />
                <span className="font-sans text-[10px] font-semibold tracking-[0.16em] uppercase">The heart of the Gospel</span>
              </span>
              <p className="mx-auto mt-4 max-w-2xl font-serif text-[1.3rem] leading-snug text-balance sm:text-[1.5rem]">
                “{FEATURED.text}”
              </p>
              <p className="mt-4 inline-flex items-center gap-1 font-sans text-[12.5px] text-muted transition-colors group-hover:text-ink">
                {FEATURED.ref} · Read the chapter <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </p>
            </Link>
          </section>

          {/* 01 · Seek by the heart — text left, topics right */}
          <section className="mt-28">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
                <span className="inline-flex items-center gap-2.5">
                  <span className="font-sans text-[11px] font-semibold tracking-[0.18em] text-forest">01 · Seek by the heart</span>
                  <span className="h-px w-8 bg-forest/30" aria-hidden />
                </span>
                <h2 className="mt-4 font-serif text-[2.1rem] leading-[1.12] font-medium tracking-tight text-balance text-ink sm:text-[2.6rem]">What's on your heart?</h2>
                <p className="mt-3 font-sans text-[14px] leading-relaxed text-muted">
                  Mercy, grace, hope — or the longing beneath them. SEEK finds the verses that answer the feeling behind the word.
                </p>
                <ul className="mt-6 space-y-1">
                  {[
                    { t: "Mercy", q: "mercy" },
                    { t: "Grace", q: "grace" },
                    { t: "Hope", q: "hope" },
                  ].map((item) => (
                    <li key={item.q}>
                      <button
                        type="button"
                        onClick={() => runExample(item.q)}
                        className="group/link flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left font-sans text-[14px] text-ink/80 transition-colors hover:bg-ink/5 dark:hover:bg-paper/8"
                      >
                        {item.t}
                        <ChevronRight className="size-4 text-muted transition-all group-hover/link:translate-x-0.5 group-hover/link:text-forest" />
                      </button>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/search"
                  search={{ q: "love" }}
                  className="mt-5 inline-flex items-center gap-1.5 font-sans text-[13px] font-semibold text-forest transition-opacity hover:opacity-80"
                >
                  Search a longing <ChevronRight className="size-4" />
                </Link>
              </div>

              <div className="lg:col-span-7">
                <div className="grid grid-cols-2 gap-3">
                  {/* Featured topic cards — wide, tonal, editorial */}
                  {TOPICS.slice(0, 2).map((t, i) => (
                    <button
                      key={t.q}
                      type="button"
                      onClick={() => runExample(t.q)}
                      className={cn(
                        "group relative col-span-2 flex min-h-[150px] flex-col justify-end overflow-hidden rounded-3xl p-5 text-left transition-all duration-300 hover:shadow-[0_18px_50px_rgba(0,0,0,0.12)]",
                        i === 0
                          ? "bg-[linear-gradient(160deg,#fbdccd_0%,#f3b8a8_55%,#e49b8d_100%)] dark:bg-[linear-gradient(160deg,#8a4a42_0%,#a85a4a_60%,#c4765f_100%)]"
                          : "bg-[linear-gradient(160deg,#d6e4f2_0%,#b3cbe6_55%,#91b0d6_100%)] dark:bg-[linear-gradient(160deg,#3b5068_0%,#46617e_60%,#5b7fa3_100%)]",
                      )}
                    >
                      <span
                        aria-hidden
                        className="pointer-events-none absolute -top-5 -right-2 font-serif text-[7rem] leading-none opacity-20 transition-transform duration-500 select-none group-hover:scale-110 sm:text-[8rem]"
                      >
                        {t.emoji}
                      </span>
                      <span className="relative flex items-center gap-2.5">
                        <span
                          aria-hidden
                          className="h-px w-5 transition-all duration-300 group-hover:w-8"
                          style={{ backgroundColor: i === 0 ? "#8c3a2e" : "#2f4f6e" }}
                        />
                        <span className="font-sans text-[10px] font-semibold tracking-[0.16em] uppercase" style={{ color: i === 0 ? "#8c3a2e" : "#2f4f6e" }}>
                          {t.line}
                        </span>
                      </span>
                      <span className="relative mt-2 flex items-end justify-between gap-3">
                        <span className={cn("font-serif text-[1.9rem] leading-none font-medium tracking-tight", i === 0 ? "text-[#5c241b]" : "text-[#1c3245]")}>
                          {t.label}
                        </span>
                        <span className="flex items-center gap-1.5 font-sans text-[12px] font-semibold uppercase" style={{ color: i === 0 ? "#5c241b" : "#1c3245" }}>
                          {t.ref}
                          <ChevronRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </span>
                      </span>
                    </button>
                  ))}

                  {/* Compact topic tiles */}
                  {TOPICS.slice(2).map((t) => (
                    <button
                      key={t.q}
                      type="button"
                      onClick={() => runExample(t.q)}
                      className="group relative flex flex-col items-start overflow-hidden rounded-3xl bg-surface p-4 text-left shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(0,0,0,0.09)] dark:bg-white/[0.03] dark:hover:bg-white/5 sm:p-5"
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b opacity-90 transition-opacity duration-300 group-hover:opacity-100",
                          t.tint,
                        )}
                      />
                      <span className="relative flex size-9 items-center justify-center rounded-xl bg-white/75 text-base leading-none shadow-sm ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-110 dark:bg-black/30 dark:ring-white/10">
                        {t.emoji}
                      </span>
                      <span className="relative mt-auto pt-5">
                        <span className="block font-serif text-[1.1rem] font-medium text-ink">{t.label}</span>
                        <span className="mt-0.5 block font-sans text-[11.5px] leading-snug text-muted">{t.line}</span>
                        <span className="mt-2 block font-sans text-[10px] font-semibold tracking-[0.14em] text-forest/80 uppercase">
                          {t.ref}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 02 · Read */}
          <section className="mt-24">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2.5">
                  <span className="font-sans text-[11px] font-semibold tracking-[0.18em] text-forest">02 · Read</span>
                  <span className="h-px w-8 bg-forest/30" aria-hidden />
                </span>
                <h2 className="mt-4 font-serif text-[2.1rem] leading-[1.12] font-medium tracking-tight text-balance text-ink sm:text-[2.6rem]">The whole King James Bible, open to you.</h2>
                <p className="mt-3 max-w-md font-sans text-[14px] leading-relaxed text-muted">
                  All 66 books, 1,189 chapters, in calm page and scroll modes. Start with the books of love and mercy.
                </p>
              </div>
              <Link to="/books" className="inline-flex shrink-0 items-center gap-1 self-start rounded-full bg-forest px-5 py-2.5 font-sans text-[13px] font-medium text-forest-fg transition-opacity hover:opacity-85 md:self-auto">
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

          {/* 03 · How it works */}
          <section className="mt-24">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2.5">
                  <span className="font-sans text-[11px] font-semibold tracking-[0.18em] text-forest">03 · How it works</span>
                  <span className="h-px w-8 bg-forest/30" aria-hidden />
                </span>
                <h2 className="mt-4 font-serif text-[2.1rem] leading-[1.12] font-medium tracking-tight text-balance text-ink sm:text-[2.6rem]">Seek. Receive. Abide.</h2>
                <p className="mt-3 max-w-md font-sans text-[14px] leading-relaxed text-muted">
                  Three movements that take you from a longing to the Word that stays with you.
                </p>
              </div>
            </div>
            <div className="mt-9 grid gap-3 md:grid-cols-3">
              {STEPS.map((s) => (
                <div key={s.n} className={cn(linkTile, "p-6")}>
                  <span className="font-sans text-[12px] font-semibold tracking-[0.18em] text-forest">{s.n}</span>
                  <p className="mt-3 font-serif text-[1.25rem]">{s.title}</p>
                  <p className="mt-2 font-sans text-[13.5px] leading-relaxed text-muted">{s.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 04 · Why Seek */}
          <section className="mt-24">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2.5">
                  <span className="font-sans text-[11px] font-semibold tracking-[0.18em] text-forest">04 · Why Seek</span>
                  <span className="h-px w-8 bg-forest/30" aria-hidden />
                </span>
                <h2 className="mt-4 font-serif text-[2.1rem] leading-[1.12] font-medium tracking-tight text-balance text-ink sm:text-[2.6rem]">A quiet place for the Gospel.</h2>
                <p className="mt-3 max-w-md font-sans text-[14px] leading-relaxed text-muted">
                  Everything built to point you to Him, nothing to get in the way.
                </p>
              </div>
            </div>
            <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Heart, title: "Rooted in agape", body: "Search the love that gives — God's self-giving love revealed in Scripture from Genesis to Revelation." },
                { icon: Search, title: "Search by meaning", body: "Find verses on mercy, sacrifice, grace, and hope — by phrase, topic, or the feeling on your heart." },
                { icon: BookOpen, title: "Read every book", body: "The complete King James Bible with scroll and page modes, so you can dwell in the Word." },
                { icon: Bookmark, title: "Save what matters", body: "Bookmark verses of comfort and conviction. Keep them close when you need them most." },
                { icon: Moon, title: "Day & night", body: "A calm reading space that switches cleanly between light and dark." },
                { icon: Shield, title: "Private by design", body: "Your searches stay on your device. Sign in only if you want synced saves." },
              ].map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className={cn(tile, "p-5")}>
                    <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-forest/10 text-forest"><Icon className="size-[18px]" strokeWidth={1.8} /></span>
                    <p className="mt-4 font-serif text-[1.1rem]">{f.title}</p>
                    <p className="mt-1.5 font-sans text-[13px] leading-relaxed text-muted">{f.body}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Recent searches */}
          {recent.length > 0 && (
            <section className="mt-12">
              <div className="flex items-center gap-1.5 text-muted">
                <Clock className="size-3.5" strokeWidth={2} />
                <span className="font-sans text-[10px] font-semibold tracking-[0.14em] uppercase">Recent searches</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {recent.map((q) => (
                  <button key={q} type="button" onClick={() => runExample(q)} className="rounded-full border border-line bg-surface px-3.5 py-1.5 font-sans text-[13px] transition-colors hover:border-ink/25 hover:bg-white dark:hover:bg-white/5">
                    {q}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <section className="mt-20 text-center">
            <div className="rounded-3xl bg-gradient-to-b from-forest/8 to-transparent p-8 sm:p-12">
              <h2 className="font-serif text-[1.8rem] font-medium tracking-tight">COME & SEE</h2>
              <p className="mx-auto mt-2 max-w-md font-sans text-[14px] leading-relaxed text-muted">Open the King James Bible. Search the love of God, His mercy, and the sacrifice of Christ — and keep the verses that hold you.</p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
                <Link to="/books" className="inline-flex h-10 items-center rounded-full bg-ink px-6 font-sans text-[13px] font-medium text-paper transition-transform hover:scale-[1.02] active:scale-95 dark:bg-[#f5f0e8] dark:text-[#0c0d12]">Browse books</Link>
                {!user && (
                  <Link to="/login" search={{ redirect: "/" }} className="inline-flex h-10 items-center rounded-full border border-line bg-surface px-6 font-sans text-[13px] font-medium transition-colors hover:border-ink/25 hover:bg-white dark:hover:bg-white/5">Sign in to save</Link>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* About */}
        <div className="mx-auto w-full max-w-5xl px-5 pb-6 sm:px-6">
          <section id="about" className="mt-6 rounded-2xl border border-line bg-surface p-6 sm:p-8">
            <span className="inline-flex items-center gap-2">
              <span className="h-px w-6 bg-forest/40" aria-hidden />
              <span className="font-sans text-[11px] font-semibold tracking-[0.18em] text-forest uppercase">About SEEK</span>
            </span>
            <h2 className="mt-3 font-serif text-[1.4rem] font-medium tracking-tight">Built to point you to Him</h2>
            <p className="mt-3 max-w-2xl font-sans text-[14px] leading-relaxed text-muted">SEEK is a quiet place to search and read the King James Bible — the love of God, His mercy toward sinners, the sacrifice of Christ, and the agape that never ends. Scripture text is public domain. SEEK is independent and not affiliated with any denomination.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-wash p-4">
                <p className="font-sans text-[10px] font-semibold tracking-[0.14em] text-forest uppercase">Contact</p>
                <p className="mt-1.5 font-sans text-[14px]"><a href={`mailto:${CONTACT_EMAIL}`} className="underline-offset-2 hover:underline">{CONTACT_EMAIL}</a></p>
              </div>
              <div className="rounded-xl bg-wash p-4">
                <p className="font-sans text-[10px] font-semibold tracking-[0.14em] text-forest uppercase">Report a bug</p>
                <p className="mt-1.5 font-sans text-[14px]"><a href={`mailto:${CONTACT_EMAIL}?subject=SEEK%20bug%20report`} className="underline-offset-2 hover:underline">Send a bug report</a></p>
              </div>
            </div>
            <div className="mt-5 space-y-1 border-t border-line/70 pt-4 font-sans text-[12px] text-muted">
              <p>Scripture text: King James Version (public domain).</p>
              <p>© {new Date().getFullYear()} SEEK · Design and software rights reserved.</p>
            </div>
          </section>
        </div>

        {/* ── FULL-WIDTH ANTIQUE PARCHMENT FOOTER ── */}
        <footer className="relative mt-10 overflow-hidden border-t border-[#8a764f]/25 bg-[#e7d8b7]">
          <img
            src="/footer-parchment.jpg"
            alt=""
            loading="lazy"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top opacity-45 mix-blend-multiply"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(255,250,235,0.55)_0%,transparent_55%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_115%,rgba(138,106,58,0.25)_0%,transparent_60%)]"
          />
          <div className="relative mx-auto w-full max-w-6xl px-6 pt-16 pb-4 text-center sm:px-8 sm:pt-20">
            {/* Brand + tagline + CTAs */}
            <a href="#top" aria-label="SEEK home" className="inline-flex items-center justify-center gap-2">
              <span className="flex size-11 items-center justify-center rounded-full border border-[#4a3a20]/25 bg-[#f6eeda]">
                <LeafMark className="size-5 text-[#5b7a4e]" />
              </span>
              <span className="font-serif text-[1.3rem] tracking-[0.05em] text-[#32291a]">SEEK</span>
            </a>
            <p className="mx-auto mt-6 max-w-xs font-sans text-[14px] leading-relaxed text-[#5a4b30]/85">
              A quiet place to search and read the King James Bible.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/books"
                className="inline-flex h-11 items-center rounded-full bg-[#32291a] px-6 font-sans text-[13px] font-medium text-[#f6eeda] transition-opacity hover:opacity-85"
              >
                Browse books
              </Link>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=SEEK%20demo`}
                className="inline-flex h-11 items-center rounded-full border border-[#32291a]/35 px-6 font-sans text-[13px] font-medium text-[#32291a] transition-colors hover:bg-[#32291a]/10"
              >
                Book a demo
              </a>
            </div>

            {/* Link columns — centered */}
            <div className="mt-12 flex flex-wrap items-start justify-center gap-x-12 gap-y-10">
              <div className="min-w-[8rem]">
                <h3 className="font-sans text-[14px] font-medium tracking-tight text-[#32291a]/90">Product</h3>
                <ul className="mt-4 space-y-3">
                  <li><a href="#about" className="font-sans text-[13px] text-[#5a4b30] transition-colors hover:text-[#32291a]">Overview</a></li>
                  <li><Link to="/search" search={{ q: "love" }} className="font-sans text-[13px] text-[#5a4b30] transition-colors hover:text-[#32291a]">Search</Link></li>
                  <li><Link to="/books" className="font-sans text-[13px] text-[#5a4b30] transition-colors hover:text-[#32291a]">Books</Link></li>
                  <li><Link to="/saved" className="font-sans text-[13px] text-[#5a4b30] transition-colors hover:text-[#32291a]">Saved</Link></li>
                </ul>
              </div>
              <div className="min-w-[8rem]">
                <h3 className="font-sans text-[14px] font-medium tracking-tight text-[#32291a]/90">Menu</h3>
                <ul className="mt-4 space-y-3">
                  <li><Link to="/pricing" className="font-sans text-[13px] text-[#5a4b30] transition-colors hover:text-[#32291a]">Pricing</Link></li>
                  <li><Link to="/faq" className="font-sans text-[13px] text-[#5a4b30] transition-colors hover:text-[#32291a]">FAQ</Link></li>
                  <li><Link to="/changelog" className="font-sans text-[13px] text-[#5a4b30] transition-colors hover:text-[#32291a]">Changelog</Link></li>
                  <li><Link to="/demo" className="font-sans text-[13px] text-[#5a4b30] transition-colors hover:text-[#32291a]">Book a demo</Link></li>
                </ul>
              </div>
              <div className="min-w-[8rem]">
                <h3 className="font-sans text-[14px] font-medium tracking-tight text-[#32291a]/90">Legal</h3>
                <ul className="mt-4 space-y-3">
                  <li><Link to="/privacy" className="font-sans text-[13px] text-[#5a4b30] transition-colors hover:text-[#32291a]">Privacy Notice</Link></li>
                  <li><Link to="/terms" className="font-sans text-[13px] text-[#5a4b30] transition-colors hover:text-[#32291a]">Terms of Use</Link></li>
                  <li><Link to="/report-bug" className="font-sans text-[13px] text-[#5a4b30] transition-colors hover:text-[#32291a]">Report a bug</Link></li>
                </ul>
              </div>
              <div className="min-w-[8rem]">
                <h3 className="font-sans text-[14px] font-medium tracking-tight text-[#32291a]/90">Social</h3>
                <ul className="mt-4 space-y-3">
                  <li><a href="https://x.com" target="_blank" rel="noreferrer" className="font-sans text-[13px] text-[#5a4b30] transition-colors hover:text-[#32291a]">X</a></li>
                  <li><a href="https://github.com" target="_blank" rel="noreferrer" className="font-sans text-[13px] text-[#5a4b30] transition-colors hover:text-[#32291a]">GitHub</a></li>
                  <li><a href="https://linkedin.com" target="_blank" rel="noreferrer" className="font-sans text-[13px] text-[#5a4b30] transition-colors hover:text-[#32291a]">LinkedIn</a></li>
                </ul>
              </div>
            </div>

            {/* Bottom bar — centered */}
            <div className="mt-14 space-y-2 border-t border-[#4a3a20]/20 pt-6">
              <p className="font-sans text-[12px] text-[#5a4b30]/80">© 2026 SEEK · Design and software rights reserved.</p>
              <p className="font-sans text-[12px] text-[#5a4b30]/80">Scripture text: King James Version (public domain).</p>
            </div>
          </div>

{/* Smaller SEEK wordmark, fading out at the baseline */}
          <div aria-hidden className="pointer-events-none -mb-1 select-none">
            <p className="seek-wordmark-fade text-center font-serif text-[clamp(100px,20vw,240px)] leading-[0.82] font-medium tracking-tighter text-[#32291a]/22">
              SEEK
            </p>
          </div>
        </footer>
        </div>
      </div>
    </div>
  );
}