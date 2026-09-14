import { useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useEffect, useId, useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";

const HINTS = [
  "a word you half remember",
  "begot, or begotten",
  "the boy who left home",
  "comfort when I am afraid",
  "walk on water",
];

export function SearchBox({
  initial = "",
  size = "lg",
  autoFocus = false,
  onSubmitQuery,
  onValueChange,
}: {
  initial?: string;
  size?: "lg" | "md";
  autoFocus?: boolean;
  onSubmitQuery?: (q: string) => void;
  onValueChange?: (q: string) => void;
}) {
  const navigate = useNavigate();
  const id = useId();
  const [value, setValue] = useState(initial);
  const [hint, setHint] = useState(0);

  useEffect(() => {
    setValue(initial);
  }, [initial]);

  useEffect(() => {
    const t = window.setInterval(() => setHint((h) => (h + 1) % HINTS.length), 4200);
    return () => window.clearInterval(t);
  }, []);

  function submit(e: FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    onSubmitQuery?.(q);
    void navigate({ to: "/search", search: { q } });
  }

  return (
    <form onSubmit={submit} className="w-full">
      <label htmlFor={id} className="sr-only">
        Search the Bible
      </label>
      <div
        className={cn(
          "glass relative flex items-center",
          size === "lg" ? "h-14 rounded-[22px]" : "h-12 rounded-[18px]",
        )}
      >
        <Search
          className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted"
          aria-hidden
          strokeWidth={1.8}
        />
        <input
          id={id}
          value={value}
          autoFocus={autoFocus}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="search"
          placeholder={HINTS[hint]}
          onChange={(e) => {
            setValue(e.target.value);
            onValueChange?.(e.target.value);
          }}
          className={cn(
            "h-full w-full bg-transparent font-sans text-ink placeholder:text-faint focus:outline-none",
            size === "lg" ? "pr-12 pl-11 text-[17px]" : "pr-12 pl-11 text-base",
          )}
        />
        {value ? (
          <button
            type="button"
            aria-label="Clear search"
            className="absolute top-1/2 right-2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-ink/8 hover:text-ink"
            onClick={() => {
              setValue("");
              onValueChange?.("");
            }}
          >
            <X className="size-4" strokeWidth={1.8} />
          </button>
        ) : (
          <button
            type="submit"
            className="sr-only"
          >
            Search
          </button>
        )}
      </div>
    </form>
  );
}
