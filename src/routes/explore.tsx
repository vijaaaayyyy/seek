import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Clock,
  Compass,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useSeekStore } from "@/lib/store";
import { useSaved } from "@/components/saved-provider";

export const Route = createFileRoute("/explore")({
  component: ExplorePage,
});

const RELATED: Record<string, string[]> = {
  peace: ["be still", "peace of God", "John 14:27", "rest"],
  hope: ["hope in the Lord", "Romans 15:13", "wait on the Lord", "comfort"],
  love: ["love one another", "1 Corinthians 13", "God so loved", "charity"],
  strength: ["be strong", "Philippians 4:13", "mighty", "courage"],
  fear: ["be not afraid", "fear not", "Psalm 23", "courage"],
  faith: ["faith is the substance", "Hebrews 11", "believe", "trust"],
  anxiety: ["be anxious for nothing", "cast your cares", "peace", "rest"],
  wisdom: ["wisdom", "Proverbs 3", "understanding", "knowledge"],
  forgive: ["forgiveness", "forgive us", "mercy", "Matthew 6"],
  joy: ["rejoice", "joy of the Lord", "gladness", "Psalm 16"],
};

const TRENDING = [
  "Psalm 23",
  "be not afraid",
  "love your enemies",
  "prodigal son",
  "light of the world",
  "fruit of the Spirit",
];

const DISCOVER = [
  { q: "valley of the shadow", label: "Valley of the shadow", note: "Comfort in dark seasons" },
  { q: "armor of God", label: "Armor of God", note: "Ephesians 6" },
  { q: "good shepherd", label: "Good shepherd", note: "John 10" },
  { q: "new covenant", label: "New covenant", note: "Promise & grace" },
  { q: "beatitudes", label: "Beatitudes", note: "Matthew 5" },
  { q: "fruits of the spirit", label: "Fruits of the Spirit", note: "Galatians 5" },
];

function predictFromRecent(recent: string[]): string[] {
  const out: string[] = [];
  const seen = new Set(recent.map((r) => r.toLowerCase()));

  for (const q of recent) {
    const key = q.toLowerCase();
    for (const [k, list] of Object.entries(RELATED)) {
      if (key.includes(k)) {
        for (const s of list) {
          if (!seen.has(s.toLowerCase()) && !out.includes(s)) out.push(s);
        }
      }
    }
  }

  for (const t of TRENDING) {
    if (!seen.has(t.toLowerCase()) && !out.includes(t)) out.push(t);
  }

  return out.slice(0, 10);
}

function ExplorePage() {
  const recent = useSeekStore((s) => s.recent);
  const rememberQuery = useSeekStore((s) => s.rememberQuery);
  const clearRecent = useSeekStore((s) => s.clearRecent);
  const { saved } = useSaved();
  const navigate = useNavigate();
  const [value, setValue] = useState("");

  const predicted = useMemo(() => predictFromRecent(recent), [recent]);
  const last = recent[0];

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

  return (
    <div className="mx-auto max-w-2xl pb-28 pt-2 lg:pb-10">
      <div className="mb-5">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-1 text-forest dark:bg-forest/20">
          <Compass className="size-3.5" strokeWidth={2} />
          <span className="font-sans text-[11px] font-semibold tracking-[0.14em] uppercase">
            For you
          </span>
        </div>
        <h1 className="mt-3 font-serif text-[1.85rem] font-medium tracking-tight text-ink">
          {last ? (
            <>
              Continue from <span className="italic">“{last}”</span>
            </>
          ) : (
            "Pick up where you left off"
          )}
        </h1>
        <p className="mt-1.5 font-sans text-[14px] text-muted">
          Your recent searches, suggestions, and places to go next — not the
          generic home feed.
        </p>
      </div>

      <form onSubmit={submit} className="mb-6">
        <div className="relative flex items-center rounded-full bg-white shadow-sm ring-1 ring-black/8 dark:bg-white/8 dark:ring-white/10">
          <Search
            className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-muted"
            strokeWidth={1.8}
          />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search again…"
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="search"
            className="h-12 w-full bg-transparent py-3 pr-14 pl-11 font-sans text-[15px] text-ink placeholder:text-faint focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute top-1/2 right-1.5 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-paper"
          >
            <ArrowRight className="size-4" strokeWidth={2.2} />
          </button>
        </div>
      </form>

      <div className="mb-6 grid grid-cols-3 gap-2">
        <div className="rounded-[18px] bg-white px-3 py-3.5 text-center shadow-sm ring-1 ring-black/6 dark:bg-white/8 dark:ring-white/10">
          <p className="font-serif text-[1.25rem] font-medium text-ink tabular-nums">{recent.length}</p>
          <p className="mt-0.5 font-sans text-[10px] tracking-wide text-muted uppercase">Recent</p>
        </div>
        <div className="rounded-[18px] bg-white px-3 py-3.5 text-center shadow-sm ring-1 ring-black/6 dark:bg-white/8 dark:ring-white/10">
          <p className="font-serif text-[1.25rem] font-medium text-ink tabular-nums">{saved.length}</p>
          <p className="mt-0.5 font-sans text-[10px] tracking-wide text-muted uppercase">Saved</p>
        </div>
        <div className="rounded-[18px] bg-white px-3 py-3.5 text-center shadow-sm ring-1 ring-black/6 dark:bg-white/8 dark:ring-white/10">
          <p className="font-serif text-[1.25rem] font-medium text-ink tabular-nums">{predicted.length}</p>
          <p className="mt-0.5 font-sans text-[10px] tracking-wide text-muted uppercase">Suggested</p>
        </div>
      </div>

      <section className="mb-6">
        <div className="mb-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-muted">
            <Clock className="size-3.5" />
            <span className="font-sans text-[11px] font-medium tracking-[0.14em] uppercase">Your recent searches</span>
          </div>
          {recent.length > 0 && (
            <button type="button" onClick={() => clearRecent()} className="font-sans text-[12px] text-muted hover:text-ink">
              Clear
            </button>
          )}
        </div>
        {recent.length === 0 ? (
          <p className="rounded-[18px] bg-white/80 px-4 py-5 text-center font-sans text-[13px] text-muted ring-1 ring-black/5 dark:bg-white/6 dark:ring-white/10">
            Search something to build your history here.
          </p>
        ) : (
          <div className="space-y-2">
            {recent.map((q, i) => (
              <button
                key={q}
                type="button"
                onClick={() => run(q)}
                className="flex w-full items-center gap-3 rounded-[18px] bg-white px-3.5 py-3 text-left shadow-sm ring-1 ring-black/6 transition-colors hover:bg-ink/[0.03] dark:bg-white/8 dark:ring-white/10"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink/6 font-sans text-[12px] font-medium text-muted tabular-nums dark:bg-white/10">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 truncate font-sans text-[14px] text-ink">{q}</span>
                <ChevronRight className="size-4 shrink-0 text-faint" />
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="mb-6">
        <div className="mb-2.5 flex items-center gap-1.5 text-muted">
          <TrendingUp className="size-3.5" />
          <span className="font-sans text-[11px] font-medium tracking-[0.14em] uppercase">Suggested next searches</span>
        </div>
        <p className="mb-2.5 font-sans text-[12.5px] text-muted">
          Based on what you’ve looked up — try one of these next.
        </p>
        <div className="flex flex-wrap gap-2">
          {predicted.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => run(q)}
              className="rounded-full bg-white px-3.5 py-2 font-sans text-[13px] text-ink shadow-sm ring-1 ring-black/6 transition-colors hover:bg-ink/[0.04] dark:bg-white/8 dark:ring-white/10"
            >
              {q}
            </button>
          ))}
        </div>
      </section>

      {saved.length > 0 && (
        <section className="mb-6">
          <div className="mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-muted">
              <BookOpen className="size-3.5" />
              <span className="font-sans text-[11px] font-medium tracking-[0.14em] uppercase">From your saved</span>
            </div>
            <Link to="/saved" className="font-sans text-[12px] font-medium text-forest">See all</Link>
          </div>
          <div className="space-y-2">
            {saved.slice(0, 3).map((v) => (
              <Link
                key={`${v.slug}-${v.chapter}-${v.verse}`}
                to="/read/$book/$chapter"
                params={{ book: v.slug, chapter: String(v.chapter) }}
                search={{ q: undefined }}
                hash={`v${v.verse}`}
                className="block rounded-[18px] bg-white px-3.5 py-3 shadow-sm ring-1 ring-black/6 dark:bg-white/8 dark:ring-white/10"
              >
                <p className="font-sans text-[12px] font-medium text-forest">
                  {v.book} {v.chapter}:{v.verse}
                </p>
                <p className="mt-1 line-clamp-2 font-serif text-[14px] leading-snug text-ink">{v.text}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mb-6">
        <div className="mb-2.5 flex items-center gap-1.5 text-muted">
          <Sparkles className="size-3.5" />
          <span className="font-sans text-[11px] font-medium tracking-[0.14em] uppercase">Discover</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {DISCOVER.map((d) => (
            <button
              key={d.q}
              type="button"
              onClick={() => run(d.q)}
              className="rounded-[18px] bg-white px-3.5 py-3.5 text-left shadow-sm ring-1 ring-black/6 transition-colors hover:bg-ink/[0.03] dark:bg-white/8 dark:ring-white/10"
            >
              <p className="font-serif text-[15px] text-ink">{d.label}</p>
              <p className="mt-0.5 font-sans text-[12px] text-muted">{d.note}</p>
            </button>
          ))}
        </div>
      </section>

      <Link to="/books" className="flex items-center gap-3 rounded-[20px] bg-ink px-4 py-4 text-paper">
        <div className="min-w-0 flex-1">
          <p className="font-sans text-[14px] font-medium">Browse the full Bible</p>
          <p className="mt-0.5 font-sans text-[12px] text-paper/65">All 66 books · King James Version</p>
        </div>
        <ChevronRight className="size-5 shrink-0 opacity-70" />
      </Link>
    </div>
  );
}
