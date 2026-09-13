import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
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
    <div className="pt-8 sm:pt-12">
      <h1 className="font-serif text-3xl font-medium tracking-tight">Books</h1>
      <p className="mt-2 max-w-lg font-sans text-sm text-muted">
        The King James Bible, complete. Open a book to begin reading.
      </p>
      <div className="mt-6 max-w-md">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter by name, like psalm or 1 cor"
        />
      </div>
      <div className="mt-8">
        {filtering ? (
          <div className="grid gap-10 md:grid-cols-2">
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
      <h2 className="mb-3 font-sans text-xs font-medium tracking-widest text-muted uppercase">
        {title}
      </h2>
      <div className="rounded-xl border border-line bg-surface p-2">
        {books.length === 0 && (
          <p className="px-3 py-4 font-sans text-sm text-muted">No books match.</p>
        )}
        {books.map((book) => (
          <Link
            key={book.slug}
            to="/read/$book/$chapter"
            params={{ book: book.slug, chapter: "1" }}
            search={{ q: undefined }}
            className="flex items-baseline justify-between gap-3 rounded-lg px-3 py-2.5 hover:bg-wash"
          >
            <span className="font-serif text-lg text-ink">{book.name}</span>
            <span className="font-sans text-xs text-faint tabular-nums">
              {book.chapters.length}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
