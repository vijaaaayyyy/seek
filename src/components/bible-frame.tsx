/**
 * The printed page, drawn once around everything.
 *
 * A Bible page is framed by rules rather than a box: a hairline at the very
 * edge of the sheet, then a gilt rule inside it, then a second hairline set
 * slightly further in, with a small ornament turning each corner. Mounted in
 * the shell so every route is framed the same way, above the paper and the
 * running text but beneath the header and the curve.
 *
 * The frame never takes a click. It is a margin, not a control.
 */
const CORNER = "absolute size-3 text-gilt/70";

export function BibleFrame() {
  return (
    <div aria-hidden data-bible-frame className="pointer-events-none fixed inset-0 z-20">
      {/* edge of the sheet */}
      <div className="absolute inset-1.5 border border-ink/15 md:inset-3" />
      {/* gilt rule and the hairline that shadows it */}
      <div className="absolute inset-3 border border-gilt/45 md:inset-5" />
      <div className="absolute inset-[13px] border border-ink/10 md:inset-[22px]" />

      {/* corner ornaments, turned to suit each corner of the sheet */}
      <svg viewBox="0 0 12 12" className={`${CORNER} top-2 left-2 md:top-4 md:left-4`}>
        <path d="M0 12V2a2 2 0 0 1 2-2h10" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M3 9V5a2 2 0 0 1 2-2h4" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
      <svg viewBox="0 0 12 12" className={`${CORNER} top-2 right-2 md:top-4 md:right-4 -scale-x-100`}>
        <path d="M0 12V2a2 2 0 0 1 2-2h10" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M3 9V5a2 2 0 0 1 2-2h4" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
      <svg viewBox="0 0 12 12" className={`${CORNER} bottom-2 left-2 md:bottom-4 md:left-4 -scale-y-100`}>
        <path d="M0 12V2a2 2 0 0 1 2-2h10" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M3 9V5a2 2 0 0 1 2-2h4" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
      <svg viewBox="0 0 12 12" className={`${CORNER} right-2 bottom-2 md:right-4 md:bottom-4 -scale-x-100 -scale-y-100`}>
        <path d="M0 12V2a2 2 0 0 1 2-2h10" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M3 9V5a2 2 0 0 1 2-2h4" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
    </div>
  );
}
