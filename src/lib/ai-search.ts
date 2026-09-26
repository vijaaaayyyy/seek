import { createServerFn } from "@tanstack/react-start";
import { BOOKS } from "@/data/books";
import { MEANING_UNAVAILABLE_MESSAGE, readGeminiKey } from "./gemini-key.ts";
import { askGemini } from "./gemini-client.ts";

export type MeaningHit = {
  book: string;
  chapter: number;
  verse: number;
  endVerse: number;
  why: string;
};

export type MeaningResponse = {
  ok: true;
  reading: string;
  results: MeaningHit[];
};

const BOOK_NAMES = BOOKS.map((b) => b.name).join(", ");

const cache = new Map<string, MeaningResponse>();

export const searchByMeaning = createServerFn({ method: "POST" })
  .inputValidator((data: { query: string }) => data)
  .handler(async ({ data }): Promise<MeaningResponse | { ok: false; error: string }> => {
    const raw = data.query?.trim();
    if (!raw || raw.length < 2) {
      return { ok: false, error: "Type a little more to search by meaning." };
    }
    const query = raw.slice(0, 200);

    const key = query.toLowerCase();
    const cached = cache.get(key);
    if (cached) return cached;

    const prompt = buildPrompt(query);
    const geminiKey = readGeminiKey();
    if (!geminiKey.ok) {
      // A server misconfiguration is not the visitor's problem: keep the reason
      // in the logs and let wording search carry the page.
      console.info(`[meaning-search] gemini key unusable: ${geminiKey.reason}`);
      return { ok: false, error: MEANING_UNAVAILABLE_MESSAGE };
    }
    if (geminiKey.warning) {
      console.info(`[meaning-search] ${geminiKey.warning}`);
    }

    const result = await askGemini(prompt, geminiKey.key);
    if (result?.ok) {
      const normalized = normalizeResults(result.response as unknown as ParsedAnswer);
      if (cache.size > 80) cache.clear();
      cache.set(key, normalized);
      return normalized;
    }
    return result ?? { ok: false, error: "Meaning search could not finish. Word matches still work." };
  });

function buildPrompt(query: string): string {
  return `You help people who half-remember a Bible verse, or who know the feeling/intention but not the words.

The user typed:
"""${query}"""

They may have:
- only a fragment or misspelling of a word (e.g. "begot" for "begotten")
- a modern paraphrase ("walk on water", "the boy who left home")
- a need or intention ("comfort when I am afraid", "how to treat enemies")
- a story name that does not appear in the KJV text ("prodigal son")

Return JSON only, no markdown, shape:
{
  "reading": "one warm sentence naming what they likely mean",
  "results": [
    { "book": "John", "chapter": 3, "verse": 16, "endVerse": 16, "why": "short reason" }
  ]
}

Rules:
- Use King James verse numbering.
- Book must be one of: ${BOOK_NAMES}
- 6 to 10 results, most likely first.
- Include verses whose MEANING matches even if the user's words are absent.
- If it is a story, give the key verses of that narrative.
- If it is clearly a reference, put that verse first, then close companions.
- Do not invent chapters or verses.`;
}

type ParsedAnswer = {
  reading: string;
  results: MeaningHit[];
};

/** Shape-check, clamp and dedupe the model's JSON into the response contract. */
function normalizeResults(parsed: ParsedAnswer): MeaningResponse {
  const names = new Set(BOOKS.map((b) => b.name));
  const results: MeaningHit[] = [];
  const seen = new Set<string>();
  for (const item of parsed.results ?? []) {
    if (!item || !names.has(item.book)) continue;
    const chapter = Math.max(1, Math.floor(item.chapter));
    const verse = Math.max(1, Math.floor(item.verse));
    const endVerse = Math.max(verse, Math.floor(item.endVerse || verse));
    const id = `${item.book}:${chapter}:${verse}`;
    if (seen.has(id)) continue;
    seen.add(id);
    results.push({
      book: item.book,
      chapter,
      verse,
      endVerse: Math.min(endVerse, verse + 8),
      why: (item.why || "Matches the meaning.").slice(0, 140),
    });
  }

  return {
    ok: true,
    reading: (parsed.reading || "Verses that match what you meant.").slice(0, 240),
    results: results.slice(0, 10),
  };
}
