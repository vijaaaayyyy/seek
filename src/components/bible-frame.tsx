/**
 * The open book, drawn once around everything.
 *
 * This used to be three nested rectangles - `inset-1.5`, `inset-3`,
 * `inset-[13px]` - which is the reason the whole site read as a rectangular box
 * rather than as a Bible. Three concentric square borders around the viewport
 * are, visually, three boxes; no amount of gilt on them makes them paper.
 *
 * What replaced it is the thing those borders were reaching for. A Bible that
 * is open on a table has a silhouette, and the silhouette is not square:
 *
 *  1. Generous, soft corners, because a sheet of paper does not meet the table
 *     at right angles.
 *  2. A gutter down the centre, shaded, because the book is open and the fold
 *     falls away from the light. This is the single change that does the most
 *     work - it is what turns two rectangles into one spread.
 *  3. Stacked leaf edges at the outer margins, a few hairlines suggesting the
 *     thickness of the block of pages beneath.
 *  4. One gilt rule that follows the page shape, with corner ornaments turned to
 *     suit each corner.
 *
 * Drawn in the shell so every route is framed identically, above the paper and
 * the running text but beneath the header and the curve. It never takes a click.
 * It is a margin, not a control.
 */

/** Stacked leaves: a few hairlines just inside the outer edges. */
function LeafEdge({ side }: { side: "left" | "right" }) {
  return (
    <div
      aria-hidden
      className={
        side === "left"
          ? "absolute inset-y-8 left-1 w-[3px] bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--gilt)_30%,transparent)_40%,color-mix(in_oklab,var(--gilt)_18%,transparent)_60%,transparent)]"
          : "absolute inset-y-8 right-1 w-[3px] bg-[linear-gradient(270deg,transparent,color-mix(in_oklab,var(--gilt)_30%,transparent)_40%,color-mix(in_oklab,var(--gilt)_18%,transparent)_60%,transparent)]"
      }
    />
  );
}

const ORNAMENT = "text-gilt/60";

export function BibleFrame() {
  return (
    <div aria-hidden data-bible-frame className="pointer-events-none fixed inset-0 z-20">
      {/* 1. The sheet. Soft corners instead of square ones, and it stops short
          of the viewport edge so there is a table showing around the book. */}
      <div className="absolute inset-1.5 rounded-[26px] md:inset-3 md:rounded-[38px]" />

      {/* 2. The gutter.

          A wide, soft vertical shadow down the centre of the spread. Both
          halves of the gradient are dark and the middle is darkest, which is
          what a fold lit from the front looks like. Without this the two
          columns of any page sit flat and the whole thing reads as a rectangle;
          with it they read as leaves of one book. */}
      <div
        className="absolute inset-y-0 left-1/2 w-[26%] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(12,7,4,0.16)_26%,rgba(12,7,4,0.30)_46%,rgba(12,7,4,0.34)_50%,rgba(12,7,4,0.30)_54%,rgba(12,7,4,0.16)_74%,transparent)]"
      />
      {/* the highlight on the crest of the fold, just off centre */}
      <div className="absolute inset-y-0 left-1/2 w-[7%] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,244,214,0.05)_50%,transparent)]" />

      {/* 3. The block of pages beneath, at the outer margins. */}
      <LeafEdge side="left" />
      <LeafEdge side="right" />

      {/* 4. The gilt rule, following the page rather than boxing it in, plus the
          hairline just inside it that a real foil-stamped rule casts. */}
      <div className="absolute inset-3 rounded-[22px] border border-gilt/40 md:inset-5 md:rounded-[32px]" />
      <div className="absolute inset-[15px] rounded-[18px] border border-ink/10 md:inset-[26px] md:rounded-[28px]" />

      {/* corner ornaments, turned to suit each corner of the sheet */}
      <svg viewBox="0 0 12 12" className={`absolute top-3 left-3 size-3 ${ORNAMENT} md:top-6 md:left-6`}>
        <path d="M0 12V2a2 2 0 0 1 2-2h10" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M3 9V5a2 2 0 0 1 2-2h4" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
      <svg viewBox="0 0 12 12" className={`absolute top-3 right-3 size-3 ${ORNAMENT} -scale-x-100 md:top-6 md:right-6`}>
        <path d="M0 12V2a2 2 0 0 1 2-2h10" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M3 9V5a2 2 0 0 1 2-2h4" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
      <svg viewBox="0 0 12 12" className={`absolute bottom-3 left-3 size-3 ${ORNAMENT} -scale-y-100 md:bottom-6 md:left-6`}>
        <path d="M0 12V2a2 2 0 0 1 2-2h10" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M3 9V5a2 2 0 0 1 2-2h4" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
      <svg viewBox="0 0 12 12" className={`absolute right-3 bottom-3 size-3 ${ORNAMENT} -scale-x-100 -scale-y-100 md:right-6 md:bottom-6`}>
        <path d="M0 12V2a2 2 0 0 1 2-2h10" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M3 9V5a2 2 0 0 1 2-2h4" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
    </div>
  );
}
