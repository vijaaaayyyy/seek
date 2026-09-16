import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useSeekStore } from "@/lib/store";
import { ArrowRight, ChevronRight, Search } from "lucide-react";
import { HERO_BIBLE_IMAGE } from "@/data/hero-image";

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
    <div className="relative -mx-4 -mt-3 flex min-h-[calc(100dvh-7.5rem)] flex-col overflow-hidden">
      {/* Full-bleed scenic background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(245,235,215,0.72) 0%, rgba(245,235,215,0.35) 28%, rgba(245,235,215,0.08) 48%, rgba(20,16,10,0.15) 72%, rgba(20,16,10,0.45) 100%), url(${HERO_BIBLE_IMAGE})`,
            backgroundPosition: "center 40%",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#f3e9d4]/80 via-transparent to-black/50 dark:from-[#0b0c11]/75 dark:via-transparent dark:to-black/70" />
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex flex-1 flex-col px-5 pt-2 pb-3">
        <p className="text-center font-sans text-[10px] font-medium tracking-[0.28em] text-ink/70 uppercase dark:text-ink/80">
          Scripture for every season
        </p>

        <h1 className="mt-3 text-center font-serif text-[2.55rem] leading-[1.12] font-medium tracking-tight text-ink sm:text-[2.75rem]">
          The Word
          <br />
          <span className="italic">you were looking for.</span>
        </h1>

        <p className="mx-auto mt-3 max-w-[17rem] text-center font-sans text-[14px] leading-relaxed text-ink/70 dark:text-ink/75">
          Search Scripture by verse, phrase, feeling, or story.
        </p>

        {/* Search */}
        <form onSubmit={submit} className="mx-auto mt-6 w-full max-w-md">
          <label htmlFor="home-search" className="sr-only">
            Search the Bible
          </label>
          <div className="relative flex items-center rounded-full bg-white/90 shadow-[0_8px_32px_rgba(40,30,10,0.18)] ring-1 ring-black/5 backdrop-blur-xl dark:bg-[#1c1f2c]/85 dark:ring-white/10">
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
              className="rounded-full bg-white/75 px-3.5 py-1.5 font-sans text-[12.5px] text-ink/80 shadow-sm ring-1 ring-black/5 backdrop-blur-md transition-transform duration-150 active:scale-[0.97] hover:bg-white/90 dark:bg-white/10 dark:text-ink/90 dark:ring-white/10"
            >
              “{ex.label}”
            </button>
          ))}
        </div>

        {/* Bible focal point + verse */}
        <div className="relative mx-auto mt-auto w-full max-w-sm flex-1">
          <div className="absolute inset-x-0 top-[8%] z-10 text-center">
            <p className="font-serif text-[15px] tracking-[0.12em] text-white/95 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] uppercase">
              Your word
            </p>
            <p className="mt-0.5 font-serif text-[15px] tracking-[0.12em] text-white/95 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] uppercase">
              lights my path.
            </p>
            <p className="mt-1.5 font-sans text-[10px] tracking-[0.22em] text-white/75 uppercase">
              Psalm 119:105
            </p>
          </div>
          <img
            src={HERO_BIBLE_IMAGE}
            alt="Open Bible glowing with light"
            width={1400}
            height={1186}
            decoding="async"
            className="mx-auto mt-6 w-full max-w-[340px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
          />
        </div>

        {/* Explore card */}
        <Link
          to="/books"
          className="mt-2 mb-1 flex items-center gap-3 rounded-[20px] bg-black/45 px-4 py-3.5 ring-1 ring-white/10 backdrop-blur-xl transition-transform duration-150 active:scale-[0.99] dark:bg-black/55"
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
