import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const HOLD_MS = 1300;
const N = 5;

const LINES = [
  "The LORD is my shepherd; I shall not want.",
  "In the beginning God created the heaven and the earth.",
  "Thy word is a lamp unto my feet, and a light unto my path.",
  "For God so loved the world, that he gave his only begotten Son.",
  "Trust in the LORD with all thine heart; and lean not unto thine own understanding.",
];

const REFS = ["Psalm 23:1", "Genesis 1:1", "Psalm 119:105", "John 3:16", "Proverbs 3:5"];

const CREAM = "#e8dcbf";
const CREAM_DEEP = "#d9c9a4";
const LINE_TAN = "#b9a57c";
const MUTED_BROWN = "#7d6c49";

export function BibleReadingAnimation() {
  const [pos, setPos] = useState(0);
  const [flipKey, setFlipKey] = useState(0);
  const [turning, setTurning] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced || turning) return;
    const t = window.setTimeout(() => {
      setTurning(true);
      setFlipKey((k) => k + 1);
    }, HOLD_MS);
    return () => window.clearTimeout(t);
  }, [reduced, turning, pos]);

  function onFlipEnd() {
    setPos((p) => (p + 1) % N);
    setTurning(false);
  }

  const leftRef = REFS[pos];
  const leftLine = LINES[pos];
  const rightRef = turning ? REFS[(pos + 1) % N] : REFS[pos];
  const rightLine = turning ? LINES[(pos + 1) % N] : LINES[pos];

  return (
    <div className="book-stage mx-auto w-full max-w-[290px]" aria-hidden>
      <div className="book-tilt relative aspect-[16/10]">
        {/* Left page: content changes with each flip. */}
        <PageSurface className="absolute inset-y-0 left-0 w-1/2 rounded-l-[10px] border-r-0">
          <p className="text-center font-sans text-[8px] font-medium tracking-[0.22em] uppercase" style={{ color: MUTED_BROWN }}>
            {leftRef}
          </p>
          <p className="mt-1.5 text-center font-serif text-[11px] leading-[1.55] font-medium" style={{ color: "#1a1a1a" }}>
            {leftLine}
          </p>
          <div
            className="my-2 h-px w-8 self-center"
            style={{ backgroundColor: LINE_TAN }}
          />
        </PageSurface>

        {/* Right page revealed beneath the turning leaf. */}
        <PageSurface className="absolute inset-y-0 left-1/2 w-1/2 rounded-r-[10px] border-l-0">
          <p className="text-center font-sans text-[8px] font-medium tracking-[0.22em] uppercase" style={{ color: MUTED_BROWN }}>
            {rightRef}
          </p>
          <p className="mt-1.5 text-center font-serif text-[11px] leading-[1.55] font-medium" style={{ color: "#1a1a1a" }}>
            {rightLine}
          </p>
        </PageSurface>

        {/* The turning page: same content as the left-flip advances. */}
        {turning && (
          <div
            key={flipKey}
            onAnimationEnd={onFlipEnd}
            className={cn("book-leaf book-flip-next absolute inset-y-0 left-1/2 w-1/2")}
          >
            <PageSurface className="h-full rounded-r-[10px] border-l-0">
              <p className="text-center font-sans text-[8px] font-medium tracking-[0.22em] uppercase" style={{ color: MUTED_BROWN }}>
                {REFS[pos]}
              </p>
              <p className="mt-1.5 text-center font-serif text-[11px] leading-[1.55] font-medium" style={{ color: "#1a1a1a" }}>
                {LINES[pos]}
              </p>
            </PageSurface>
          </div>
        )}
      </div>
    </div>
  );
}

function PageSurface({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col justify-center overflow-hidden px-3 py-3 text-ink",
        className,
      )}
      style={{
        backgroundColor: CREAM,
        border: `1px solid ${CREAM_DEEP}`,
        boxShadow: "0 1px 2px var(--glass-drop), 0 12px 30px var(--glass-drop)",
      }}
    >
      {children}
    </div>
  );
}