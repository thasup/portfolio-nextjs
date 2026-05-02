/**
 * LLM-as-judge rubric scorer.
 *
 * Used for outline + unit prompts where quality is multi-dimensional.
 * The judge is itself an OpenRouter call with a strict JSON schema —
 * we deliberately use the same client so both generator and judge fail
 * and succeed together.
 */
import {
  ChatRole,
  OpenRouterClient,
  ResponseFormat,
  extractJson,
} from "@/lib/praxis/openrouter/client";
import { RubricScore } from "@/lib/praxis/eval/types";

/** Criterion IDs used across all rubrics. Values are stable for CSV joins. */
export enum RubricCriterion {
  OBJECTIVE_SPECIFICITY = "objective_specificity",
  CONCEPT_COVERAGE = "concept_coverage",
  EXAMPLE_CONCRETENESS = "example_concreteness",
  PRACTICE_USEFULNESS = "practice_usefulness",
  PERSONALIZATION_FIDELITY = "personalization_fidelity",
  PEDAGOGICAL_ORDER = "pedagogical_order",
  TOPIC_RELEVANCE = "topic_relevance",
}

export const OUTLINE_CRITERIA: ReadonlyArray<RubricCriterion> = [
  RubricCriterion.OBJECTIVE_SPECIFICITY,
  RubricCriterion.CONCEPT_COVERAGE,
  RubricCriterion.PEDAGOGICAL_ORDER,
  RubricCriterion.TOPIC_RELEVANCE,
];

export const UNIT_CRITERIA: ReadonlyArray<RubricCriterion> = [
  RubricCriterion.OBJECTIVE_SPECIFICITY,
  RubricCriterion.CONCEPT_COVERAGE,
  RubricCriterion.EXAMPLE_CONCRETENESS,
  RubricCriterion.PRACTICE_USEFULNESS,
  RubricCriterion.PERSONALIZATION_FIDELITY,
];

const CRITERION_DESCRIPTIONS: Record<RubricCriterion, string> = {
  [RubricCriterion.OBJECTIVE_SPECIFICITY]:
    "Objectives are specific, verb-forward, and measurable — not vague wishes.",
  [RubricCriterion.CONCEPT_COVERAGE]:
    "The content covers the concepts a learner needs without major gaps or filler.",
  [RubricCriterion.EXAMPLE_CONCRETENESS]:
    "Examples are grounded in real situations with named actors and specifics, not abstractions.",
  [RubricCriterion.PRACTICE_USEFULNESS]:
    "The practice activity is doable in under 30 minutes and connects to a real learner outcome.",
  [RubricCriterion.PERSONALIZATION_FIDELITY]:
    "Where personalisation is permitted (practice block), the learner's context is integrated naturally, not pasted.",
  [RubricCriterion.PEDAGOGICAL_ORDER]:
    "Units build on each other in a plausible order; the first is the cheapest win, the last is synthesis.",
  [RubricCriterion.TOPIC_RELEVANCE]:
    "Every unit clearly belongs to the stated topic — no generic self-help drift.",
};

export interface JudgeInput {
  client: OpenRouterClient;
  model: string;
  /** Pretty label shown to the judge ("curriculum outline for topic `sales`"). */
  subject: string;
  /** JSON object being judged, serialised. */
  generated: string;
  /** Criteria to score. */
  criteria: ReadonlyArray<RubricCriterion>;
  /** Optional signal for cancellation. */
  signal?: AbortSignal;
}

export interface JudgeOutput {
  scores: RubricScore[];
  mean: number;
  inputTokens: number;
  outputTokens: number;
}

/**
 * Build the judge's system + user prompts. Kept tiny so judge cost is
 * a small fraction of generation cost across an eval run.
 */
function buildJudgePrompt(
  subject: string,
  generated: string,
  criteria: ReadonlyArray<RubricCriterion>,
): string {
  const criteriaLines = criteria
    .map((c, i) => `  ${i + 1}. "${c}" — ${CRITERION_DESCRIPTIONS[c]}`)
    .join("\n");
  return [
    "You are a strict learning-design reviewer scoring generated content against a fixed rubric.",
    "For every criterion, score an integer 0–3:",
    "  0 = absent or actively wrong",
    "  1 = present but weak",
    "  2 = solid",
    "  3 = excellent, ships as-is",
    "",
    "## Subject",
    subject,
    "",
    "## Criteria",
    criteriaLines,
    "",
    "## Content under review",
    generated,
    "",
    "## Output schema",
    '{ "scores": [ { "criterion": string, "score": 0|1|2|3, "note": string } ] }',
    "- Include every criterion above, in the same order. Use the same string key for `criterion`.",
    "- `note` is ≤ 140 chars explaining the score.",
    "",
    "Return ONLY the JSON object. No prose before or after.",
  ].join("\n");
}

export async function judge(input: JudgeInput): Promise<JudgeOutput> {
  const prompt = buildJudgePrompt(
    input.subject,
    input.generated,
    input.criteria,
  );
  const res = await input.client.chat({
    model: input.model,
    messages: [{ role: ChatRole.USER, content: prompt }],
    responseFormat: ResponseFormat.JSON_OBJECT,
    temperature: 0,
    maxTokens: 1024,
    signal: input.signal,
  });

  const parsed = extractJson<{
    scores?: Array<{ criterion?: string; score?: number; note?: string }>;
  }>(res.content);
  const raw = parsed?.scores ?? [];

  const scores: RubricScore[] = input.criteria.map((c) => {
    const match = raw.find((r) => r.criterion === c);
    const score =
      typeof match?.score === "number"
        ? Math.max(0, Math.min(3, Math.round(match.score)))
        : 0;
    return {
      criterion: c,
      score,
      note: (match?.note ?? "").slice(0, 240),
    };
  });

  const mean = scores.length
    ? scores.reduce((sum, s) => sum + s.score, 0) / scores.length
    : 0;

  return {
    scores,
    mean,
    inputTokens: res.usage.inputTokens,
    outputTokens: res.usage.outputTokens,
  };
}
