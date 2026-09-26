import { createServerFn } from "@tanstack/react-start";
import { BOOKS } from "@/data/books";
import { MEANING_UNAVAILABLE_MESSAGE, readGeminiKey } from "./gemini-key";

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
 * Static model fallback chain, in preference order, used only when the key's
 * available models can't be listed. The meaning search is a small JSON task,
 * so the workhorse Lite models are preferred over Pro.
 */
const STATIC_MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.5-pro",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-flash-latest",
  "gemini-pro",
] as const;

const PREFERRED_ORDER: string[] = [...STATIC_MODELS];

/** Cached model list per key, so discovery isn't repeated on every search. */
const modelListCache = new Map<string, { at: number; models: string[] }>();

/**
 * Ask the API which generative text models this key can actually call, and
 * order them most-likely-useful first. Versioned ids like
 * `gemini-2.0-flash-001` are kept, so a key whose project only exposes dated
 * models still works. Returns `null` when the list request itself fails, so
 * the caller can fall back to the static chain.
 */
async function resolveModelChain(apiKey: string): Promise<string[] | null> {
  const cached = modelListCache.get(apiKey);
  if (cached && Date.now() - cached.at < 10 * 60 * 1000) return cached.models;
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}&pageSize=300`,
    );
    if (!res.ok) return null;
    const body = (await res.json()) as {
      models?: { name?: string; supportedGenerationMethods?: string[] }[];
    };
    const skip = (name: string) =>
      name.includes("embedding") ||
      name.includes("imagen") ||
      name.includes("veo") ||
      name.includes("tts") ||
      name.includes("aqa") ||
      name.includes("search") ||
      name.includes("thinking");
    const available = new Set<string>();
    for (const model of body.models ?? []) {
      const name = (model.name ?? "").replace(/^models\//, "");
      if (!/^gemini/.test(name)) continue;
      if (skip(name)) continue;
      if (!(model.supportedGenerationMethods ?? []).includes("generateContent")) continue;
      available.add(name);
    }
    const ordered = [
      ...PREFERRED_ORDER.filter((p) => available.has(p)),
      ...[...available].filter((a) => !PREFERRED_ORDER.includes(a)),
    ];
    modelListCache.set(apiKey, { at: Date.now(), models: ordered });
    return ordered;
  } catch {
    return null;
  }
}

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
    const geminiKey = readGeminiKey();
    if (!geminiKey.ok) {
      // A server misconfiguration is not the visitor's problem: keep the reason
      // in the logs and let wording search carry the page.
      console.info(`[meaning-search] gemini key unusable: ${geminiKey.reason}`);
      return { ok: false, error: MEANING_UNAVAILABLE_MESSAGE };
    }

    const result = await askGemini(prompt, geminiKey.key);
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
 * Call Gemini across its full model fallback chain. The chain comes from
 * `resolveModelChain` (every generative model this key can use, preferred
 * first) and only falls back to the static list when discovery fails. Every
 * model is tried twice — first through the OpenAI-compatible endpoint, then
 * through the native `generateContent` REST endpoint — because a key can
 * reject the compat route while the REST route works. Moves on whenever a call
 * bills nothing (network failure, 400/404 model missing, 429 rate limit, 5xx).
 * A 2xx that can't be parsed is a stop condition: the call was billed, so we
 * don't keep spending across the chain. Returns `null` only when every model
 * failed without billing anything.
 */
async function askGemini(prompt: string, apiKey: string): Promise<MeaningResponse | null> {
  const discovered = await resolveModelChain(apiKey);
  const models: string[] =
    discovered && discovered.length ? discovered : [...STATIC_MODELS];
  const failures: string[] = [];
  for (const model of models) {
    const compat = await callGeminiCompat(prompt, apiKey, model);
    if (compat.kind === "ok") return compat.response;
    if (compat.kind === "stop") {
      console.info(`[meaning-search] stopped on compat/${model}: ${compat.reason}`);
      return { ok: false, error: compat.message };
    }
    failures.push(`compat:${compat.reason}`);

    const rest = await callGeminiRest(prompt, apiKey, model);
    if (rest.kind === "ok") return rest.response;
    if (rest.kind === "stop") {
      console.info(`[meaning-search] stopped on rest/${model}: ${rest.reason}`);
      return { ok: false, error: rest.message };
    }
    failures.push(`rest:${rest.reason}`);
  }
  console.info("[meaning-search] all models failed:", failures.join(" | "));
  return null;
}

type GeminiCallResult =
  | { kind: "ok"; response: MeaningResponse }
  | { kind: "stop"; message: string; reason: string }
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
  if (res.status === 401 || res.status === 403) {
    return {
      kind: "stop",
      message: "Meaning search is unavailable right now. Word matches still work.",
      reason: "gemini rejected the key (401/403 — revoked, expired, or no API access)",
    };
  }
  if (res.status === 400) {
    const detail = await res.text().catch(() => "");
    // A key problem and a model problem both arrive as 400. Only the former
    // should stop the chain, and neither should be blamed on the visitor.
    if (/api key not valid|API_KEY_INVALID/i.test(detail)) {
      return {
        kind: "stop",
        message: "Meaning search is unavailable right now. Word matches still work.",
        reason: "gemini reported the key as invalid (API_KEY_INVALID)",
      };
    }
    if (/API key not valid|API_KEY_INVALID|API_KEY/i.test(detail)) {
      return {
        kind: "stop",
        message: "Meaning search is unavailable right now. Word matches still work.",
        reason: "gemini rejected the key on a 400",
      };
    }
    return { kind: "next", reason: `${model} is unavailable` };
  }
  if (res.status === 404) {
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
    return {
      kind: "stop",
      message: MEANING_UNAVAILABLE_MESSAGE,
      reason: `${model} returned an empty answer`,
    };
  }
  const parsed = parseModelJson(text);
  if (!parsed) {
    return {
      kind: "stop",
      message: MEANING_UNAVAILABLE_MESSAGE,
      reason: `${model} returned an unparseable answer`,
    };
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