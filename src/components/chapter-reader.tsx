import { Link, useNavigate } from "@tanstack/react-router";
import {
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Reveal } from "@/components/reveal";
import { toast } from "sonner";
import { BookPicker } from "@/components/book-picker";
import { Highlighted } from "@/components/highlighted";
import { ReadingModeToggle } from "@/components/reading-mode-toggle";
import { useSaved } from "@/components/saved-provider";
import { useBible } from "@/components/bible-provider";
import {
  VERSE_ACTIONS_CLASS,
  VerseShareButton,
} from "@/components/verse-share-button";
import { BOOKS, type BookMeta } from "@/lib/bible/meta";
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

  useEffect(() => {
    setMinChapter(chapter);
    setMaxUnlocked(chapter);
  }, [book.slug]);

  useEffect(() => {
    setMinChapter((prev) => Math.min(prev, chapter));
    setMaxUnlocked((prev) => Math.max(prev, chapter));
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

  /**
   * Reaching the end of a chapter unlocks the next one, with nothing to dismiss.
   *
   * There is deliberately no dialog here. The reader is one continuous scroll, so
   * interrupting the end of a chapter to ask whether to continue or stay put was
   * friction over a decision the reader had already made by reading on - and a
   * modal in the middle of scripture is the last thing that belongs there.
   * Advancing silently keeps the scroll continuous.
   *
   * The guard is `finishedChapter !== maxUnlocked`, so only the chapter at the
   * live edge can advance, and the IntersectionObserver that calls this only
   * observes that edge chapter. Between them a chapter cannot be unlocked twice.
   */
  const onChapterEnd = useCallback(
    (finishedChapter: number) => {
      if (finishedChapter !== maxUnlocked) return;
      if (finishedChapter >= book.chapters.length) return;
      setMaxUnlocked(finishedChapter + 1);
    },
    [book.chapters.length, maxUnlocked],
  );

  const activeVerses =
    blocks.find((b) => b.chapter === activeChapter)?.verses.length ?? 0;

  return (
    <div className="relative pb-8">
      {/*
        The reader is one continuous scroll, so each chapter label is a plain
        <p> and no inner element can own the page heading. This is that
        heading, styled like every other page so the reader matches the rest.
      */}
      <Reveal>
        <p className="font-sans text-[11px] tracking-[0.2em] text-muted uppercase">
          King James Version
        </p>
        <h1 className="mt-3 font-sans text-[length:var(--type-title)] font-medium leading-[0.95] tracking-[-0.03em] text-ink">
          {book.name} {chapter}
        </h1>
      </Reveal>


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
            className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-line bg-surface px-3 py-2.5 transition-colors hover:border-ink/20 hover:bg-white"
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
              // A chapter reached by scrolling is already unlocked. Jumping
              // ahead to one that is not is still allowed: this is an explicit
              // choice by the reader, and the continuous-scroll lock exists to
              // stop chapters arriving unread, not to forbid navigation.
              void navigate({
                to: "/read/$book/$chapter",
                params: {
                  book: next.book.slug,
                  chapter: String(next.chapter),
                },
                search: { q: undefined },
              });
            }}
            className="flex min-w-0 flex-1 items-center justify-end gap-2 rounded-2xl border border-line bg-surface px-3 py-2.5 transition-colors hover:border-ink/20 hover:bg-white"
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
                        "bg-mark/55 ring-1 ring-forest/25",
                    )}
                  >
                    <p className="font-sans text-[1.05rem] leading-[1.65] text-ink">
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
                        className={cn(
                          "ml-1.5 translate-y-0.5 align-baseline text-muted",
                          VERSE_ACTIONS_CLASS,
                        )}
                      >
                        {saved ? (
                          <BookmarkCheck className="size-3.5 text-forest" strokeWidth={2} />
                        ) : (
                          <Bookmark className="size-3.5" strokeWidth={1.8} />
                        )}
                      </button>
                      <VerseShareButton
                        book={book}
                        chapter={v.chapter}
                        verse={v.verse}
                        text={v.text}
                        className={cn(
                          "ml-1.5 translate-y-0.5 align-baseline text-muted",
                          VERSE_ACTIONS_CLASS,
                        )}
                      />
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
