import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSeekStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { formatRef } from "@/lib/bible/meta";

export const Route = createFileRoute("/saved")({ component: SavedPage });

function SavedPage() {
  const saved = useSeekStore((s) => s.saved);
  const toggleSaved = useSeekStore((s) => s.toggleSaved);
  const hydrated = useHydrated();

  return (
    <div className="pt-8 sm:pt-12">
      <h1 className="font-serif text-3xl font-medium tracking-tight">Saved</h1>
      <p className="mt-2 max-w-lg font-sans text-sm text-muted">
        Verses you keep on this device. Nothing is sent away.
      </p>

      {!hydrated ? (
        <div className="mx-auto mt-8 max-w-2xl space-y-3">
          <div className="h-36 animate-pulse rounded-xl bg-wash" />
        </div>
      ) : saved.length === 0 ? (
        <div className="mt-10 rounded-xl border border-line bg-surface px-6 py-12 text-center">
          <Bookmark className="mx-auto size-6 text-faint" />
          <p className="mt-3 font-serif text-xl text-ink">No saved verses yet</p>
          <p className="mt-2 font-sans text-sm text-muted">
            Tap the bookmark beside a verse while you read or search.
          </p>
          <Button asChild className="mt-6">
            <Link to="/">Search the Bible</Link>
          </Button>
        </div>
      ) : (
        <div className="mx-auto mt-8 max-w-2xl space-y-3">
          {saved.map((v) => (
            <article
              key={`${v.slug}:${v.chapter}:${v.verse}`}
              className="rounded-xl border border-line bg-surface p-5 shadow-soft"
            >
              <div className="flex items-start justify-between gap-3">
                <Link
                  to="/read/$book/$chapter"
                  params={{ book: v.slug, chapter: String(v.chapter) }}
                  search={{ q: undefined }}
                  hash={`v${v.verse}`}
                  className="font-serif text-lg font-medium text-ink underline-offset-4 hover:underline"
                >
                  {formatRef(v.book, v.chapter, v.verse)}
                </Link>
                <button
                  type="button"
                  className="h-10 px-2 font-sans text-xs text-muted hover:text-ink"
                  onClick={() => toggleSaved(v)}
                >
                  Remove
                </button>
              </div>
              <p className="mt-3 font-serif text-lg leading-relaxed text-ink">{v.text}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
