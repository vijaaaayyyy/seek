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
          <p className="pointer-events-none absolute left-1/2 top-[58%] z-0 -translate-x-1/2 select-none font-sans text-[clamp(2.5rem,10vw,7rem)] font-medium leading-none tracking-[-0.03em] text-black/15 dark:text-white/15">
            Scripture
          </p>

          <div className="relative z-10 mt-[28vh] w-full max-w-md bg-black p-6 text-white shadow-2xl dark:bg-white dark:text-black sm:p-8">
            <form onSubmit={submit}>
              <label htmlFor="home-search" className="sr-only">
                Search the Bible
              </label>
              <div className="flex items-center gap-3 border-b border-white/30 pb-3 dark:border-black/30">
                <Search className="size-4 shrink-0 opacity-60" strokeWidth={1.6} />
                <input
                  id="home-search"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  enterKeyHint="search"
                  placeholder="A verse, a word, a longing…"
                  className="w-full bg-transparent font-sans text-[1.05rem] outline-none placeholder:text-white/40 dark:placeholder:text-black/40"
                />
              </div>
            </form>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
              {EXAMPLES.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => run(q)}
                  className="font-sans text-[11px] tracking-wide text-white/50 transition hover:text-white dark:text-black/50 dark:hover:text-black"
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
        className="relative z-10 min-h-[80dvh] border-t border-black/10 px-5 py-28 dark:border-white/10 sm:px-10 lg:px-16"
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

      <section className="relative z-10 border-t border-black/10 px-5 py-28 dark:border-white/10 sm:px-10 lg:px-16">
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

      <section className="relative z-10 border-t border-black/10 px-5 py-32 dark:border-white/10 sm:px-10 lg:px-16">
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

      <section className="relative z-10 border-t border-black/10 px-5 py-32 dark:border-white/10 sm:px-10 lg:px-16">
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

      <footer className="relative z-10 border-t border-black/10 px-5 py-10 dark:border-white/10 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <p className="font-sans text-[12px] text-black/40 dark:text-white/40">
            © {new Date().getFullYear()} SEEK · KJV public domain
          </p>
          <p className="font-sans text-[12px] text-black/40 dark:text-white/40">
            Free · No ads · No paywall
          </p>
        </div>
      </footer>
    </div>
  );
}
