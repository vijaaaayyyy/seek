import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSeekStore } from "@/lib/store";
import { Search } from "lucide-react";

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
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY || document.documentElement.scrollTop);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, { capture: true });
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

  return (
    <div
      ref={rootRef}
      className="relative min-h-[100dvh] bg-[#f4f4f4] text-black dark:bg-[#0c0d12] dark:text-[#f5f0e8]"
    >
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
        <div
          className="absolute left-[4%] top-[18%] h-[22vmin] w-[32vmin] rounded-sm bg-black/10 blur-[18px] dark:bg-white/8"
          style={{ transform: `translate3d(0, ${p1 * 0.4}px, 0)` }}
        />
        <div
          className="absolute right-[6%] top-[28%] h-[26vmin] w-[34vmin] rounded-sm bg-black/12 blur-[22px] dark:bg-white/10"
          style={{ transform: `translate3d(0, ${-p2 * 0.5}px, 0)` }}
        />
        <div
          className="absolute bottom-[12%] left-[18%] h-[18vmin] w-[28vmin] rounded-sm bg-black/8 blur-[16px] dark:bg-white/6"
          style={{ transform: `translate3d(0, ${p3 * 0.3}px, 0)` }}
        />
        <div
          className="absolute left-[12%] top-[8%] h-[14vmin] w-[11vmin] bg-black dark:bg-white"
          style={{ transform: `translate3d(0, ${p2 * 0.25}px, 0)` }}
        />
      </div>

      <span
        className="pointer-events-none fixed bottom-6 left-4 z-20 select-none font-sans text-[clamp(2.5rem,9vw,5rem)] font-medium tracking-tight text-black/10 dark:text-white/10 sm:left-8"
        aria-hidden
      >
        seek
      </span>
      <span
        className="pointer-events-none fixed right-4 bottom-6 z-20 select-none font-sans text-[clamp(2.5rem,9vw,5rem)] font-medium tracking-tight text-black/10 dark:text-white/10 sm:right-8"
        aria-hidden
      >
        bible
      </span>

      <section className="relative z-10 flex min-h-[100dvh] flex-col px-5 pt-20 pb-10 sm:px-10 lg:px-16">
        <div className="flex items-start justify-between gap-6">
          <div className="flex gap-6">
            <div className="hidden h-16 w-12 bg-black dark:bg-white sm:block" aria-hidden />
            <div className="border-l border-black/20 pl-4 dark:border-white/20">
              <p className="font-sans text-[12px] leading-snug text-black/70 dark:text-white/70">
                Free · KJV
                <br />
                66 books
              </p>
            </div>
          </div>
          <p className="max-w-[10rem] text-right font-sans text-[12px] leading-snug text-black/60 dark:text-white/60">
            Search a half-
            <br />
            remembered word
          </p>
        </div>

        <div className="relative flex flex-1 flex-col items-center justify-center">
          <h1 className="pointer-events-none absolute left-1/2 top-[38%] z-0 -translate-x-1/2 -translate-y-1/2 select-none text-center font-sans text-[clamp(4.5rem,18vw,13rem)] font-medium leading-[0.85] tracking-[-0.04em] text-black dark:text-white">
            SEEK
          </h1>
          <p className="pointer-events-none absolute left-1/2 top-[48%] z-0 -translate-x-1/2 select-none font-sans text-[clamp(2.5rem,10vw,7rem)] font-medium leading-none tracking-[-0.03em] text-black/15 dark:text-white/15">
            Scripture
          </p>

          <div className="relative z-10 mt-[34vh] w-full max-w-md border border-black/10 bg-white/25 px-6 py-6 backdrop-blur-md dark:border-white/15 dark:bg-white/5 sm:px-8">
            <form onSubmit={submit}>
              <label htmlFor="home-search" className="sr-only">
                Search the Bible
              </label>
              <div className="flex items-center gap-3 border-b border-black/20 pb-3 dark:border-white/25">
                <Search className="size-4 shrink-0 opacity-50" strokeWidth={1.6} />
                <input
                  id="home-search"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  enterKeyHint="search"
                  placeholder="A verse, a word, a longing…"
                  className="w-full bg-transparent font-sans text-[1.05rem] outline-none placeholder:text-black/35 dark:placeholder:text-white/35"
                />
              </div>
            </form>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
              {EXAMPLES.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => run(q)}
                  className="font-sans text-[11px] tracking-wide text-black/45 transition hover:text-black dark:text-white/45 dark:hover:text-white"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between pt-10">
          <p className="font-sans text-[12px] text-black/50 dark:text-white/50">
            Designer
            <br />& the Word
          </p>
          <a
            href="#work"
            className="font-sans text-[12px] tracking-[0.16em] text-black/50 uppercase dark:text-white/50"
          >
            Scroll
          </a>
        </div>
      </section>

      <section
        id="work"
        className="relative z-10 min-h-[80dvh]px-5 py-28 dark:border-white/10 sm:px-10 lg:px-16"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-20 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-sans text-[11px] tracking-[0.2em] text-black/40 uppercase dark:text-white/40">
              Corpus
            </p>
            <h2 className="mt-4 font-sans text-[clamp(3.5rem,12vw,9rem)] font-medium leading-[0.9] tracking-[-0.04em]">
              66
              <span className="block text-black/25 dark:text-white/25">books</span>
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
                <p className="mt-1 font-sans text-[11px] tracking-[0.16em] text-black/40 uppercase dark:text-white/40">
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-5 py-28 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="font-sans text-[11px] tracking-[0.2em] text-black/40 uppercase dark:text-white/40">
            Start somewhere
          </p>
          <h2 className="mt-4 font-sans text-[clamp(2.5rem,8vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.03em]">
            Begin a
            <span className="block text-black/25 dark:text-white/25">chapter</span>
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
                <span className="shrink-0 font-sans text-[12px] text-black/35 dark:text-white/35">
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
              <p className="font-sans text-[11px] tracking-[0.2em] text-black/40 uppercase dark:text-white/40">
                Two ways in
              </p>
              <h2 className="mt-4 font-sans text-[clamp(2rem,6vw,3.5rem)] font-medium leading-[1] tracking-[-0.03em]">
                Search by meaning, or read by reference.
              </h2>
            </div>
            <div className="flex flex-col gap-8">
              <div>
                <p className="font-sans text-[15px] leading-relaxed text-black/60 dark:text-white/60">
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
                <p className="font-sans text-[15px] leading-relaxed text-black/60 dark:text-white/60">
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

      <section className="relative z-10 px-5 py-32 dark:border-white/10 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-5xl flex-col gap-20 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-sans text-[11px] tracking-[0.2em] text-black/40 uppercase dark:text-white/40">
              Still deciding
            </p>
            <h2 className="mt-4 font-sans text-[clamp(2.5rem,8vw,5rem)] font-medium leading-[0.95] tracking-[-0.03em]">
              Take it
              <span className="block text-black/25 dark:text-white/25">with you</span>
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
                <p className="mt-1 font-sans text-[11px] tracking-[0.16em] text-black/40 uppercase dark:text-white/40">
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
          <Link to="/groups" className="font-sans text-[12px] tracking-[0.16em] uppercase text-black/45 dark:text-white/45">
            Reading groups
          </Link>
          <Link to="/faq" className="font-sans text-[12px] tracking-[0.16em] uppercase text-black/45 dark:text-white/45">
            FAQ
          </Link>
        </div>
      </section>

      <section className="relative z-10 px-5 py-32 dark:border-white/10 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <p className="font-sans text-[11px] tracking-[0.2em] text-black/40 uppercase dark:text-white/40">
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

      <section className="relative z-10 px-5 py-32 dark:border-white/10 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex gap-8">
            <div className="hidden w-px self-stretch bg-black/15 dark:bg-white/15 sm:block" />
            <div>
              <p className="font-sans text-[clamp(2rem,6vw,4.5rem)] font-medium leading-[1.05] tracking-[-0.03em]">
                the
                <br />
                best
                <br />
                ideas deserve
                <br />
                <span className="text-black/30 dark:text-white/30">the Word.</span>
              </p>
              <p className="mt-10 max-w-sm font-sans text-[14px] leading-relaxed text-black/55 dark:text-white/55">
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
                  className="font-sans text-[13px] tracking-[0.12em] text-black/45 uppercase dark:text-white/45"
                >
                  About
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10px-5 py-28 dark:border-white/10 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="font-sans text-[11px] tracking-[0.2em] text-black/40 uppercase dark:text-white/40">
            Seek by meaning
          </p>
          <ul className="mt-12 divide-y divide-black/10 dark:divide-white/10">
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
                  <span className="shrink-0 font-sans text-[12px] tracking-wide text-black/35 dark:text-white/35">
                    {t.ref}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative z-10px-5 py-32 dark:border-white/10 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <p className="font-sans text-[11px] tracking-[0.2em] text-black/40 uppercase dark:text-white/40">
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

      <section className="relative z-10px-5 py-32 dark:border-white/10 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="font-sans text-[11px] tracking-[0.2em] text-black/40 uppercase dark:text-white/40">
            Write directly
          </p>
          <h2 className="mt-4 font-sans text-[clamp(2.5rem,8vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.03em]">
            Contact
          </h2>
          <a
            href="mailto:vijay.peddenti434@gmail.com"
            className="mt-8 block font-sans text-[clamp(1rem,2.5vw,1.35rem)] underline-offset-4 hover:underline"
          >
            vijay.peddenti434@gmail.com
          </a>
          <div className="mt-16 flex flex-wrap gap-x-8 gap-y-3 font-sans text-[13px] text-black/45 dark:text-white/45">
            <Link to="/about" className="hover:text-black dark:hover:text-white">
              About
            </Link>
            <Link to="/books" className="hover:text-black dark:hover:text-white">
              Bible
            </Link>
            <Link to="/faq" className="hover:text-black dark:hover:text-white">
              FAQ
            </Link>
            <Link to="/contact" className="hover:text-black dark:hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 px-5 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-baseline justify-between gap-6">
            <span className="font-sans text-[clamp(3rem,11vw,7.5rem)] font-medium leading-none tracking-[-0.04em]">
              SEEK
            </span>
            <span className="font-sans text-[clamp(3rem,11vw,7.5rem)] font-medium leading-none tracking-[-0.04em]">
              BIBLE
            </span>
          </div>

          <div className="mt-12 flex flex-col items-center gap-2 text-center">
            <p className="font-sans text-[12px] text-black/40 dark:text-white/40">
              © {new Date().getFullYear()} SEEK · KJV public domain
            </p>
            <p className="font-sans text-[12px] text-black/40 dark:text-white/40">
              Free · No ads · No paywall
            </p>
            <nav
              aria-label="Footer"
              className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-sans text-[12px] text-black/40 dark:text-white/40"
            >
              <Link to="/about" className="transition hover:text-black dark:hover:text-white">
                About
              </Link>
              <Link to="/books" className="transition hover:text-black dark:hover:text-white">
                Bible
              </Link>
              <Link to="/faq" className="transition hover:text-black dark:hover:text-white">
                FAQ
              </Link>
              <Link to="/groups" className="transition hover:text-black dark:hover:text-white">
                Groups
              </Link>
              <Link to="/contact" className="transition hover:text-black dark:hover:text-white">
                Contact
              </Link>
              <Link to="/download" className="transition hover:text-black dark:hover:text-white">
                Download
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
