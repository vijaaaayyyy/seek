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
      <div className="relative hidden min-h-dvh flex-col bg-paper text-ink lg:flex">
        <header
          className={cn(
            "sticky top-0 z-30 border-b border-line/80 bg-paper/90 backdrop-blur-md transition-transform duration-300 ease-out will-change-transform",
            navHidden ? "-translate-y-full" : "translate-y-0",
          )}
        >
          <div className="mx-auto flex h-12 max-w-5xl items-center justify-between gap-4 px-6">
            <div className="flex items-center gap-5">
              <Link to="/" className="flex items-center gap-1.5 text-ink">
                <LeafMark className="size-4 text-forest" />
                <span className="font-serif text-[1.05rem] tracking-[0.04em]">SEEK</span>
              </Link>
              <nav className="flex items-center gap-0.5">
                {[
                  { to: "/books" as const, label: "Bible" },
                  { to: "/saved" as const, label: "Saved" },
                  { to: "/profile" as const, label: "Profile" },
                ].map((l) => (
                  <Link key={l.to} to={l.to} className="rounded-md px-2.5 py-1 font-sans text-[13px] font-medium text-muted transition-colors hover:bg-wash hover:text-ink">
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-1.5">
              <ThemeToggle />
              <Link to="/login" search={{ redirect: "/" }} className="rounded-md bg-ink px-3 py-1.5 font-sans text-[13px] font-medium text-paper transition-opacity hover:opacity-90">
                Sign in
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-6 pt-14 pb-20">
          <section className="mx-auto max-w-2xl text-center">
            <p className="font-sans text-[12px] font-medium tracking-[0.16em] text-muted uppercase">Scripture for every season</p>
            <h1 className="mt-4 font-serif text-[3.25rem] leading-[1.12] font-medium tracking-tight text-ink xl:text-[3.75rem]">
              The Word<br /><span className="italic text-forest">you were looking for.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-md font-sans text-[15px] leading-relaxed text-muted">
              Search the King James Bible by verse, phrase, or feeling — then read and save what speaks to you.
            </p>

            <form onSubmit={submit} className="mx-auto mt-8 w-full max-w-lg">
              <div className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 shadow-sm transition-shadow focus-within:border-ink/25 focus-within:shadow-md">
                <Search className="size-4 shrink-0 text-faint" strokeWidth={1.8} aria-hidden />
                <label htmlFor="desktop-home-search" className="sr-only">Search the Bible</label>
                <input
                  id="desktop-home-search"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  enterKeyHint="search"
                  placeholder="Search a verse, phrase, or feeling…"
                  className="h-9 min-w-0 flex-1 bg-transparent font-sans text-[15px] text-ink placeholder:text-faint focus:outline-none"
                />
                <button type="submit" className="flex h-9 shrink-0 items-center gap-1.5 rounded-md bg-ink px-3.5 font-sans text-[13px] font-medium text-paper transition-opacity hover:opacity-90">
                  Search <ArrowRight className="size-3.5" strokeWidth={2.2} />
                </button>
              </div>
            </form>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {EXAMPLES.map((ex) => (
                <button key={ex.q} type="button" onClick={() => runExample(ex.q)} className="rounded-md border border-line bg-surface px-3 py-1.5 font-sans text-[12.5px] text-ink transition-colors hover:bg-wash">
                  “{ex.label}”
                </button>
              ))}
            </div>
          </section>

          <div className="mx-auto mt-14 grid max-w-2xl grid-cols-4 gap-3">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-lg border border-line bg-surface px-2 py-3.5 text-center">
                <p className="font-serif text-[1.35rem] font-medium text-ink tabular-nums">{s.value}</p>
                <p className="mt-0.5 font-sans text-[10px] tracking-wide text-muted uppercase">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <Link to="/read/$book/$chapter" params={{ book: FEATURED.book, chapter: FEATURED.chapter }} search={{ q: undefined }} className="group rounded-xl border border-line bg-surface p-5 text-left transition-colors hover:bg-wash">
              <div className="flex items-center gap-2 text-forest">
                <Star className="size-3.5" strokeWidth={2} fill="currentColor" />
                <span className="font-sans text-[11px] font-semibold tracking-[0.12em] uppercase">Featured verse</span>
              </div>
              <p className="mt-3 font-serif text-[1.2rem] leading-snug text-ink text-balance">“{FEATURED.text}”</p>
              <p className="mt-2 font-sans text-[13px] text-muted">{FEATURED.ref}</p>
              <span className="mt-3 inline-flex items-center gap-1 font-sans text-[13px] font-medium text-muted group-hover:text-ink">Read chapter <ChevronRight className="size-3.5" /></span>
            </Link>

            <div className="rounded-xl border border-line bg-surface p-5">
              <div className="flex items-center gap-2 text-muted">
                <Heart className="size-3.5" strokeWidth={2} />
                <span className="font-sans text-[11px] font-semibold tracking-[0.12em] uppercase">Browse by feeling</span>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {TOPICS.map((t) => (
                  <button key={t.q} type="button" onClick={() => runExample(t.q)} className="flex flex-col items-center gap-1 rounded-lg border border-line bg-paper px-1.5 py-2.5 transition-colors hover:bg-wash">
                    <span className="text-base leading-none">{t.emoji}</span>
                    <span className="font-sans text-[11px] font-medium text-ink">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <section className="mt-4 rounded-xl border border-line bg-surface p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted">
                <BookOpen className="size-3.5" strokeWidth={2} />
                <span className="font-sans text-[11px] font-semibold tracking-[0.12em] uppercase">Popular books</span>
              </div>
              <Link to="/books" className="font-sans text-[13px] font-medium text-forest hover:underline">All 66 books →</Link>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 md:grid-cols-6">
              {POPULAR_BOOKS.map((b) => (
                <Link key={b.slug} to="/read/$book/$chapter" params={{ book: b.slug, chapter: "1" }} search={{ q: undefined }} className="rounded-lg border border-line bg-paper px-3 py-3 text-center transition-colors hover:bg-wash">
                  <p className="font-serif text-[14px] font-medium text-ink">{b.name}</p>
                  <p className="mt-0.5 font-sans text-[11px] text-muted">{b.chapters} ch.</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-14">
            <p className="text-center font-sans text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">How it works</p>
            <h2 className="mt-2 text-center font-serif text-[1.75rem] font-medium text-ink">Three steps to the Word</h2>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {STEPS.map((s) => (
                <div key={s.n} className="rounded-xl border border-line bg-surface p-5">
                  <p className="font-sans text-[12px] font-semibold tracking-[0.16em] text-forest">{s.n}</p>
                  <p className="mt-1.5 font-serif text-[1.15rem] text-ink">{s.title}</p>
                  <p className="mt-1.5 font-sans text-[13.5px] leading-relaxed text-muted">{s.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-14">
            <p className="text-center font-sans text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">Why Seek</p>
            <h2 className="mt-2 text-center font-serif text-[1.75rem] font-medium text-ink">Built for everyday reading</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="rounded-xl border border-line bg-surface p-5">
                    <span className="inline-flex size-9 items-center justify-center rounded-md bg-wash text-forest"><Icon className="size-4" strokeWidth={1.8} /></span>
                    <p className="mt-3 font-serif text-[1.05rem] text-ink">{f.title}</p>
                    <p className="mt-1 font-sans text-[13px] leading-relaxed text-muted">{f.body}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {recent.length > 0 && (
            <section className="mt-10 rounded-xl border border-line bg-surface p-5">
              <div className="flex items-center gap-2 text-muted">
                <Clock className="size-3.5" strokeWidth={2} />
                <span className="font-sans text-[11px] font-semibold tracking-[0.12em] uppercase">Recent searches</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {recent.map((q) => (
                  <button key={q} type="button" onClick={() => runExample(q)} className="rounded-md border border-line bg-paper px-3 py-1.5 font-sans text-[13px] text-ink transition-colors hover:bg-wash">{q}</button>
                ))}
              </div>
            </section>
          )}

          <section className="mt-14 rounded-xl border border-line bg-surface px-8 py-10 text-center">
            <h2 className="font-serif text-[1.85rem] font-medium text-ink">Start reading today</h2>
            <p className="mx-auto mt-2 max-w-md font-sans text-[14px] text-muted">Open the full King James Bible, search any passage, and keep the verses that speak to you.</p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <Link to="/books" className="inline-flex h-10 items-center rounded-md bg-ink px-5 font-sans text-[13px] font-medium text-paper transition-opacity hover:opacity-90">Browse books</Link>
              <Link to="/login" search={{ redirect: "/" }} className="inline-flex h-10 items-center rounded-md border border-line bg-paper px-5 font-sans text-[13px] font-medium text-ink transition-colors hover:bg-wash">Sign in to save</Link>
            </div>
          </section>

          <section id="about" className="mt-14 rounded-xl border border-line bg-surface p-6 md:p-8">
            <p className="font-sans text-[11px] font-semibold tracking-[0.12em] text-muted uppercase">About SEEK</p>
            <h2 className="mt-2 font-serif text-[1.5rem] font-medium text-ink">Built for quiet reading</h2>
            <p className="mt-3 max-w-2xl font-sans text-[14px] leading-relaxed text-muted">
              SEEK helps you search and read the King James Bible by verse, phrase, or feeling. Scripture text is the public-domain King James Version. SEEK is independent — not affiliated with any denomination or publisher.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-line bg-paper p-4">
                <p className="font-sans text-[11px] font-semibold tracking-wide text-forest uppercase">Contact</p>
                <p className="mt-1.5 font-sans text-[14px] text-ink"><a href={`mailto:${CONTACT_EMAIL}`} className="underline-offset-2 hover:underline">{CONTACT_EMAIL}</a></p>
                <p className="mt-1 font-sans text-[12px] text-muted">Questions, feedback, or partnership ideas.</p>
              </div>
              <div className="rounded-lg border border-line bg-paper p-4">
                <p className="font-sans text-[11px] font-semibold tracking-wide text-forest uppercase">Report a bug</p>
                <p className="mt-1.5 font-sans text-[14px] text-ink"><a href={`mailto:${CONTACT_EMAIL}?subject=SEEK%20bug%20report&body=Page%20URL%3A%0AWhat%20happened%3A%0AWhat%20you%20expected%3A%0A`} className="underline-offset-2 hover:underline">Send a bug report</a></p>
                <p className="mt-1 font-sans text-[12px] text-muted">Include the page URL and what you expected.</p>
              </div>
            </div>
            <div className="mt-5 space-y-1 border-t border-line pt-4 font-sans text-[12px] text-faint">
              <p>Scripture text: King James Version (public domain).</p>
              <p>© {new Date().getFullYear()} SEEK · Design and software rights reserved. Bible text remains public domain.</p>
            </div>
          </section>

          <footer className="mt-10 border-t border-line pt-6 pb-2">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex items-center gap-2 text-ink">
                <LeafMark className="size-4 text-forest" />
                <span className="font-serif text-[1.05rem] tracking-[0.04em]">SEEK</span>
              </div>
              <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1 font-sans text-[13px] text-muted">
                <Link to="/books" className="hover:text-ink">Bible</Link>
                <Link to="/saved" className="hover:text-ink">Saved</Link>
                <Link to="/profile" className="hover:text-ink">Profile</Link>
                <a href="#about" className="hover:text-ink">About</a>
                <a href={`mailto:${CONTACT_EMAIL}?subject=SEEK%20bug%20report`} className="hover:text-ink">Report a bug</a>
              </nav>
            </div>
          </footer>
        </main>
      </div>

      <div className="relative -mx-4 -mt-3 flex flex-col bg-paper lg:hidden">
        <div className="relative z-10 flex flex-1 flex-col px-5 pt-1 pb-8">
          <p className="text-center font-sans text-[10px] font-medium tracking-[0.28em] text-muted uppercase">Scripture for every season</p>
          <h1 className="mt-3 text-center font-serif text-[2.55rem] leading-[1.12] font-medium tracking-tight text-ink">The Word<br /><span className="italic text-forest">you were looking for.</span></h1>
          <p className="mx-auto mt-3 max-w-[18rem] text-center font-sans text-[14px] leading-relaxed text-muted">Search by verse, phrase, or feeling — then read and save.</p>

          <form onSubmit={submit} className="mx-auto mt-5 w-full max-w-md">
            <div className="relative flex items-center rounded-xl border border-line bg-surface shadow-sm">
              <Search className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-muted" strokeWidth={1.8} aria-hidden />
              <input value={value} autoComplete="off" spellCheck={false} enterKeyHint="search" placeholder="Search a verse, phrase, or feeling…" onChange={(e) => setValue(e.target.value)} className="h-12 w-full bg-transparent py-3 pr-14 pl-11 font-sans text-[15px] text-ink placeholder:text-faint focus:outline-none" />
              <button type="submit" aria-label="Search" className="absolute top-1/2 right-1.5 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg bg-ink text-paper transition-transform active:scale-95">
                <ArrowRight className="size-4" strokeWidth={2.2} />
              </button>
            </div>
          </form>

          <div className="mx-auto mt-3.5 flex max-w-md flex-wrap justify-center gap-2">
            {EXAMPLES.map((ex) => (
              <button key={ex.q} type="button" onClick={() => runExample(ex.q)} className="rounded-lg border border-line bg-surface px-3 py-1.5 font-sans text-[12.5px] text-ink active:scale-[0.97]">“{ex.label}”</button>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-4 gap-2">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-xl border border-line bg-surface px-1.5 py-3 text-center">
                <p className="font-serif text-[1.05rem] font-medium text-ink tabular-nums">{s.value}</p>
                <p className="mt-0.5 font-sans text-[9px] tracking-wide text-muted uppercase">{s.label}</p>
              </div>
            ))}
          </div>

          <Link to="/read/$book/$chapter" params={{ book: FEATURED.book, chapter: FEATURED.chapter }} search={{ q: undefined }} className="mt-5 block rounded-xl border border-line bg-surface p-4">
            <div className="flex items-center gap-1.5 text-forest"><Star className="size-3.5" strokeWidth={2} fill="currentColor" /><span className="font-sans text-[10px] font-semibold tracking-[0.14em] uppercase">Featured</span></div>
            <p className="mt-2 font-serif text-[1.05rem] leading-snug text-ink">“{FEATURED.text}”</p>
            <p className="mt-2 font-sans text-[12px] text-muted">{FEATURED.ref}</p>
          </Link>

          <section className="mt-5">
            <p className="mb-2.5 font-sans text-[11px] font-medium tracking-[0.14em] text-muted uppercase">Browse by feeling</p>
            <div className="grid grid-cols-4 gap-2">
              {TOPICS.map((t) => (
                <button key={t.q} type="button" onClick={() => runExample(t.q)} className="flex flex-col items-center gap-1 rounded-xl border border-line bg-surface px-1.5 py-3">
                  <span className="text-base leading-none">{t.emoji}</span>
                  <span className="font-sans text-[11px] font-medium text-ink">{t.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="mt-5">
            <div className="mb-2.5 flex items-center justify-between">
              <p className="font-sans text-[11px] font-medium tracking-[0.14em] text-muted uppercase">Popular books</p>
              <Link to="/books" className="font-sans text-[12px] font-medium text-forest">See all</Link>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {POPULAR_BOOKS.map((b) => (
                <Link key={b.slug} to="/read/$book/$chapter" params={{ book: b.slug, chapter: "1" }} search={{ q: undefined }} className="w-[7.25rem] shrink-0 rounded-xl border border-line bg-surface px-3 py-3.5">
                  <p className="font-serif text-[15px] font-medium text-ink">{b.name}</p>
                  <p className="mt-0.5 font-sans text-[11px] text-muted">{b.chapters} chapters</p>
                </Link>
              ))}
            </div>
          </section>

          <div className="mt-6 rounded-xl bg-ink px-5 py-6 text-center">
            <p className="font-serif text-[1.25rem] text-paper">Start reading today</p>
            <Link to="/books" className="mt-4 inline-flex h-10 items-center rounded-lg bg-paper px-5 font-sans text-[13px] font-semibold text-ink">Browse books</Link>
          </div>

          <section id="about-mobile" className="mt-8 rounded-xl border border-line bg-surface p-4">
            <p className="font-sans text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">About SEEK</p>
            <p className="mt-2 font-sans text-[13px] leading-relaxed text-ink">Search and read the King James Bible by verse, phrase, or feeling. Independent app · KJV text is public domain.</p>
            <div className="mt-3 space-y-1.5 font-sans text-[12px] text-muted">
              <p>Contact: <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-forest underline-offset-2 hover:underline">{CONTACT_EMAIL}</a></p>
              <p><a href={`mailto:${CONTACT_EMAIL}?subject=SEEK%20bug%20report&body=Page%20URL%3A%0AWhat%20happened%3A%0AWhat%20you%20expected%3A%0A`} className="font-medium text-forest underline-offset-2 hover:underline">Report a bug</a></p>
              <p className="pt-1 text-[11px] text-faint">© {new Date().getFullYear()} SEEK · Design & software rights reserved</p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
