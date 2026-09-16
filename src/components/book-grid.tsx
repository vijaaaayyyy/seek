import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
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

function sizeTier(book: BookMeta): 0 | 1 | 2 {
  const { verseCount } = bookStats(book);
  if (verseCount >= 870) return 2;
  if (verseCount >= 120) return 1;
  return 0;
}

function BookPin({ book }: { book: BookMeta }) {
  const { chapterCount, verseCount, longestChapter, longestVerses } = bookStats(book);
  const tier = sizeTier(book);

  return (
    <Link
      to="/read/$book/$chapter"
      params={{ book: book.slug, chapter: "1" }}
      search={{ q: undefined }}
      className={cn(
        "glass group relative mb-2.5 block w-full break-inside-avoid rounded-[22px] transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]",
        tier === 0 && "px-3.5 py-4",
        tier === 1 && "px-3.5 py-5",
        tier === 2 && "px-4 pt-7 pb-5",
      )}
    >
      <p className="font-sans text-[10px] font-semibold tracking-[0.18em] text-muted uppercase">
        {book.abbrev} · {book.testament}
      </p>

      <h2
        className={cn(
          "mt-1.5 font-serif leading-[1.08] font-medium tracking-tight text-ink text-balance",
          tier === 0 ? "text-[1.35rem]" : tier === 1 ? "text-[1.5rem]" : "text-[1.65rem]",
        )}
      >
        {book.name}
      </h2>

      <div className="mt-3 border-t border-line/70 pt-3">
        <p className="font-sans text-[13px] font-medium text-ink">
          <span className="tabular-nums text-forest">{chapterCount}</span>{" "}
          {chapterCount === 1 ? "chapter" : "chapters"}
          <span className="text-faint"> · </span>
          <span className="tabular-nums text-muted">{verseCount.toLocaleString()}</span>{" "}
          <span className="text-muted">verses</span>
        </p>
        {tier === 2 && (
          <p className="mt-1 font-sans text-[11px] text-faint">
            Longest: ch. {longestChapter} · {longestVerses} verses
          </p>
        )}
      </div>

      <span className="mt-3 inline-flex items-center gap-0.5 font-sans text-[11px] font-medium text-muted transition-colors group-hover:text-ink">
        Open
        <ChevronRight className="size-3.5" strokeWidth={2} />
      </span>
    </Link>
  );
}

function pinHeight(book: BookMeta): number {
  const tier = sizeTier(book);
  if (tier === 2) return 210;
  if (tier === 1) return 175;
  return 145;
}

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

function useColumnCount() {
  const [cols, setCols] = useState(2);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1280) setCols(4);
      else if (w >= 1024) setCols(3);
      else if (w >= 640) setCols(3);
      else setCols(2);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return cols;
}

export function BookWall({ title, books }: { title: string; books: BookMeta[] }) {
  const colCount = useColumnCount();
  const columns = books.length ? packColumns(books, colCount) : [];

  return (
    <section className="w-full min-w-0">
      <h2 className="mb-3 font-sans text-[11px] font-medium tracking-[0.16em] text-muted uppercase">
        {title}
        {books.length > 0 && (
          <span className="ml-2 tabular-nums text-faint normal-case tracking-normal">
            {books.length}
          </span>
        )}
      </h2>
      {columns.length === 0 ? (
        <p className="font-sans text-sm text-muted">No books match.</p>
      ) : (
        <div
          className="grid w-full min-w-0 items-start gap-2.5"
          style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}
        >
          {columns.map((col, i) => (
            <div key={i} className="flex min-w-0 flex-col">
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
