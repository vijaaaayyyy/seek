import { Link } from "@tanstack/react-router";
import { ArrowLeft, Leaf } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type InfoSection = {
  title?: string;
  body: ReactNode;
};

export function InfoPage({
  title,
  lede,
  sections,
  lastUpdated,
  className,
}: {
  title: string;
  lede: string;
  sections: InfoSection[];
  lastUpdated?: string;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-3xl", className)}>
      <div className="mb-8 flex items-center gap-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-1.5 font-sans text-[12.5px] font-medium text-muted transition-colors hover:border-ink/25 hover:text-ink"
        >
          <ArrowLeft className="size-3.5" strokeWidth={2} />
          Home
        </Link>
        {lastUpdated && (
          <span className="ml-auto font-sans text-[12px] text-faint">Updated {lastUpdated}</span>
        )}
      </div>

      <div className="flex items-center gap-2 text-forest">
        <Leaf className="size-4" strokeWidth={2} />
        <span className="font-sans text-[11px] font-semibold tracking-[0.18em] uppercase">SEEK</span>
      </div>
      <h1 className="mt-3 font-serif text-[2rem] leading-tight font-medium tracking-tight sm:text-[2.5rem]">
        {title}
      </h1>
      <p className="mt-3 max-w-xl font-sans text-[14.5px] leading-relaxed text-muted">{lede}</p>

      <div className="mt-9 space-y-7">
        {sections.map((s, i) => (
          <section key={i} className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
            {s.title && (
              <h2 className="font-serif text-[1.2rem] font-medium tracking-tight text-ink">
                {s.title}
              </h2>
            )}
            <div className={cn("font-sans text-[14px] leading-relaxed text-muted", s.title && "mt-2")}>
              {s.body}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}