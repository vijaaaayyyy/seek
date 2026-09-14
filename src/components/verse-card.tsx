import { Link } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck, Copy } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Highlighted } from "@/components/highlighted";
import { useSaved } from "@/components/saved-provider";
import { BOOKS, formatRef } from "@/lib/bible/meta";
import type { IndexedVerse } from "@/lib/bible/load";

export type VerseCardProps = {
  verse: IndexedVerse;
  matched?: string[];
  reason?: string;
  kind?: "wording" | "meaning" | "reference" | "book";
  query?: string;
  alsoMeaning?: boolean;
};

export function VerseCard({
  verse,
  matched = [],
  reason,
  kind,
  query,
  alsoMeaning,
}: VerseCardProps) {
  const book = BOOKS[verse.bookIndex]!;
  const { isSaved, toggleSaved } = useSaved();
  const saved = isSaved(book.slug, verse.chapter, verse.verse);
  const citation = formatRef(book, verse.chapter, verse.verse);

  async function copyVerse() {
    const blob = `${citation} — ${verse.text}`;
    try {
      await navigator.clipboard.writeText(blob);
      toast("Copied verse");
    } catch {
      toast("Could not copy");
    }
  }

  return (
    <article className="glass rounded-[22px] p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            to="/read/$book/$chapter"
            params={{ book: book.slug, chapter: String(verse.chapter) }}
            search={{ q: query }}
            hash={`v${verse.verse}`}
            className="font-serif text-[17px] font-medium tracking-tight text-ink underline-offset-4 hover:underline"
          >
            {citation}
          </Link>
          <p className="mt-0.5 font-sans text-[11px] tracking-wide text-muted">
            {book.testament === "OT" ? "Old Testament" : "New Testament"}
          </p>
        </div>
        <div className="flex shrink-0 gap-0.5">
          <Button variant="ghost" size="icon-sm" aria-label="Copy verse" onClick={copyVerse}>
            <Copy />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={saved ? "Remove from saved" : "Save verse"}
            onClick={() =>
              toggleSaved({
                book: book.name,
                slug: book.slug,
                chapter: verse.chapter,
                verse: verse.verse,
                text: verse.text,
              })
            }
          >
            {saved ? <BookmarkCheck /> : <Bookmark />}
          </Button>
        </div>
      </div>
      <p className="mt-3 font-serif text-[17px] leading-relaxed text-ink">
        <Highlighted text={verse.text} needles={matched} />
      </p>
      {(kind || reason) && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {kind === "meaning" || alsoMeaning ? <Badge variant="forest">By meaning</Badge> : null}
          {kind === "wording" ? <Badge>By wording</Badge> : null}
          {kind === "reference" || kind === "book" ? <Badge variant="forest">This place</Badge> : null}
          {reason && <span className="font-sans text-xs text-muted">{reason}</span>}
        </div>
      )}
    </article>
  );
}
