import { BOOKS, type BookMeta, type Testament } from "@/data/books";

export { BOOKS, type BookMeta, type Testament };

export const OT_BOOKS = BOOKS.filter((b) => b.testament === "OT");
export const NT_BOOKS = BOOKS.filter((b) => b.testament === "NT");

const bySlug = new Map(BOOKS.map((b) => [b.slug, b]));
const byName = new Map(BOOKS.map((b) => [b.name.toLowerCase(), b]));

export function bookBySlug(slug: string): BookMeta | undefined {
  return bySlug.get(slug.toLowerCase());
}

export function bookByName(name: string): BookMeta | undefined {
  return byName.get(name.toLowerCase()) ?? bySlug.get(slugify(name));
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function chapterCount(book: BookMeta): number {
  return book.chapters.length;
}

export function verseCount(book: BookMeta, chapter: number): number {
  return book.chapters[chapter - 1] ?? 0;
}

export function formatRef(
  book: string | BookMeta,
  chapter: number,
  verse?: number | null,
  endVerse?: number | null,
): string {
  const name = typeof book === "string" ? book : book.name;
  if (!verse) return `${name} ${chapter}`;
  if (endVerse && endVerse !== verse) return `${name} ${chapter}:${verse}–${endVerse}`;
  return `${name} ${chapter}:${verse}`;
}

export function readPath(
  book: string | BookMeta,
  chapter: number,
  verse?: number | null,
): string {
  const slug = typeof book === "string" ? slugify(book) : book.slug;
  const base = `/read/${slug}/${chapter}`;
  return verse ? `${base}#v${verse}` : base;
}

export type AliasEntry = { alias: string; book: BookMeta; short: boolean };

function compact(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
}

export const ALIASES: AliasEntry[] = (() => {
  const out: AliasEntry[] = [];
  const seen = new Set<string>();
  for (const book of BOOKS) {
    const keys = [book.name, book.abbrev, book.slug.replace(/-/g, " "), ...book.aliases];
    for (const key of keys) {
      const alias = compact(key);
      if (!alias || seen.has(alias)) continue;
      seen.add(alias);
      out.push({ alias, book, short: alias.replace(/\s/g, "").length <= 2 });
    }
  }
  out.sort((a, b) => b.alias.length - a.alias.length);
  return out;
})();
