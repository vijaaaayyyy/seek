import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Reveal } from "@/components/reveal";
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
    <div className={cn("relative mx-auto w-full max-w-4xl pb-8", className)}>


      <div className="mb-10 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="font-sans text-[12px] tracking-[0.14em] text-ink/50 uppercase transition-colors hover:text-ink"
        >
          ← Home
        </Link>
        {lastUpdated && (
          <span className="font-sans text-[12px] text-ink/40">Updated {lastUpdated}</span>
        )}
      </div>

      <Reveal as="p" className="font-sans text-[11px] font-medium tracking-[0.2em] text-ink/45 uppercase">
        SEEK
      </Reveal>
      <Reveal delay={40} className="mt-3 max-w-3xl">
        <h1 className="font-sans text-[length:var(--type-title)] font-medium leading-[0.95] tracking-[-0.03em] text-ink">
          {title}
        </h1>
      </Reveal>
      <Reveal delay={80} as="p" className="mt-5 max-w-xl font-sans text-[15px] leading-relaxed text-ink/60 sm:text-[16px]">
        {lede}
      </Reveal>

      <div className="mt-14 space-y-10">
        {sections.map((s, i) => (
          <Reveal key={i} delay={Math.min(i * 35, 200)} as="div" className="border-t border-ink/10 pt-8">
            {s.title && (
              <h2 className="font-sans text-[length:var(--type-lede)] font-medium tracking-[-0.02em] text-ink">
                {s.title}
              </h2>
            )}
            <div
              className={cn(
                "max-w-2xl font-sans text-[14.5px] leading-relaxed text-ink/65 sm:text-[15px]",
                s.title && "mt-3",
              )}
            >
              {s.body}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
