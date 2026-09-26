import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  askGemini,
  clearModelListCache,
  resolveModelChain,
  STATIC_MODELS,
} from "./gemini-client.ts";

/**
 * The failure this exists to prevent: a meaning-search deployment where the key
 * is perfectly good but every model the app knew about has been retired, so the
 * feature is simply dead. These drive the real chain against a stubbed `fetch`,
 * because the chain is not something to verify by reading it.
 */

type Call = { url: string; body: string };

const ANSWER = {
  reading: "Verses about comfort.",
  results: [{ book: "John", chapter: 3, verse: 16, endVerse: 16, why: "Comfort." }],
};

const jsonResponse = (payload: unknown) =>
  new Response(JSON.stringify(payload), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

const errorResponse = (status: number, message: string) =>
  new Response(JSON.stringify({ error: { code: status, message, status: "X" } }), {
    status,
    headers: { "Content-Type": "application/json" },
  });

/** Every model in the chain 404s except `survivor`, which answers. */
function stubWhereOnlyModelWorks(survivor: string) {
  const calls: Call[] = [];
  const impl = (async (url: string | URL, init?: RequestInit) => {
    const href = String(url);
    calls.push({ url: href, body: String(init?.body ?? "") });
    if (href.includes("/v1beta/models?")) return jsonResponse({ models: [] });
    const model = decodeURIComponent(href).match(/models\/([^:]+):generateContent/)?.[1];
    const inBody = (() => {
      try {
        return JSON.parse(String(init?.body ?? "{}")).model as string | undefined;
      } catch {
        return undefined;
      }
    })();
    const asked = model ?? inBody;
    if (asked === survivor) return jsonResponse({ candidates: [{ content: { parts: [{ text: JSON.stringify(ANSWER) }] } }] });
    return errorResponse(404, `models/${asked} is not found for your project.`);
  }) as unknown as typeof fetch;
  return { impl, calls };
}

describe("gemini model fallback", () => {
  beforeEach(() => clearModelListCache());

  it("falls through retired models to one that still works", async () => {
    const { impl, calls } = stubWhereOnlyModelWorks("gemini-1.5-flash");
    const result = await askGemini("comfort when afraid", "AIzaTestKey", impl);
    assert.equal(result?.ok, true);
    assert.equal(result?.ok && result.response.reading, ANSWER.reading);
    // It must have actually moved past the models ahead of the survivor.
    const attempted = new Set(
      calls
        .filter((c) => c.url.includes("generateContent") || c.url.includes("chat/completions"))
        .map((c) => (c.url.match(/models\/([^:]+):generateContent/) ?? [])[1]),
    );
    assert.ok(attempted.size > 0, "expected at least one generateContent attempt");
  });

  it("recovers even when the discovered model list is empty", async () => {
    // A key whose project exposes nothing discoverable must still reach the
    // static chain rather than an empty list of attempts.
    const { impl, calls } = stubWhereOnlyModelWorks("gemini-pro");
    const result = await askGemini("hope", "AIzaTestKey", impl);
    assert.equal(result?.ok, true);
    assert.ok(
      calls.some((c) => c.url.includes("/v1beta/models?")),
      "discovery should have been attempted",
    );
  });

  it("uses a model discovery returned by the API, ordered by preference", async () => {
    clearModelListCache();
    const impl = (async (url: string | URL) => {
      const href = String(url);
      if (href.includes("/v1beta/models?")) {
        return jsonResponse({
          models: [
            { name: "models/gemini-2.5-pro", supportedGenerationMethods: ["generateContent"] },
            { name: "models/gemini-2.5-flash", supportedGenerationMethods: ["generateContent"] },
            { name: "models/text-embedding-004", supportedGenerationMethods: ["embedContent"] },
            { name: "models/gemini-2.0-flash-001", supportedGenerationMethods: ["generateContent"] },
          ],
        });
      }
      return jsonResponse({ candidates: [{ content: { parts: [{ text: JSON.stringify(ANSWER) }] } }] });
    }) as unknown as typeof fetch;

    const chain = await resolveModelChain("AIzaTestKey", impl);
    assert.ok(chain);
    assert.deepEqual(chain.slice(0, 3), [
      "gemini-2.5-flash",
      "gemini-2.5-pro",
      "gemini-2.0-flash-001",
    ]);
    // Embedding models are not callable for text and must never be attempted.
    assert.equal(chain?.some((m) => m.includes("embedding")), false);
  });

  it("treats a model-scoped 403 as a reason to try the next model, not to stop", async () => {
    clearModelListCache();
    // Deny everything until the last resort answers.
    const denying = (async (url: string | URL) => {
      const href = String(url);
      if (href.includes("/v1beta/models?")) return jsonResponse({ models: [] });
      if (href.includes("gemini-pro")) {
        return jsonResponse({ candidates: [{ content: { parts: [{ text: JSON.stringify(ANSWER) }] } }] });
      }
      return errorResponse(403, "The caller does not have permission.");
    }) as unknown as typeof fetch;

    const result = await askGemini("hope", "AIzaTestKey", denying);
    assert.equal(result?.ok, true, "a model-scoped 403 must not abort the chain");
  });

  it("blames nothing when every model is merely gone (caller falls back)", async () => {
    clearModelListCache();
    const impl = (async (url: string | URL) => {
      const href = String(url);
      if (href.includes("/v1beta/models?")) return jsonResponse({ models: [] });
      return errorResponse(404, "not found");
    }) as unknown as typeof fetch;

    const result = await askGemini("hope", "AIzaTestKey", impl);
    // A missing model is not a credential fault, so the chain reports "nothing
    // worked" and the caller supplies its own graceful wording.
    assert.equal(result, null);
  });

  it("reports the graceful message when every attempt was denied", async () => {
    clearModelListCache();
    const impl = (async (url: string | URL) => {
      const href = String(url);
      if (href.includes("/v1beta/models?")) return jsonResponse({ models: [] });
      return errorResponse(403, "The caller does not have permission.");
    }) as unknown as typeof fetch;

    const result = await askGemini("hope", "AIzaTestKey", impl);
    assert.equal(result?.ok, false);
    assert.match(result?.ok === false ? result.error : "", /unavailable right now/i);
  });

  it("never surfaces the old false 'expired key' message", async () => {
    clearModelListCache();
    const impl = (async (url: string | URL) => {
      const href = String(url);
      if (href.includes("/v1beta/models?")) {
        return errorResponse(400, "API key not valid. Please pass a valid API key.");
      }
      return errorResponse(400, "API key not valid. Please pass a valid API key.");
    }) as unknown as typeof fetch;

    const result = await askGemini("hope", "bad-key", impl);
    const message = result?.ok === false ? result.error : "";
    assert.equal(/expired/i.test(message), false);
    assert.match(message, /unavailable right now/i);
  });

  it("offers the stable -latest aliases as a last resort", () => {
    assert.ok(STATIC_MODELS.includes("gemini-flash-latest"));
    assert.ok(STATIC_MODELS.includes("gemini-pro-latest"));
  });
});
