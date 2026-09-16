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

const EXAMPLES = [
  { q: "be not afraid", label: "be not afraid" },
  { q: "Psalm 23", label: "Psalm 23" },
  { q: "prodigal son", label: "prodigal son" },
  { q: "love your enemies", label: "love your enemies" },
  { q: "valley of the shadow", label: "valley of the shadow" },
];

const TOPICS = [
  { q: "peace", label: "Peace", emoji: "\ud83d\udd4a\ufe0f" },
  { q: "hope", label: "Hope", emoji: "\ud83c\udf05" },
  { q: "love", label: "Love", emoji: "\u2764\ufe0f" },
  { q: "strength", label: "Strength", emoji: "\ud83d\udcaa" },
  { q: "forgiveness", label: "Forgiveness", emoji: "\ud83e\udd1d" },
  { q: "wisdom", label: "Wisdom", emoji: "\ud83d\udcd6" },
  { q: "anxiety", label: "Anxiety", emoji: "\ud83c\udf3f" },
  { q: "faith", label: "Faith", emoji: "\u2728" },
];

const POPULAR_BOOKS = [
  { slug: "psalms", name: "Psalms", chapters: 150 },
  { slug: "john", name: "John", chapters: 21 },
  { slug: "romans", name: "Romans", chapters: 16 },
  { slug: "proverbs", name: "Proverbs", chapters: 31 },
  { slug: "genesis", name: "Genesis", chapters: 50 },
  { slug: "matthew", name: "Matthew", chapters: 28 },
];

const FEATURED = {
  ref: "Psalm 119:105",
  text: "Thy word is a lamp unto my feet, and a light unto my path.",
  book: "psalms",
  chapter: "119",
};

const STATS = [
  { value: "66", label: "Books" },
  { value: "1,189", label: "Chapters" },
  { value: "31,102", label: "Verses" },
  { value: "KJV", label: "Translation" },
];

const FEATURES = [
  { icon: Search, title: "Search by meaning", body: "Find verses by phrase, topic, or feeling — not only exact references." },
  { icon: BookOpen, title: "Read every book", body: "The complete King James Bible with scroll and page reading modes." },
  { icon: Bookmark, title: "Save what matters", body: "Bookmark verses and keep them synced when you sign in." },
  { icon: Moon, title: "Day & night", body: "A calm interface that switches cleanly between light and dark." },
  { icon: Zap, title: "Fast on any device", body: "Built for phones and desktops so Scripture is always one search away." },
  { icon: Shield, title: "Private by design", body: "Your searches stay on your device. Sign in only if you want synced saves." },
];

const STEPS = [
  { n: "01", title: "Search", body: "Type a verse, story, or feeling — like peace or Psalm 23." },
  { n: "02", title: "Read", body: "Open the chapter in scroll or page mode with clear chapter markers." },
  { n: "03", title: "Save", body: "Bookmark verses you want to return to later." },
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
      <div className="relative hidden lg:block">
        <section className="relative flex min-h-dvh flex-col overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <img src="/banner-day.webp" alt="" className="h-full w-full object-cover object-center" decoding="async" fetchPriority="high" />
            <div className="absolute inset-0 bg-[#0b0c11]/45" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c11] via-[#0b0c11]/35 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0b0c11]/40 via-transparent to-transparent" />
          </div>

          <header
            className={cn(
              "fixed top-0 right-0 left-0 z-30 flex justify-center px-4 pt-5 transition-transform duration-300 ease-out will-change-transform",
              navHidden ? "-translate-y-[140%]" : "translate-y-0",
            )}
          >
            <div className="flex h-12 w-fit max-w-[min(100%,40rem)] items-center gap-1 rounded-full bg-black/35 px-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] ring-1 ring-white/15 backdrop-blur-xl">
              <Link to="/" className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-white transition-opacity hover:opacity-90">
                <LeafMark className="size-4 text-[#c5d1c8]" />
                <span className="font-serif text-[1.05rem] tracking-[0.06em]">SEEK</span>
              </Link>
              <nav className="flex items-center gap-0.5">
                {[
                  { to: "/books" as const, label: "Bible" },
                  { to: "/saved" as const, label: "Saved" },
                  { to: "/profile" as const, label: "Profile" },
                ].map((l) => (
                  <Link key={l.to} to={l.to} className="rounded-full px-3 py-1.5 font-sans text-[12.5px] font-medium text-white/70 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                ))}
              </nav>
              <div className="ml-1 flex items-center gap-1 border-l border-white/15 pl-2">
                <ThemeToggle className="border-0 bg-white/10 text-white ring-white/15 hover:bg-white/15" />
                <Link to="/login" search={{ redirect: "/" }} className="rounded-full bg-white/15 px-3.5 py-1.5 font-sans text-[12.5px] font-medium text-white ring-1 ring-white/15 transition-colors hover:bg-white/25">
                  Sign in
                </Link>
              </div>
            </div>
          </header>

          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-24 text-center">
            <p className="font-sans text-[11px] font-medium tracking-[0.28em] text-white/70 uppercase">Scripture for every season</p>
            <h1 className="mt-4 font-serif text-[4.5rem] leading-[1.05] font-medium tracking-tight text-white drop-shadow-sm xl:text-[5.25rem]">
              SEEK<span className="align-super text-[1.1rem] font-normal tracking-normal text-white/70">®</span>
            </h1>
            <p className="mx-auto mt-4 max-w-md font-sans text-[16px] leading-relaxed text-white/80">
              Search the King James Bible by verse, phrase, or feeling — then read and save what speaks to you.
            </p>

            <form onSubmit={submit} className="mt-8 w-full max-w-md">
              <div className="flex items-center gap-0 rounded-full bg-white/15 p-1.5 shadow-[0_12px_48px_rgba(0,0,0,0.25)] ring-1 ring-white/25 backdrop-blur-xl">
                <label htmlFor="desktop-home-search" className="sr-only">Search the Bible</label>
                <input
                  id="desktop-home-search"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  enterKeyHint="search"
                  placeholder="Search a verse, phrase, or feeling…"
                  className="h-11 min-w-0 flex-1 bg-transparent px-4 font-sans text-[15px] text-white placeholder:text-white/50 focus:outline-none"
                />
                <button type="submit" aria-label="Search" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-[#0b0c11] transition-transform active:scale-95 hover:bg-white/95">
                  <ArrowRight className="size-4" strokeWidth={2.2} />
                </button>
              </div>
            </form>

            <p className="mt-4 max-w-sm font-sans text-[13px] text-white/60">
              Stay in the Word — search any passage and never lose your place.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              {EXAMPLES.slice(0, 4).map((ex) => (
                <button key={ex.q} type="button" onClick={() => runExample(ex.q)} className="rounded-full bg-white/12 px-3.5 py-1.5 font-sans text-[12.5px] text-white/90 ring-1 ring-white/20 backdrop-blur-md transition-colors hover:bg-white/22">
                  “{ex.label}”
                </button>
              ))}
            </div>

            <Link to="/books" className="mt-8 inline-flex h-10 items-center rounded-full bg-white/15 px-5 font-sans text-[13px] font-medium text-white ring-1 ring-white/25 backdrop-blur-md transition-colors hover:bg-white/25">
              Browse all books
            </Link>
          </div>

          <div className="relative z-10 flex justify-center gap-3 pb-8">
            <Link to="/books" className="flex size-10 items-center justify-center rounded-full bg-white/12 text-white ring-1 ring-white/20 backdrop-blur-md transition-colors hover:bg-white/22" aria-label="Bible">
              <BookOpen className="size-4" strokeWidth={1.8} />
            </Link>
            <Link to="/saved" className="flex size-10 items-center justify-center rounded-full bg-white/12 text-white ring-1 ring-white/20 backdrop-blur-md transition-colors hover:bg-white/22" aria-label="Saved">
              <Bookmark className="size-4" strokeWidth={1.8} />
            </Link>
            <Link to="/profile" className="flex size-10 items-center justify-center rounded-full bg-white/12 text-white ring-1 ring-white/20 backdrop-blur-md transition-colors hover:bg-white/22" aria-label="Profile">
              <Sparkles className="size-4" strokeWidth={1.8} />
            </Link>
          </div>
        </section>

        <section className="relative bg-[#0b0c11] px-6 pt-4 pb-16">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 grid grid-cols-4 gap-3">
              {STATS.map((s) => (
                <div key={s.label} className="rounded-2xl bg-white/[0.06] px-3 py-4 text-center ring-1 ring-white/10">
                  <p className="font-serif text-[1.5rem] font-medium text-[#f2ebe0] tabular-nums">{s.value}</p>
                  <p className="mt-0.5 font-sans text-[11px] tracking-wide text-[#a39b90] uppercase">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Link to="/read/$book/$chapter" params={{ book: FEATURED.book, chapter: FEATURED.chapter }} search={{ q: undefined }} className="group rounded-[28px] bg-white/[0.06] p-6 text-left ring-1 ring-white/10 transition-colors hover:bg-white/[0.1]">
                <div className="flex items-center gap-2 text-[#c5d1c8]">
                  <Star className="size-4" strokeWidth={2} fill="currentColor" />
                  <span className="font-sans text-[11px] font-semibold tracking-[0.16em] uppercase">Featured verse</span>
                </div>
                <p className="mt-4 font-serif text-[1.35rem] leading-snug text-[#f2ebe0] text-balance">“{FEATURED.text}”</p>
                <p className="mt-3 font-sans text-[13px] text-[#a39b90]">{FEATURED.ref}</p>
                <span className="mt-4 inline-flex items-center gap-1 font-sans text-[13px] font-medium text-[#f2ebe0]/70 group-hover:text-[#f2ebe0]">Read chapter <ChevronRight className="size-4" /></span>
              </Link>

              <div className="rounded-[28px] bg-white/[0.06] p-6 ring-1 ring-white/10">
                <div className="flex items-center gap-2 text-[#f2ebe0]/70">
                  <Heart className="size-4" strokeWidth={2} />
                  <span className="font-sans text-[11px] font-semibold tracking-[0.16em] uppercase">Browse by feeling</span>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {TOPICS.map((t) => (
                    <button key={t.q} type="button" onClick={() => runExample(t.q)} className="flex flex-col items-center gap-1 rounded-2xl bg-white/[0.06] px-2 py-3 transition-colors hover:bg-white/12">
                      <span className="text-lg">{t.emoji}</span>
                      <span className="font-sans text-[12px] font-medium text-[#f2ebe0]/90">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <section className="mt-4 rounded-[28px] bg-white/[0.06] p-6 ring-1 ring-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#f2ebe0]/70">
                  <BookOpen className="size-4" strokeWidth={2} />
                  <span className="font-sans text-[11px] font-semibold tracking-[0.16em] uppercase">Popular books</span>
                </div>
                <Link to="/books" className="font-sans text-[13px] font-medium text-[#a39b90] transition-colors hover:text-[#f2ebe0]">All 66 books →</Link>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 md:grid-cols-6">
                {POPULAR_BOOKS.map((b) => (
                  <Link key={b.slug} to="/read/$book/$chapter" params={{ book: b.slug, chapter: "1" }} search={{ q: undefined }} className="rounded-2xl bg-white/[0.06] px-3 py-3.5 text-center transition-colors hover:bg-white/12">
                    <p className="font-serif text-[15px] font-medium text-[#f2ebe0]">{b.name}</p>
                    <p className="mt-0.5 font-sans text-[11px] text-[#a39b90]">{b.chapters} ch.</p>
                  </Link>
                ))}
              </div>
            </section>

            <section className="mt-14">
              <p className="text-center font-sans text-[11px] font-semibold tracking-[0.18em] text-[#7a746b] uppercase">How it works</p>
              <h2 className="mt-2 text-center font-serif text-[2rem] font-medium text-[#f2ebe0]">Three steps to the Word</h2>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {STEPS.map((s) => (
                  <div key={s.n} className="rounded-[24px] bg-white/[0.05] p-5 ring-1 ring-white/10">
                    <p className="font-sans text-[12px] font-semibold tracking-[0.2em] text-[#c5d1c8]">{s.n}</p>
                    <p className="mt-2 font-serif text-[1.25rem] text-[#f2ebe0]">{s.title}</p>
                    <p className="mt-2 font-sans text-[14px] leading-relaxed text-[#a39b90]">{s.body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-14">
              <p className="text-center font-sans text-[11px] font-semibold tracking-[0.18em] text-[#7a746b] uppercase">Why Seek</p>
              <h2 className="mt-2 text-center font-serif text-[2rem] font-medium text-[#f2ebe0]">Built for everyday reading</h2>
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {FEATURES.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.title} className="rounded-[22px] bg-white/[0.05] p-5 ring-1 ring-white/10">
                      <span className="inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-[#c5d1c8]"><Icon className="size-4.5" strokeWidth={1.8} /></span>
                      <p className="mt-3 font-serif text-[1.1rem] text-[#f2ebe0]">{f.title}</p>
                      <p className="mt-1.5 font-sans text-[13.5px] leading-relaxed text-[#a39b90]">{f.body}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {recent.length > 0 && (
              <section className="mt-10 rounded-[28px] bg-white/[0.05] p-6 ring-1 ring-white/10">
                <div className="flex items-center gap-2 text-[#a39b90]">
                  <Clock className="size-4" strokeWidth={2} />
                  <span className="font-sans text-[11px] font-semibold tracking-[0.16em] uppercase">Recent searches</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {recent.map((q) => (
                    <button key={q} type="button" onClick={() => runExample(q)} className="rounded-full bg-white/[0.08] px-3.5 py-1.5 font-sans text-[13px] text-[#f2ebe0]/85 ring-1 ring-white/10 transition-colors hover:bg-white/14">{q}</button>
                  ))}
                </div>
              </section>
            )}

            <section className="mt-14 rounded-[32px] bg-white/[0.06] px-8 py-12 text-center ring-1 ring-white/10">
              <h2 className="font-serif text-[2.25rem] font-medium text-[#f2ebe0]">Start reading today</h2>
              <p className="mx-auto mt-3 max-w-md font-sans text-[15px] text-[#a39b90]">Open the full King James Bible, search any passage, and keep the verses that speak to you.</p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link to="/books" className="inline-flex h-12 items-center rounded-full bg-[#f2ebe0] px-6 font-sans text-[14px] font-semibold text-[#0b0c11] transition-transform active:scale-95">Browse books</Link>
                <Link to="/login" search={{ redirect: "/" }} className="inline-flex h-12 items-center rounded-full bg-white/10 px-6 font-sans text-[14px] font-medium text-[#f2ebe0] ring-1 ring-white/15 transition-colors hover:bg-white/15">Sign in to save</Link>
              </div>
            </section>

            <section id="about" className="mt-14 rounded-[28px] bg-white/[0.06] p-6 ring-1 ring-white/10 md:p-8">
              <p className="font-sans text-[11px] font-semibold tracking-[0.16em] text-[#7a746b] uppercase">About SEEK</p>
              <h2 className="mt-2 font-serif text-[1.75rem] font-medium text-[#f2ebe0]">Built for quiet reading</h2>
              <p className="mt-3 max-w-2xl font-sans text-[14px] leading-relaxed text-[#a39b90]">
                SEEK helps you search and read the King James Bible by verse, phrase, or feeling. Scripture text is the public-domain King James Version. SEEK is independent — not affiliated with any denomination or publisher.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[20px] bg-white/[0.05] p-4 ring-1 ring-white/8">
                  <p className="font-sans text-[12px] font-semibold tracking-wide text-[#c5d1c8] uppercase">Contact</p>
                  <p className="mt-2 font-sans text-[14px] text-[#f2ebe0]"><a href="mailto:vijay@seek.bible" className="underline-offset-2 hover:underline">vijay@seek.bible</a></p>
                  <p className="mt-1 font-sans text-[12px] text-[#a39b90]">Questions, feedback, or partnership ideas.</p>
                </div>
                <div className="rounded-[20px] bg-white/[0.05] p-4 ring-1 ring-white/8">
                  <p className="font-sans text-[12px] font-semibold tracking-wide text-[#c5d1c8] uppercase">Report a bug</p>
                  <p className="mt-2 font-sans text-[14px] text-[#f2ebe0]"><a href="mailto:vijay@seek.bible?subject=SEEK%20bug%20report&body=Page%20URL%3A%0AWhat%20happened%3A%0AWhat%20you%20expected%3A%0A" className="underline-offset-2 hover:underline">Send a bug report</a></p>
                  <p className="mt-1 font-sans text-[12px] text-[#a39b90]">Include the page URL and what you expected.</p>
                </div>
              </div>
              <div className="mt-6 space-y-1 border-t border-white/[0.06] pt-5 font-sans text-[12px] text-[#7a746b]">
                <p>Scripture text: King James Version (public domain).</p>
                <p>© {new Date().getFullYear()} SEEK · Design and software rights reserved. Bible text remains public domain.</p>
              </div>
            </section>

            <footer className="mt-10 border-t border-white/[0.06] pt-8 pb-6">
              <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                <div className="flex items-center gap-2 text-[#f2ebe0]">
                  <LeafMark className="size-4 text-[#c5d1c8]" />
                  <span className="font-serif text-[1.1rem] tracking-[0.06em]">SEEK</span>
                </div>
                <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 font-sans text-[13px] text-[#a39b90]">
                  <Link to="/books" className="transition-colors hover:text-[#f2ebe0]">Bible</Link>
                  <Link to="/saved" className="transition-colors hover:text-[#f2ebe0]">Saved</Link>
                  <Link to="/profile" className="transition-colors hover:text-[#f2ebe0]">Profile</Link>
                  <a href="#about" className="transition-colors hover:text-[#f2ebe0]">About</a>
                  <a href="mailto:vijay@seek.bible?subject=SEEK%20bug%20report" className="transition-colors hover:text-[#f2ebe0]">Report a bug</a>
                </nav>
              </div>
            </footer>
          </div>
        </section>
      </div>

      <div className="relative -mx-4 -mt-3 flex flex-col lg:hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,#f0c49a_0%,transparent_55%)] opacity-80 dark:opacity-30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_80%_100%,#c4a574_0%,transparent_50%)] opacity-60 dark:opacity-20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_10%_90%,#b7cbb8_0%,transparent_50%)] opacity-50 dark:opacity-15" />
        </div>
        <div className="relative z-10 flex flex-1 flex-col px-5 pt-1 pb-8">
          <p className="text-center font-sans text-[10px] font-medium tracking-[0.28em] text-muted uppercase">Scripture for every season</p>
          <h1 className="mt-3 text-center font-serif text-[2.55rem] leading-[1.12] font-medium tracking-tight text-ink">The Word<br /><span className="italic">you were looking for.</span></h1>
          <p className="mx-auto mt-3 max-w-[18rem] text-center font-sans text-[14px] leading-relaxed text-muted">Search by verse, phrase, or feeling — then read and save.</p>
          <form onSubmit={submit} className="mx-auto mt-5 w-full max-w-md">
            <div className="relative flex items-center rounded-full bg-white shadow-sm ring-1 ring-black/10 dark:bg-[#1c1f2c]/90 dark:ring-white/10">
              <Search className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-muted" strokeWidth={1.8} aria-hidden />
              <input value={value} autoComplete="off" spellCheck={false} enterKeyHint="search" placeholder="Search a verse, phrase, or feeling…" onChange={(e) => setValue(e.target.value)} className="h-13 w-full bg-transparent py-3.5 pr-14 pl-11 font-sans text-[15px] text-ink placeholder:text-faint focus:outline-none" />
              <button type="submit" aria-label="Search" className="absolute top-1/2 right-1.5 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#2c3a32] text-white transition-transform duration-150 active:scale-95 dark:bg-[#c5d1c8] dark:text-[#121410]">
                <ArrowRight className="size-4" strokeWidth={2.2} />
              </button>
            </div>
          </form>
          <div className="mx-auto mt-3.5 flex max-w-md flex-wrap justify-center gap-2">
            {EXAMPLES.map((ex) => (
              <button key={ex.q} type="button" onClick={() => runExample(ex.q)} className="rounded-full bg-white px-3.5 py-1.5 font-sans text-[12.5px] text-ink shadow-sm ring-1 ring-black/8 active:scale-[0.97] dark:bg-white/10 dark:ring-white/10">“{ex.label}”</button>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-4 gap-2">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-[16px] bg-white px-1.5 py-3 text-center shadow-sm ring-1 ring-black/8 dark:bg-white/8 dark:ring-white/10">
                <p className="font-serif text-[1.05rem] font-medium text-ink tabular-nums">{s.value}</p>
                <p className="mt-0.5 font-sans text-[9px] tracking-wide text-muted uppercase">{s.label}</p>
              </div>
            ))}
          </div>
          <Link to="/read/$book/$chapter" params={{ book: FEATURED.book, chapter: FEATURED.chapter }} search={{ q: undefined }} className="mt-5 block rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-black/8 dark:bg-white/8 dark:ring-white/10">
            <div className="flex items-center gap-1.5 text-forest"><Star className="size-3.5" strokeWidth={2} fill="currentColor" /><span className="font-sans text-[10px] font-semibold tracking-[0.14em] uppercase">Featured</span></div>
            <p className="mt-2 font-serif text-[1.05rem] leading-snug text-ink">“{FEATURED.text}”</p>
            <p className="mt-2 font-sans text-[12px] text-muted">{FEATURED.ref}</p>
          </Link>
          <section className="mt-5">
            <p className="mb-2.5 font-sans text-[11px] font-medium tracking-[0.14em] text-muted uppercase">Browse by feeling</p>
            <div className="grid grid-cols-4 gap-2">
              {TOPICS.map((t) => (
                <button key={t.q} type="button" onClick={() => runExample(t.q)} className="flex flex-col items-center gap-1 rounded-[18px] bg-white px-1.5 py-3 shadow-sm ring-1 ring-black/8 dark:bg-white/8 dark:ring-white/10">
                  <span className="text-base">{t.emoji}</span>
                  <span className="font-sans text-[11px] font-medium text-ink">{t.label}</span>
                </button>
              ))}
            </div>
          </section>
          <section className="mt-5">
            <div className="mb-2.5 flex items-center justify-between"><p className="font-sans text-[11px] font-medium tracking-[0.14em] text-muted uppercase">Popular books</p><Link to="/books" className="font-sans text-[12px] font-medium text-forest">See all</Link></div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {POPULAR_BOOKS.map((b) => (
                <Link key={b.slug} to="/read/$book/$chapter" params={{ book: b.slug, chapter: "1" }} search={{ q: undefined }} className="w-[7.25rem] shrink-0 rounded-[18px] bg-white px-3 py-3.5 shadow-sm ring-1 ring-black/8 dark:bg-white/8 dark:ring-white/10">
                  <p className="font-serif text-[15px] font-medium text-ink">{b.name}</p>
                  <p className="mt-0.5 font-sans text-[11px] text-muted">{b.chapters} chapters</p>
                </Link>
              ))}
            </div>
          </section>
          <div className="mt-6 rounded-[22px] bg-[#2c3a32] px-5 py-6 text-center dark:bg-[#c5d1c8]">
            <p className="font-serif text-[1.25rem] text-white dark:text-[#121410]">Start reading today</p>
            <Link to="/books" className="mt-4 inline-flex h-11 items-center rounded-full bg-white px-5 font-sans text-[13px] font-semibold text-[#2c3a32] dark:bg-[#121410] dark:text-[#c5d1c8]">Browse books</Link>
          </div>
          <section id="about-mobile" className="mt-8 rounded-[22px] bg-white p-4 shadow-sm ring-1 ring-black/8 dark:bg-white/8 dark:ring-white/10">
            <p className="font-sans text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">About SEEK</p>
            <p className="mt-2 font-sans text-[13px] leading-relaxed text-ink">Search and read the King James Bible by verse, phrase, or feeling. Independent app · KJV text is public domain.</p>
            <div className="mt-3 space-y-1.5 font-sans text-[12px] text-muted">
              <p>Contact: <a href="mailto:vijay@seek.bible" className="font-medium text-forest underline-offset-2 hover:underline">vijay@seek.bible</a></p>
              <p><a href="mailto:vijay@seek.bible?subject=SEEK%20bug%20report&body=Page%20URL%3A%0AWhat%20happened%3A%0AWhat%20you%20expected%3A%0A" className="font-medium text-forest underline-offset-2 hover:underline">Report a bug</a></p>
              <p className="pt-1 text-[11px] text-faint">© {new Date().getFullYear()} SEEK · Design & software rights reserved</p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
