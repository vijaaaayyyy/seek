import { MEANING_UNAVAILABLE_MESSAGE } from "./gemini-key.ts";

/**
 * Gemini transport: model discovery, the fallback chain, and response
 * classification. Deliberately free of `@/` imports so the fallback behaviour
 * can be unit-tested against a stubbed `fetch` - the chain is the part that
 * silently dies when a model is retired, and it is not something to verify by
 * reading.
 *
 * `MeaningResponse` is structural here so this module stays importable on its
 * own; `ai-search.ts` supplies the real type.
 */
export type GeminiMeaningHit = {
  book: string;
  chapter: number;
  verse: number;
  endVerse: number;
  why: string;
};

export type GeminiMeaningResponse = {
  reading: string;
  results: GeminiMeaningHit[];
};

export type GeminiCallResult =
  | { kind: "ok"; response: GeminiMeaningResponse }
  | { kind: "stop"; message: string; reason: string }
  | { kind: "next"; reason: string };

export type GeminiOutcome =
  | { ok: true; response: GeminiMeaningResponse }
  | { ok: false; error: string };

/**
 * Static model fallback chain, in preference order. Used when the key's
 * available models can't be listed, and appended to a successful list so a
 * project exposing an unusual subset can still fall back to the stable aliases.
 *
 * The meaning search is a small JSON task, so the workhorse Lite/Flash models
 * are preferred over Pro. `*-latest` aliases are kept last on purpose: they
 * track whatever Google currently ships, so they are the best rescue when every
 * pinned id has been retired, but they are the least predictable, so a dated id
 * that discovery already confirmed is always tried first.
 */
export const STATIC_MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.5-pro",
  "gemini-1.5-flash",
  "gemini-1.5-flash-002",
  "gemini-1.5-pro",
  "gemini-1.0-pro",
  "gemini-flash-latest",
  "gemini-flash",
  "gemini-pro-latest",
  "gemini-pro",
] as const;

const PREFERRED_ORDER: string[] = [...STATIC_MODELS];

/** Cached model list per key, so discovery isn't repeated on every search. */
const modelListCache = new Map<string, { at: number; models: string[] }>();
const CACHE_MS = 10 * 60 * 1000;

/** Test seam: lets a suite assert discovery was skipped or re-run. */
export function clearModelListCache(): void {
  modelListCache.clear();
}

/**
 * Ask the API which generative text models this key can actually call, and
 * order them most-likely-useful first. Versioned ids like
 * `gemini-2.0-flash-001` are kept, so a key whose project only exposes dated
 * models still works. Returns `null` when the list request itself fails, so the
 * caller can fall back to the static chain.
 */
export async function resolveModelChain(
  apiKey: string,
  fetchImpl: typeof fetch = fetch,
): Promise<string[] | null> {
  const cached = modelListCache.get(apiKey);
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.models;
  try {
    const res = await fetchImpl(
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
    // An empty list means discovery told us nothing useful. Cache it as `null`
    // so the static chain is used rather than an empty one.
    if (!ordered.length) return null;
    modelListCache.set(apiKey, { at: Date.now(), models: ordered });
    return ordered;
  } catch {
    return null;
  }
}

/**
 * Walk the model chain until one answers. Moves on whenever a call fails
 * without billing anything (model missing, denied, rate limited, 5xx) and
 * returns `null` only when every model in the chain failed.
 */
export async function askGemini(
  prompt: string,
  apiKey: string,
  fetchImpl: typeof fetch = fetch,
): Promise<GeminiOutcome | null> {
  const discovered = await resolveModelChain(apiKey, fetchImpl);
  // Discovery is a hint, never the whole chain. If it succeeds we still append
  // every static id it did not return, so a project that exposes a narrow or
  // partly-retired subset can still reach the stable `-latest` aliases. Without
  // this, one bad model list meant meaning search was dead even though the key
  // could call something perfectly well.
  const models = [...new Set([...(discovered ?? []), ...STATIC_MODELS])];
  const failures: string[] = [];
  for (const model of models) {
    const compat = await callGeminiCompat(prompt, apiKey, model, fetchImpl);
    if (compat.kind === "ok") return { ok: true, response: compat.response };
    if (compat.kind === "stop") {
      console.info(`[meaning-search] stopped on compat/${model}: ${compat.reason}`);
      return { ok: false, error: compat.message };
    }
    failures.push(`compat:${compat.reason}`);

    const rest = await callGeminiRest(prompt, apiKey, model, fetchImpl);
    if (rest.kind === "ok") return { ok: true, response: rest.response };
    if (rest.kind === "stop") {
      console.info(`[meaning-search] stopped on rest/${model}: ${rest.reason}`);
      return { ok: false, error: rest.message };
    }
    failures.push(`rest:${rest.reason}`);
  }
  console.info(
    `[meaning-search] all ${models.length} models failed:`,
    failures.join(" | "),
  );
  // Nothing worked. If every attempt was refused rather than merely
  // unavailable, the fault is the key's access, not the model list - say so,
  // because that is the one case an operator has to go fix.
  if (failures.length && failures.every((f) => /denied|rejected the key|no access/i.test(f))) {
    return { ok: false, error: MEANING_UNAVAILABLE_MESSAGE };
  }
  return null;
}

async function callGeminiCompat(
  prompt: string,
  apiKey: string,
  model: string,
  fetchImpl: typeof fetch,
): Promise<GeminiCallResult> {
  try {
    const res = await fetchImpl(
      "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
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
  fetchImpl: typeof fetch,
): Promise<GeminiCallResult> {
  try {
    const res = await fetchImpl(
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
  // Read the body once, up front: almost every branch needs the reason, and a
  // Response body can only be consumed a single time.
  const detail = res.status >= 400 ? await res.text().catch(() => "") : "";
  const saysKey = /API_KEY_INVALID|API key not valid/i.test(detail);
  // "this API is not enabled for the project" is a key-wide fault and no model
  // will fix it. A model-scoped permission denial is not: another model in the
  // chain may still be allowed, which is the whole point of the fallback.
  const saysApiDisabled =
    /has not been used|API is not enabled|api not enabled|SERVICE_DISABLED|PERMISSION_DENIED/i.test(
      detail,
    );

  if (res.status === 401) {
    return {
      kind: "stop",
      message: MEANING_UNAVAILABLE_MESSAGE,
      reason: saysKey
        ? "gemini reported the key as invalid (API_KEY_INVALID)"
        : "gemini rejected the key (401 — revoked, expired, or malformed)",
    };
  }
  if (res.status === 403) {
    // Do NOT abort the chain here. Google returns 403 both for a key that has
    // no access at all and for a single model the project may not use, and
    // treating the second as fatal is what made meaning search die on a
    // deployment whose key was fine. Record it and let the next model try; the
    // caller promotes it to a stop if nothing at all succeeds.
    return {
      kind: "next",
      reason: saysApiDisabled
        ? `gemini denied access (${model} — key may lack the Generative Language API)`
        : `${model} was denied for this key`,
    };
  }
  if (res.status === 400) {
    if (saysKey) {
      return {
        kind: "stop",
        message: MEANING_UNAVAILABLE_MESSAGE,
        reason: "gemini reported the key as invalid (API_KEY_INVALID)",
      };
    }
    if (/\bAPI[_ ]KEY\b/i.test(detail)) {
      return {
        kind: "stop",
        message: MEANING_UNAVAILABLE_MESSAGE,
        reason: "gemini rejected the key on a 400",
      };
    }
    return { kind: "next", reason: `${model} is unavailable` };
  }
  if (res.status === 404) {
    return { kind: "next", reason: `${model} is unavailable` };
  }
  if (res.status === 429) {
    return {
      kind: "next",
      reason: /quota|billing/i.test(detail)
        ? `quota or billing limit reached on ${model}`
        : `rate limit reached on ${model}`,
    };
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
  return { kind: "ok", response: parsed as GeminiMeaningResponse };
}

function parseModelJson(text: string): { reading: string; results: unknown[] } | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidates = [fenced?.[1], text];
  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      const value = JSON.parse(candidate.trim());
      if (value && typeof value === "object" && Array.isArray((value as { results?: unknown }).results)) {
        return value as { reading: string; results: unknown[] };
      }
    } catch {
      continue;
    }
  }
  return null;
}
