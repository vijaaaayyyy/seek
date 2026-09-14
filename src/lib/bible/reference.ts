import { ALIASES, bookByName, type BookMeta } from "./meta";
import { normalize } from "./load";

export type ParsedRef = {
  book: BookMeta;
  chapter: number | null;
  verse: number | null;
  endVerse: number | null;
};

export function parseReference(raw: string): ParsedRef | null {
  const q = normalize(raw);
  if (!q) return null;

  for (const { alias, book, short } of ALIASES) {
    if (q === alias) {
      if (short) continue;
      return { book, chapter: null, verse: null, endVerse: null };
    }

    const prefix = alias + " ";
    if (!q.startsWith(prefix)) continue;

    const rest = q.slice(prefix.length).trim();
    const m = rest.match(/^(\d+)(?:\s+(\d+))?(?:\s+(\d+))?$/);
    if (!m) continue;

    const chapter = Number(m[1]);
    const verse = m[2] ? Number(m[2]) : null;
    const endVerse = m[3] ? Number(m[3]) : null;
    if (!Number.isFinite(chapter) || chapter < 1) continue;
    if (chapter > book.chapters.length) continue;
    const maxVerse = book.chapters[chapter - 1] ?? 0;
    if (verse && verse > maxVerse) continue;
    return { book, chapter, verse, endVerse };
  }

  return null;
}

export function resolveBookName(name: string): BookMeta | undefined {
  return bookByName(name);
}
