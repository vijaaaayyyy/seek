/**
 * A real Google AI Studio key is `AIza` + 35 url-safe base64 characters. Anything
 * else is a placeholder or a truncated paste.
 *
 * This matters because Google answers a malformed key with a bare
 * `400 INVALID_ARGUMENT` whose body reads like a bad model id rather than a bad
 * key. A classifier that only knows `API_KEY_INVALID` cannot attribute that, so
 * the failure used to surface to every visitor as "The Gemini API key is invalid
 * or expired. Please update it and try again." — pointing them at a key that was
 * never valid in the first place. Checking the shape up front turns that
 * misdiagnosis into a named, logged server fault.
 *
 * Kept free of runtime imports so it can be unit-tested directly.
 */

/** Shown to visitors whenever meaning search cannot run for any reason. */
export const MEANING_UNAVAILABLE_MESSAGE =
  "Meaning search is unavailable right now. Word matches still work.";

const GEMINI_KEY_SHAPE = /^AIza[0-9A-Za-z_-]{35}$/;

export type GeminiKeyResult = { ok: true; key: string } | { ok: false; reason: string };

export function readGeminiKey(env: NodeJS.ProcessEnv = process.env): GeminiKeyResult {
  const key = env.GEMINI_API_KEY?.trim() ?? "";
  if (!key) return { ok: false, reason: "GEMINI_API_KEY is not set" };
  if (key.length < 30) {
    return {
      ok: false,
      reason: `GEMINI_API_KEY looks like a ${key.length}-character placeholder, not a Google AI Studio key`,
    };
  }
  if (!GEMINI_KEY_SHAPE.test(key)) {
    return { ok: false, reason: "GEMINI_API_KEY is not a well-formed Google AI Studio key" };
  }
  return { ok: true, key };
}
