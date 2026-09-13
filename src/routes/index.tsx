import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SearchBox } from "@/components/search-box";
import { BookGrid } from "@/components/book-grid";
import { VerseCard } from "@/components/verse-card";
import { useBible } from "@/components/bible-provider";
import { searchLocal } from "@/lib/bible/search";
import { useSeekStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { verseOfTheDay } from "@/data/daily";

const EXAMPLES = [
  { q: "begot", label: "begot" },
  { q: "walk on water", label: "walk on water" },
  { q: "comfort when I am afraid", label: "comfort when afraid" },
  { q: "prodigal son", label: "prodigal son" },
  { q: "valley of the shadow", label: "valley of the shadow" },
];

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const daily = verseOfTheDay();
  const { bible, ready } = useBible();
  const recent = useSeekStore((s) => s.recent);
  const rememberQuery = useSeekStore((s) => s.rememberQuery);
  const navigate = useNavigate();
  const hydrated = useHydrated();
  const [live, setLive] = useState("");

  const preview = useMemo(() => {
    if (!bible || live.trim().length < 3) return [];
    return searchLocal(bible, live, 4);
  }, [bible, live]);

  return (
    <div className="pt-10 sm:pt-16">
      <section className="mx-auto max-w-2xl text-center">
        <p className="font-sans text-xs font-medium tracking-widest text-muted uppercase">
          The whole Bible
        </p>
        <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
          Find the verse you only half remember
        </h1>
        <p className="mx-auto mt-4 max-w-lg font-sans text-base leading-relaxed text-muted">
          Type a fragment of a word, a feeling, or a story. Seek finds the place in
          Scripture — even when the exact wording is gone.
        </p>
        <div className="mt-8 text-left">
          <SearchBox
            autoFocus
            onSubmitQuery={(q) => rememberQuery(q)}
            onValueChange={setLive}
          />
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.q}
              type="button"
              onClick={() => {
                rememberQuery(ex.q);
                void navigate({ to: "/search", search: { q: ex.q } });
              }}
              className="rounded-full border border-line bg-surface px-3 py-1.5 font-sans text-xs text-muted transition-colors hover:border-forest/30 hover:text-ink"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </section>

      {ready && preview.length > 0 && (
        <section className="mx-auto mt-8 max-w-2xl space-y-3">
          <p className="font-sans text-xs tracking-widest text-muted uppercase">
            Instant matches
          </p>
          {preview.map((hit) => (
            <VerseCard
              key={hit.verse.i}
              verse={hit.verse}
              matched={hit.matched}
              reason={hit.reason}
              kind={hit.kind === "book" ? "reference" : hit.kind}
              query={live}
            />
          ))}
        </section>
      )}

      {hydrated && recent.length > 0 && (
        <section className="mx-auto mt-10 max-w-2xl">
          <p className="mb-2 font-sans text-xs tracking-widest text-muted uppercase">
            Recent
          </p>
          <div className="flex flex-wrap gap-2">
            {recent.map((q) => (
              <Link
                key={q}
                to="/search"
                search={{ q }}
                className="rounded-full bg-wash px-3 py-1.5 font-sans text-sm text-ink hover:bg-line"
              >
                {q}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto mt-14 max-w-2xl">
        <p className="font-sans text-xs tracking-widest text-muted uppercase">Today</p>
        <Link
          to="/read/$book/$chapter"
          params={{ book: daily.slug, chapter: String(daily.chapter) }}
          search={{ q: undefined }}
          hash={`v${daily.verse}`}
          className="mt-3 block rounded-xl border border-line bg-surface p-6 shadow-soft transition-colors hover:border-forest/30"
        >
          <p className="font-serif text-lg font-medium text-ink">
            {daily.book} {daily.chapter}:{daily.verse}
          </p>
          <p className="mt-3 font-serif text-lg leading-relaxed text-ink">{daily.text}</p>
        </Link>
      </section>

      <section className="mt-16 mb-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-medium tracking-tight">The books</h2>
            <p className="mt-1 font-sans text-sm text-muted">
              Sixty-six books. Open any chapter.
            </p>
          </div>
          <Link to="/books" className="font-sans text-sm text-forest hover:underline">
            Browse all
          </Link>
        </div>
        <BookGrid />
      </section>
    </div>
  );
}
