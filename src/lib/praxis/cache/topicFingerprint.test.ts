/**
 * Unit tests for `topicFingerprint`. Focused on the normalisation
 * invariants that actually protect cache hit rate.
 */
import { describe, expect, it } from "vitest";
import {
  fingerprint,
  normaliseTopic,
  sameTopic,
  titleFromRawInput,
} from "@/lib/praxis/cache/topicFingerprint";

describe("normaliseTopic", () => {
  it("lowercases and trims", () => {
    expect(normaliseTopic("  Sales  ")).toBe("sales");
  });

  it("strips leading intent phrases", () => {
    expect(normaliseTopic("I want to learn negotiation")).toBe("negotiation");
    expect(normaliseTopic("Teach me about sales")).toBe("sales");
    expect(normaliseTopic("How to give feedback")).toBe("give feedback");
    expect(normaliseTopic("Help me with public speaking")).toBe(
      "public speaking",
    );
  });

  it("strips trailing fillers", () => {
    expect(normaliseTopic("sales basics")).toBe("sales");
    expect(normaliseTopic("SQL 101")).toBe("sql");
    expect(normaliseTopic("sales fundamentals")).toBe("sales");
  });

  it("removes punctuation but preserves Unicode letters", () => {
    expect(normaliseTopic("Sales!!!")).toBe("sales");
    expect(normaliseTopic("การเจรจา")).toBe("การเจรจา");
  });
});

describe("fingerprint", () => {
  it("is deterministic", () => {
    expect(fingerprint("sales")).toBe(fingerprint("sales"));
  });

  it("matches semantically-equivalent inputs", () => {
    const a = fingerprint("sales");
    expect(fingerprint("Sales")).toBe(a);
    expect(fingerprint("I want to learn sales")).toBe(a);
    expect(fingerprint("Teach me sales")).toBe(a);
    expect(fingerprint("sales basics")).toBe(a);
    expect(fingerprint("  sales!!  ")).toBe(a);
  });

  it("differentiates genuinely different topics", () => {
    expect(fingerprint("sales")).not.toBe(fingerprint("negotiation"));
    expect(fingerprint("sales")).not.toBe(fingerprint("enterprise sales"));
  });

  it("is word-order insensitive (Phase 1 simplification)", () => {
    expect(fingerprint("public speaking")).toBe(fingerprint("speaking public"));
  });

  it("prefixes `sha1-`", () => {
    expect(fingerprint("sales")).toMatch(/^sha1-[a-f0-9]{40}$/);
  });
});

describe("sameTopic", () => {
  it("is true for equivalent inputs", () => {
    expect(sameTopic("sales", "I want to learn sales")).toBe(true);
  });

  it("is false for different topics", () => {
    expect(sameTopic("sales", "sql")).toBe(false);
  });
});

describe("titleFromRawInput", () => {
  it("title-cases the normalised topic", () => {
    expect(titleFromRawInput("i want to learn sales")).toBe("Sales");
    expect(titleFromRawInput("public speaking")).toBe("Public Speaking");
  });

  it("keeps short connectors lowercase except first word", () => {
    expect(titleFromRawInput("the art of negotiation")).toBe(
      "The Art of Negotiation",
    );
  });

  it("falls back to the raw input when normalisation is empty", () => {
    expect(titleFromRawInput("!!!")).toBe("!!!");
  });

  it("clamps to 80 chars", () => {
    const long = "a ".repeat(60);
    expect(titleFromRawInput(long).length).toBeLessThanOrEqual(80);
  });
});
