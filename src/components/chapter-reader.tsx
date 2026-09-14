import { Link } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { BookPicker } from "@/components/book-picker";
import { Highlighted } from "@/components/highlighted";
import { ReadingModeToggle } from "@/components/reading-mode-toggle";
import { useSaved } from "@/components/saved-provider";
import { BOOKS, formatRef, type BookMeta } from "@/lib/bible/meta";
import type { IndexedVerse } from "@/lib/bible/load";
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
  const { saved, toggleSaved } = useSaved();
  const prev = adjacentChapter(book, chapter, -1);
  const next = adjacentChapter(book, chapter, 1);

  useEffect(() => {
    if (!focusVerse) return;
    const el = document.getElementById(`v${focusVerse}`);
    if (el) el.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [focusVerse, book.slug, chapter]);

  return (
    <div className="pb-6">
      <div className="sticky top-[calc(env(safe-area-inset-top)+4.25rem)] z-20 px-0.5 pb-2">
        <div className="glass glass-strong flex items-center justify-between gap-2 rounded-[22px] py-1.5 pr-1.5 pl-1">
          <div className="min-w-0">
            <BookPicker book={book} chapter={chapter} />
            <p className="px-3 font-sans text-[11px] text-muted">
              {book.testament === "OT" ? "Old Testament" : "New Testament"} · {verses.length} verses
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <ReadingModeToggle />
            {prev ? (
              <Link
                to="/read/$book/$chapter"
                params={{ book: prev.slug, chapter: String(prev.chapter) }}
                search={{ q: undefined }}
                aria-label="Previous chapter"
                className="inline-flex size-11 items-center justify-center rounded-full text-ink transition-transform duration-150 active:scale-[0.96] hover:bg-ink/8"
              >
                <ChevronLeft className="size-5" />
              </Link>
            ) : (
              <span className="inline-flex size-11 items-center justify-center rounded-full text-faint opacity-40">
                <ChevronLeft className="size-5" />
              </span>
            )}
            {next ? (
              <Link
                to="/read/$book/$chapter"
                params={{ book: next.slug, chapter: String(next.chapter) }}
                search={{ q: undefined }}
                aria-label="Next chapter"
                className="inline-flex size-11 items-center justify-center rounded-full text-ink transition-transform duration-150 active:scale-[0.96] hover:bg-ink/8"
              >
                <ChevronRight className="size-5" />
              </Link>
            ) : (
              <span className="inline-flex size-11 items-center justify-center rounded-full text-faint opacity-40">
                <ChevronRight className="size-5" />
              </span>
            )}
          </div>
        </div>
      </div>

      <article className="mt-6">
        <h1 className="sr-only">
          {book.name} {chapter}
        </h1>
        <div className="glass rounded-[28px] px-5 py-6 font-serif text-[18px] leading-[1.65] text-ink">
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
                  "group relative -mx-2 mb-3 scroll-mt-36 rounded-xl px-2 py-1",
                  focused && "bg-mark/70",
                )}
              >
                <button
                  type="button"
                  className="mr-1.5 align-super font-sans text-[11px] font-medium text-muted tabular-nums hover:text-ink"
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
                    "ml-1.5 inline-flex size-8 translate-y-0.5 items-center justify-center rounded-full text-faint transition-colors",
                    isSaved ? "text-forest" : "opacity-70 hover:text-ink",
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
