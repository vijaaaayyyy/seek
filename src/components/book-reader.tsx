import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BookPicker } from "@/components/book-picker";
import { Highlighted } from "@/components/highlighted";
import { ReadingModeToggle } from "@/components/reading-mode-toggle";
import { BOOKS, type BookMeta } from "@/lib/bible/meta";
import type { IndexedVerse } from "@/lib/bible/load";
import { cn } from "@/lib/utils";

const CHAR_W = 8.2;
const LINE_H = 30;
const PAD_X = 44;
const HEADER_H = 52;
const FOOTER_H = 38;

type Flip = { dir: "next" | "prev"; from: number } | null;

function paginate(verses: IndexedVerse[], width: number, height: number): IndexedVerse[][] {
  if (verses.length === 0) return [];
  if (!width || !height) return [verses];
  const usableWidth = Math.max(160, width - PAD_X);
  const charsPerLine = Math.max(24, Math.floor(usableWidth / CHAR_W));
  const maxLines = Math.max(6, Math.floor((height - HEADER_H - FOOTER_H) / LINE_H));
  const pages: IndexedVerse[][] = [];
  let page: IndexedVerse[] = [];
  let lines = 0;
  for (const v of verses) {
    const vLines = Math.max(1, Math.ceil((v.text.length + 4) / charsPerLine));
    if (page.length > 0 && lines + vLines > maxLines) {
      pages.push(page);
      page = [];
      lines = 0;
    }
    page.push(v);
    lines += vLines;
  }
  if (page.length > 0) pages.push(page);
  return pages;
}

export function BookReader({
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
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [index, setIndex] = useState(0);
  const [flip, setFlip] = useState<Flip>(null);
  const [chapterPrompt, setChapterPrompt] = useState(false);
  const navigate = useNavigate();
  const sheetRef = useRef<HTMLDivElement>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const handledFocus = useRef<number | undefined>(undefined);

  const pages = useMemo(() => paginate(verses, size.width, size.height), [verses, size]);
  const pageCount = pages.length;

  useEffect(() => {
    const el = sheetRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize((prev) =>
          Math.abs(prev.width - width) < 2 && Math.abs(prev.height - height) < 2
            ? prev
            : { width, height },
        );
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setIndex(0);
    setFlip(null);
    setChapterPrompt(false);
  }, [book.slug, chapter]);

  useEffect(() => {
    if (!focusVerse || handledFocus.current === focusVerse || pages.length === 0) return;
    handledFocus.current = focusVerse;
    const wanted = pages.findIndex((p) => p.some((v) => v.verse === focusVerse));
    if (wanted >= 0) {
      setFlip(null);
      setIndex(wanted);
    }
  }, [focusVerse, pages]);

  const targetIndex = flip ? (flip.dir === "next" ? flip.from + 1 : flip.from - 1) : index;
  const under = pages[targetIndex] ?? [];

  const go = useCallback(
    (dir: "next" | "prev") => {
      if (flip || chapterPrompt) return;
      const nextIndex = dir === "next" ? index + 1 : index - 1;
      if (nextIndex < 0) return;
      if (nextIndex >= pageCount) {
        if (dir === "next") setChapterPrompt(true);
        return;
      }
      setFlip({ dir, from: index });
    },
    [flip, index, pageCount, chapterPrompt],
  );

  function commitFlip() {
    if (!flip) return;
    setIndex(flip.dir === "next" ? flip.from + 1 : flip.from - 1);
    setFlip(null);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") go("next");
      else if (e.key === "ArrowLeft") go("prev");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  function onPointerDown(e: React.PointerEvent) {
    pointer.current = { x: e.clientX, y: e.clientY };
  }
  function onPointerUp(e: React.PointerEvent) {
    if (!pointer.current) return;
    const dx = e.clientX - pointer.current.x;
    pointer.current = null;
    if (Math.abs(dx) < 48) return;
    go(dx < 0 ? "next" : "prev");
  }

  const prevChapter = adjacentChapter(book, chapter, -1);
  const nextChapter = adjacentChapter(book, chapter, 1);
  const pageLabel = book.name + " " + chapter;

  return (
    <div className="pb-6">
      <div className="sticky top-0 z-20 -mx-1 px-0.5 pb-2 pt-1">
        <div className="glass glass-strong flex items-center justify-between gap-2 rounded-[22px] py-1.5 pr-1.5 pl-1">
          <div className="min-w-0">
            <BookPicker book={book} chapter={chapter} />
            <p className="px-3 font-sans text-[11px] text-muted">
              Chapter {chapter} of {book.chapters.length}
              <span className="text-faint"> · </span>
              Page {Math.min(index + 1, Math.max(pageCount, 1))} / {Math.max(pageCount, 1)}
              <span className="text-faint"> · </span>
              {verses.length} verses
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <ReadingModeToggle />
            {prevChapter ? (
              <Link
                to="/read/$book/$chapter"
                params={{ book: prevChapter.slug, chapter: String(prevChapter.chapter) }}
                search={{ q: undefined }}
                aria-label="Previous chapter"
                className="inline-flex size-10 items-center justify-center rounded-full text-ink transition-transform duration-150 active:scale-[0.96] hover:bg-ink/8"
              >
                <ChevronLeft className="size-5" />
              </Link>
            ) : (
              <span className="inline-flex size-10 items-center justify-center rounded-full text-faint opacity-40">
                <ChevronLeft className="size-5" />
              </span>
            )}
            {nextChapter ? (
              <Link
                to="/read/$book/$chapter"
                params={{ book: nextChapter.slug, chapter: String(nextChapter.chapter) }}
                search={{ q: undefined }}
                aria-label="Next chapter"
                className="inline-flex size-10 items-center justify-center rounded-full text-ink transition-transform duration-150 active:scale-[0.96] hover:bg-ink/8"
              >
                <ChevronRight className="size-5" />
              </Link>
            ) : (
              <span className="inline-flex size-10 items-center justify-center rounded-full text-faint opacity-40">
                <ChevronRight className="size-5" />
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 px-0.5">
        <div className="book-stage mx-auto w-full max-w-2xl">
          <div
            ref={sheetRef}
            className="relative h-[min(62dvh,560px)] min-h-[360px] w-full cursor-pointer select-none touch-pan-y"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            <PageSheet
              book={book}
              chapter={chapter}
              pageLabel={pageLabel}
              verses={under}
              pageNo={targetIndex + 1}
              pageCount={pageCount || 1}
              highlight={highlight}
              className="absolute inset-0"
              aria-hidden={flip ? false : true}
            />

            {flip && (
              <div
                key={`${flip.dir}-${flip.from}`}
                onAnimationEnd={commitFlip}
                className={cn(
                  "book-leaf absolute inset-0",
                  flip.dir === "next" ? "book-flip-next" : "book-flip-prev",
                )}
              >
                <PageSheet
                  book={book}
                  chapter={chapter}
                  pageLabel={pageLabel}
                  verses={pages[flip.from] ?? []}
                  pageNo={flip.from + 1}
                  pageCount={pageCount || 1}
                  highlight={highlight}
                  className="h-full"
                />
              </div>
            )}
          </div>
        </div>

        <div className="mx-auto mt-4 flex w-full max-w-2xl items-center justify-between gap-3 px-1">
          <button
            type="button"
            onClick={() => go("prev")}
            disabled={flip !== null || index === 0}
            aria-label="Previous page"
            className="inline-flex size-11 items-center justify-center rounded-full glass text-ink transition-transform duration-150 active:scale-[0.94] disabled:opacity-35 disabled:active:scale-100"
          >
            <ChevronLeft className="size-5" />
          </button>
          <p className="font-sans text-[13px] text-muted tabular-nums">
            Page {index + 1} <span className="text-faint">of {pageCount}</span>
          </p>
          <button
            type="button"
            onClick={() => go("next")}
            disabled={flip !== null || chapterPrompt}
            aria-label="Next page"
            className="inline-flex size-11 items-center justify-center rounded-full glass text-ink transition-transform duration-150 active:scale-[0.94] disabled:opacity-35 disabled:active:scale-100"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      {chapterPrompt && (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45 p-4 backdrop-blur-[2px] sm:items-center"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-[28px] bg-paper p-6 text-ink shadow-[0_24px_64px_rgba(0,0,0,0.35)] ring-1 ring-black/10 dark:bg-[#1a1c22] dark:ring-white/10">
            <p className="font-serif text-[1.35rem] font-medium tracking-tight">
              Chapter {chapter} finished
            </p>
            <p className="mt-2 font-sans text-[14px] leading-relaxed text-muted">
              {nextChapter
                ? "Continue to the next chapter, or stay on this one?"
                : "You've reached the end of this book. Stay on this chapter?"}
            </p>
            <div className="mt-5 grid gap-2">
              {nextChapter && (
                <button
                  type="button"
                  onClick={() => {
                    setChapterPrompt(false);
                    void navigate({
                      to: "/read/$book/$chapter",
                      params: {
                        book: nextChapter.slug,
                        chapter: String(nextChapter.chapter),
                      },
                      search: { q: undefined },
                    });
                  }}
                  className="flex h-12 items-center justify-center rounded-full bg-ink font-sans text-[14px] font-medium text-paper transition-transform active:scale-[0.98]"
                >
                  Next chapter
                </button>
              )}
              <button
                type="button"
                onClick={() => setChapterPrompt(false)}
                className="flex h-12 items-center justify-center rounded-full bg-ink/8 font-sans text-[14px] font-medium text-ink transition-transform active:scale-[0.98] dark:bg-white/10"
              >
                Stay on chapter {chapter}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PageSheet({
  book,
  chapter,
  pageLabel,
  verses,
  pageNo,
  pageCount,
  highlight,
  className,
}: {
  book: BookMeta;
  chapter: number;
  pageLabel: string;
  verses: IndexedVerse[];
  pageNo: number;
  pageCount: number;
  highlight: string[];
  className?: string;
  "aria-hidden"?: boolean;
}) {
  return (
    <div
      className={cn(
        "book-page flex flex-col overflow-hidden rounded-[22px] border border-line bg-[var(--paper)] text-ink shadow-[0_1px_2px_var(--glass-drop),0_14px_40px_var(--glass-drop)]",
        className,
      )}
    >
      <div className="relative px-5 pt-4 pb-2 text-center">
        <p className="font-sans text-[10px] font-medium tracking-[0.28em] text-muted uppercase">
          Holy Bible
        </p>
        <p className="mt-0.5 font-serif text-[15px] leading-none font-medium tracking-tight">
          {pageLabel}
        </p>
        <span className="mx-auto mt-2 block h-px w-10 bg-line" />
      </div>

      <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pt-1 pb-2">
        {verses.map((v, i) => (
          <p key={v.verse} className={cn("font-serif text-[17px] leading-[1.7]", i > 0 && "mt-1.5")}>
            <sup className="mr-1 font-sans text-[10px] font-medium text-faint tabular-nums">
              {v.verse}
            </sup>
            <Highlighted text={v.text} needles={highlight} />
          </p>
        ))}
      </div>

      <div className="px-5 pt-2 pb-3 text-center">
        <span className="mx-auto block h-px w-10 bg-line" />
        <p className="mt-2 font-sans text-[11px] text-faint tabular-nums">
          {book.abbrev} {chapter} · {pageNo} / {pageCount}
        </p>
      </div>
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
