/**
 * T-003 — Curriculum outline prompt.
 *
 * Produces a reviewable 3–7 unit outline for an accepted topic (FR-009).
 * The output is strict JSON and is *shown to the learner* before any
 * unit generation begins, so wording quality matters more here than on
 * any other prompt in the system.
 *
 * Cacheability (FR-011, research.md §6): this prompt is intentionally
 * independent of learner identity. Personalisation is applied at read
 * time by Nori's conversational injection, not by baking onboarding
 * answers into the outline. That keeps `praxis_curriculum_cache` hit
 * rates high.
 */
import {
  JSON_ONLY_DIRECTIVE,
  clamp,
  localeDirective,
} from "@/lib/praxis/prompts/_shared";
import { PraxisLocale, PromptFixture } from "@/lib/praxis/prompts/types";

export const VERSION = "curriculum.outline@1" as const;

export interface CurriculumOutlineInput {
  locale: PraxisLocale;
  /** Topic string after scope-guardrail admission. */
  topic: string;
  /**
   * Optional short context hint from the learner (`"I'm a new sales rep
   * at a payroll SaaS"`). Empty string is acceptable.
   * Not persisted — used only to break ties on ambiguous topics.
   */
  hint?: string;
}

export interface OutlineJson {
  units: Array<{
    title: string;
    objective: string;
    summary: string;
  }>;
}

const MIN_UNITS = 3;
const MAX_UNITS = 7;
const MAX_TOPIC_CHARS = 240;
const MAX_HINT_CHARS = 400;

export function build(input: CurriculumOutlineInput): string {
  const topic = clamp(input.topic, MAX_TOPIC_CHARS);
  const hint = input.hint ? clamp(input.hint, MAX_HINT_CHARS) : "";

  return [
    "You are an experienced curriculum designer producing a reviewable learning outline for a single learner.",
    "You are NOT writing unit content. You are deciding what the units should be.",
    "",
    "## Method",
    `- Produce between ${MIN_UNITS} and ${MAX_UNITS} units, ordered so each builds on the previous.`,
    "- The first unit is always the cheapest possible win — something the learner can act on in under an hour.",
    "- The final unit is always synthesis or a realistic end-to-end situation, not a summary.",
    '- Avoid unit titles that are nouns only ("Objections"); prefer verb-forward titles ("Handling four common objections").',
    "- Avoid duplication. Two units should never cover the same ground at different depths.",
    "",
    "## Output schema",
    "{",
    '  "units": [',
    "    {",
    '      "title": string,       // ≤ 60 chars, verb-forward',
    '      "objective": string,   // one sentence, ≤ 140 chars, starts with "By the end…"',
    '      "summary": string      // 2–3 sentences, ≤ 320 chars, no bullet points',
    "    }",
    "  ]",
    "}",
    "",
    `## Locale\n${localeDirective(input.locale)}`,
    "",
    JSON_ONLY_DIRECTIVE,
    "",
    "## Topic",
    topic,
    ...(hint ? ["", "## Optional hint", hint] : []),
  ].join("\n");
}

export const fixtures: ReadonlyArray<PromptFixture<CurriculumOutlineInput>> = [
  { name: "sales", input: { locale: PraxisLocale.EN, topic: "sales" } },
  {
    name: "negotiation",
    input: { locale: PraxisLocale.EN, topic: "negotiation" },
  },
  {
    name: "public_speaking",
    input: { locale: PraxisLocale.EN, topic: "public speaking" },
  },
  {
    name: "giving_feedback",
    input: { locale: PraxisLocale.EN, topic: "giving feedback" },
  },
  {
    name: "sql_fundamentals",
    input: { locale: PraxisLocale.EN, topic: "SQL fundamentals" },
  },
  {
    name: "pm_basics",
    input: { locale: PraxisLocale.EN, topic: "product management basics" },
  },
  {
    name: "ux_research",
    input: { locale: PraxisLocale.EN, topic: "UX research" },
  },
  {
    name: "thai_cooking",
    input: { locale: PraxisLocale.EN, topic: "Thai cooking basics" },
  },
  {
    name: "pickleball",
    input: { locale: PraxisLocale.EN, topic: "pickleball fundamentals" },
  },
  {
    name: "async_leadership",
    input: { locale: PraxisLocale.EN, topic: "async leadership" },
  },
];
