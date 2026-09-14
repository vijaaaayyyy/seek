import { Link } from "@tanstack/react-router";
import { NT_BOOKS, OT_BOOKS, type BookMeta } from "@/lib/bible/meta";
import { cn } from "@/lib/utils";

function BookLink({ book }: { book: BookMeta }) {
  return (
    <Link
      to="/read/$book/$chapter"
      params={{ book: book.slug, chapter: "1" }}
      search={{ q: undefined }}
      className={cn(
        "glass-row group flex min-h-12 items-baseline justify-between gap-3 px-4 py-3 transition-colors",
        "active:bg-ink/6 hover:bg-ink/5",
      )}
    >
      <span className="font-serif text-[17px] text-ink">{book.name}</span>
      <span className="font-sans text-xs text-faint tabular-nums">
        {book.chapters.length}
      </span>
    </Link>
  );
}

export function BookGrid() {
  return (
    <div className="grid gap-8">
      <section>
        <h2 className="mb-2 px-1 font-sans text-[11px] font-medium tracking-[0.16em] text-muted uppercase">
          Old Testament
        </h2>
        <div className="glass-group rounded-[22px]">
          {OT_BOOKS.map((book) => (
            <BookLink key={book.slug} book={book} />
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-2 px-1 font-sans text-[11px] font-medium tracking-[0.16em] text-muted uppercase">
          New Testament
        </h2>
        <div className="glass-group rounded-[22px]">
          {NT_BOOKS.map((book) => (
            <BookLink key={book.slug} book={book} />
          ))}
        </div>
      </section>
    </div>
  );
}
