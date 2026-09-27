import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useSeekStore } from "@/lib/store";
import { Search } from "lucide-react";

const EXAMPLES = ["God so loved the world", "mercy", "Psalm 23", "be not afraid", "love one another"];

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

export function Home() {
  const rememberQuery = useSeekStore((s) => s.rememberQuery);
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [scrollY, setScrollY] = useState(0);
  const [docH, setDocH] = useState(1);
  const [vh, setVh] = useState(1);
  const rootRef = useRef<HTMLDivElement>(null);

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
    const t = Math.min(1, Math.max(0, (scrollY - max * 0.55) / (max * 0.45)));
    return t * t * (3 - 2 * t);
  }, [scrollY, docH, vh]);

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
  const leftX = `calc(${4 + merge * 38}vw)`;
  const rightX = `calc(${4 + merge * 38}vw)`;
  const labelOpacity = 0.1 + merge * 0.55;
  const labelScale = 1 + merge * 0.35;

  return (
    <div ref={rootRef} className="relative min-h-[100dvh] bg-[#f4f4f4] text-black dark:bg-[#0c0d12] dark:text-[#f5f0e8]">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
        <div className="absolute left-[4%] top-[18%] h-[22vmin] w-[32vmin] rounded-sm bg-black/10 blur-[18px] dark:bg-white/[0.08]" style={{ transform: `translate3d(0, ${p1 * 0.4}px, 0)` }} />
        <div className="absolute right-[6%] top-[28%] h-[26vmin] w-[34vmin] rounded-sm bg-black/12 blur-[22px] dark:bg-white/10" style={{ transform: `translate3d(0, ${-p2 * 0.5}px, 0)` }} />
        <div className="absolute bottom-[12%] left-[18%] h-[18vmin] w-[28vmin] rounded-sm bg-black/8 blur-[16px] dark:bg-white/[0.06]" style={{ transform: `translate3d(0, ${p3 * 0.3}px, 0)` }} />
        <div className="absolute left-[12%] top-[8%] h-[14vmin] w-[11vmin] bg-black dark:bg-white" style={{ transform: `translate3d(0, ${p2 * 0.25}px, 0)` }} />
        <div className="absolute right-[14%] top-[62%] h-[20vmin] w-[26vmin] rounded-sm bg-black/9 blur-[20px] dark:bg-white/[0.07]" style={{ transform: `translate3d(0, ${-p1 * 0.3}px, 0)` }} />
      </div>

      <span className="pointer-events-none fixed bottom-6 z-20 select-none font-sans text-[clamp(2.5rem,9vw,5rem)] font-medium tracking-tight text-black will-change-transform dark:text-white" style={{ left: leftX, opacity: labelOpacity, transform: `scale(${labelScale})`, transformOrigin: "left bottom" }} aria-hidden>seek</span>
      <span className="pointer-events-none fixed bottom-6 z-20 select-none font-sans text-[clamp(2.5rem,9vw,5rem)] font-medium tracking-tight text-black will-change-transform dark:text-white" style={{ right: rightX, opacity: labelOpacity, transform: `scale(${labelScale})`, transformOrigin: "right bottom" }} aria-hidden>bible</span>

      <section className="relative z-10 flex min-h-[100dvh] flex-col px-5 pt-20 pb-10 sm:px-10 lg:px-16">
        <div className="flex items-start justify-between gap-6">
          <div className="flex gap-6">
            <div className="hidden h-16 w-12 bg-black dark:bg-white sm:block" aria-hidden />
            <div className="border-l border-black/20 pl-4 dark:border-white/20">
              <p className="font-sans text-[12px] leading-snug text-black/70 dark:text-white/70">Free · KJV<br />66 books</p>
            </div>
          </div>
          <p className="max-w-[10rem] text-right font-sans text-[12px] leading-snug text-black/60 dark:text-white/60">Search a half-<br />remembered word</p>
        </div>
        <div className="relative flex flex-1 flex-col items-center justify-center">
          <h1 className="pointer-events-none absolute left-1/2 top-[38%] z-0 -translate-x-1/2 -translate-y-1/2 select-none text-center font-sans text-[clamp(4.5rem,18vw,13rem)] font-medium leading-[0.85] tracking-[-0.04em]">SEEK</h1>
          <p className="pointer-events-none absolute left-1/2 top-[58%] z-0 -translate-x-1/2 select-none font-sans text-[clamp(2.5rem,10vw,7rem)] font-medium leading-none tracking-[-0.03em] text-black/15 dark:text-white/15">Scripture</p>
          <div className="relative z-10 mt-[28vh] w-full max-w-md bg-black p-6 text-white shadow-2xl dark:bg-white dark:text-black sm:p-8">
            <form onSubmit={submit}>
              <label htmlFor="home-search" className="sr-only">Search the Bible</label>
              <div className="flex items-center gap-3 border-b border-white/30 pb-3 dark:border-black/30">
                <Search className="size-4 shrink-0 opacity-60" strokeWidth={1.6} />
                <input id="home-search" value={value} onChange={(e) => setValue(e.target.value)} autoComplete="off" spellCheck={false} enterKeyHint="search" placeholder="A verse, a word, a longing…" className="w-full bg-transparent font-sans text-[1.05rem] outline-none placeholder:text-white/40 dark:placeholder:text-black/40" />
              </div>
            </form>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
              {EXAMPLES.map((q) => (
                <button key={q} type="button" onClick={() => run(q)} className="font-sans text-[11px] tracking-wide text-white/50 transition hover:text-white dark:text-black/50 dark:hover:text-black">{q}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-auto flex items-end justify-between pt-10">
          <p className="font-sans text-[12px] text-black/50 dark:text-white/50">Designer<br />& the Word</p>
          <a href="#work" className="font-sans text-[12px] tracking-[0.16em] text-black/50 uppercase dark:text-white/50">Scroll</a>
        </div>
      </section>

      <section id="work" className="relative z-10 min-h-[90dvh] border-t border-black/10 px-5 py-32 dark:border-white/10 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-24 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-sans text-[11px] tracking-[0.2em] text-black/40 uppercase dark:text-white/40">Corpus</p>
            <h2 className="mt-4 font-sans text-[clamp(4rem,14vw,10rem)] font-medium leading-[0.9] tracking-[-0.04em]">66<span className="block text-black/25 dark:text-white/25">books</span></h2>
          </div>
          <div className="grid grid-cols-3 gap-10 sm:gap-16">
            {[{ v: "1,189", l: "Chapters" }, { v: "31k", l: "Verses" }, { v: "KJV", l: "Only" }].map((s) => (
              <div key={s.l}>
                <p className="font-sans text-[clamp(1.75rem,4vw,2.75rem)] font-medium tracking-tight">{s.v}</p>
                <p className="mt-1 font-sans text-[11px] tracking-[0.16em] text-black/40 uppercase dark:text-white/40">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 min-h-[70dvh] px-5 py-36 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex gap-8">
            <div className="hidden w-px self-stretch bg-black/15 dark:bg-white/15 sm:block" />
            <div>
              <p className="font-sans text-[clamp(2.25rem,7vw,5rem)] font-medium leading-[1.05] tracking-[-0.03em]">the<br />best<br />ideas deserve<br /><span className="text-black/30 dark:text-white/30">the Word.</span></p>
              <p className="mt-12 max-w-sm font-sans text-[15px] leading-relaxed text-black/55 dark:text-white/55">Search by a half-remembered phrase or the meaning you meant. Read the King James Bible — free, no ads, no paywall.</p>
              <div className="mt-12 flex flex-wrap gap-6">
                <Link to="/books" className="font-sans text-[13px] tracking-[0.12em] uppercase underline underline-offset-4">Open the Bible</Link>
                <Link to="/about" className="font-sans text-[13px] tracking-[0.12em] text-black/45 uppercase dark:text-white/45">About</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 min-h-[80dvh] border-t border-black/10 px-5 py-32 dark:border-white/10 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="font-sans text-[11px] tracking-[0.2em] text-black/40 uppercase dark:text-white/40">Seek by meaning</p>
          <h2 className="mt-4 max-w-xl font-sans text-[clamp(2.2rem,6vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.03em]">Start with a longing.</h2>
          <ul className="mt-16 divide-y divide-black/10 dark:divide-white/10">
            {[{"q":"love of God","label":"Love","ref":"1 Jn 4:19"},{"q":"mercy","label":"Mercy","ref":"Ps 136:1"},{"q":"grace","label":"Grace","ref":"Eph 2:8"},{"q":"hope","label":"Hope","ref":"Heb 6:19"},{"q":"peace","label":"Peace","ref":"Phil 4:7"},{"q":"faith","label":"Faith","ref":"Heb 11:1"},{"q":"forgiveness","label":"Forgiveness","ref":"1 Jn 1:9"},{"q":"sacrifice","label":"Sacrifice","ref":"Jn 3:16"}].map((t) => (
              <li key={t.q}>
                <button type="button" onClick={() => run(t.q)} className="group flex w-full items-baseline justify-between gap-4 py-7 text-left">
                  <span className="font-sans text-[clamp(1.5rem,4vw,2.5rem)] font-medium tracking-tight transition group-hover:opacity-55">{t.label}</span>
                  <span className="shrink-0 font-sans text-[12px] tracking-wide text-black/35 dark:text-white/35">{t.ref}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative z-10 min-h-[70dvh] border-t border-black/10 px-5 py-36 dark:border-white/10 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <p className="font-sans text-[11px] tracking-[0.2em] text-black/40 uppercase dark:text-white/40">John 3:16</p>
          <p className="mt-10 font-sans text-[clamp(1.4rem,3.8vw,2.4rem)] font-medium leading-[1.28] tracking-[-0.02em]">For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.</p>
          <Link to="/read/$book/$chapter" params={{ book: "john", chapter: "3" }} className="mt-12 inline-block font-sans text-[12px] tracking-[0.16em] uppercase underline underline-offset-4">Read the chapter</Link>
        </div>
      </section>

      <section className="relative z-10 min-h-[70dvh] border-t border-black/10 px-5 py-32 dark:border-white/10 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="font-sans text-[11px] tracking-[0.2em] text-black/40 uppercase dark:text-white/40">Start reading</p>
          <h2 className="mt-4 font-sans text-[clamp(2.2rem,6vw,3.75rem)] font-medium tracking-[-0.03em]">Popular books</h2>
          <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-0 sm:grid-cols-4">
            {BOOKS.map((b) => (
              <Link key={b.slug} to="/read/$book/$chapter" params={{ book: b.slug, chapter: "1" }} className="group border-t border-black/10 py-6 dark:border-white/10">
                <span className="block font-sans text-[1.15rem] font-medium tracking-tight group-hover:underline group-hover:underline-offset-4">{b.name}</span>
                <span className="mt-1 block font-sans text-[12px] text-black/40 dark:text-white/40">{b.chapters} chapters</span>
              </Link>
            ))}
          </div>
          <Link to="/books" className="mt-12 inline-block font-sans text-[13px] tracking-[0.12em] uppercase underline underline-offset-4">All 66 books</Link>
        </div>
      </section>

      <section className="relative z-10 min-h-[70dvh] border-t border-black/10 px-5 py-32 dark:border-white/10 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="font-sans text-[11px] tracking-[0.2em] text-black/40 uppercase dark:text-white/40">How it works</p>
          <h2 className="mt-4 font-sans text-[clamp(2.2rem,6vw,3.75rem)] font-medium tracking-[-0.03em]">Three quiet steps.</h2>
          <div className="mt-20 grid gap-16 sm:grid-cols-3 sm:gap-10">
            {STEPS.map((s) => (
              <div key={s.n}>
                <p className="font-sans text-[12px] tracking-[0.16em] text-black/40 dark:text-white/40">{s.n}</p>
                <h3 className="mt-4 font-sans text-[1.6rem] font-medium tracking-tight">{s.title}</h3>
                <p className="mt-3 font-sans text-[14.5px] leading-relaxed text-black/55 dark:text-white/55">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 min-h-[60dvh] border-t border-black/10 bg-black px-5 py-32 text-white dark:bg-white dark:text-black sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="max-w-2xl font-sans text-[clamp(2.25rem,6vw,4rem)] font-medium leading-[1.05] tracking-[-0.03em]">Free forever.<br />No ads. No paywall.</h2>
          <p className="mt-8 max-w-md font-sans text-[15px] leading-relaxed text-white/60 dark:text-black/55">The King James Version is public domain — so is the invitation.</p>
          <div className="mt-12 flex flex-wrap gap-6">
            <Link to="/books" className="inline-flex items-center rounded-full bg-white px-6 py-3 font-sans text-[13px] font-medium text-black dark:bg-black dark:text-white">Open the Bible</Link>
            <Link to="/download" className="inline-flex items-center rounded-full border border-white/30 px-6 py-3 font-sans text-[13px] font-medium dark:border-black/30">Download</Link>
          </div>
        </div>
      </section>

      <section className="relative z-10 min-h-[50dvh] border-t border-black/10 px-5 py-32 dark:border-white/10 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="font-sans text-[11px] tracking-[0.2em] text-black/40 uppercase dark:text-white/40">Write directly</p>
          <h2 className="mt-4 font-sans text-[clamp(2.5rem,8vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.03em]">Contact</h2>
          <a href="mailto:vijay.peddenti434@gmail.com" className="mt-10 block font-sans text-[clamp(1rem,2.5vw,1.35rem)] underline-offset-4 hover:underline">vijay.peddenti434@gmail.com</a>
          <div className="mt-16 flex flex-wrap gap-x-8 gap-y-3 font-sans text-[13px] text-black/45 dark:text-white/45">
            <Link to="/about" className="hover:text-black dark:hover:text-white">About</Link>
            <Link to="/books" className="hover:text-black dark:hover:text-white">Bible</Link>
            <Link to="/faq" className="hover:text-black dark:hover:text-white">FAQ</Link>
            <Link to="/contact" className="hover:text-black dark:hover:text-white">Contact</Link>
          </div>
        </div>
      </section>

      <section className="relative z-10 flex min-h-[85dvh] flex-col items-center justify-center border-t border-black/10 px-5 py-24 dark:border-white/10 sm:px-10">
        <p className="font-sans text-[11px] tracking-[0.2em] text-black/40 uppercase dark:text-white/40">Until the end</p>
        <p className="mt-10 text-center font-sans font-medium leading-[0.9] tracking-[-0.04em]" style={{ fontSize: "clamp(3rem, 14vw, 9rem)", opacity: 0.15 + merge * 0.85, transform: `scale(${0.92 + merge * 0.08})` }}>seek bible</p>
        <p className="mt-8 max-w-xs text-center font-sans text-[14px] leading-relaxed text-black/45 dark:text-white/45">Keep seeking. The Word is near.</p>
      </section>

      <footer className="relative z-10 border-t border-black/10 px-5 py-10 dark:border-white/10 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <p className="font-sans text-[12px] text-black/40 dark:text-white/40">© {new Date().getFullYear()} SEEK · KJV public domain</p>
          <p className="font-sans text-[12px] text-black/40 dark:text-white/40">Free · No ads · No paywall</p>
        </div>
      </footer>
    </div>
  );
}
