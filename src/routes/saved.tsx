import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { useSaved } from "@/components/saved-provider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUserState } from "@/lib/supa/use-current-user";
import { formatRef } from "@/lib/bible/meta";

export const Route = createFileRoute("/saved")({ component: SavedPage });

function SavedPage() {
  const { saved, status, toggleSaved } = useSaved();
  const { user, isPending } = useCurrentUserState();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Render the same loading frame until hydration completes, so server HTML
  // and the client's first paint always match.
  if (!mounted || isPending) {
    return (
      <div className="pt-3">
        <h1 className="font-serif text-[2rem] leading-tight font-medium tracking-tight">Saved</h1>
        <div className="mt-6 space-y-3">
          <Skeleton className="h-36 w-full rounded-[22px]" />
          <Skeleton className="h-36 w-full rounded-[22px]" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-3">
        <h1 className="font-serif text-[2rem] leading-tight font-medium tracking-tight">Saved</h1>
        <div className="glass mt-8 rounded-[28px] px-6 py-14 text-center">
          <Bookmark className="mx-auto size-6 text-faint" strokeWidth={1.6} />
          <p className="mt-3 font-serif text-xl text-ink">Your saved verses live on your account</p>
          <p className="mt-2 font-sans text-sm text-muted">
            Sign in to view them on any device — nothing stays on this one.
          </p>
          <Button asChild className="mt-6 rounded-full px-5">
            <Link to="/login" search={{ redirect: "/saved" }}>
              Sign in or create an account
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-3">
      <h1 className="font-serif text-[2rem] leading-tight font-medium tracking-tight">Saved</h1>
      <p className="mt-1.5 font-sans text-[15px] text-muted">
        {status === "loading" ? (
          "Loading your saved verses…"
        ) : (
          <>
            Saved to{" "}
            <span className="font-medium text-ink">
              {user.displayName ?? user.primaryEmail ?? "your account"}
            </span>
            .
          </>
        )}
      </p>

      {status === "loading" || status === "idle" ? (
        <div className="mt-6 space-y-3">
          <Skeleton className="h-36 w-full rounded-[22px]" />
        </div>
      ) : saved.length === 0 ? (
        <div className="glass mt-8 rounded-[28px] px-6 py-14 text-center">
          <Bookmark className="mx-auto size-6 text-faint" strokeWidth={1.6} />
          <p className="mt-3 font-serif text-xl text-ink">No saved verses yet</p>
          <p className="mt-2 font-sans text-sm text-muted">
            Tap the bookmark beside a verse while you read or search.
          </p>
          <Button asChild className="mt-6 rounded-full px-5">
            <Link to="/">Search the Bible</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {saved.map((v) => (
            <article
              key={`${v.slug}:${v.chapter}:${v.verse}`}
              className="glass rounded-[22px] p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <Link
                  to="/read/$book/$chapter"
                  params={{ book: v.slug, chapter: String(v.chapter) }}
                  search={{ q: undefined }}
                  hash={`v${v.verse}`}
                  className="font-serif text-[17px] font-medium text-ink underline-offset-4 hover:underline"
                >
                  {formatRef(v.book, v.chapter, v.verse)}
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => void toggleSaved(v)}
                >
                  Remove
                </Button>
              </div>
              <p className="mt-3 font-serif text-[17px] leading-relaxed text-ink">{v.text}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}