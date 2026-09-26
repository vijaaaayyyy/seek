import { useState } from "react";
import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { shareVerse, verseCitation } from "@/lib/share";
import type { BookMeta } from "@/lib/bible/meta";
import { cn } from "@/lib/utils";

/**
 * The per-verse share control. Styled by its caller so it can sit inline in the
 * reader's verse paragraph or in a result card's icon row.
 */
export function VerseShareButton({
  book,
  chapter,
  verse,
  text,
  className,
  label,
  iconClassName,
}: {
  book: BookMeta;
  chapter: number;
  verse: number;
  text: string;
  className?: string;
  label?: string;
  iconClassName?: string;
}) {
  const [busy, setBusy] = useState(false);

  async function onClick() {
    // A second tap while the sheet is open, or before a clipboard write settles,
    // would fire a second share.
    if (busy) return;
    setBusy(true);
    try {
      const outcome = await shareVerse({ book, chapter, verse, text });
      if (outcome === "copied") {
        toast.success("Copied verse and link");
      } else if (outcome === "failed") {
        toast.error("Could not share this verse");
      }
      // "shared" needs no confirmation — the sheet closing is the confirmation.
      // "cancelled" must stay silent: the user already told us what they wanted.
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      aria-label={label ?? `Share ${verseCitation(book, chapter, verse)}`}
      disabled={busy}
      onClick={onClick}
      className={cn("inline-flex", className)}
    >
      <Share2 className={cn("size-3.5", iconClassName)} strokeWidth={1.8} />
    </button>
  );
}

/**
 * The reader keeps its per-verse controls out of the way until the verse is
 * hovered. `hover:` alone would leave them unreachable: there is no hover on a
 * touch screen, and a keyboard user would tab onto an invisible control. So the
 * reveal is gated on a real hover-capable pointer, and always visible otherwise.
 */
export const VERSE_ACTIONS_CLASS =
  "opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100";
