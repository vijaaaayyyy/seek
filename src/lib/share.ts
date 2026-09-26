import { formatRef, type BookMeta } from "@/lib/bible/meta";
import { CANONICAL_ORIGIN } from "@/lib/seo";

/**
 * Sharing a verse.
 *
 * The canonical target of a share is the reader link for that exact verse, using
 * the `#v<number>` hash the reader already understands: opening it scrolls the
 * verse into view and highlights it. That is the same deep link the search
 * results use, so a shared verse reopens the way the site already links to it.
 *
 * Two outcomes matter and they are not the same gesture: on a phone the user
 * expects the OS share sheet, because that is how a verse reaches WhatsApp or
 * Messages. On a desktop with no share sheet, the useful equivalent is a
 * clipboard copy of the words *and* the link, so pasting it anywhere still
 * carries the reference back to SEEK.
 */

export type ShareOutcome = "shared" | "copied" | "cancelled" | "failed";

function origin(): string {
  // window.location wins so a share made from a preview or a local build still
  // points somewhere the recipient can open; in production it is the canonical
  // origin anyway.
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }
  return CANONICAL_ORIGIN;
}

export function verseShareUrl(
  slug: string,
  chapter: number,
  verse: number,
): string {
  return `${origin()}/read/${slug}/${chapter}#v${verse}`;
}

export function verseCitation(
  book: BookMeta,
  chapter: number,
  verse: number,
): string {
  return `${formatRef(book, chapter, verse)} (KJV)`;
}

export async function shareVerse(args: {
  book: BookMeta;
  chapter: number;
  verse: number;
  text: string;
}): Promise<ShareOutcome> {
  const { book, chapter, verse, text } = args;
  const url = verseShareUrl(book.slug, chapter, verse);
  const citation = verseCitation(book, chapter, verse);
  const message = `\u201c${text.trim()}\u201d \u2014 ${citation}`;

  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share({ title: citation, text: message, url });
      return "shared";
    } catch (err) {
      // Dismissing the sheet is a decision, not a failure, and must not fall
      // through to a silent clipboard write the user never asked for.
      if (err instanceof DOMException && err.name === "AbortError") {
        return "cancelled";
      }
      // Any other rejection (no share target, permission, insecure context)
      // still deserves the clipboard.
    }
  }

  try {
    await navigator.clipboard.writeText(`${message}\n${url}`);
    return "copied";
  } catch {
    return "failed";
  }
}
