import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { ChapterReader } from "@/components/chapter-reader";
import { Skeleton } from "@/components/ui/skeleton";
import { useBible } from "@/components/bible-provider";
import { bookBySlug } from "@/lib/bible/meta";
import { getChapter, normalize } from "@/lib/bible/load";

export const Route = createFileRoute("/read/$book/$chapter")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  component: ReadPage,
});

function ReadPage() {
  const { book: slug, chapter: chapterParam } = Route.useParams();
  const { q } = Route.useSearch();
  const hash = useRouterState({ select: (s) => s.location.hash });
  const { bible, ready, error } = useBible();
  const book = bookBySlug(slug);
  const chapter = Number(chapterParam);

  if (!book || !Number.isFinite(chapter) || chapter < 1 || chapter > book.chapters.length) {
    return (
      <div className="pt-16 text-center">
        <h1 className="font-serif text-3xl">That place is not in this Bible</h1>
        <p className="mt-2 font-sans text-sm text-muted">
          Check the book name and chapter, or return to the list.
        </p>
        <Link to="/books" className="mt-6 inline-block font-sans text-sm text-forest hover:underline">
          Browse books
        </Link>
      </div>
    );
  }

  if (error) {
    return <p className="pt-16 text-center font-sans text-sm text-muted">{error}</p>;
  }

  if (!ready || !bible) {
    return (
      <div className="pt-10">
        <Skeleton className="h-10 w-48" />
        <div className="mx-auto mt-8 max-w-2xl space-y-3">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-11/12" />
          <Skeleton className="h-6 w-10/12" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
    );
  }

  const verses = getChapter(bible, book.index, chapter);
  const rawHash = hash.replace(/^#/, "");
  const parsed = rawHash.startsWith("v") ? Number(rawHash.slice(1)) : Number.NaN;
  const highlight = q ? normalize(q).split(" ").filter((t) => t.length > 2) : [];

  return (
    <div className="pt-4">
      <ChapterReader
        book={book}
        chapter={chapter}
        verses={verses}
        highlight={highlight}
        focusVerse={Number.isFinite(parsed) ? parsed : undefined}
      />
    </div>
  );
}
