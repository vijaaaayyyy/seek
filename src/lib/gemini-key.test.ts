import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readGeminiKey } from "./gemini-key.ts";

/**
 * Regression cover for the bug where an 11-character placeholder stub in
 * `GEMINI_API_KEY` made Google answer `400 INVALID_ARGUMENT`, which the old
 * classifier could not attribute and so reported to every visitor as
 * "The Gemini API key is invalid or expired. Please update it and try again."
 * The real fault was a server misconfiguration, which must be named in the
 * logs without ever being blamed on the visitor.
 */
const REAL_LOOKING_KEY = `AIza${"SyD-ExampleKeyForTestsOnly_0123456789ab".slice(0, 35)}`;

const reasonFor = (value: string | undefined): string => {
  const result = readGeminiKey({ GEMINI_API_KEY: value } as NodeJS.ProcessEnv);
  assert.equal(result.ok, false);
  return result.ok ? "" : result.reason;
};

describe("readGeminiKey", () => {
  it("reports an unset key without attempting a request", () => {
    assert.match(reasonFor(undefined), /not set/);
  });

  it("treats a whitespace-only key as absent", () => {
    assert.match(reasonFor("   "), /not set/);
  });

  it("rejects the short placeholder stub that caused the false expiry message", () => {
    assert.match(reasonFor("sk-placeholder"), /14-character placeholder/);
  });

  it("rejects a well-sized value that is not a Google AI Studio key", () => {
    assert.match(reasonFor("x".repeat(39)), /well-formed/);
  });

  it("rejects a key with a valid length but a broken AIza prefix", () => {
    assert.match(reasonFor(`BIza${"a".repeat(35)}`), /well-formed/);
  });

  it("accepts a well-formed key and trims surrounding whitespace", () => {
    const result = readGeminiKey({
      GEMINI_API_KEY: `  ${REAL_LOOKING_KEY}  `,
    } as NodeJS.ProcessEnv);
    assert.equal(result.ok, true);
    assert.equal(result.ok && result.key, REAL_LOOKING_KEY);
  });

  it("never echoes the key value back in its reason", () => {
    const stub = "sk-leaky-value-1234";
    const reason = reasonFor(stub);
    assert.equal(reason.includes(stub), false);
  });
});
