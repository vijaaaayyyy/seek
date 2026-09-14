import { BOOKS } from "@/data/books";

export type RawBook = { name: string; chapters: string[][] };

export type IndexedVerse = {
  i: number;
  bookIndex: number;
  chapter: number;
  verse: number;
  text: string;
  norm: string;
  words: string[];
};

export type LoadedBible = {
  books: RawBook[];
  verses: IndexedVerse[];
  prefixIndex: Map<string, number[]>;
};

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u2018\u2019\u0060]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function indexBible(raw: RawBook[]): LoadedBible {
  const verses: IndexedVerse[] = [];
  const prefixIndex = new Map<string, number[]>();

  raw.forEach((book, bookIndex) => {
    book.chapters.forEach((ch, ci) => {
      ch.forEach((text, vi) => {
        const norm = normalize(text);
        const words = norm.split(" ").filter(Boolean);
        const i = verses.length;
        verses.push({
          i,
          bookIndex,
          chapter: ci + 1,
          verse: vi + 1,
          text,
          norm,
          words,
        });
        const seen = new Set<string>();
        for (const word of words) {
          const key = word.slice(0, 3);
          if (!key || seen.has(key)) continue;
          seen.add(key);
          const bucket = prefixIndex.get(key);
          if (bucket) bucket.push(i);
          else prefixIndex.set(key, [i]);
        }
      });
    });
  });
  return { books: raw, verses, prefixIndex };
}

let inflight: Promise<LoadedBible> | null = null;
let cached: LoadedBible | null = null;

export function getBibleSync(): LoadedBible | null {
  return cached;
}

export function loadBible(): Promise<LoadedBible> {
  if (cached) return Promise.resolve(cached);
  if (inflight) return inflight;
  inflight = fetch("/data/kjv.json")
    .then((res) => {
      if (!res.ok) throw new Error("Could not load the Bible text.");
      return res.json() as Promise<RawBook[]>;
    })
    .then((raw) => {
      if (!Array.isArray(raw) || raw.length !== BOOKS.length) {
        throw new Error("Bible data looks incomplete.");
      }
      cached = indexBible(raw);
      return cached;
    })
    .catch((err) => {
      inflight = null;
      throw err;
    });
  return inflight;
}

export function getVerse(
  bible: LoadedBible,
  bookIndex: number,
  chapter: number,
  verse: number,
): IndexedVerse | undefined {
  return bible.verses.find(
    (v) => v.bookIndex === bookIndex && v.chapter === chapter && v.verse === verse,
  );
}

export function getChapter(
  bible: LoadedBible,
  bookIndex: number,
  chapter: number,
): IndexedVerse[] {
  return bible.verses.filter((v) => v.bookIndex === bookIndex && v.chapter === chapter);
}
