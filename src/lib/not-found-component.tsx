import { Link } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";

export function NotFoundComponent() {
  return (
    <div className="flex min-h-[55dvh] flex-col items-center justify-center gap-3 px-6 text-center">
      <span className="glass grid size-14 place-items-center rounded-full" aria-hidden="true">
        <BookOpen className="size-6 text-forest" strokeWidth={1.8} />
      </span>
      <h1 className="font-serif text-2xl font-medium text-ink">Page not found</h1>
      <p className="max-w-xs font-sans text-sm leading-relaxed text-muted">
        This page isn&rsquo;t in the Bible. Let&rsquo;s get you back to the search.
      </p>
      <Link
        to="/"
        className="glass glass-strong mt-2 rounded-full px-5 py-2.5 font-sans text-[13px] font-medium text-ink transition-transform duration-150 active:scale-[0.96]"
      >
        Back to Seek
      </Link>
    </div>
  );
}