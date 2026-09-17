import { Link, useNavigate } from "@tanstack/react-router";
import {
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { BookPicker } from "@/components/book-picker";
import { Highlighted } from "@/components/highlighted";
import { ReadingModeToggle } from "@/components/reading-mode-toggle";
import { useSaved } from "@/components/saved-provider";
import { useBible } from "@/components/bible-provider";
import { BOOKS, formatRef, type BookMeta } from "@/lib/bible/meta";
import { getChapter, type IndexedVerse } from "@/lib/bible/load";
import { cn } from "@/lib/utils";

type ChapterBlock = {
  chapter: number;
  verses: IndexedVerse[];
};

export function ChapterReader({
  book,
  chapter,
  verses: initialVerses,
  highlight = [],
  focusVerse,
}: {
  book: BookMeta;
  chapter: number;
  verses: IndexedVerse[];
  highlight?: string[];
  focusVerse?: number;
}) {
  const { bible } = useBible();
  const { toggleSaved, isSaved } = useSaved();
  const navigate = useNavigate();
  const prev = adjacentChapter(book, chapter, -1);
  const next = adjacentChapter(book, chapter, 1);

  const [minChapter, setMinChapter] = useState(chapter);
  const [maxUnlocked, setMaxUnlocked] = useState(chapter);
  const [prompt, setPrompt] = useState<{
    finished: number;
    nextChapter: number | null;
  } | null>(null);

  useEffect(() => {
    setMinChapter(chapter);
    setMaxUnlocked(chapter);
    setPrompt(null);
  }, [book.slug]);

  useEffect(() => {
    setMinChapter((prev) => Math.min(prev, chapter));
    setMaxUnlocked((prev) => Math.max(prev, chapter));
    setPrompt(null);
  }, [chapter]);

  const blocks: ChapterBlock[] = useMemo(() => {
    const out: ChapterBlock[] = [];
    const start = Math.max(1, minChapter);
    const end = Math.min(maxUnlocked, book.chapters.length);
    for (let ch = start; ch <= end; ch++) {
      if (bible) {
        out.push({ chapter: ch, verses: getChapter(bible, book.index, ch) });
      } else if (ch === chapter) {
        out.push({ chapter: ch, verses: initialVerses });
      }
    }
    return out;
  }, [bible, book, chapter, minChapter, maxUnlocked, initialVerses]);

  const [activeChapter, setActiveChapter] = useState(chapter);
  const sectionRefs = useRef<Map<number, HTMLElement>>(new Map());
  const didInitialScroll = useRef(false);

  useEffect(() => {
    setActiveChapter(chapter);
  }, [chapter]);

  useEffect(() => {
    const run = () => {
      if (focusVerse) {
        const el = document.getElementById(`c${chapter}-v${focusVerse}`);
        if (el) {
          el.scrollIntoView({ block: "center", behavior: "smooth" });
          return;
        }
      }
      if (didInitialScroll.current) return;
      const sec = sectionRefs.current.get(chapter);
      if (sec) sec.scrollIntoView({ block: "start", behavior: "auto" });
    };
    didInitialScroll.current = true;
    requestAnimationFrame(() => requestAnimationFrame(run));
  }, [chapter, focusVerse, book.slug]);

  useEffect(() => {
    const roots = Array.from(sectionRefs.current.values());
    if (!roots.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        let best: { ch: number; ratio: number } | null = null;
        for (const e of entries) {
          const ch = Number((e.target as HTMLElement).dataset.chapter);
          if (!Number.isFinite(ch)) continue;
          if (!best || e.intersectionRatio > best.ratio) {
            best = { ch, ratio: e.intersectionRatio };
          }
        }
        if (best && best.ratio > 0.12) setActiveChapter(best.ch);
      },
      {
        root: null,
        rootMargin: "-25% 0px -50% 0px",
        threshold: [0, 0.12, 0.3, 0.5, 0.75, 1],
      },
    );

    for (const el of roots) io.observe(el);
    return () => io.disconnect();
  }, [blocks.length, book.slug, maxUnlocked, minChapter]);

  const onChapterEnd = useCallback(
    (finishedChapter: number) => {
      if (prompt) return;
      if (finishedChapter !== maxUnlocked) return;

      const nextCh =
        finishedChapter < book.chapters.length ? finishedChapter + 1 : null;
      setPrompt({ finished: finishedChapter, nextChapter: nextCh });
    },
    [book.chapters.length, prompt, maxUnlocked],
  );

  function stayHere() {
    setPrompt(null);
  }

  function goNext() {
    if (!prompt) return;
    const nextCh = prompt.nextChapter;
    setPrompt(null);

    if (nextCh != null) {
      setMaxUnlocked(nextCh);
      void navigate({
        to: "/read/$book/$chapter",
        params: { book: book.slug, chapter: String(nextCh) },
        search: { q: undefined },
        replace: true,
      });
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const sec = sectionRefs.current.get(nextCh);
          if (sec) sec.scrollIntoView({ block: "start", behavior: "smooth" });
        });
      });
    } else {
      const neighbor = BOOKS[book.index + 1];
      if (neighbor) {
        void navigate({
          to: "/read/$book/$chapter",
          params: { book: neighbor.slug, chapter: "1" },
          search: { q: undefined },
        });
      }
    }
  }

  const activeVerses =
    blocks.find((b) => b.chapter === activeChapter)?.verses.length ?? 0;

  return (
    <div className="relative pb-8">
      <div className="sticky top-0 z-20 -mx-1 mt-0.5 mb-1 px-1 pb-2 pt-1 sm:px-1.5">
        <div className="glass glass-strong flex items-center justify-between gap-2 rounded-[22px] py-1.5 pr-1.5 pl-1 shadow-sm">
          <div className="min-w-0">
            <BookPicker book={book} chapter={activeChapter} />
            <p className="px-3 font-sans text-[11px] text-muted">
              Chapter {activeChapter} of {book.chapters.length}
              <span className="text-faint"> · </span>
              {activeVerses} verses
              <span className="text-faint"> · </span>
              {book.testament === "OT" ? "OT" : "NT"}
              {minChapter < maxUnlocked && (
                <>
                  <span className="text-faint"> · </span>
                  Showing ch. {minChapter}–{maxUnlocked}
                </>
              )}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <ReadingModeToggle />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-1.5 flex max-w-2xl items-center gap-2 px-1 sm:px-1.5">
        {prev ? (
          <Link
            to="/read/$book/$chapter"
            params={{ book: prev.book.slug, chapter: String(prev.chapter) }}
            search={{ q: undefined }}
            className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-line bg-surface px-3 py-2.5 transition-colors hover:border-ink/20 hover:bg-white dark:hover:bg-white/5"
          >
            <ChevronLeft className="size-4 shrink-0 text-muted" />
            <span className="min-w-0 truncate font-sans text-[12.5px] font-medium text-ink">
              {prev.chapter <= maxUnlocked ? `${prev.book.name} ${prev.chapter}` : "Previous chapter"}
            </span>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        {next ? (
          <button
            type="button"
            aria-label="Next chapter"
            onClick={() => {
              if (next.chapter <= maxUnlocked) {
                void navigate({
                  to: "/read/$book/$chapter",
                  params: {
                    book: next.book.slug,
                    chapter: String(next.chapter),
                  },
                  search: { q: undefined },
                });
              } else {
                setPrompt({
                  finished: maxUnlocked,
                  nextChapter: next.chapter,
                });
              }
            }}
            className="flex min-w-0 flex-1 items-center justify-end gap-2 rounded-2xl border border-line bg-surface px-3 py-2.5 transition-colors hover:border-ink/20 hover:bg-white dark:hover:bg-white/5"
          >
            <span className="min-w-0 truncate font-sans text-[12.5px] font-medium text-ink">
              {next.chapter <= maxUnlocked ? `${next.book.name} ${next.chapter}` : `Chapter ${next.chapter} →`}
            </span>
            <ChevronRight className="size-4 shrink-0 text-muted" />
          </button>
        ) : (
          <div className="flex-1" />
        )}
      </div>

      <div className="mx-auto max-w-2xl pt-2">
        {blocks.map((block) => (
          <section
            key={block.chapter}
            data-chapter={block.chapter}
            ref={(el) => {
              if (el) sectionRefs.current.set(block.chapter, el);
              else sectionRefs.current.delete(block.chapter);
            }}
            className="mb-2 scroll-mt-32"
          >
            <p className="mb-4 text-center font-sans text-[11px] font-medium tracking-[0.2em] text-muted uppercase">
              {book.abbrev.toUpperCase()} {block.chapter}
            </p>
            <div className="space-y-0">
              {block.verses.map((v) => {
                const saved = isSaved(book.slug, v.chapter, v.verse);
                const focused =
                  focusVerse === v.verse && block.chapter === chapter;
                return (
                  <div
                    key={v.i}
                    id={`c${block.chapter}-v${v.verse}`}
                    className={cn(
                      "group relative -mx-2 mb-3 scroll-mt-32 rounded-xl px-2 py-1.5 transition-colors",
                      focused &&
                        "bg-mark/55 ring-1 ring-forest/25 dark:bg-mark/40 dark:ring-forest/35",
                    )}
                  >
                    <p className="font-serif text-[1.05rem] leading-[1.65] text-ink">
                      <sup
                        className={cn(
                          "mr-1.5 font-sans text-[11px] font-medium tabular-nums",
                          focused ? "text-forest" : "text-muted",
                        )}
                      >
                        {v.verse}
                      </sup>
                      <Highlighted text={v.text} needles={highlight} />
                      <button
                        type="button"
                        aria-label={saved ? "Remove bookmark" : "Bookmark verse"}
                        onClick={() => {
                          toggleSaved({
                            book: book.name,
                            slug: book.slug,
                            chapter: v.chapter,
                            verse: v.verse,
                            text: v.text,
                          });
                          toast.success(saved ? "Removed from saved" : "Saved");
                        }}
                        className="ml-1.5 inline-flex translate-y-0.5 align-baseline text-muted opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        {saved ? (
                          <BookmarkCheck className="size-3.5 text-forest" strokeWidth={2} />
                        ) : (
                          <Bookmark className="size-3.5" strokeWidth={1.8} />
                        )}
                      </button>
                    </p>
                  </div>
                );
              })}
            </div>
            <ChapterEndSensor
              chapter={block.chapter}
              onEnd={onChapterEnd}
              isLastUnlocked={block.chapter === maxUnlocked}
            />
          </section>
        ))}
      </div>

      {prompt && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 backdrop-blur-[2px] sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="next-chapter-title"
        >
          <div className="w-full max-w-sm rounded-[24px] bg-paper p-5 shadow-2xl ring-1 ring-black/10 dark:ring-white/10">
            <p
              id="next-chapter-title"
              className="font-serif text-[1.25rem] font-medium text-ink"
            >
              Chapter {prompt.finished} finished
            </p>
            <p className="mt-1.5 font-sans text-[14px] text-muted">
              {prompt.nextChapter
                ? `Continue to ${book.name} ${prompt.nextChapter}, or stay on chapter ${prompt.finished}?`
                : "Stay on this chapter?"}
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <button
                type="button"
                onClick={goNext}
                className="h-11 rounded-full bg-ink font-sans text-[14px] font-medium text-paper"
              >
                {prompt.nextChapter
                  ? `Next chapter (${prompt.nextChapter})`
                  : "Done"}
              </button>
              <button
                type="button"
                onClick={stayHere}
                className="h-11 rounded-full bg-ink/8 font-sans text-[14px] font-medium text-ink dark:bg-white/10"
              >
                Stay on chapter {prompt.finished}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChapterEndSensor({
  chapter,
  onEnd,
  isLastUnlocked,
}: {
  chapter: number;
  onEnd: (ch: number) => void;
  isLastUnlocked: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLastUnlocked) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) onEnd(chapter);
      },
      { root: null, rootMargin: "0px", threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [chapter, onEnd, isLastUnlocked]);

  return <div ref={ref} className="h-8" aria-hidden />;
}

function adjacentChapter(
  book: BookMeta,
  chapter: number,
  dir: -1 | 1,
): { book: BookMeta; chapter: number } | null {
  const next = chapter + dir;
  if (next >= 1 && next <= book.chapters.length) {
    return { book, chapter: next };
  }
  if (dir === 1) {
    const nb = BOOKS[book.index + 1];
    if (nb) return { book: nb, chapter: 1 };
  } else {
    const pb = BOOKS[book.index - 1];
    if (pb) return { book: pb, chapter: pb.chapters.length };
  }
  return null;
}
