import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readGeminiKey } from "./gemini-key.ts";

/**
 * Regression cover for the AI-search outage.
 *
 * Two separate faults, both of which left meaning search dead on a deployment:
 *
 * 1. `GEMINI_API_KEY` held an 11-character placeholder. Google answers that
 *    with a bare `400 INVALID_ARGUMENT` whose body reads like a bad model id,
 *    so the old classifier could not attribute it and told every visitor the
 *    key was "invalid or expired" - blaming them for a server fault.
 *
 * 2. The first fix hard-rejected any key that was not exactly 39 characters of
 *    `AIza...`. That is a guess, and a wrong guess is far worse than no check:
 *    a provider key, a proxy key or any future key format would have been
 *    refused before a single request went out, so a working deployment would
 *    report meaning search as unconfigured. The shape check is advisory only.
 */
const REAL_LOOKING_KEY = `AIza${"SyD-ExampleKeyForTestsOnly_0123456789ab".slice(0, 35)}`;

const read = (value: string | undefined) =>
  readGeminiKey({ GEMINI_API_KEY: value } as NodeJS.ProcessEnv);

describe("readGeminiKey", () => {
  it("refuses only an absent key, which cannot be worked around", () => {
    assert.equal(read(undefined).ok, false);
  });

  it("treats a whitespace-only key as absent", () => {
    assert.equal(read("   ").ok, false);
  });

  it("accepts a standard 39-character AI Studio key with no warning", () => {
    const result = read(REAL_LOOKING_KEY);
    assert.equal(result.ok, true);
    assert.equal(result.ok && result.key, REAL_LOOKING_KEY);
    assert.equal(result.ok && result.warning, undefined);
  });

  it("trims surrounding whitespace rather than sending it to the API", () => {
    const result = read(`  ${REAL_LOOKING_KEY}\t`);
    assert.equal(result.ok && result.key, REAL_LOOKING_KEY);
  });

  it("still tries the short placeholder, so one request can name the real fault", () => {
    const result = read("sk-placeholder");
    assert.equal(result.ok, true);
    assert.match(result.ok && result.warning ? result.warning : "", /14 chars/);
  });

  it("never blocks a key that does not match the expected shape", () => {
    // Regression guard: an over-strict check silently disabled the feature in
    // production. Any non-empty value must reach the API.
    for (const candidate of ["x".repeat(39), `BIza${"a".repeat(35)}`, "sk-live-abc123"]) {
      assert.equal(read(candidate).ok, true, `rejected ${candidate.slice(0, 6)}...`);
    }
  });

  it("warns without ever echoing the key value", () => {
    const stub = "sk-leaky-value-1234";
    const result = read(stub);
    const warning = result.ok && result.warning ? result.warning : "";
    assert.ok(warning.length > 0);
    assert.equal(warning.includes(stub), false);
  });
});
