import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useSeekStore } from "@/lib/store";
import { ArrowUpRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const EXAMPLES = [
  { q: "God so loved the world", label: "God so loved the world" },
  { q: "mercy", label: "Mercy" },
  { q: "love one another", label: "Love one another" },
  { q: "sacrifice", label: "Sacrifice" },
  { q: "Psalm 23", label: "Psalm 23" },
];

const BOOKS = [
  { slug: "john", name: "John", chapters: 21 },
  { slug: "romans", name: "Romans", chapters: 16 },
  { slug: "psalms", name: "Psalms", chapters: 150 },
  { slug: "matthew", name: "Matthew", chapters: 28 },
  { slug: "genesis", name: "Genesis", chapters: 50 },
  { slug: "isaiah", name: "Isaiah", chapters: 66 },
  { slug: "ephesians", name: "Ephesians", chapters: 6 },
  { slug: "1-john", name: "1 John", chapters: 5 },
];

const STEPS = [
  { n: "01", title: "Seek", body: "Type a verse, a story, or a longing. Search by exact words or by meaning." },
  { n: "02", title: "Receive", body: "Open the chapter. Read slowly in page or scroll mode, day or night." },
  { n: "03", title: "Abide", body: "Save the verses that hold you. Return to them when you need grace again." },
];

function useInView<T extends HTMLElement>(rootMargin = "0px 0px -8% 0px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) setInView(true); },
      { rootMargin, threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return { ref, inView };
}

function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        className,
      )}
      style={{ transitionDelay: inView ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

export function Home() {
  const rememberQuery = useSeekStore((s) => s.rememberQuery);
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [scrollY, setScrollY] = useState(0);
  const [docH, setDocH] = useState(1);
  const [vh, setVh] = useState(1);
  const finaleRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const measure = () => {
      setDocH(document.documentElement.scrollHeight || 1);
      setVh(window.innerHeight || 1);
    };
    const onScroll = () => {
      setScrollY(window.scrollY || document.documentElement.scrollTop);
      measure();
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", measure);
    };
  }, []);

  const merge = useMemo(() => {
    const max = Math.max(1, docH - vh);
    // Start joining in the lower third; fully together by the end
    const t = Math.min(1, Math.max(0, (scrollY - max * 0.45) / (max * 0.5)));
    return t * t * (3 - 2 * t);
  }, [scrollY, docH, vh]);

  // Side words slide toward center and stop as one phrase "seek bible"
  const sideOpacity = 0.14 + merge * 0.5;
  const sideScale = 1 + merge * 0.12;
  // horizontal offset from viewport center (shrinks as they meet)
  const fromCenter = 42 * (1 - merge); // vw; 0 when fully together
  // small gap between the two words when joined
  const halfGap = 0.8;

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

  const p1 = scrollY * 0.1;
  const p2 = scrollY * 0.07;

  return (
    <div className="relative min-h-[100dvh] bg-[#f4f4f4] text-black dark:bg-[#0c0d12] dark:text-[#f5f0e8]">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
        <div className="absolute left-[4%] top-[18%] h-[22vmin] w-[32vmin] rounded-sm bg-black/[0.06] blur-[20px] dark:bg-white/[0.06]" style={{ transform: `translate3d(0, ${p1 * 0.4}px, 0)` }} />
        <div className="absolute right-[6%] top-[30%] h-[26vmin] w-[34vmin] rounded-sm bg-black/[0.07] blur-[24px] dark:bg-white/[0.07]" style={{ transform: `translate3d(0, ${-p2 * 0.5}px, 0)` }} />
        <div className="absolute left-[12%] top-[8%] h-[12vmin] w-[10vmin] bg-black/90 dark:bg-white/90" />
      </div>

      {/* seek ← → bible : meet in the middle and stop as "seek bible" */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-6 z-20 h-[clamp(2.5rem,8vw,4.5rem)]"
        aria-hidden
      >
        <span
          className="absolute bottom-0 select-none font-sans text-[clamp(2rem,7vw,4rem)] font-medium tracking-tight text-white/90 will-change-transform"
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
          className="absolute bottom-0 select-none font-sans text-[clamp(2rem,7vw,4rem)] font-medium tracking-tight text-white/90 will-change-transform"
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

      {/* Dark cinematic search hero */}
      <section className="relative z-10 flex min-h-[100dvh] flex-col bg-[#0c0d12] px-5 pt-20 pb-12 text-[#f5f0e8] sm:px-10 lg:px-16">
        <div className="flex items-start justify-between gap-6">
          <div className="flex gap-6">
            <div className="hidden h-14 w-11 bg-white/90 sm:block" aria-hidden />
            <div className="border-l border-white/25 pl-4">
              <p className="font-sans text-[12px] leading-snug text-white/70">Free · KJV<br />66 books</p>
            </div>
          </div>
          <p className="max-w-[11rem] text-right font-sans text-[12px] leading-snug text-white/55">Search a half-<br />remembered word</p>
        </div>

        <div className="relative flex flex-1 flex-col items-center justify-center py-20">
          <h1
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-[55%] select-none text-center font-serif text-[clamp(5.5rem,22vw,14rem)] font-medium leading-none tracking-[-0.04em] text-white/[0.09]"
            aria-hidden
          >
            SEEK
          </h1>
          <span className="sr-only">SEEK</span>

          <form onSubmit={submit} className="relative z-10 w-full max-w-xl px-2">
            <label htmlFor="home-search" className="sr-only">Search the Bible</label>
            <div className="flex items-center gap-3 border-b border-white/20 pb-3">
              <Search className="size-[18px] shrink-0 text-white/40" strokeWidth={1.5} />
              <input
                id="home-search"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                enterKeyHint="search"
                placeholder="Search love, mercy, a verse..."
                className="h-11 min-w-0 flex-1 bg-transparent font-serif text-[1.15rem] text-white outline-none placeholder:text-white/40 sm:text-[1.25rem]"
              />
              <button
                type="submit"
                aria-label="Search"
                className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/25 text-white/70 transition hover:border-white hover:text-white"
              >
                <ArrowUpRight className="size-4" strokeWidth={1.75} />
              </button>
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2">
              {EXAMPLES.map((item) => (
                <button
                  key={item.q}
                  type="button"
                  onClick={() => run(item.q)}
                  className="font-sans text-[10px] tracking-[0.14em] text-white/40 uppercase transition hover:text-white sm:text-[11px]"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </form>
        </div>

        <div className="mt-auto flex items-end justify-between pt-8">
          <p className="font-sans text-[12px] text-white/40">Scroll</p>
          <a href="#work" className="font-sans text-[12px] tracking-[0.16em] text-white/40 uppercase">↓</a>
        </div>
      </section>

      <section id="work" className="relative z-10 border-t border-black/10 bg-[#f4f4f4] px-5 py-28 dark:border-white/10 dark:bg-[#0c0d12] sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-16 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <p className="font-sans text-[11px] tracking-[0.2em] text-black/40 uppercase dark:text-white/40">Corpus</p>
            <h2 className="mt-3 font-sans text-[clamp(3.5rem,12vw,8rem)] font-medium leading-[0.9] tracking-[-0.04em]">66<span className="block text-black/25 dark:text-white/25">books</span></h2>
          </Reveal>
          <div className="grid grid-cols-3 gap-8 sm:gap-12">
            {[{ v: "1,189", l: "Chapters" }, { v: "31k", l: "Verses" }, { v: "KJV", l: "Only" }].map((s, i) => (
              <Reveal key={s.l} delay={i * 80}>
                <p className="font-sans text-[clamp(1.6rem,3.5vw,2.5rem)] font-medium tracking-tight">{s.v}</p>
                <p className="mt-1 font-sans text-[11px] tracking-[0.16em] text-black/40 uppercase dark:text-white/40">{s.l}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-[#f4f4f4] px-5 py-28 dark:bg-[#0c0d12] sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <p className="font-sans text-[clamp(2rem,6vw,4.25rem)] font-medium leading-[1.08] tracking-[-0.03em]">the best ideas<br />deserve <span className="text-black/30 dark:text-white/30">the Word.</span></p>
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-8 max-w-md font-sans text-[15px] leading-relaxed text-black/55 dark:text-white/55">Search by a half-remembered phrase or the meaning you meant. The King James Bible — free, no ads, no paywall.</p>
          </Reveal>
          <Reveal delay={160} className="mt-10 flex flex-wrap gap-6">
            <Link to="/books" className="font-sans text-[13px] tracking-[0.12em] uppercase underline underline-offset-4">Open the Bible</Link>
            <Link to="/about" className="font-sans text-[13px] tracking-[0.12em] text-black/45 uppercase dark:text-white/45">About</Link>
          </Reveal>
        </div>
      </section>

      <section className="relative z-10 border-t border-black/10 bg-[#f4f4f4] px-5 py-28 dark:border-white/10 dark:bg-[#0c0d12] sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <p className="font-sans text-[11px] tracking-[0.2em] text-black/40 uppercase dark:text-white/40">Seek by meaning</p>
            <h2 className="mt-3 font-sans text-[clamp(2rem,5.5vw,3.25rem)] font-medium tracking-[-0.03em]">Start with a longing.</h2>
          </Reveal>
          <ul className="mt-12 divide-y divide-black/10 dark:divide-white/10">
            {[{"q":"love of God","label":"Love","ref":"1 Jn 4:19"},{"q":"mercy","label":"Mercy","ref":"Ps 136:1"},{"q":"grace","label":"Grace","ref":"Eph 2:8"},{"q":"hope","label":"Hope","ref":"Heb 6:19"},{"q":"peace","label":"Peace","ref":"Phil 4:7"},{"q":"faith","label":"Faith","ref":"Heb 11:1"}].map((t, i) => (
              <li key={t.q}>
                <Reveal delay={Math.min(i * 40, 200)}>
                  <button type="button" onClick={() => run(t.q)} className="group flex w-full items-baseline justify-between gap-4 py-6 text-left">
                    <span className="font-sans text-[clamp(1.35rem,3.5vw,2.15rem)] font-medium tracking-tight transition group-hover:opacity-50">{t.label}</span>
                    <span className="shrink-0 font-sans text-[12px] text-black/35 dark:text-white/35">{t.ref}</span>
                  </button>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative z-10 border-t border-black/10 bg-[#f4f4f4] px-5 py-28 dark:border-white/10 dark:bg-[#0c0d12] sm:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <p className="font-sans text-[11px] tracking-[0.2em] text-black/40 uppercase dark:text-white/40">John 3:16</p>
            <p className="mt-8 font-sans text-[clamp(1.3rem,3.2vw,2.1rem)] font-medium leading-[1.3] tracking-[-0.02em]">For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.</p>
            <Link to="/read/$book/$chapter" params={{ book: "john", chapter: "3" }} className="mt-10 inline-block font-sans text-[12px] tracking-[0.16em] uppercase underline underline-offset-4">Read the chapter</Link>
          </Reveal>
        </div>
      </section>

      <section className="relative z-10 border-t border-black/10 bg-[#f4f4f4] px-5 py-28 dark:border-white/10 dark:bg-[#0c0d12] sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <p className="font-sans text-[11px] tracking-[0.2em] text-black/40 uppercase dark:text-white/40">Start reading</p>
            <h2 className="mt-3 font-sans text-[clamp(2rem,5.5vw,3.25rem)] font-medium tracking-[-0.03em]">Popular books</h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-x-8 sm:grid-cols-4">
            {BOOKS.map((b, i) => (
              <Reveal key={b.slug} delay={Math.min(i * 40, 160)}>
                <Link to="/read/$book/$chapter" params={{ book: b.slug, chapter: "1" }} className="group block border-t border-black/10 py-5 dark:border-white/10">
                  <span className="block font-sans text-[1.1rem] font-medium group-hover:underline group-hover:underline-offset-4">{b.name}</span>
                  <span className="mt-1 block font-sans text-[12px] text-black/40 dark:text-white/40">{b.chapters} chapters</span>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal delay={120} className="mt-10">
            <Link to="/books" className="font-sans text-[13px] tracking-[0.12em] uppercase underline underline-offset-4">All 66 books</Link>
          </Reveal>
        </div>
      </section>

      <section className="relative z-10 border-t border-black/10 bg-[#f4f4f4] px-5 py-28 dark:border-white/10 dark:bg-[#0c0d12] sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <p className="font-sans text-[11px] tracking-[0.2em] text-black/40 uppercase dark:text-white/40">How it works</p>
            <h2 className="mt-3 font-sans text-[clamp(2rem,5.5vw,3.25rem)] font-medium tracking-[-0.03em]">Three quiet steps.</h2>
          </Reveal>
          <div className="mt-16 grid gap-12 sm:grid-cols-3 sm:gap-8">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 90}>
                <p className="font-sans text-[12px] tracking-[0.16em] text-black/40 dark:text-white/40">{s.n}</p>
                <h3 className="mt-3 font-sans text-[1.45rem] font-medium tracking-tight">{s.title}</h3>
                <p className="mt-2 font-sans text-[14px] leading-relaxed text-black/55 dark:text-white/55">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 border-t border-black/10 bg-black px-5 py-28 text-white dark:border-white/10 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <h2 className="max-w-2xl font-sans text-[clamp(2rem,5.5vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.03em]">Free forever.<br />No ads. No paywall.</h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="mt-6 max-w-md font-sans text-[15px] leading-relaxed text-white/55">The King James Version is public domain — so is the invitation.</p>
          </Reveal>
          <Reveal delay={140} className="mt-10 flex flex-wrap gap-4">
            <Link to="/books" className="inline-flex items-center rounded-full bg-white px-6 py-3 font-sans text-[13px] font-medium text-black">Open the Bible</Link>
            <Link to="/download" className="inline-flex items-center rounded-full border border-white/30 px-6 py-3 font-sans text-[13px] font-medium text-white">Download</Link>
          </Reveal>
        </div>
      </section>

      <section className="relative z-10 border-t border-black/10 bg-[#f4f4f4] px-5 py-28 dark:border-white/10 dark:bg-[#0c0d12] sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <p className="font-sans text-[11px] tracking-[0.2em] text-black/40 uppercase dark:text-white/40">Write directly</p>
            <h2 className="mt-3 font-sans text-[clamp(2.25rem,7vw,4.5rem)] font-medium tracking-[-0.03em]">Contact</h2>
            <a href="mailto:vijay.peddenti434@gmail.com" className="mt-8 block font-sans text-[clamp(1rem,2.2vw,1.25rem)] underline-offset-4 hover:underline">vijay.peddenti434@gmail.com</a>
          </Reveal>
        </div>
      </section>

      {/* Space for side labels to finish meeting — no second "seek bible" text */}
      <section
        ref={finaleRef}
        className="relative z-10 flex min-h-[45dvh] flex-col items-center justify-end border-t border-black/10 bg-[#f4f4f4] px-5 pb-28 pt-20 dark:border-white/10 dark:bg-[#0c0d12] sm:px-10"
      >
        <p className="max-w-xs text-center font-sans text-[14px] leading-relaxed text-black/45 dark:text-white/45">
          Keep seeking. The Word is near.
        </p>
      </section>

      <footer className="relative z-10 border-t border-black/10 bg-[#f4f4f4] px-5 py-8 dark:border-white/10 dark:bg-[#0c0d12] sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <p className="font-sans text-[12px] text-black/40 dark:text-white/40">© {new Date().getFullYear()} SEEK · KJV public domain</p>
          <p className="font-sans text-[12px] text-black/40 dark:text-white/40">Free · No ads · No paywall</p>
        </div>
      </footer>
    </div>
  );
}
