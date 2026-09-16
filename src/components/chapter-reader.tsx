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
  verses: _initialVerses,
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

  const blocks: ChapterBlock[] = useMemo(() => {
    if (!bible) {
      return [{ chapter, verses: _initialVerses }];
    }
    const out: ChapterBlock[] = [];
    for (let ch = 1; ch <= book.chapters.length; ch++) {
      out.push({ chapter: ch, verses: getChapter(bible, book.index, ch) });
    }
    return out;
  }, [bible, book, chapter, _initialVerses]);

  const [activeChapter, setActiveChapter] = useState(chapter);
  const [prompt, setPrompt] = useState<{
    finished: number;
    nextChapter: number | null;
  } | null>(null);
  const dismissedRef = useRef<Set<number>>(new Set());
  const sectionRefs = useRef<Map<number, HTMLElement>>(new Map());
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const didInitialScroll = useRef(false);

  useEffect(() => {
    if (didInitialScroll.current) return;
    didInitialScroll.current = true;
    const targetCh = chapter;
    const run = () => {
      if (focusVerse) {
        const el = document.getElementById(`c${targetCh}-v${focusVerse}`);
        if (el) {
          el.scrollIntoView({ block: "center", behavior: "auto" });
          return;
        }
      }
      const sec = sectionRefs.current.get(targetCh);
      if (sec) sec.scrollIntoView({ block: "start", behavior: "auto" });
    };
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
        if (best && best.ratio > 0.15) {
          setActiveChapter(best.ch);
        }
      },
      {
        root: null,
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.15, 0.35, 0.55, 0.75, 1],
      },
    );

    for (const el of roots) io.observe(el);
    return () => io.disconnect();
  }, [blocks.length, book.slug]);

  const onChapterEnd = useCallback(
    (finishedChapter: number) => {
      if (prompt) return;
      if (dismissedRef.current.has(finishedChapter)) return;

      const nextCh =
        finishedChapter < book.chapters.length ? finishedChapter + 1 : null;

      setPrompt({ finished: finishedChapter, nextChapter: nextCh });
    },
    [book.chapters.length, prompt],
  );

  function stayHere() {
    if (!prompt) return;
    dismissedRef.current.add(prompt.finished);
    setPrompt(null);
  }

  function goNext() {
    if (!prompt) return;
    const finished = prompt.finished;
    dismissedRef.current.add(finished);
    const nextCh = prompt.nextChapter;
    setPrompt(null);

    if (nextCh != null) {
      const sec = sectionRefs.current.get(nextCh);
      if (sec) {
        sec.scrollIntoView({ block: "start", behavior: "smooth" });
        setActiveChapter(nextCh);
        void navigate({
          to: "/read/$book/$chapter",
          params: { book: book.slug, chapter: String(nextCh) },
          search: { q: undefined },
          replace: true,
        });
      }
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
    <div className="relative pb-6">
      <div className="sticky top-0 z-20 px-0.5 pb-2">
        <div className="glass glass-strong flex items-center justify-between gap-2 rounded-[22px] py-1.5 pr-1.5 pl-1">
          <div className="min-w-0">
            <BookPicker book={book} chapter={activeChapter} />
            <p className="px-3 font-sans text-[11px] text-muted">
              Chapter {activeChapter} of {book.chapters.length}
              <span className="text-faint"> · </span>
              {activeVerses} verses
              <span className="text-faint"> · </span>
              {book.testament === "OT" ? "OT" : "NT"}
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

      <div ref={scrollerRef} className="px-1">
        {blocks.map((block) => (
          <section
            key={block.chapter}
            data-chapter={block.chapter}
            ref={(el) => {
              if (el) sectionRefs.current.set(block.chapter, el);
              else sectionRefs.current.delete(block.chapter);
            }}
            className="mb-2 scroll-mt-28"
          >
            <div className="mb-4 flex items-center gap-3 pt-4">
              <span className="h-px flex-1 bg-line/80" />
              <span className="font-sans text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">
                {book.abbrev} {block.chapter}
              </span>
              <span className="h-px flex-1 bg-line/80" />
            </div>

            <article className="pb-2">
              {block.verses.map((v) => {
                const saved = isSaved(book.slug, v.chapter, v.verse);
                return (
                  <p
                    key={`${block.chapter}-${v.verse}`}
                    id={`c${block.chapter}-v${v.verse}`}
                    className="group relative -mx-2 mb-3 scroll-mt-36 rounded-xl px-2 py-1"
                  >
                    <button
                      type="button"
                      className="mr-1.5 align-super font-sans text-[11px] font-medium text-muted tabular-nums hover:text-ink"
                      onClick={async () => {
                        const citation = formatRef(book, v.chapter, v.verse);
                        try {
                          await navigator.clipboard.writeText(
                            `${citation} — ${v.text}`,
                          );
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
                        saved ? "text-forest" : "opacity-70 hover:text-ink",
                      )}
                      aria-label={saved ? "Remove from saved" : "Save verse"}
                      onClick={() =>
                        void toggleSaved({
                          book: book.name,
                          slug: book.slug,
                          chapter: v.chapter,
                          verse: v.verse,
                          text: v.text,
                        })
                      }
                    >
                      {saved ? (
                        <BookmarkCheck className="size-3.5" />
                      ) : (
                        <Bookmark className="size-3.5" />
                      )}
                    </button>
                  </p>
                );
              })}
            </article>

            <ChapterEndSentinel
              chapter={block.chapter}
              onEnd={onChapterEnd}
              disabled={!!prompt || dismissedRef.current.has(block.chapter)}
            />
          </section>
        ))}

        <p className="py-8 text-center font-sans text-[12px] text-faint">
          End of {book.name}
        </p>
      </div>

      {prompt && (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45 p-4 backdrop-blur-[2px] sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="next-ch-title"
        >
          <div className="w-full max-w-sm rounded-[28px] bg-paper p-6 text-ink shadow-[0_24px_64px_rgba(0,0,0,0.35)] ring-1 ring-black/10 dark:bg-[#1a1c22] dark:ring-white/10">
            <p
              id="next-ch-title"
              className="font-serif text-[1.35rem] font-medium tracking-tight"
            >
              Chapter {prompt.finished} finished
            </p>
            <p className="mt-2 font-sans text-[14px] leading-relaxed text-muted">
              {prompt.nextChapter != null
                ? `Continue to ${book.name} ${prompt.nextChapter}, or stay on chapter ${prompt.finished}?`
                : `You've reached the end of ${book.name}. ${
                    BOOKS[book.index + 1]
                      ? `Open ${BOOKS[book.index + 1].name}, or stay here?`
                      : "Stay on this chapter?"
                  }`}
            </p>
            <div className="mt-5 grid gap-2">
              {(prompt.nextChapter != null || BOOKS[book.index + 1]) && (
                <button
                  type="button"
                  onClick={goNext}
                  className="flex h-12 items-center justify-center rounded-full bg-ink font-sans text-[14px] font-medium text-paper transition-transform active:scale-[0.98]"
                >
                  {prompt.nextChapter != null
                    ? `Next chapter (${prompt.nextChapter})`
                    : `Open ${BOOKS[book.index + 1]?.name}`}
                </button>
              )}
              <button
                type="button"
                onClick={stayHere}
                className="flex h-12 items-center justify-center rounded-full bg-ink/8 font-sans text-[14px] font-medium text-ink transition-transform active:scale-[0.98] dark:bg-white/10"
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

function ChapterEndSentinel({
  chapter,
  onEnd,
  disabled,
}: {
  chapter: number;
  onEnd: (ch: number) => void;
  disabled: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const fired = useRef(false);

  useEffect(() => {
    fired.current = false;
  }, [chapter]);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        if (fired.current) return;
        fired.current = true;
        onEnd(chapter);
      },
      { root: null, rootMargin: "0px", threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [chapter, onEnd, disabled]);

  return (
    <div
      ref={ref}
      className="flex h-16 items-center justify-center"
      aria-hidden
    >
      <span className="h-px w-12 bg-line/60" />
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
