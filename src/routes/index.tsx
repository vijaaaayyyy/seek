import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useSeekStore } from "@/lib/store";
import { ArrowRight, ChevronRight, Search } from "lucide-react";

const EXAMPLES = [
  { q: "be not afraid", label: "be not afraid" },
  { q: "Psalm 23", label: "Psalm 23" },
  { q: "prodigal son", label: "prodigal son" },
  { q: "love your enemies", label: "love your enemies" },
  { q: "valley of the shadow", label: "valley of the shadow" },
];

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const rememberQuery = useSeekStore((s) => s.rememberQuery);
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
    <div className="relative -mx-4 -mt-3 flex min-h-[calc(100dvh-8.5rem)] flex-col">
      {/* Warm scenic atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,#f0c49a_0%,transparent_55%)] opacity-80 dark:opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_80%_100%,#c4a574_0%,transparent_50%)] opacity-60 dark:opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_10%_90%,#b7cbb8_0%,transparent_50%)] opacity-50 dark:opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/25 dark:to-black/50" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-5 pt-1 pb-2">
        <p className="text-center font-sans text-[10px] font-medium tracking-[0.28em] text-muted uppercase">
          Scripture for every season
        </p>

        <h1 className="mt-3 text-center font-serif text-[2.55rem] leading-[1.12] font-medium tracking-tight text-ink sm:text-[2.75rem]">
          The Word
          <br />
          <span className="italic">you were looking for.</span>
        </h1>

        <p className="mx-auto mt-3 max-w-[17rem] text-center font-sans text-[14px] leading-relaxed text-muted">
          Search Scripture by verse, phrase, feeling, or story.
        </p>

        {/* Search */}
        <form onSubmit={submit} className="mx-auto mt-6 w-full max-w-md">
          <label htmlFor="home-search" className="sr-only">
            Search the Bible
          </label>
          <div className="relative flex items-center rounded-full bg-white/90 shadow-[0_8px_32px_rgba(40,30,10,0.14)] ring-1 ring-black/5 backdrop-blur-xl dark:bg-[#1c1f2c]/90 dark:ring-white/10">
            <Search
              className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-muted"
              strokeWidth={1.8}
              aria-hidden
            />
            <input
              id="home-search"
              value={value}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="search"
              placeholder="Search a verse, phrase, or feeling…"
              onChange={(e) => setValue(e.target.value)}
              className="h-13 w-full bg-transparent py-3.5 pr-14 pl-11 font-sans text-[15px] text-ink placeholder:text-faint focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute top-1/2 right-1.5 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#2c3a32] text-white transition-transform duration-150 active:scale-95 dark:bg-[#c5d1c8] dark:text-[#121410]"
            >
              <ArrowRight className="size-4" strokeWidth={2.2} />
            </button>
          </div>
        </form>

        {/* Suggestion chips */}
        <div className="mx-auto mt-4 flex max-w-md flex-wrap justify-center gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.q}
              type="button"
              onClick={() => runExample(ex.q)}
              className="rounded-full bg-white/70 px-3.5 py-1.5 font-sans text-[12.5px] text-ink/80 shadow-sm ring-1 ring-black/5 backdrop-blur-md transition-transform duration-150 active:scale-[0.97] hover:bg-white/90 dark:bg-white/10 dark:text-ink/90 dark:ring-white/10"
            >
              “{ex.label}”
            </button>
          ))}
        </div>

        {/* Verse focal point */}
        <div className="mt-auto flex flex-1 flex-col items-center justify-center py-8">
          <div className="relative text-center">
            <div
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f0c49a]/35 blur-3xl dark:bg-[#f0c49a]/15"
            />
            <p className="relative font-serif text-[17px] tracking-[0.14em] text-ink/90 uppercase">
              Your word
            </p>
            <p className="relative mt-1 font-serif text-[17px] tracking-[0.14em] text-ink/90 uppercase">
              lights my path.
            </p>
            <p className="relative mt-2.5 font-sans text-[10px] tracking-[0.22em] text-muted uppercase">
              Psalm 119:105
            </p>
          </div>
        </div>

        {/* Explore card */}
        <Link
          to="/books"
          className="mb-1 flex items-center gap-3 rounded-[20px] bg-black/40 px-4 py-3.5 ring-1 ring-white/10 backdrop-blur-xl transition-transform duration-150 active:scale-[0.99] dark:bg-black/50"
        >
          <div className="min-w-0 flex-1">
            <p className="font-sans text-[14px] font-medium text-white">
              Not sure what to search?
            </p>
            <p className="mt-0.5 font-sans text-[12px] leading-snug text-white/70">
              Explore books, read a chapter, or find verses by topic.
            </p>
          </div>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
            <ChevronRight className="size-4" strokeWidth={2} />
          </span>
        </Link>
      </div>
    </div>
  );
}
