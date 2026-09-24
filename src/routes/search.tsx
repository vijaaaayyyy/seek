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
import { Compass } from "lucide-react";

type Tab = "all" | "wording" | "meaning";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : "",
  }),
  component: SearchPage,
  head: () => ({
    meta: [
      { title: "Search | Seek" },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
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
    const timer = window.setTimeout(() => {
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
    }, 450);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
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
  const tabs = [
    ["all", "All"],
    ["wording", "Wording"],
    ["meaning", "Meaning"],
  ] as const;

  return (
    <div className="pb-28 lg:pb-16">
      <div className="sticky top-0 z-20 -mx-1 mb-3 px-0.5 pb-2 pt-1">
        <SearchBox initial={q} autoFocus={!q} />
      </div>

      {q.trim().length < 2 ? (
        <p className="px-1 pt-6 text-center font-sans text-sm text-muted">
          Type at least two characters to search Scripture.
        </p>
      ) : (
        <div>
          {books.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {books.map((b) => (
                <Link
                  key={b.book.slug}
                  to="/read/$book/$chapter"
                  params={{ book: b.book.slug, chapter: "1" }}
                  search={{ q: undefined }}
                  className="rounded-full bg-ink/6 px-3 py-1.5 font-sans text-[12px] font-medium text-ink ring-1 ring-black/5 dark:bg-white/10 dark:ring-white/10"
                >
                  {b.book.name}
                </Link>
              ))}
            </div>
          )}

          {meaning.status === "ok" && meaning.reading && (
            <p className="mb-3 rounded-[18px] bg-forest/8 px-3.5 py-2.5 font-sans text-[13px] leading-relaxed text-ink dark:bg-forest/15">
              <span className="font-medium text-forest">Reading · </span>
              {meaning.reading}
            </p>
          )}

          <div className="mb-3 flex gap-1 rounded-full bg-ink/5 p-1 dark:bg-white/8">
            {tabs.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={cn(
                  "flex-1 rounded-full py-2 font-sans text-[12px] font-medium transition-colors",
                  tab === id ? "bg-paper text-ink shadow-sm dark:bg-ink/40" : "text-muted",
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-5 space-y-3">
            {!ready && <ResultSkeleton />}
            {error && (
              <p className="glass rounded-2xl px-4 py-3 text-sm text-muted">{error}</p>
            )}

            {ready && tab !== "wording" && meaning.status === "loading" && <ResultSkeleton />}
            {ready && tab !== "wording" && meaning.status === "err" && (
              <p className="glass rounded-2xl px-4 py-3 font-sans text-sm text-muted">
                {meaning.error}
              </p>
            )}

            {ready &&
              tab !== "wording" &&
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

            {ready &&
              tab !== "meaning" &&
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
              <p className="glass rounded-[22px] px-4 py-8 text-center font-sans text-sm text-muted">
                Nothing matched by meaning. Try a story, a feeling, or a shorter fragment.
              </p>
            )}
          </div>
        </div>
      )}

      {q.trim().length >= 2 && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(5.5rem,calc(env(safe-area-inset-bottom)+4.75rem))] lg:pb-8">
          <div className="pointer-events-auto flex w-full max-w-md items-center gap-2 rounded-full bg-ink/90 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.35)] ring-1 ring-white/10 backdrop-blur-xl dark:bg-paper/95 dark:ring-black/10">
            <Link
              to="/explore"
              className="flex min-w-0 flex-1 items-center gap-2.5 rounded-full px-3 py-2.5 text-paper transition-colors hover:bg-white/10 dark:text-ink dark:hover:bg-ink/5"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/15 dark:bg-ink/10">
                <Compass className="size-4" strokeWidth={2} />
              </span>
              <span className="min-w-0 text-left">
                <span className="block font-sans text-[13px] font-medium leading-tight">
                  Next search
                </span>
                <span className="block truncate font-sans text-[11px] leading-tight text-paper/60 dark:text-ink/55">
                  Recent, suggestions & more for you
                </span>
              </span>
            </Link>
            <Link
              to="/"
              className="shrink-0 rounded-full bg-white/15 px-3.5 py-2.5 font-sans text-[12px] font-medium text-paper dark:bg-ink/10 dark:text-ink"
            >
              Home
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function ResultSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-36 w-full rounded-[22px]" />
      <Skeleton className="h-36 w-full rounded-[22px]" />
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="glass rounded-[22px] px-5 py-8 text-center">
      <p className="font-serif text-xl text-ink">No wording match for “{query}”</p>
      <p className="mt-2 font-sans text-sm text-muted">
        Meaning search still looks for the intention behind those words.
      </p>
      <Badge className="mt-4">Try a shorter fragment</Badge>
    </div>
  );
}
