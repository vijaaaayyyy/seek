/**
 * Google AI Studio keys are normally `AIza` + 35 url-safe base64 characters
 * (39 total), and that is what a 400 `INVALID_ARGUMENT` most often means: the
 * value in `GEMINI_API_KEY` is a placeholder or a truncated paste rather than a
 * real key. The old classifier could not tell that apart from a bad model id,
 * so it told every visitor the key was "invalid or expired" - blaming them for
 * a server misconfiguration.
 *
 * The shape check here is therefore **advisory only**. An earlier version
 * hard-rejected anything that did not match, which was actively dangerous: a
 * provider key, a proxy key, or any future key format would have been silently
 * refused before a single request went out, and meaning search would look
 * "unconfigured" on a deployment that was otherwise fine. A wrong guess costs
 * one wasted request, which the response classifier can then name exactly; a
 * false rejection costs the whole feature in production. So: never block a
 * non-empty key, but say so in the logs when it looks off.
 *
 * Kept free of runtime imports so it can be unit-tested directly.
 */

/** Shown to visitors whenever meaning search cannot run for any reason. */
export const MEANING_UNAVAILABLE_MESSAGE =
  "Meaning search is unavailable right now. Word matches still work.";

const GEMINI_KEY_SHAPE = /^AIza[0-9A-Za-z_-]{35}$/;

export type GeminiKeyResult =
  | { ok: true; key: string; warning?: string }
  | { ok: false; reason: string };

export function readGeminiKey(env: NodeJS.ProcessEnv = process.env): GeminiKeyResult {
  const key = env.GEMINI_API_KEY?.trim() ?? "";
  if (!key) return { ok: false, reason: "GEMINI_API_KEY is not set" };
  if (!GEMINI_KEY_SHAPE.test(key)) {
    return {
      ok: true,
      key,
      warning: `GEMINI_API_KEY does not look like a standard 39-character Google AI Studio key (${key.length} chars) - trying anyway`,
    };
  }
  return { ok: true, key };
}
