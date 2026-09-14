import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BookGrid } from "@/components/book-grid";
import { NT_BOOKS, OT_BOOKS, type BookMeta } from "@/lib/bible/meta";

export const Route = createFileRoute("/books")({ component: BooksPage });

function BooksPage() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const match = (b: BookMeta) =>
      !needle ||
      b.name.toLowerCase().includes(needle) ||
      b.abbrev.toLowerCase().includes(needle) ||
      b.aliases.some((a) => a.toLowerCase().includes(needle));
    return { ot: OT_BOOKS.filter(match), nt: NT_BOOKS.filter(match) };
  }, [q]);

  const filtering = q.trim().length > 0;

  return (
    <div className="pt-3">
      <h1 className="font-serif text-[2rem] leading-tight font-medium tracking-tight">Books</h1>
      <p className="mt-1.5 font-sans text-[15px] text-muted">
        The King James Bible, complete.
      </p>
      <div className="glass mt-5 flex h-12 items-center rounded-[18px] px-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter, like psalm or 1 cor"
          className="h-full w-full bg-transparent font-sans text-base text-ink placeholder:text-faint focus:outline-none"
        />
      </div>
      <div className="mt-6">
        {filtering ? (
          <div className="grid gap-8">
            <BookColumn title="Old Testament" books={filtered.ot} />
            <BookColumn title="New Testament" books={filtered.nt} />
          </div>
        ) : (
          <BookGrid />
        )}
      </div>
    </div>
  );
}

function BookColumn({ title, books }: { title: string; books: BookMeta[] }) {
  return (
    <section>
      <h2 className="mb-2 px-1 font-sans text-[11px] font-medium tracking-[0.16em] text-muted uppercase">
        {title}
      </h2>
      <div className="glass-group rounded-[22px]">
        {books.length === 0 && (
          <p className="px-4 py-5 font-sans text-sm text-muted">No books match.</p>
        )}
        {books.map((book) => (
          <Link
            key={book.slug}
            to="/read/$book/$chapter"
            params={{ book: book.slug, chapter: "1" }}
            search={{ q: undefined }}
            className="glass-row flex min-h-12 items-baseline justify-between gap-3 px-4 py-3 hover:bg-ink/5"
          >
            <span className="font-serif text-[17px] text-ink">{book.name}</span>
            <span className="font-sans text-xs text-faint tabular-nums">
              {book.chapters.length}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
