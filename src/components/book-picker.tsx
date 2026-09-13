import { useNavigate } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
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
          className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-left transition-colors hover:bg-wash"
        >
          <span className="font-serif text-xl font-medium tracking-tight sm:text-2xl">
            {book.name} {chapter}
          </span>
          <ChevronDown className="size-4 text-muted" />
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="gap-0">
        <SheetHeader>
          <SheetTitle>Choose a place</SheetTitle>
          <SheetDescription>
            {picking.name} has {picking.chapters.length} chapters.
          </SheetDescription>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-4 px-6 pb-6">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter books"
            className="h-11"
          />
          <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto md:grid-cols-2">
            <div>
              <p className="mb-2 font-sans text-xs tracking-widest text-muted uppercase">
                Books
              </p>
              <div className="flex flex-col">
                {[...filtered.ot, ...filtered.nt].map((b) => (
                  <button
                    key={b.slug}
                    type="button"
                    onClick={() => setPicking(b)}
                    className={cn(
                      "rounded-md px-3 py-2 text-left font-serif text-base transition-colors",
                      picking.slug === b.slug ? "bg-wash text-ink" : "text-ink hover:bg-wash",
                    )}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 font-sans text-xs tracking-widest text-muted uppercase">
                Chapters
              </p>
              <div className="grid grid-cols-6 gap-1 sm:grid-cols-8">
                {picking.chapters.map((_, i) => {
                  const n = i + 1;
                  const current = picking.slug === book.slug && n === chapter;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => go(picking, n)}
                      className={cn(
                        "inline-flex h-11 items-center justify-center rounded-md font-sans text-sm tabular-nums transition-colors",
                        current ? "bg-forest text-forest-fg" : "bg-wash text-ink hover:bg-line",
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
      </SheetContent>
    </Sheet>
  );
}

export function bookOrNull(slug: string) {
  return BOOKS.find((b) => b.slug === slug);
}
