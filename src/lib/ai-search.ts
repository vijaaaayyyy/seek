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
 * Gemini model fallback chain (display order keeps the workhorse model first).
 * The meaning search is a small JSON task, so the chain starts at Flash and
 * only climbs or drops to an alias when a model is unavailable or rate-limited.
 */
const GEMINI_MODELS = [
  { label: "Gemini 2.5 Flash", id: "gemini-2.5-flash" },
  { label: "Gemini 2.5 Flash Lite", id: "gemini-2.5-flash-lite" },
  { label: "Gemini 2.0 Flash", id: "gemini-2.0-flash" },
  { label: "Gemini 2.0 Flash Lite", id: "gemini-2.0-flash-lite" },
  { label: "Gemini 2.5 Pro", id: "gemini-2.5-pro" },
  { label: "Gemini 1.5 Flash", id: "gemini-1.5-flash" },
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
    if (!geminiKey) {
      return { ok: false, error: "Meaning search is unavailable right now." };
    }

    const result = await askGemini(prompt, geminiKey);
    if (result?.ok) {
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
 * Call Gemini with a model fallback chain. Every model is tried twice — first
 * through the OpenAI-compatible endpoint, then through the native
 * `generateContent` REST endpoint — because a key can reject the compat route
 * while the REST route works. Moves on whenever a call bills nothing (network
 * failure, 400/404 model missing, 429 rate limit, 5xx). A 2xx that can't be
 * parsed is a stop condition: the call was billed, so we don't keep spending
 * across the chain. Returns `null` only when every model failed without
 * billing anything, so the caller can fall back to xAI.
 */
async function askGemini(prompt: string, apiKey: string): Promise<MeaningResponse | null> {
  for (const model of GEMINI_MODELS) {
    const compat = await callGeminiCompat(prompt, apiKey, model.id);
    if (compat.kind === "ok") return compat.response;
    if (compat.kind === "stop") return { ok: false, error: compat.message };

    const rest = await callGeminiRest(prompt, apiKey, model.id);
    if (rest.kind === "ok") return rest.response;
    if (rest.kind === "stop") return { ok: false, error: rest.message };
  }
  return null;
}

type GeminiCallResult =
  | { kind: "ok"; response: MeaningResponse }
  | { kind: "stop"; message: string }
  | { kind: "next"; reason: string };

async function callGeminiCompat(
  prompt: string,
  apiKey: string,
  model: string,
): Promise<GeminiCallResult> {
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
          model,
          temperature: 0.2,
          max_tokens: 900,
          messages: [{ role: "user", content: prompt }],
        }),
      },
    );
    return classifyGeminiResponse(res, model);
  } catch {
    return { kind: "next", reason: `${model} could not be reached` };
  }
}

async function callGeminiRest(
  prompt: string,
  apiKey: string,
  model: string,
): Promise<GeminiCallResult> {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 900 },
        }),
      },
    );
    return classifyGeminiResponse(res, model);
  } catch {
    return { kind: "next", reason: `${model} could not be reached` };
  }
}

async function classifyGeminiResponse(
  res: Response,
  model: string,
): Promise<GeminiCallResult> {
  if (res.status === 400 || res.status === 404) {
    return { kind: "next", reason: `${model} is unavailable` };
  }
  if (res.status === 429) {
    return { kind: "next", reason: "rate limit reached" };
  }
  if (res.status >= 500) {
    return { kind: "next", reason: `${model} had a server error` };
  }
  if (!res.ok) {
    return { kind: "next", reason: `${model} returned ${res.status}` };
  }

  const body = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text =
    body.choices?.[0]?.message?.content ??
    body.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ??
    "";
  if (!text.trim()) {
    return { kind: "stop", message: `Meaning search returned an empty answer (${model}).` };
  }
  const parsed = parseModelJson(text);
  if (!parsed) {
    return { kind: "stop", message: `Meaning search returned an unexpected answer (${model}).` };
  }
  return { kind: "ok", response: normalizeResults(parsed) };
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