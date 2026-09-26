import kjvRaw from "../../../public/data/kjv.json?raw";
import { BOOKS } from "@/data/books";
import type { RawBook } from "@/lib/bible/load";

/**
 * The KJV text, on the server.
 *
 * The browser downloads `public/data/kjv.json` (4.2 MB) because searching and
 * paging need the whole Bible resident. That is the right trade for an
 * interactive reader and the wrong one for a crawler: until that download
 * finishes, a chapter URL renders an empty shell, so every one of the ~1,190
 * chapter pages in the sitemap reaches a search engine as a page with no text.
 *
 * This module gives the server the same text without touching how the client
 * loads it. It is imported only from a `createServerFn` handler, so the string
 * is inlined into the server bundle and never reaches the browser.
 *
 * `?raw` rather than a JSON import on purpose: `import data from "*.json"`
 * makes TypeScript build a literal type for all ~31,000 verses, which makes
 * `tsc` crawl. `?raw` types as `string` and is parsed once per process.
 */
let books: RawBook[] | null = null;

function kjv(): RawBook[] {
  if (books) return books;
  const parsed = JSON.parse(kjvRaw) as RawBook[];
  if (!Array.isArray(parsed) || parsed.length !== BOOKS.length) {
    throw new Error("KJV data looks incomplete.");
  }
  books = parsed;
  return books;
}

export type ChapterText = { chapter: number; verses: string[] };

/** Null for a reference outside the text; the route has already 404'd by then. */
export function chapterText(bookIndex: number, chapter: number): ChapterText | null {
  const book = kjv()[bookIndex];
  const verses = book?.chapters?.[chapter - 1];
  if (!Array.isArray(verses) || verses.length === 0) return null;
  return { chapter, verses };
}
