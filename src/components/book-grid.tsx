import { Link } from "@tanstack/react-router";
import { Bookmark, ChevronRight } from "lucide-react";
import { NT_BOOKS, OT_BOOKS, type BookMeta } from "@/lib/bible/meta";
import { cn } from "@/lib/utils";

function bookStats(book: BookMeta) {
  const chapterCount = book.chapters.length;
  const verseCount = book.chapters.reduce((a, b) => a + b, 0);
  let longestChapter = 1;
  let longestVerses = book.chapters[0] ?? 0;
  book.chapters.forEach((v, i) => {
    if (v > longestVerses) {
      longestVerses = v;
      longestChapter = i + 1;
    }
  });
  return { chapterCount, verseCount, longestChapter, longestVerses };
}

/** Size tier driven by how big the book is: big books = tall pins. */
function sizeTier(book: BookMeta): 0 | 1 | 2 {
  const { verseCount } = bookStats(book);
  if (verseCount >= 870) return 2; // tall
  if (verseCount >= 120) return 1; // medium
  return 0; // small
}

/**
 * Pinterest-style masonry pin shaped like a book chapter. Pure text — no
 * images. Card height follows the book's verse count, so the wall scrolls
 * tall, medium and small cards down two staggered columns.
 */
function BookPin({ book }: { book: BookMeta }) {
  const { chapterCount, verseCount, longestChapter, longestVerses } = bookStats(book);
  const tier = sizeTier(book);

  return (
    <Link
      to="/read/$book/$chapter"
      params={{ book: book.slug, chapter: "1" }}
      search={{ q: undefined }}
      className={cn(
        "glass group relative mb-3 block w-full break-inside-avoid rounded-[26px] transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98] max-w-[240px]",
        tier === 0 && "px-3.5 py-5",
        tier === 1 && "px-4 py-8",
        tier === 2 && "px-5 pt-12 pb-7",
      )}
    >
      <span
        aria-hidden
        className="absolute top-3.5 right-3.5 grid size-9 place-items-center rounded-full bg-ink/0 text-faint opacity-0 transition-all duration-200 group-hover:bg-ink/5 group-hover:text-ink group-hover:opacity-100 dark:group-hover:bg-paper/10"
      >
        <Bookmark className="size-4.5" strokeWidth={1.8} />
      </span>

      <p
        className={cn(
          "font-sans font-semibold tracking-[0.22em] text-muted uppercase",
          tier === 0 ? "text-[10px]" : "text-[11px]",
        )}
      >
        {book.abbrev} · {book.testament}
      </p>

      {tier === 0 ? (
        <h2 className="mt-2 font-serif text-[1.7rem] leading-[1.05] font-medium tracking-tight text-ink">
          {book.name}
        </h2>
      ) : tier === 2 ? (
        <h2 className="mt-3 font-serif text-[2rem] leading-[1.05] font-medium tracking-tight text-ink text-balance">
          {book.name}
        </h2>
      ) : (
        <h2 className="mt-3 font-serif text-[2rem] leading-[1.05] font-medium tracking-tight text-ink">
          {book.name}
        </h2>
      )}

      {tier === 2 ? (
        <div className="mt-6 border-t border-line/70 pt-5">
          <p className="font-sans text-[15px] font-medium text-ink">
            <span className="tabular-nums text-[2.4rem] leading-none text-forest dark:text-forest">
              {chapterCount}
            </span>{" "}
            chapters
          </p>
          <p className="mt-2 font-sans text-[13px] text-muted">
            <span className="tabular-nums text-ink">{verseCount.toLocaleString()}</span>{" "}
            verses
          </p>
          <p className="mt-2 font-sans text-[12px] text-faint">
            Longest: chapter {longestChapter} · {longestVerses} verses
          </p>
        </div>
      ) : tier === 1 ? (
        <div className="mt-5 border-t border-line/70 pt-4">
          <p className="font-sans text-[14px] font-medium text-ink">
            <span className="tabular-nums text-[1.8rem] leading-none text-forest dark:text-forest">
              {chapterCount}
            </span>{" "}
            chapters
            <span className="mx-2 text-faint">·</span>
            <span className="font-sans text-[13px] text-muted">
              {verseCount.toLocaleString()} verses
            </span>
          </p>
          <p className="mt-2 font-sans text-[12px] text-faint">
            Longest: chapter {longestChapter} · {longestVerses} verses
          </p>
        </div>
      ) : (
        <div className="mt-3 border-t border-line/70 pt-3">
          <p className="font-sans text-[12px] text-muted">
            {chapterCount} chapters
            <span className="mx-1.5 text-faint">·</span>
            <span className="tabular-nums">{verseCount.toLocaleString()} verses</span>
          </p>
        </div>
      )}

      <span className="mt-4 inline-flex items-center gap-1 font-sans text-[12px] font-medium text-forest underline-offset-4 dark:text-forest group-hover:underline">
        {book.testament === "OT" ? "Old Testament" : "New Testament"}
        <ChevronRight className="size-4" strokeWidth={2} />
      </span>
    </Link>
  );
}

/** Rough pin height per tier — used to balance the masonry. */
function pinHeight(book: BookMeta): number {
  const tier = sizeTier(book);
  if (tier === 2) return 290;
  if (tier === 1) return 225;
  return 165;
}

/**
 * Pinterest ordering: walk the books left-to-right and drop each pin into
 * the shorter column, so tall and small cards stagger across the width.
 */
function packColumns(books: BookMeta[], cols: number): BookMeta[][] {
  const heights = new Array(cols).fill(0);
  const columns = Array.from({ length: cols }, () => [] as BookMeta[]);
  for (const book of books) {
    let best = 0;
    for (let c = 1; c < cols; c++) if (heights[c] < heights[best]) best = c;
    columns[best].push(book);
    heights[best] += pinHeight(book);
  }
  return columns;
}

export function BookWall({ title, books }: { title: string; books: BookMeta[] }) {
  const columns = books.length ? packColumns(books, 2) : [];

  return (
    <section className="w-full min-w-0 -mx-4">
      <h2 className="mb-2.5 px-4 font-sans text-[11px] font-medium tracking-[0.16em] text-muted uppercase">
        {title}
      </h2>
      {columns.length === 0 ? (
        <p className="px-1 font-sans text-sm text-muted">No books match.</p>
      ) : (
        <div className="flex w-full min-w-0 items-start gap-2.5">
          {columns.map((col, i) => (
            <div key={i} className="flex min-w-0 flex-1 flex-col items-center">
              {col.map((book) => (
                <BookPin key={book.slug} book={book} />
              ))}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function BookGrid() {
  return (
    <div className="grid gap-8">
      <BookWall title="Old Testament" books={OT_BOOKS} />
      <BookWall title="New Testament" books={NT_BOOKS} />
    </div>
  );
}