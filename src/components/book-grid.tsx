import { Link } from "@tanstack/react-router";
import { NT_BOOKS, OT_BOOKS, type BookMeta } from "@/lib/bible/meta";

function BookLink({ book }: { book: BookMeta }) {
  return (
    <Link
      to="/read/$book/$chapter"
      params={{ book: book.slug, chapter: "1" }}
      search={{ q: undefined }}
      className="group flex items-baseline justify-between gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-wash"
    >
      <span className="font-serif text-lg text-ink group-hover:text-forest">
        {book.name}
      </span>
      <span className="font-sans text-xs text-faint tabular-nums">
        {book.chapters.length}
      </span>
    </Link>
  );
}

export function BookGrid() {
  return (
    <div className="grid gap-10 md:grid-cols-2">
      <section>
        <h2 className="mb-3 font-sans text-xs font-medium tracking-widest text-muted uppercase">
          Old Testament
        </h2>
        <div className="rounded-xl border border-line bg-surface p-2">
          {OT_BOOKS.map((book) => (
            <BookLink key={book.slug} book={book} />
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-3 font-sans text-xs font-medium tracking-widest text-muted uppercase">
          New Testament
        </h2>
        <div className="rounded-xl border border-line bg-surface p-2">
          {NT_BOOKS.map((book) => (
            <BookLink key={book.slug} book={book} />
          ))}
        </div>
      </section>
    </div>
  );
}
