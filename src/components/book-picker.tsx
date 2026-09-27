import { useNavigate } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { BOOKS, NT_BOOKS, OT_BOOKS, type BookMeta } from "@/lib/bible/meta";
import { cn } from "@/lib/utils";

export function BookPicker({ book, chapter }: { book: BookMeta; chapter: number }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [picking, setPicking] = useState<BookMeta>(book);
  const activeBookRef = useRef<HTMLButtonElement | null>(null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const match = (b: BookMeta) =>
      !needle ||
      b.name.toLowerCase().includes(needle) ||
      b.abbrev.toLowerCase().includes(needle) ||
      b.aliases.some((a) => a.toLowerCase().includes(needle));
    return {
      ot: OT_BOOKS.filter(match),
      nt: NT_BOOKS.filter(match),
    };
  }, [q]);

  const allFiltered = useMemo(
    () => [...filtered.ot, ...filtered.nt],
    [filtered.ot, filtered.nt],
  );

  // Keep the selected book visible when the sheet opens or selection changes
  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => {
      activeBookRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }, 50);
    return () => window.clearTimeout(id);
  }, [open, picking.slug]);

  function go(next: BookMeta, ch: number) {
    setOpen(false);
    void navigate({
      to: "/read/$book/$chapter",
      params: { book: next.slug, chapter: String(ch) },
      search: { q: undefined },
    });
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          setPicking(book);
          setQ("");
        }
      }}
    >
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-2xl px-3 text-left transition-colors hover:bg-ink/6 active:scale-[0.98]"
        >
          <span className="font-sans text-xl font-medium tracking-tight">
            {book.name} {chapter}
          </span>
          <ChevronDown className="size-4 text-muted" />
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[90dvh] gap-0">
        <SheetHeader>
          <SheetTitle>Choose a place</SheetTitle>
          <SheetDescription>
            {picking.name} has {picking.chapters.length} chapters.
          </SheetDescription>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-3 px-5 pb-6">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter books"
            className="h-11 shrink-0"
          />
          <div className="grid min-h-0 flex-1 gap-4 overflow-hidden md:grid-cols-2">
            <div className="flex min-h-0 flex-col">
              <p className="mb-2 shrink-0 px-1 font-sans text-[11px] tracking-[0.16em] text-muted uppercase">
                Books
              </p>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-2xl border border-line/60">
                {allFiltered.length === 0 ? (
                  <p className="px-4 py-6 font-sans text-sm text-muted">No books match.</p>
                ) : (
                  allFiltered.map((b) => {
                    const active = picking.slug === b.slug;
                    return (
                      <button
                        key={b.slug}
                        ref={active ? activeBookRef : undefined}
                        type="button"
                        onClick={() => setPicking(b)}
                        className={cn(
                          "w-full border-b border-line/40 px-4 py-3 text-left font-sans text-base transition-colors last:border-b-0",
                          active ? "bg-ink/10 text-ink" : "text-ink hover:bg-ink/5",
                        )}
                      >
                        {b.name}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
            <div className="flex min-h-0 flex-col">
              <p className="mb-2 shrink-0 px-1 font-sans text-[11px] tracking-[0.16em] text-muted uppercase">
                Chapters
              </p>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-6">
                  {picking.chapters.map((_, i) => {
                    const n = i + 1;
                    const current = picking.slug === book.slug && n === chapter;
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => go(picking, n)}
                        className={cn(
                          "inline-flex h-11 items-center justify-center rounded-2xl font-sans text-sm tabular-nums transition-colors active:scale-[0.96]",
                          current ? "bg-ink text-paper" : "bg-ink/8 text-ink hover:bg-ink/12",
                        )}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function bookOrNull(slug: string) {
  return BOOKS.find((b) => b.slug === slug);
}
