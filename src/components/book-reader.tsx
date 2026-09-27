import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BookPicker } from "@/components/book-picker";
import { Highlighted } from "@/components/highlighted";
import { ReadingModeToggle } from "@/components/reading-mode-toggle";
import {
  VERSE_ACTIONS_CLASS,
  VerseShareButton,
} from "@/components/verse-share-button";
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

function adjacentChapter(book: BookMeta, chapter: number, dir: -1 | 1) {
  const nextNum = chapter + dir;
  if (nextNum >= 1 && nextNum <= book.chapters.length) {
    return { slug: book.slug, chapter: nextNum, name: book.name };
  }
  const neighbor = BOOKS[book.index + dir];
  if (!neighbor) return null;
  return {
    slug: neighbor.slug,
    chapter: dir === 1 ? 1 : neighbor.chapters.length,
    name: neighbor.name,
  };
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
    handledFocus.current = undefined;
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
  const isPrevFlip = flip !== null && flip.dir === "prev";
  const underBase = isPrevFlip ? pages[flip!.from] ?? [] : pages[targetIndex] ?? [];
  const sourcePage = flip ? (pages[flip.from] ?? []) : [];
  const leafPage = isPrevFlip ? pages[targetIndex] ?? [] : sourcePage;

  const go = useCallback(
    (dir: "next" | "prev") => {
      if (flip || chapterPrompt) return;
      const nextIndex = dir === "next" ? index + 1 : index - 1;
      if (nextIndex < 0) return;
      if (nextIndex >= pageCount) {
        if (dir === "next") {
          const nc = adjacentChapter(book, chapter, 1);
          if (nc) {
            void navigate({
              to: "/read/$book/$chapter",
              params: { book: nc.slug, chapter: String(nc.chapter) },
              search: { q: undefined },
            });
          } else {
            setChapterPrompt(true);
          }
        }
        return;
      }
      setFlip({ dir, from: index });
    },
    [flip, index, pageCount, chapterPrompt, book, chapter, navigate],
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

  const prevCh = adjacentChapter(book, chapter, -1);
  const nextCh = adjacentChapter(book, chapter, 1);
  const isFirstPage = index === 0;
  const isLastPage = index >= pageCount - 1;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-10 sm:px-6">
      <div className="flex items-start justify-between gap-4 border-b border-black/10 pb-4 dark:border-white/10">
        <div className="min-w-0">
          <BookPicker book={book} chapter={chapter} />
          <p className="mt-1 font-sans text-[12px] tracking-wide text-black/45 dark:text-white/45">
            Chapter {chapter} of {book.chapters.length}
            <span className="mx-1.5 text-black/25 dark:text-white/25">·</span>
            Page {Math.min(index + 1, Math.max(pageCount, 1))} / {Math.max(pageCount, 1)}
          </p>
        </div>
        <ReadingModeToggle />
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 font-sans text-[13px]">
        {prevCh ? (
          <Link
            to="/read/$book/$chapter"
            params={{ book: prevCh.slug, chapter: String(prevCh.chapter) }}
            search={{ q: undefined }}
            className="group flex min-w-0 items-center gap-1.5 text-black/50 transition hover:text-black dark:text-white/50 dark:hover:text-white"
          >
            <ChevronLeft className="size-4 shrink-0 opacity-60" />
            <span className="truncate group-hover:underline group-hover:underline-offset-4">
              {prevCh.name} {prevCh.chapter}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {nextCh ? (
          <Link
            to="/read/$book/$chapter"
            params={{ book: nextCh.slug, chapter: String(nextCh.chapter) }}
            search={{ q: undefined }}
            className="group flex min-w-0 items-center gap-1.5 text-black/50 transition hover:text-black dark:text-white/50 dark:hover:text-white"
          >
            <span className="truncate group-hover:underline group-hover:underline-offset-4">
              {nextCh.name} {nextCh.chapter}
            </span>
            <ChevronRight className="size-4 shrink-0 opacity-60" />
          </Link>
        ) : (
          <span />
        )}
      </div>

      <div className="mt-8">
        <div className="book-stage mx-auto w-full max-w-2xl">
          <div
            ref={sheetRef}
            className="relative h-[min(54dvh,560px)] min-h-[330px] w-full cursor-pointer select-none touch-pan-y"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            <PageSheet
              book={book}
              chapter={chapter}
              verses={underBase}
              pageNo={targetIndex + 1}
              pageCount={pageCount || 1}
              highlight={highlight}
              focusVerse={focusVerse}
              className="absolute inset-0"
              aria-hidden={flip === null ? undefined : true}
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
                  verses={leafPage}
                  pageNo={flip.dir === "prev" ? targetIndex + 1 : flip.from + 1}
                  pageCount={pageCount || 1}
                  highlight={highlight}
                  focusVerse={focusVerse}
                  className="h-full"
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex w-full items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => go("prev")}
            disabled={flip !== null || isFirstPage}
            aria-label="Previous page"
            className={cn(
              "font-sans text-[13px] tracking-wide transition",
              isFirstPage
                ? "text-black/25 dark:text-white/25"
                : "text-black/55 hover:text-black dark:text-white/55 dark:hover:text-white",
            )}
          >
            ← Prev
          </button>
          <p className="font-sans text-[13px] tabular-nums text-black/40 dark:text-white/40">
            {index + 1} / {pageCount}
          </p>
          <button
            type="button"
            onClick={() => go("next")}
            disabled={flip !== null || chapterPrompt}
            aria-label={isLastPage ? "Next chapter" : "Next page"}
            className={cn(
              "font-sans text-[13px] tracking-wide transition",
              chapterPrompt
                ? "text-black/25 dark:text-white/25"
                : "text-black/55 hover:text-black dark:text-white/55 dark:hover:text-white",
            )}
          >
            {isLastPage ? "Next ch." : "Next"} →
          </button>
        </div>
      </div>

      {chapterPrompt && (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45 p-4 backdrop-blur-[2px] sm:items-center"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-2xl bg-paper p-6 text-ink shadow-2xl ring-1 ring-black/10 dark:bg-[#1a1c22] dark:ring-white/10">
            <p className="font-serif text-[1.35rem] font-medium tracking-tight">
              Chapter {chapter} finished
            </p>
            <p className="mt-2 font-sans text-[14px] leading-relaxed text-muted">
              {nextCh
                ? `Continue to ${nextCh.name} ${nextCh.chapter}?`
                : "You've reached the end of this book."}
            </p>
            <div className="mt-5 grid gap-2">
              {nextCh && (
                <button
                  type="button"
                  onClick={() => {
                    setChapterPrompt(false);
                    void navigate({
                      to: "/read/$book/$chapter",
                      params: { book: nextCh.slug, chapter: String(nextCh.chapter) },
                      search: { q: undefined },
                    });
                  }}
                  className="flex h-12 items-center justify-center rounded-full bg-ink font-sans text-[14px] font-medium text-paper dark:bg-[#f5f0e8] dark:text-ink"
                >
                  Continue to {nextCh.name} {nextCh.chapter}
                </button>
              )}
              <button
                type="button"
                onClick={() => setChapterPrompt(false)}
                className="flex h-12 items-center justify-center rounded-full bg-ink/8 font-sans text-[14px] font-medium text-ink dark:bg-white/10"
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
  verses,
  pageNo,
  pageCount,
  highlight,
  focusVerse,
  className,
}: {
  book: BookMeta;
  chapter: number;
  verses: IndexedVerse[];
  pageNo: number;
  pageCount: number;
  highlight: string[];
  focusVerse?: number;
  className?: string;
  "aria-hidden"?: boolean;
}) {
  return (
    <div
      className={cn(
        "book-page flex flex-col overflow-hidden rounded-sm border border-black/10 bg-[#fafaf8] text-ink dark:border-white/10 dark:bg-[#14161c]",
        className,
      )}
    >
      <div className="relative px-5 pt-4 pb-2 text-center">
        <p className="font-sans text-[10px] font-medium tracking-[0.28em] text-muted uppercase">
          Holy Bible
        </p>
        <p className="mt-0.5 font-serif text-[15px] leading-none font-medium tracking-tight">
          {book.name} {chapter}
        </p>
        <span className="mx-auto mt-2 block h-px w-10 bg-line" />
      </div>

      <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pt-1 pb-2">
        {verses.map((v, i) => (
          <p
            key={v.verse}
            id={`c${chapter}-v${v.verse}`}
            className={cn(
              "group scroll-mt-24 rounded-lg px-1.5 py-0.5 font-serif text-[17px] leading-[1.7]",
              i > 0 && "mt-1.5",
              focusVerse === v.verse &&
                "bg-mark/55 ring-1 ring-forest/25 dark:bg-mark/40",
            )}
          >
            <sup
              className={cn(
                "mr-1 font-sans text-[10px] font-medium tabular-nums",
                focusVerse === v.verse ? "text-forest" : "text-faint",
              )}
            >
              {v.verse}
            </sup>
            <Highlighted text={v.text} needles={highlight} />
            <VerseShareButton
              book={book}
              chapter={chapter}
              verse={v.verse}
              text={v.text}
              className={cn(
                "ml-1 inline-flex translate-y-0.5 align-baseline text-faint",
                VERSE_ACTIONS_CLASS,
              )}
              iconClassName="size-3"
            />
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
