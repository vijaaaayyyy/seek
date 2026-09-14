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

/**
 * Gemini model fallback chain (display order keeps the newest, most
 * cost-efficient model first). The meaning search is a small JSON task, so the
 * chain starts at the workhorse Flash-Lite and only climbs when a model is
 * unavailable or rate-limited.
 */
const GEMINI_MODELS = [
  { label: "Gemini 3.1 Flash Lite", id: "gemini-3.1-flash-lite" },
  { label: "Gemini 2.5 Flash", id: "gemini-2.5-flash" },
  { label: "Gemini 2.5 Pro", id: "gemini-2.5-pro" },
  { label: "Gemini 2.5 Flash Lite", id: "gemini-2.5-flash-lite" },
] as const;

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

    const prompt = buildPrompt(query);
    const geminiKey = process.env.GEMINI_API_KEY?.trim();
    const xaiKey = process.env.XAI_API_KEY?.trim();
    if (!geminiKey && !xaiKey) {
      return { ok: false, error: "Meaning search is unavailable right now." };
    }

    // Gemini first (you gave your own key), then xAI as the last resort.
    let result: MeaningResponse | null = null;
    if (geminiKey) {
      result = await askGemini(prompt, geminiKey);
    }
    if (!result && xaiKey) {
      result = await askXai(prompt, xaiKey);
    }
    if (result) {
      if (cache.size > 80) cache.clear();
      cache.set(key, result);
    }
    return (
      result ?? { ok: false, error: "Meaning search could not finish. Word matches still work." }
    );
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
- Do not invent chapters or verses.
- endVerse >= verse; use a short range only when the thought spans consecutive verses.
- why: max 14 words, plain language.`;
}

/**
 * Call Gemini via its OpenAI-compatible endpoint with the model fallback chain.
 * Moves to the next model on HTTP failures (404 model missing, 429 rate limit,
 * 5xx server trouble) — those bill nothing. A 2xx response that can't be parsed
 * is a stop condition: the call was billed, so we don't keep spending across
 * the chain.
 */
async function askGemini(prompt: string, apiKey: string): Promise<MeaningResponse | null> {
  let lastError: string | null = null;
  for (const model of GEMINI_MODELS) {
    try {
      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: model.id,
            temperature: 0.2,
            max_tokens: 900,
            messages: [{ role: "user", content: prompt }],
          }),
        },
      );

      if (res.status === 400 || res.status === 404) {
        lastError = `${model.label} is unavailable`;
        continue;
      }
      if (res.status === 429) {
        lastError = "Rate limit reached";
        continue;
      }
      if (res.status >= 500) {
        lastError = `${model.label} had a server error`;
        continue;
      }
      if (!res.ok) {
        lastError = `${model.label} returned ${res.status}`;
        continue;
      }

      const body = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const text = body.choices?.[0]?.message?.content ?? "";
      const parsed = parseModelJson(text);
      if (!parsed) {
        return {
          ok: false,
          error: `Meaning search returned an unexpected answer (${model.label}).`,
        };
      }
      return normalizeResults(parsed);
    } catch {
      lastError = "Gemini could not be reached";
      continue;
    }
  }
  return lastError ? { ok: false, error: `Meaning search could not finish (${lastError}).` } : null;
}

/** Legacy xAI fallback — used only when no Gemini key is configured. */
async function askXai(prompt: string, apiKey: string): Promise<MeaningResponse | null> {
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
      return { ok: false, error: "Meaning search could not finish. Word matches still work." };
    }

    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = body.choices?.[0]?.message?.content ?? "";
    const parsed = parseModelJson(text);
    if (!parsed) {
      return { ok: false, error: "Meaning search returned an unexpected answer." };
    }
    return normalizeResults(parsed);
  } catch {
    return { ok: false, error: "Meaning search could not reach the network." };
  }
}

/** Shape-check, clamp and dedupe the model's JSON into the response contract. */
function normalizeResults(parsed: {
  reading: string;
  results: MeaningHit[];
}): MeaningResponse {
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

  return {
    ok: true,
    reading: (parsed.reading || "Verses that match what you meant.").slice(0, 240),
    results: results.slice(0, 10),
  };
}

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