import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SearchBox } from "@/components/search-box";
import { VerseCard } from "@/components/verse-card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useBible } from "@/components/bible-provider";
import { searchByMeaning, type MeaningHit } from "@/lib/ai-search";
import { searchBooks, searchLocal } from "@/lib/bible/search";
import { bookByName, formatRef } from "@/lib/bible/meta";
import { getVerse, type IndexedVerse } from "@/lib/bible/load";
import { useSeekStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type Tab = "all" | "wording" | "meaning";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : "",
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const { bible, ready, error } = useBible();
  const rememberQuery = useSeekStore((s) => s.rememberQuery);
  const [tab, setTab] = useState<Tab>("all");
  const [meaning, setMeaning] = useState<{
    status: "idle" | "loading" | "ok" | "err";
    reading?: string;
    hits?: MeaningHit[];
    error?: string;
  }>({ status: "idle" });

  useEffect(() => {
    if (q.trim().length >= 2) rememberQuery(q);
  }, [q, rememberQuery]);

  const local = useMemo(() => {
    if (!bible || q.trim().length < 2) return [];
    return searchLocal(bible, q, 24);
  }, [bible, q]);

  const books = useMemo(() => searchBooks(q, 6), [q]);

  useEffect(() => {
    let cancelled = false;
    const query = q.trim();
    if (query.length < 2) {
      setMeaning({ status: "idle" });
      return;
    }
    setMeaning({ status: "loading" });
    searchByMeaning({ data: { query } })
      .then((res) => {
        if (cancelled) return;
        if (res.ok) setMeaning({ status: "ok", reading: res.reading, hits: res.results });
        else setMeaning({ status: "err", error: res.error });
      })
      .catch(() => {
        if (!cancelled) setMeaning({ status: "err", error: "Meaning search could not finish." });
      });
    return () => {
      cancelled = true;
    };
  }, [q]);

  const meaningCards = useMemo(() => {
    if (!bible || meaning.status !== "ok" || !meaning.hits) return [];
    const cards: { verse: IndexedVerse; why: string }[] = [];
    const seen = new Set<number>();
    for (const hit of meaning.hits) {
      const book = bookByName(hit.book);
      if (!book) continue;
      const verse = getVerse(bible, book.index, hit.chapter, hit.verse);
      if (!verse || seen.has(verse.i)) continue;
      seen.add(verse.i);
      const range =
        hit.endVerse && hit.endVerse !== hit.verse
          ? formatRef(book, hit.chapter, hit.verse, hit.endVerse)
          : null;
      cards.push({
        verse,
        why: range ? `${range}. ${hit.why}` : hit.why,
      });
    }
    return cards;
  }, [bible, meaning]);

  const meaningIds = new Set(meaningCards.map((c) => c.verse.i));
  const wordingRest = local.filter((hit) => !meaningIds.has(hit.verse.i));

  return (
    <div className="pt-6 sm:pt-10">
      <div className="mx-auto max-w-2xl">
        <SearchBox initial={q} size="md" onSubmitQuery={(next) => rememberQuery(next)} />
        <p className="mt-3 font-sans text-sm text-muted">
          {q.trim()
            ? "Wording matches appear at once. Meaning looks past the letters to what you intended."
            : "Search a fragment, a misspelling, or the thought behind a verse."}
        </p>
      </div>

      {q.trim().length >= 2 && (
        <div className="mx-auto mt-6 max-w-2xl">
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["all", "All"],
                ["wording", "By wording"],
                ["meaning", "By meaning"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={cn(
                  "h-10 rounded-full px-4 font-sans text-sm transition-colors",
                  tab === id ? "bg-forest text-forest-fg" : "bg-wash text-muted hover:text-ink",
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {meaning.status === "ok" && meaning.reading && tab !== "wording" && (
            <p className="mt-5 font-serif text-lg leading-snug text-ink italic">
              {meaning.reading}
            </p>
          )}

          {books.length > 0 && tab !== "meaning" && (
            <div className="mt-6 flex flex-wrap gap-2">
              {books.map(({ book, reason }) => (
                <Link
                  key={book.slug}
                  to="/read/$book/$chapter"
                  params={{ book: book.slug, chapter: "1" }}
                  search={{ q: undefined }}
                  className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 font-sans text-sm hover:border-forest/30"
                >
                  <span className="font-serif text-base">{book.name}</span>
                  <span className="text-xs text-muted">{reason}</span>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-6 space-y-3">
            {!ready && <ResultSkeleton />}
            {error && (
              <p className="rounded-lg border border-line bg-surface px-4 py-3 text-sm text-muted">
                {error}
              </p>
            )}

            {ready && tab !== "wording" && meaning.status === "loading" && <ResultSkeleton />}
            {ready && tab !== "wording" && meaning.status === "err" && (
              <p className="rounded-lg border border-line bg-surface px-4 py-3 font-sans text-sm text-muted">
                {meaning.error}
              </p>
            )}

            {ready && tab !== "wording" &&
              meaningCards.map((hit) => (
                <VerseCard
                  key={`m-${hit.verse.i}`}
                  verse={hit.verse}
                  reason={hit.why}
                  kind="meaning"
                  query={q}
                  matched={local.find((l) => l.verse.i === hit.verse.i)?.matched ?? []}
                />
              ))}

            {ready && tab !== "meaning" &&
              (tab === "wording" ? local : wordingRest).map((hit) => (
                <VerseCard
                  key={`w-${hit.verse.i}`}
                  verse={hit.verse}
                  matched={hit.matched}
                  reason={hit.reason}
                  kind={hit.kind === "book" ? "reference" : hit.kind}
                  query={q}
                />
              ))}

            {ready && local.length === 0 && tab === "wording" && <EmptyState query={q} />}
            {ready &&
              tab === "all" &&
              local.length === 0 &&
              meaningCards.length === 0 &&
              meaning.status !== "loading" && <EmptyState query={q} />}
            {ready && tab === "meaning" && meaning.status === "ok" && meaningCards.length === 0 && (
              <p className="rounded-lg border border-line bg-surface px-4 py-6 text-center font-sans text-sm text-muted">
                Nothing matched by meaning. Try a story, a feeling, or a shorter fragment.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ResultSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-36 w-full rounded-xl" />
      <Skeleton className="h-36 w-full rounded-xl" />
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface px-5 py-8 text-center">
      <p className="font-serif text-xl text-ink">No wording match for “{query}”</p>
      <p className="mt-2 font-sans text-sm text-muted">
        Meaning search still looks for the intention behind those words.
      </p>
      <Badge className="mt-4">Try a shorter fragment</Badge>
    </div>
  );
}
