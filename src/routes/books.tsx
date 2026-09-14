import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BookWall } from "@/components/book-grid";
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
      <div className="mt-6 grid min-w-0 gap-8">
        <BookWall title="Old Testament" books={filtered.ot} />
        <BookWall title="New Testament" books={filtered.nt} />
      </div>
    </div>
  );
}