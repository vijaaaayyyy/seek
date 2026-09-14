import { BOOKS } from "./meta";
import { normalize, type IndexedVerse, type LoadedBible } from "./load";
import { parseReference } from "./reference";

export type SearchKind = "reference" | "wording" | "book";

export type LocalHit = {
  verse: IndexedVerse;
  score: number;
  kind: SearchKind;
  matched: string[];
  reason: string;
};

const STOP = new Set([
  "the",
  "and",
  "of",
  "to",
  "a",
  "an",
  "in",
  "that",
  "is",
  "was",
  "it",
  "with",
  "for",
  "from",
  "by",
  "as",
  "on",
  "at",
  "or",
  "be",
  "he",
  "his",
  "him",
  "i",
  "my",
]);

const SYNONYMS: Record<string, string[]> = {
  love: ["charity"],
  charity: ["love"],
  spirit: ["ghost"],
  ghost: ["spirit"],
  jesus: ["christ"],
  christ: ["jesus"],
  church: ["congregation"],
  congregation: ["church"],
};

function expand(token: string): string[] {
  const extra = SYNONYMS[token];
  return extra ? [token, ...extra] : [token];
}

function editDistanceOne(a: string, b: string): boolean {
  const la = a.length;
  const lb = b.length;
  if (Math.abs(la - lb) > 1) return false;
  if (a === b) return true;
  if (la === lb) {
    let d = 0;
    for (let i = 0; i < la; i++) {
      if (a[i] !== b[i] && ++d > 1) return false;
    }
    return true;
  }
  const longer = la > lb ? a : b;
  const shorter = la > lb ? b : a;
  let i = 0;
  let j = 0;
  let d = 0;
  while (i < longer.length) {
    if (j < shorter.length && longer[i] === shorter[j]) {
      i++;
      j++;
    } else {
      if (++d > 1) return false;
      i++;
    }
  }
  return true;
}

type TokenMatch = { score: number; word: string };

function matchToken(token: string, words: string[]): TokenMatch | null {
  let best: TokenMatch | null = null;
  const consider = (score: number, word: string) => {
    if (!best || score > best.score) best = { score, word };
  };

  for (const word of words) {
    if (word === token) {
      consider(24, word);
      continue;
    }
    if (token.length >= 3 && word.startsWith(token)) {
      const extra = word.length - token.length;
      consider(extra <= 5 ? 16 : 10, word);
      continue;
    }
    if (token.length >= 4 && word.endsWith(token)) {
      consider(14, word);
      continue;
    }
    if (token.length >= 5 && word.includes(token)) {
      consider(9, word);
      continue;
    }
    if (token.length >= 5 && Math.abs(word.length - token.length) <= 1 && editDistanceOne(token, word)) {
      consider(12, word);
    }
  }
  return best;
}

function proximityBonus(positions: number[]): number {
  if (positions.length < 2) return 0;
  const sorted = [...positions].sort((a, b) => a - b);
  let best = 99;
  for (let i = 1; i < sorted.length; i++) {
    best = Math.min(best, sorted[i]! - sorted[i - 1]!);
  }
  if (best <= 2) return 18;
  if (best <= 6) return 10;
  if (best <= 12) return 4;
  return 0;
}

function candidateIds(bible: LoadedBible, tokens: string[]): IndexedVerse[] {
  const buckets: number[][] = [];
  for (const token of tokens) {
    if (token.length < 3) return bible.verses;
    const keys = new Set(expand(token).map((t) => t.slice(0, 3)));
    const merged: number[] = [];
    const seen = new Set<number>();
    for (const key of keys) {
      const bucket = bible.prefixIndex.get(key);
      if (!bucket) continue;
      for (const id of bucket) {
        if (!seen.has(id)) {
          seen.add(id);
          merged.push(id);
        }
      }
    }
    if (!merged.length) return [];
    buckets.push(merged);
  }
  if (!buckets.length) return bible.verses;

  buckets.sort((a, b) => a.length - b.length);
  const first = buckets[0]!;
  if (buckets.length === 1) return first.map((id) => bible.verses[id]!);

  const rest = buckets.slice(1).map((b) => new Set(b));
  const out: IndexedVerse[] = [];
  for (const id of first) {
    if (rest.every((set) => set.has(id))) out.push(bible.verses[id]!);
  }
  return out;
}

function diversify(hits: LocalHit[], maxPerBook = 3): LocalHit[] {
  const counts = new Map<number, number>();
  const out: LocalHit[] = [];
  for (const hit of hits) {
    if (hit.kind !== "wording") {
      out.push(hit);
      continue;
    }
    const n = counts.get(hit.verse.bookIndex) ?? 0;
    if (n >= maxPerBook) continue;
    counts.set(hit.verse.bookIndex, n + 1);
    out.push(hit);
  }
  return out;
}

export function searchLocal(
  bible: LoadedBible,
  query: string,
  limit = 40,
): LocalHit[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const hits: LocalHit[] = [];
  const ref = parseReference(trimmed);

  if (ref) {
    if (ref.chapter && ref.verse) {
      const start = ref.verse;
      const end = ref.endVerse && ref.endVerse > start ? ref.endVerse : start;
      for (let v = start; v <= end; v++) {
        const verse = bible.verses.find(
          (item) =>
            item.bookIndex === ref.book.index &&
            item.chapter === ref.chapter &&
            item.verse === v,
        );
        if (verse) {
          hits.push({
            verse,
            score: 1000 - (v - start),
            kind: "reference",
            matched: [],
            reason: "Opened this place from the reference you typed.",
          });
        }
      }
    } else if (ref.chapter) {
      const chapterVerses = bible.verses.filter(
        (item) => item.bookIndex === ref.book.index && item.chapter === ref.chapter,
      );
      chapterVerses.slice(0, 8).forEach((verse, i) => {
        hits.push({
          verse,
          score: 900 - i,
          kind: "reference",
          matched: [],
          reason: `Opening ${ref.book.name} ${ref.chapter}.`,
        });
      });
    } else {
      const first = bible.verses.find((item) => item.bookIndex === ref.book.index);
      if (first) {
        hits.push({
          verse: first,
          score: 850,
          kind: "book",
          matched: [],
          reason: `The book of ${ref.book.name}.`,
        });
      }
    }
  }

  const norm = normalize(trimmed);
  const tokens = norm.split(" ").filter(Boolean);
  if (!tokens.length) return hits.slice(0, limit);

  const contentTokens = tokens.filter((t) => !STOP.has(t) && t.length > 1);
  const required = contentTokens.length ? contentTokens : tokens.filter((t) => t.length > 1);
  if (!required.length) return hits.slice(0, limit);

  const expanded = required.map((t) => expand(t));
  const phrase = required.join(" ");
  const pool = candidateIds(bible, required);
  const already = new Set(hits.map((h) => h.verse.i));

  for (const verse of pool) {
    if (already.has(verse.i)) continue;

    let score = 0;
    const matched = new Set<string>();
    const positions: number[] = [];
    let missed = 0;

    if (phrase.length >= 6 && verse.norm.includes(phrase)) {
      score += 80 + Math.min(phrase.length, 40);
    }

    for (const variants of expanded) {
      let best: TokenMatch | null = null;
      let bestPos = -1;
      for (const token of variants) {
        if (token.length <= 1) continue;
        const found = matchToken(token, verse.words);
        if (found && (!best || found.score > best.score)) {
          best = found;
          bestPos = verse.words.indexOf(found.word);
        }
      }
      if (!best) {
        missed += 1;
        continue;
      }
      score += best.score;
      matched.add(best.word);
      if (bestPos >= 0) positions.push(bestPos);
    }

    if (!matched.size) continue;
    if (required.length >= 2 && missed > Math.floor(required.length / 2)) continue;
    if (required.length === 1 && missed > 0) continue;

    score += proximityBonus(positions);
    if (required.length >= 2 && missed === 0) score += 16;

    const words = [...matched];
    hits.push({
      verse,
      score,
      kind: "wording",
      matched: words,
      reason:
        words.length === 1
          ? `Remembers “${words[0]}”`
          : `Remembers ${words.slice(0, 3).map((w) => `“${w}”`).join(", ")}`,
    });
  }

  hits.sort((a, b) => b.score - a.score || a.verse.i - b.verse.i);
  return diversify(hits).slice(0, limit);
}

export function searchBooks(query: string, limit = 8): { book: (typeof BOOKS)[number]; reason: string }[] {
  const q = normalize(query);
  if (q.length < 2) return [];
  const out: { book: (typeof BOOKS)[number]; reason: string }[] = [];
  for (const book of BOOKS) {
    const name = normalize(book.name);
    const slug = normalize(book.slug.replace(/-/g, " "));
    if (name === q || slug === q || book.aliases.some((a) => normalize(a) === q)) {
      out.push({ book, reason: "This book" });
      continue;
    }
    if (name.startsWith(q) || slug.startsWith(q) || book.abbrev.toLowerCase().startsWith(q)) {
      out.push({ book, reason: "Book name" });
    }
  }
  return out.slice(0, limit);
}
