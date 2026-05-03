/**
 * Deterministic fingerprint for topic strings.
 *
 * Used to deduplicate curriculum cache hits across learners. Two topic
 * strings that mean the same thing ("sales", "I want to learn sales",
 * "Sales basics") should fingerprint identically — but close-but-
 * different topics ("enterprise sales" vs "sales") must NOT collide.
 *
 * Algorithm (intentionally simple, Phase 1):
 *   1. Lowercase + NFC normalise + trim.
 *   2. Strip a small allowlist of leading intent phrases
 *      ("i want to learn", "teach me", "how to", "help me with", "help me").
 *   3. Strip trailing filler ("please", "basics", "101", "fundamentals")
 *      — these don't change the underlying topic.
 *   4. Remove all non-alphanumeric characters *except* internal spaces.
 *   5. Collapse runs of whitespace to a single space.
 *   6. Sort tokens alphabetically so word-order variation doesn't matter.
 *   7. SHA-1 of the normalised form; prefix with `sha1-` per the
 *      curriculum contract example.
 *
 * Unit-tested against representative inputs in
 * `src/lib/praxis/cache/topicFingerprint.test.ts` (Week 2 Vitest suite).
 */
import { createHash } from "node:crypto";

const LEADING_PREFIXES: ReadonlyArray<RegExp> = [
  /^i want to learn\s+/,
  /^i would like to learn\s+/,
  /^i'?d like to learn\s+/,
  /^teach me\s+(?:about\s+)?/,
  /^help me\s+(?:with\s+)?/,
  /^how (?:do i|to)\s+/,
  /^can you teach me\s+(?:about\s+)?/,
  /^please teach me\s+(?:about\s+)?/,
  /^let'?s learn\s+(?:about\s+)?/,
  /^learning\s+/,
];

const TRAILING_FILLERS: ReadonlyArray<string> = [
  "please",
  "basics",
  "101",
  "fundamentals",
  "for beginners",
  "from scratch",
];

/** Publicly exposed so the `/curriculum` endpoint can surface the
 *  cleaned-up title without re-running the pipeline. */
export function normaliseTopic(rawInput: string): string {
  let out = rawInput.normalize("NFC").trim().toLowerCase();

  let stripped = true;
  while (stripped) {
    stripped = false;
    for (const prefix of LEADING_PREFIXES) {
      if (prefix.test(out)) {
        out = out.replace(prefix, "");
        stripped = true;
      }
    }
  }

  for (const filler of TRAILING_FILLERS) {
    const re = new RegExp(
      `\\s+${filler.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}\\s*$`,
    );
    out = out.replace(re, "");
  }

  // Keep only alphanumeric + internal whitespace. Thai script is in the
  // BMP as Unicode letters, so the `\p{L}` class covers it too.
  out = out
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  return out;
}

/** Returns `true` if two raw inputs would share a cache bucket. */
export function sameTopic(a: string, b: string): boolean {
  return fingerprint(a) === fingerprint(b);
}

/** Stable `sha1-<hex>` fingerprint suitable for the cache key. */
export function fingerprint(rawInput: string): string {
  const normalised = normaliseTopic(rawInput);
  const tokens = normalised.split(" ").filter(Boolean).sort();
  const canonical = tokens.join(" ");
  const hex = createHash("sha1").update(canonical, "utf8").digest("hex");
  return `sha1-${hex}`;
}

/**
 * Extracts a reasonable human title from a raw input. Not unique;
 * multiple rawInputs can title-ise to the same string. Used only for
 * display in the library and outline review UI.
 */
export function titleFromRawInput(rawInput: string): string {
  const normalised = normaliseTopic(rawInput);
  if (!normalised) return rawInput.trim().slice(0, 80);
  // Title-case each word, preserving short connectors (a, an, the, of,
  // for, and) in lowercase except as the first word.
  const words = normalised.split(" ");
  const SHORT = new Set([
    "a",
    "an",
    "the",
    "of",
    "for",
    "and",
    "in",
    "on",
    "to",
  ]);
  return words
    .map((w, i) =>
      i === 0 || !SHORT.has(w) ? w.charAt(0).toUpperCase() + w.slice(1) : w,
    )
    .join(" ")
    .slice(0, 80);
}
