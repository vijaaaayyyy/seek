import { Link } from "@tanstack/react-router";
import {
  Anchor,
  BookMarked,
  Church,
  CloudRain,
  Heart,
  Leaf,
  Sparkles,
  Users,
} from "lucide-react";
import { APP_VERSION_LABEL } from "@/lib/version";
import { Reveal } from "@/components/reveal";
import { SwapText } from "@/components/swap-text";

const CONTACT_EMAIL = "vijay.peddenti434@gmail.com";

const TOPICS = [
  { q: "love of God", label: "Love", line: "He first loved us.", ref: "1 Jn 4:19", Icon: Heart },
  { q: "mercy", label: "Mercy", line: "His mercy endureth for ever.", ref: "Ps 136:1", Icon: CloudRain },
  { q: "grace", label: "Grace", line: "By grace are ye saved.", ref: "Eph 2:8", Icon: Sparkles },
  { q: "sacrifice", label: "Sacrifice", line: "He gave His only Son.", ref: "Jn 3:16", Icon: Church },
  { q: "forgiveness", label: "Forgiveness", line: "Cleanse us from our sins.", ref: "1 Jn 1:9", Icon: Users },
  { q: "hope", label: "Hope", line: "An anchor of the soul.", ref: "Heb 6:19", Icon: Anchor },
  { q: "peace", label: "Peace", line: "That passeth understanding.", ref: "Phil 4:7", Icon: Leaf },
  { q: "faith", label: "Faith", line: "Substance of things hoped for.", ref: "Heb 11:1", Icon: BookMarked },
];

const POPULAR_BOOKS = [
  { slug: "john", name: "John", chapters: 21 },
  { slug: "romans", name: "Romans", chapters: 16 },
  { slug: "psalms", name: "Psalms", chapters: 150 },
  { slug: "ephesians", name: "Ephesians", chapters: 6 },
  { slug: "matthew", name: "Matthew", chapters: 28 },
  { slug: "1-john", name: "1 John", chapters: 5 },
  { slug: "genesis", name: "Genesis", chapters: 50 },
  { slug: "isaiah", name: "Isaiah", chapters: 66 },
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
  {
    n: "01",
    title: "Seek",
    body: "Type a verse, a story, or a longing — love, mercy, forgiveness, or a name of God. Search by exact words or by meaning.",
  },
  {
    n: "02",
    title: "Receive",
    body: "Open the chapter. Read slowly in page or scroll mode, day or night. Let the Word speak of the Father's heart.",
  },
  {
    n: "03",
    title: "Abide",
    body: "Save the verses that hold you. Return to them on any device when you need grace again.",
  },
];

export function HomeSections({
  recent,
  runExample,
  userEmail,
}: {
  recent: string[];
  runExample: (q: string) => void;
  userEmail?: string | null;
}) {
  return (
    <>
      <section id="start" className="border-t border-ink/10 px-5 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal as="p" className="font-sans text-[11px] tracking-[0.22em] text-ink/45 uppercase">
            00 — Gospel
          </Reveal>
          <Reveal delay={60}>
            <p className="mt-8 max-w-4xl font-serif text-[clamp(1.75rem,4.8vw,3.6rem)] font-medium leading-[1.12] text-balance text-ink">
              “Beloved, let us love one another: for love is of God.”
            </p>
          </Reveal>
          <Reveal delay={120} as="p" className="mt-5 font-sans text-[12px] tracking-[0.18em] text-ink/45 uppercase">
            1 John 4:7
          </Reveal>
          <div className="mt-20 grid grid-cols-2 gap-10 border-t border-ink/10 pt-12 sm:grid-cols-4">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 50}>
                <p className="font-sans text-[clamp(2.25rem,5.5vw,3.5rem)] font-medium tracking-tight text-ink">{s.value}</p>
                <p className="mt-2 font-sans text-[11px] tracking-[0.18em] text-ink/45 uppercase">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-ink/10 px-5 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal as="p" className="font-sans text-[11px] tracking-[0.22em] text-ink/45 uppercase">01 — Topics</Reveal>
          <Reveal delay={40}>
            <h2 className="mt-4 max-w-2xl font-sans text-[clamp(2.2rem,6vw,3.75rem)] font-medium leading-[1.02] tracking-[-0.03em] text-ink">
              Search by the<br />feeling you meant.
            </h2>
          </Reveal>
          <Reveal delay={80} as="p" className="mt-5 max-w-lg font-sans text-[15px] leading-relaxed text-ink/55">
            Love, mercy, grace, hope — start with a longing and find the verses that answer it.
          </Reveal>
          <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TOPICS.map((t, i) => (
              <Reveal key={t.q} delay={Math.min(i * 40, 200)}>
                <button type="button" onClick={() => runExample(t.q)} className="group flex h-full w-full flex-col items-start rounded-2xl border border-ink/10 bg-white/50 p-6 text-left transition hover:border-ink/25 hover:bg-white/80 dark:bg-white/[0.04] dark:hover:bg-white/[0.08]">
                  <t.Icon className="size-5 text-ink/40 transition group-hover:text-ink" strokeWidth={1.5} />
                  <span className="mt-5 font-sans text-[16px] font-medium text-ink">{t.label}</span>
                  <span className="mt-1.5 font-serif text-[14px] italic leading-snug text-ink/50">{t.line}</span>
                  <span className="mt-4 font-sans text-[11px] tracking-wide text-ink/35">{t.ref}</span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-ink/10 px-5 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal as="p" className="font-sans text-[11px] tracking-[0.22em] text-ink/45 uppercase">02 — Featured</Reveal>
          <Link to="/read/$book/$chapter" params={{ book: FEATURED.book, chapter: FEATURED.chapter }} className="group mt-8 block">
            <Reveal delay={40}>
              <p className="max-w-4xl font-serif text-[clamp(1.5rem,3.8vw,2.75rem)] font-medium leading-[1.2] text-ink transition group-hover:text-ink/80">
                “{FEATURED.text}”
              </p>
            </Reveal>
            <Reveal delay={80} as="p" className="mt-6 font-sans text-[13px] tracking-[0.12em] text-ink/50 uppercase">
              <SwapText>{`${FEATURED.ref} · Read the chapter →`}</SwapText>
            </Reveal>
          </Link>
        </div>
      </section>

      <section className="border-t border-ink/10 px-5 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal as="p" className="font-sans text-[11px] tracking-[0.22em] text-ink/45 uppercase">03 — Books</Reveal>
          <Reveal delay={40}>
            <h2 className="mt-4 font-sans text-[clamp(2.2rem,6vw,3.75rem)] font-medium leading-[1.02] tracking-[-0.03em] text-ink">Start reading.</h2>
          </Reveal>
          <Reveal delay={80} as="p" className="mt-4 max-w-md font-sans text-[15px] leading-relaxed text-ink/55">
            Open a book. Every chapter of the King James Bible is here — free, calm, and ready.
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {POPULAR_BOOKS.map((b, i) => (
              <Reveal key={b.slug} delay={Math.min(i * 35, 180)}>
                <Link to="/read/$book/$chapter" params={{ book: b.slug, chapter: "1" }} className="group flex flex-col rounded-2xl border border-ink/10 bg-white/40 px-5 py-5 transition hover:border-ink/25 hover:bg-white/70 dark:bg-white/[0.04] dark:hover:bg-white/[0.08]">
                  <span className="font-sans text-[17px] font-medium text-ink group-hover:underline group-hover:underline-offset-4">{b.name}</span>
                  <span className="mt-1 font-sans text-[12px] text-ink/40">{b.chapters} chapters</span>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal delay={120} className="mt-8">
            <Link to="/books" className="inline-flex items-center gap-2 font-sans text-[13px] tracking-wide text-ink/60 transition hover:text-ink">
              <SwapText>Browse all 66 books →</SwapText>
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-ink/10 px-5 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal as="p" className="font-sans text-[11px] tracking-[0.22em] text-ink/45 uppercase">04 — How it works</Reveal>
          <Reveal delay={40}>
            <h2 className="mt-4 max-w-xl font-sans text-[clamp(2.2rem,6vw,3.75rem)] font-medium leading-[1.02] tracking-[-0.03em] text-ink">Three quiet steps.</h2>
          </Reveal>
          <div className="mt-16 grid gap-12 sm:grid-cols-3 sm:gap-8">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 60}>
                <p className="font-sans text-[12px] tracking-[0.16em] text-ink/40">{s.n}</p>
                <h3 className="mt-3 font-sans text-[1.5rem] font-medium tracking-tight text-ink">{s.title}</h3>
                <p className="mt-3 font-sans text-[14.5px] leading-relaxed text-ink/55">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {recent.length > 0 && (
        <section className="border-t border-ink/10 px-5 py-20 sm:px-10">
          <div className="mx-auto max-w-6xl">
            <Reveal as="p" className="font-sans text-[11px] tracking-[0.22em] text-ink/45 uppercase">Your recent</Reveal>
            <div className="mt-6 flex flex-wrap gap-2">
              {recent.slice(0, 8).map((q) => (
                <button key={q} type="button" onClick={() => runExample(q)} className="rounded-full border border-ink/12 px-4 py-2 font-sans text-[13px] text-ink/65 transition hover:border-ink/30 hover:text-ink">{q}</button>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-ink/10 bg-ink px-5 py-24 text-paper sm:px-10 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="max-w-2xl font-sans text-[clamp(2rem,5.5vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.03em]">
              The best ideas<br />deserve the Word.
            </h2>
          </Reveal>
          <Reveal delay={60} as="p" className="mt-6 max-w-md font-sans text-[15px] leading-relaxed text-paper/65">
            Free forever. No ads, no trackers, no paywall. The King James Version is public domain — so is the invitation.
          </Reveal>
          <Reveal delay={100} className="mt-10 flex flex-wrap gap-4">
            <Link to="/books" className="inline-flex items-center rounded-full bg-paper px-6 py-3 font-sans text-[13px] font-medium text-ink transition hover:opacity-90">Open the Bible</Link>
            <Link to="/about" className="inline-flex items-center rounded-full border border-paper/30 px-6 py-3 font-sans text-[13px] font-medium text-paper transition hover:border-paper/60">About SEEK</Link>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-ink/10 px-5 py-24 sm:px-10 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal as="p" className="font-sans text-[11px] tracking-[0.22em] text-ink/45 uppercase">Write directly</Reveal>
          <Reveal delay={40}>
            <h2 className="mt-4 font-sans text-[clamp(2rem,5vw,3.25rem)] font-medium tracking-[-0.03em] text-ink">Contact</h2>
          </Reveal>
          <Reveal delay={80} as="p" className="mt-4 max-w-md font-sans text-[15px] leading-relaxed text-ink/55">
            Questions, corrections, or something you would like SEEK to do better.
          </Reveal>
          <Reveal delay={120}>
            <a href={`mailto:${CONTACT_EMAIL}`} className="mt-8 inline-block font-serif text-[clamp(1.2rem,3vw,1.75rem)] text-ink underline-offset-4 hover:underline">{CONTACT_EMAIL}</a>
          </Reveal>
          <Reveal delay={140} className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-sans text-[13px] text-ink/50">
            <Link to="/contact" className="hover:text-ink">Contact page</Link>
            <Link to="/report-bug" className="hover:text-ink">Report a bug</Link>
            <Link to="/faq" className="hover:text-ink">FAQ</Link>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-ink/10 bg-paper px-5 pb-28 pt-16 sm:px-10 lg:pb-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 sm:grid-cols-3">
            <div>
              <p className="font-serif text-[1.35rem] tracking-tight text-ink">SEEK</p>
              <p className="mt-2 max-w-xs font-sans text-[13px] leading-relaxed text-ink/50">Bible search & scripture discovery. Free, ad-free, KJV.</p>
              {userEmail ? <p className="mt-3 font-sans text-[12px] text-ink/40">Signed in · {userEmail}</p> : null}
            </div>
            <div>
              <p className="font-sans text-[11px] tracking-[0.16em] text-ink/40 uppercase">Explore</p>
              <ul className="mt-3 space-y-2 font-sans text-[13px] text-ink/60">
                <li><Link to="/books" className="hover:text-ink">Bible</Link></li>
                <li><Link to="/explore" className="hover:text-ink">Explore</Link></li>
                <li><Link to="/saved" className="hover:text-ink">Saved</Link></li>
                <li><Link to="/download" className="hover:text-ink">Download</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-sans text-[11px] tracking-[0.16em] text-ink/40 uppercase">Info</p>
              <ul className="mt-3 space-y-2 font-sans text-[13px] text-ink/60">
                <li><Link to="/about" className="hover:text-ink">About</Link></li>
                <li><Link to="/pricing" className="hover:text-ink">Pricing</Link></li>
                <li><Link to="/faq" className="hover:text-ink">FAQ</Link></li>
                <li><Link to="/privacy" className="hover:text-ink">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-ink">Terms</Link></li>
                <li><Link to="/contact" className="hover:text-ink">Contact</Link></li>
              </ul>
            </div>
          </div>
          <p className="mt-12 font-sans text-[12px] text-ink/40">King James Version (KJV), 1611 · 66 books · 1,189 chapters · 31,102 verses · Free — no ads, no trackers, no paywall</p>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-6">
            <p className="font-sans text-[12px] text-ink/40">© {new Date().getFullYear()} SEEK · KJV is public domain</p>
            <p className="font-sans text-[12px] text-ink/40">{APP_VERSION_LABEL}</p>
          </div>
          <div aria-hidden className="mt-12 flex justify-center overflow-hidden" style={{ height: "clamp(2.4rem, 12vw, 9rem)" }}>
            <p className="select-none text-center font-sans text-[clamp(4rem,22vw,16rem)] font-medium leading-[0.8] tracking-[-0.05em] text-ink/[0.06]">SEEK</p>
          </div>
        </div>
      </footer>
    </>
  );
}
