import { Link } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BookPicker } from "@/components/book-picker";
import { Highlighted } from "@/components/highlighted";
import { BOOKS, formatRef, type BookMeta } from "@/lib/bible/meta";
import type { IndexedVerse } from "@/lib/bible/load";
import { useSeekStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ChapterReader({
  book,
  chapter,
  verses,
  highlight = [],
  focusVerse,
}: {
  book: BookMeta;
  chapter: number;
  verses: IndexedVerse[];
  highlight?: string[];
  focusVerse?: number;
}) {
  const saved = useSeekStore((s) => s.saved);
  const toggleSaved = useSeekStore((s) => s.toggleSaved);
  const prev = adjacentChapter(book, chapter, -1);
  const next = adjacentChapter(book, chapter, 1);

  useEffect(() => {
    if (!focusVerse) return;
    const el = document.getElementById(`v${focusVerse}`);
    if (el) el.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [focusVerse, book.slug, chapter]);

  return (
    <div className="pb-8">
      <div className="sticky top-14 z-20 -mx-4 flex items-center justify-between gap-2 border-b border-line/70 bg-paper/95 px-4 py-2 backdrop-blur-sm sm:top-16 sm:mx-0 sm:rounded-xl sm:border sm:px-3">
        <div className="min-w-0">
          <BookPicker book={book} chapter={chapter} />
          <p className="px-2 font-sans text-xs text-muted">
            {book.testament === "OT" ? "Old Testament" : "New Testament"} · {verses.length} verses
          </p>
        </div>
        <div className="flex shrink-0 gap-1">
          {prev ? (
            <Button variant="ghost" size="icon-sm" asChild>
              <Link
                to="/read/$book/$chapter"
                params={{ book: prev.slug, chapter: String(prev.chapter) }}
                search={{ q: undefined }}
                aria-label="Previous chapter"
              >
                <ChevronLeft />
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" size="icon-sm" disabled aria-label="Previous chapter">
              <ChevronLeft />
            </Button>
          )}
          {next ? (
            <Button variant="ghost" size="icon-sm" asChild>
              <Link
                to="/read/$book/$chapter"
                params={{ book: next.slug, chapter: String(next.chapter) }}
                search={{ q: undefined }}
                aria-label="Next chapter"
              >
                <ChevronRight />
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" size="icon-sm" disabled aria-label="Next chapter">
              <ChevronRight />
            </Button>
          )}
        </div>
      </div>

      <article className="mx-auto mt-8 max-w-2xl">
        <h1 className="sr-only">
          {book.name} {chapter}
        </h1>
        <div className="font-serif text-lg leading-relaxed text-ink sm:text-xl sm:leading-relaxed">
          {verses.map((v) => {
            const isSaved = saved.some(
              (s) => s.slug === book.slug && s.chapter === v.chapter && s.verse === v.verse,
            );
            const focused = focusVerse === v.verse;
            return (
              <p
                key={v.verse}
                id={`v${v.verse}`}
                className={cn(
                  "group relative -mx-2 mb-3 rounded-md px-2 py-1",
                  focused && "bg-mark/70",
                )}
              >
                <button
                  type="button"
                  className="mr-1.5 align-super font-sans text-xs font-medium text-muted tabular-nums hover:text-forest"
                  onClick={async () => {
                    const citation = formatRef(book, v.chapter, v.verse);
                    try {
                      await navigator.clipboard.writeText(`${citation} — ${v.text}`);
                      toast("Copied verse");
                    } catch {
                      toast("Could not copy");
                    }
                  }}
                  aria-label={`Copy ${formatRef(book, v.chapter, v.verse)}`}
                >
                  {v.verse}
                </button>
                <Highlighted text={v.text} needles={highlight} />
                <button
                  type="button"
                  className={cn(
                    "ml-2 inline-flex size-7 translate-y-0.5 items-center justify-center rounded-sm text-faint opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100",
                    isSaved && "text-forest opacity-100",
                  )}
                  aria-label={isSaved ? "Remove from saved" : "Save verse"}
                  onClick={() =>
                    toggleSaved({
                      book: book.name,
                      slug: book.slug,
                      chapter: v.chapter,
                      verse: v.verse,
                      text: v.text,
                    })
                  }
                >
                  {isSaved ? (
                    <BookmarkCheck className="size-3.5" />
                  ) : (
                    <Bookmark className="size-3.5" />
                  )}
                </button>
              </p>
            );
          })}
        </div>
      </article>
    </div>
  );
}

function adjacentChapter(book: BookMeta, chapter: number, dir: -1 | 1) {
  const nextNum = chapter + dir;
  if (nextNum >= 1 && nextNum <= book.chapters.length) {
    return { slug: book.slug, chapter: nextNum };
  }
  const neighbor = BOOKS[book.index + dir];
  if (!neighbor) return null;
  return {
    slug: neighbor.slug,
    chapter: dir === 1 ? 1 : neighbor.chapters.length,
  };
}
