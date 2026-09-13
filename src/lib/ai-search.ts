import { createServerFn } from "@tanstack/react-start";
import { BOOKS } from "@/data/books";

export type MeaningHit = {
  book: string;
  chapter: number;
  verse: number;
  endVerse: number;
  why: string;
};

export type MeaningResponse =
  | { ok: true; reading: string; results: MeaningHit[] }
  | { ok: false; error: string };

const BOOK_NAMES = BOOKS.map((b) => b.name).join(", ");

const cache = new Map<string, MeaningResponse>();

export const searchByMeaning = createServerFn({ method: "POST" })
  .validator((input: { query: string }) => {
    const query = input.query.trim().slice(0, 220);
    return { query };
  })
  .handler(async ({ data }): Promise<MeaningResponse> => {
    const query = data.query;
    if (query.length < 2) {
      return { ok: false, error: "Type a little more to search by meaning." };
    }

    const key = query.toLowerCase();
    const cached = cache.get(key);
    if (cached) return cached;

    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false, error: "Meaning search is unavailable right now." };
    }

    const prompt = `You help people who half-remember a Bible verse, or who know the feeling/intention but not the words.

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
- Do not invent chapters or verses.
- endVerse >= verse; use a short range only when the thought spans consecutive verses.
- why: max 14 words, plain language.`;

    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-4.5",
          temperature: 0.2,
          max_tokens: 900,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!res.ok) {
        return {
          ok: false,
          error: "Meaning search could not finish. Word matches still work.",
        };
      }

      const body = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const text = body.choices?.[0]?.message?.content ?? "";
      const parsed = parseModelJson(text);
      if (!parsed) {
        return { ok: false, error: "Meaning search returned an unexpected answer." };
      }

      const names = new Set(BOOKS.map((b) => b.name));
      const results: MeaningHit[] = [];
      const seen = new Set<string>();
      for (const item of parsed.results) {
        if (!names.has(item.book)) continue;
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

      const result: MeaningResponse = {
        ok: true,
        reading: (parsed.reading || "Verses that match what you meant.").slice(0, 240),
        results: results.slice(0, 10),
      };
      if (cache.size > 80) cache.clear();
      cache.set(key, result);
      return result;
    } catch {
      return { ok: false, error: "Meaning search could not reach the network." };
    }
  });

function parseModelJson(text: string): {
  reading: string;
  results: MeaningHit[];
} | null {
  const trimmed = text.trim();
  const fenced = trimmed.match(/\{[\s\S]*\}/);
  const raw = fenced ? fenced[0] : trimmed;
  try {
    const data = JSON.parse(raw) as {
      reading?: unknown;
      results?: unknown;
    };
    if (!Array.isArray(data.results)) return null;
    const results: MeaningHit[] = [];
    for (const row of data.results) {
      if (!row || typeof row !== "object") continue;
      const r = row as Record<string, unknown>;
      if (typeof r.book !== "string") continue;
      if (typeof r.chapter !== "number" && typeof r.chapter !== "string") continue;
      if (typeof r.verse !== "number" && typeof r.verse !== "string") continue;
      results.push({
        book: r.book,
        chapter: Number(r.chapter),
        verse: Number(r.verse),
        endVerse: Number(r.endVerse ?? r.verse),
        why: typeof r.why === "string" ? r.why : "",
      });
    }
    return {
      reading: typeof data.reading === "string" ? data.reading : "",
      results,
    };
  } catch {
    return null;
  }
}
