import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
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

  const total = filtered.ot.length + filtered.nt.length;

  return (
    <div className="mx-auto w-full max-w-5xl pt-2 pb-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-[1.85rem] leading-tight font-medium tracking-tight text-ink sm:text-[2rem]">
            Books
          </h1>
          <p className="mt-1 font-sans text-[14px] text-muted">
            The King James Bible — 66 books.
          </p>
        </div>
        {q.trim() && (
          <p className="font-sans text-[13px] text-muted">
            {total} match{total === 1 ? "" : "es"}
          </p>
        )}
      </div>

      <div className="relative mt-4">
        <Search
          className="pointer-events-none absolute top-1/2 left-3.5 size-[17px] -translate-y-1/2 text-muted"
          strokeWidth={1.8}
          aria-hidden
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter books — psalm, 1 cor, john…"
          className="glass h-12 w-full rounded-full bg-white/60 pr-4 pl-10 font-sans text-[15px] text-ink placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-ink/15 dark:bg-white/5"
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      <div className="mt-7 grid min-w-0 gap-9">
        <BookWall title="Old Testament" books={filtered.ot} />
        <BookWall title="New Testament" books={filtered.nt} />
      </div>
    </div>
  );
}
