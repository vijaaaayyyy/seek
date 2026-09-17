import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useSeekStore } from "@/lib/store";
import { useCurrentUserState } from "@/lib/supa/use-current-user";
import { ArrowRight, ChevronRight, Search } from "lucide-react";

const CONTACT_EMAIL = "vijay.peddenti434@gmail.com";

const EXAMPLES = [
  { q: "God so loved the world", label: "God so loved the world" },
  { q: "mercy", label: "mercy" },
  { q: "agape", label: "love one another" },
  { q: "sacrifice", label: "sacrifice" },
  { q: "Psalm 23", label: "Psalm 23" },
];

const TOPICS = [
  { q: "love of God", label: "Love", line: "He first loved us." },
  { q: "mercy", label: "Mercy", line: "His mercy endureth for ever." },
  { q: "grace", label: "Grace", line: "By grace are ye saved." },
  { q: "sacrifice", label: "Sacrifice", line: "He gave His only Son." },
  { q: "forgiveness", label: "Forgiveness", line: "Cleanse us from all sin." },
  { q: "hope", label: "Hope", line: "An anchor of the soul." },
];

const POPULAR_BOOKS = [
  { slug: "john", name: "John", chapters: 21 },
  { slug: "romans", name: "Romans", chapters: 16 },
  { slug: "psalms", name: "Psalms", chapters: 150 },
  { slug: "ephesians", name: "Ephesians", chapters: 6 },
  { slug: "matthew", name: "Matthew", chapters: 28 },
  { slug: "1-john", name: "1 John", chapters: 5 },
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
        <img src="/lotus-hero.jpg" alt="" className="forest-drift" decoding="async" fetchPriority="high" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_30%,transparent_0%,rgba(4,12,8,0.4)_55%,rgba(4,12,8,0.78)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/70" />
      </div>

      <section className="relative z-10">
        <div className="mx-auto flex min-h-[90dvh] max-w-3xl flex-col items-center justify-center px-6 pt-28 pb-16 text-center">
          <div className="flex items-center gap-2 text-white/90">
            <LeafMark className="size-5 text-[#9cc49f]" />
            <span className="font-serif text-[1.15rem] tracking-[0.08em]">SEEK</span>
          </div>
          <p className="mt-8 font-sans text-[11px] font-medium tracking-[0.28em] text-white/70 uppercase">
            Love · Mercy · Sacrifice · Agape
          </p>
          <h1 className="mt-4 font-serif text-[2.75rem] leading-[1.08] font-medium tracking-tight text-white sm:text-[3.75rem]">
            Look up.<br />
            <span className="italic text-white/90">The Word is near.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md font-sans text-[15px] leading-relaxed text-white/75">
            The whole King James Bible — search a half-remembered word, a fragment, or the meaning you meant.
          </p>

          <form onSubmit={submit} className="mt-10 w-full max-w-md">
            <div className="relative flex items-center rounded-full border border-white/25 bg-white/85 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.25)] backdrop-blur-md focus-within:border-white/40">
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
                className="h-12 w-full bg-transparent py-3 pr-14 pl-11 font-sans text-[15px] text-[#1c1915] placeholder:text-[#1c1915]/45 focus:outline-none"
              />
              <button type="submit" aria-label="Search" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#1c1915] text-[#f7f5f0] transition-transform active:scale-95">
                <ArrowRight className="size-4" strokeWidth={2.2} />
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.q}
                type="button"
                onClick={() => runExample(ex.q)}
                className="font-sans text-[13px] text-white/65 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="relative z-10 border-t border-white/10">
        <div className="mx-auto max-w-3xl px-6 pt-16 pb-24 sm:px-8">
          <blockquote className="text-center">
            <p className="font-serif text-[1.55rem] leading-snug text-white/95 sm:text-[1.85rem]">
              “Beloved, let us love one another: for love is of God.”
            </p>
            <cite className="mt-4 block font-sans text-[12px] tracking-[0.18em] text-white/50 not-italic uppercase">
              1 John 4:7
            </cite>
          </blockquote>

          <p className="mt-14 text-center font-sans text-[13px] tracking-[0.06em] text-white/45">
            66 books · 1,189 chapters · 31,102 verses · King James
          </p>

          <div className="mt-20 border-t border-white/10 pt-16">
            <div className="grid gap-10 md:grid-cols-12 md:gap-12">
              <div className="md:col-span-7">
                <Link
                  to="/read/$book/$chapter"
                  params={{ book: "john", chapter: "3" }}
                  search={{ q: undefined }}
                  className="group block"
                >
                  <p className="font-serif text-[1.35rem] leading-snug text-white/90 transition-colors group-hover:text-white sm:text-[1.5rem]">
                    “For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.”
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 font-sans text-[13px] text-white/50 transition-colors group-hover:text-white/80">
                    John 3:16 · Read the chapter
                    <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </div>
              <div className="md:col-span-5 md:text-right">
                <p className="font-sans text-[11px] font-medium tracking-[0.2em] text-white/40 uppercase">The heart of the Gospel</p>
                <p className="mt-3 font-sans text-[14px] leading-relaxed text-white/55 md:ml-auto md:max-w-[14rem]">
                  The love that gives. The sacrifice that saves. Begin here.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-20 border-t border-white/10 pt-16">
            <div className="grid gap-12 md:grid-cols-12 md:gap-14">
              <div className="md:col-span-7">
                <ul className="divide-y divide-white/10">
                  {TOPICS.map((t) => (
                    <li key={t.q}>
                      <button
                        type="button"
                        onClick={() => runExample(t.q)}
                        className="group flex w-full items-baseline justify-between gap-6 py-4 text-left transition-colors"
                      >
                        <span className="font-serif text-[1.2rem] text-white/90 group-hover:text-white">{t.label}</span>
                        <span className="shrink-0 font-sans text-[13px] text-white/40 group-hover:text-white/60">{t.line}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-5 md:text-right">
                <p className="font-sans text-[11px] font-medium tracking-[0.2em] text-white/40 uppercase">01 · Seek by the heart</p>
                <h2 className="mt-3 font-serif text-[1.85rem] leading-tight font-medium text-white sm:text-[2.1rem]">
                  What's on your heart?
                </h2>
                <p className="mt-4 font-sans text-[14px] leading-relaxed text-white/50 md:ml-auto md:max-w-[15rem]">
                  Mercy, grace, hope — or the longing beneath them. SEEK finds the verses that answer the feeling behind the word.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-20 border-t border-white/10 pt-16">
            <div className="grid gap-12 md:grid-cols-12 md:gap-14">
              <div className="md:col-span-7">
                <ul className="space-y-1">
                  {POPULAR_BOOKS.map((b) => (
                    <li key={b.slug}>
                      <Link
                        to="/read/$book/$chapter"
                        params={{ book: b.slug, chapter: "1" }}
                        search={{ q: undefined }}
                        className="group flex items-baseline justify-between gap-4 py-2.5"
                      >
                        <span className="font-serif text-[1.15rem] text-white/90 group-hover:text-white">{b.name}</span>
                        <span className="font-sans text-[12px] tabular-nums text-white/35 group-hover:text-white/55">
                          {b.chapters} ch
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/books"
                  className="mt-6 inline-flex items-center gap-1.5 font-sans text-[13px] text-white/55 transition-colors hover:text-white"
                >
                  All 66 books <ChevronRight className="size-3.5" />
                </Link>
              </div>
              <div className="md:col-span-5 md:text-right">
                <p className="font-sans text-[11px] font-medium tracking-[0.2em] text-white/40 uppercase">02 · Read</p>
                <h2 className="mt-3 font-serif text-[1.85rem] leading-tight font-medium text-white sm:text-[2.1rem]">
                  The whole King James Bible
                </h2>
                <p className="mt-4 font-sans text-[14px] leading-relaxed text-white/50 md:ml-auto md:max-w-[15rem]">
                  Open any book. Read in calm page or scroll mode. Start with the books of love and mercy.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-20 border-t border-white/10 pt-16">
            <div className="grid gap-12 md:grid-cols-12 md:gap-14">
              <div className="space-y-10 md:col-span-7">
                {STEPS.map((s) => (
                  <div key={s.n} className="flex gap-5">
                    <span className="shrink-0 font-sans text-[12px] font-medium tracking-[0.16em] text-white/35">{s.n}</span>
                    <div>
                      <p className="font-serif text-[1.25rem] text-white/95">{s.title}</p>
                      <p className="mt-1.5 max-w-sm font-sans text-[14px] leading-relaxed text-white/50">{s.body}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="md:col-span-5 md:text-right">
                <p className="font-sans text-[11px] font-medium tracking-[0.2em] text-white/40 uppercase">03 · How it works</p>
                <h2 className="mt-3 font-serif text-[1.85rem] leading-tight font-medium text-white sm:text-[2.1rem]">
                  Seek. Receive. Abide.
                </h2>
                <p className="mt-4 font-sans text-[14px] leading-relaxed text-white/50 md:ml-auto md:max-w-[15rem]">
                  Three quiet movements from a longing to the Word that stays with you.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-20 border-t border-white/10 pt-16">
            <div className="grid gap-10 md:grid-cols-12">
              <div className="md:col-span-7">
                <p className="font-serif text-[1.35rem] leading-snug text-white/90 sm:text-[1.5rem]">
                  A quiet place to search and read Scripture — the love of God, His mercy, the sacrifice of Christ, and the agape that never ends.
                </p>
                <p className="mt-5 font-sans text-[14px] leading-relaxed text-white/45">
                  Private by design. Your searches stay on your device. Sign in only if you want synced saves. Light and dark, page and scroll.
                </p>
              </div>
              <div className="md:col-span-5 md:text-right">
                <p className="font-sans text-[11px] font-medium tracking-[0.2em] text-white/40 uppercase">04 · Why Seek</p>
                <h2 className="mt-3 font-serif text-[1.85rem] leading-tight font-medium text-white sm:text-[2.1rem]">
                  Built to point you to Him
                </h2>
              </div>
            </div>
          </div>

          {recent.length > 0 && (
            <div className="mt-16 border-t border-white/10 pt-10">
              <p className="font-sans text-[11px] font-medium tracking-[0.18em] text-white/40 uppercase">Recent</p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                {recent.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => runExample(q)}
                    className="font-sans text-[14px] text-white/60 underline-offset-4 hover:text-white hover:underline"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-20 border-t border-white/10 pt-16 text-center">
            <h2 className="font-serif text-[2rem] font-medium text-white sm:text-[2.35rem]">Come and see</h2>
            <p className="mx-auto mt-3 max-w-md font-sans text-[14px] leading-relaxed text-white/50">
              Open the King James Bible. Search the love of God, His mercy, and the sacrifice of Christ.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
              <Link
                to="/books"
                className="inline-flex items-center gap-1.5 font-sans text-[14px] font-medium text-white underline-offset-4 hover:underline"
              >
                Browse books <ChevronRight className="size-4" />
              </Link>
              {!user && (
                <Link
                  to="/login"
                  search={{ redirect: "/" }}
                  className="font-sans text-[14px] text-white/55 underline-offset-4 hover:text-white hover:underline"
                >
                  Sign in to save
                </Link>
              )}
            </div>
          </div>

          <footer id="about" className="mt-24 border-t border-white/10 pt-12">
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <p className="font-sans text-[11px] font-medium tracking-[0.18em] text-white/40 uppercase">About</p>
                <p className="mt-3 max-w-sm font-sans text-[13.5px] leading-relaxed text-white/50">
                  SEEK is independent and not affiliated with any denomination. Scripture text is the King James Version, public domain.
                </p>
              </div>
              <div className="md:text-right">
                <p className="font-sans text-[11px] font-medium tracking-[0.18em] text-white/40 uppercase">Contact</p>
                <p className="mt-3 font-sans text-[13.5px] text-white/55">
                  <a href={`mailto:${CONTACT_EMAIL}`} className="underline-offset-4 hover:text-white hover:underline">
                    {CONTACT_EMAIL}
                  </a>
                </p>
                <p className="mt-2 font-sans text-[13.5px] text-white/40">
                  <a href={`mailto:${CONTACT_EMAIL}?subject=SEEK%20bug%20report`} className="underline-offset-4 hover:text-white/70 hover:underline">
                    Report a bug
                  </a>
                </p>
              </div>
            </div>
            <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
              <div className="flex items-center gap-2 text-white/70">
                <LeafMark className="size-4 text-[#9cc49f]" />
                <span className="font-serif text-[1rem] tracking-[0.06em]">SEEK</span>
              </div>
              <p className="font-sans text-[12px] text-white/35">
                © {new Date().getFullYear()} · KJV public domain
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
