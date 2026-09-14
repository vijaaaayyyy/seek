import { BookOpenText, ScrollText } from "lucide-react";
import { useSeekStore, type ReaderView } from "@/lib/store";
import { cn } from "@/lib/utils";

const MODES: { id: ReaderView; label: string; icon: typeof BookOpenText }[] = [
  { id: "book", label: "Pages", icon: BookOpenText },
  { id: "scroll", label: "Scroll", icon: ScrollText },
];

export function ReadingModeToggle({ className }: { className?: string }) {
  const view = useSeekStore((s) => s.readerView);
  const setView = useSeekStore((s) => s.setReaderView);

  return (
    <div
      role="tablist"
      aria-label="Reading mode"
      className={cn("glass-segmented relative flex h-10 shrink-0 rounded-full p-1", className)}
    >
      {MODES.map(({ id, label, icon: Icon }) => {
        const active = view === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setView(id)}
            className={cn(
              "relative z-10 inline-flex items-center gap-1.5 rounded-full px-3 font-sans text-[12px] font-medium transition-colors",
              active ? "text-ink" : "text-muted hover:text-ink/80",
            )}
          >
            <Icon className="size-3.5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}