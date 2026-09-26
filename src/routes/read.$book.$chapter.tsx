import { createFileRoute, notFound, useRouterState } from "@tanstack/react-router";
import { BookReader } from "@/components/book-reader";
import { ChapterReader } from "@/components/chapter-reader";
import { Skeleton } from "@/components/ui/skeleton";
import { useBible } from "@/components/bible-provider";
import { bookBySlug } from "@/lib/bible/meta";
import { getChapter, normalize } from "@/lib/bible/load";
import { useSeekStore } from "@/lib/store";
import { CANONICAL_ORIGIN, canonical } from "@/lib/seo";

export const Route = createFileRoute("/read/$book/$chapter")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  // Validation lives in a loader, not in the component. Throwing `notFound()`
  // during render makes the server abandon SSR and stream a 200 with an empty
  // body — a soft-404 that crawlers index and visitors see as a blank page. From
  // a loader, the router renders the NotFound route *and* the response status is
  // a real 404, with the not-found page fully server-rendered.
  loader: ({ params }) => {
    const book = bookBySlug(params.book);
    const chapter = Number(params.chapter);
    if (
      !book ||
      !Number.isInteger(chapter) ||
      chapter < 1 ||
      chapter > book.chapters.length
    ) {
      throw notFound();
    }
  },
  component: ReadPage,
  head: ({ params }) => {
    const book = bookBySlug(params.book);
    const chapter = Number(params.chapter);
    const valid = !!book && Number.isInteger(chapter) && chapter >= 1 && chapter <= book.chapters.length;

    // A reference that is not in the Bible gets a real 404 from the loader, so
    // it must never be indexed and must not canonicalise anywhere — least of
    // all to the homepage.
    if (!valid || !book) {
      return {
        meta: [
          { title: "Page Not Found | SEEK" },
          { name: "robots", content: "noindex, follow" },
        ],
        links: [],
      };
    }

    const title = `${book.name} ${chapter} — King James Bible | SEEK`;
    const description = `Read ${book.name} ${chapter} of the King James Bible (KJV) online, free. All ${book.chapters.length} chapters of ${book.name} in the 1611 Authorized Version.`;
    const href = canonical(`/read/${book.slug}/${chapter}`);

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1" },
        // `Chapter` is not a schema.org type — using it produced markup no
        // consumer could interpret. The page is a `WebPage`; the thing it is
        // about is a `Book`, and the KJV itself is the containing `Book`.
        {
          "script:ld+json": {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: `${book.name} ${chapter} — King James Bible`,
            url: href,
            description,
            inLanguage: "en",
            isPartOf: { "@type": "WebSite", name: "SEEK", url: `${CANONICAL_ORIGIN}/` },
            mainEntityOfPage: {
              "@type": "Book",
              name: `${book.name} (King James Bible)`,
              url: href,
              bookFormat: "https://schema.org/EBook",
              inLanguage: "en",
              isPartOf: {
                "@type": "Book",
                name: "King James Bible (KJV)",
                url: `${CANONICAL_ORIGIN}/books`,
              },
            },
          },
        },
        {
          "script:ld+json": {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "SEEK", item: `${CANONICAL_ORIGIN}/` },
              { "@type": "ListItem", position: 2, name: "Books", item: `${CANONICAL_ORIGIN}/books` },
              {
                "@type": "ListItem",
                position: 3,
                name: `${book.name} ${chapter}`,
                item: href,
              },
            ],
          },
        },
      ] as Array<Record<string, unknown>>,
      links: [{ rel: "canonical", href }],
    };
  },
});

function ReadPage() {
  const { book: slug, chapter: chapterParam } = Route.useParams();
  const { q } = Route.useSearch();
  const hash = useRouterState({ select: (s) => s.location.hash });
  const { bible, ready, error } = useBible();
  const readerView = useSeekStore((s) => s.readerView);
  const book = bookBySlug(slug);
  const chapter = Number(chapterParam);

  // The loader above has already rejected invalid references with a real 404,
  // so by the time we render, both of these are sound. The guard is kept as a
  // type-narrowing assertion, not as a second source of truth.
  if (!book) throw notFound();

  if (error) {
    return <p className="pt-16 text-center font-sans text-sm text-muted">{error}</p>;
  }

  if (!ready || !bible) {
    return (
      <div className="pt-4">
        <Skeleton className="h-14 w-full rounded-[22px]" />
        <div className="mt-6 space-y-3">
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
    <div className="pt-1">
      {readerView === "book" ? (
        <BookReader
          book={book}
          chapter={chapter}
          verses={verses}
          highlight={highlight}
          focusVerse={Number.isFinite(parsed) ? parsed : undefined}
        />
      ) : (
        <ChapterReader
          book={book}
          chapter={chapter}
          verses={verses}
          highlight={highlight}
          focusVerse={Number.isFinite(parsed) ? parsed : undefined}
        />
      )}
    </div>
  );
}
