/**
 * Types for the PRAXIS Week 0 eval harness.
 *
 * The harness runs every fixture from `src/lib/praxis/prompts/*` through
 * OpenRouter, parses the output, and scores it. Two scoring modes coexist:
 *
 *   1. **Rubric** (LLM-as-judge) for outline + unit prompts where quality
 *      is multi-dimensional. Each criterion is scored 0–3.
 *   2. **Binary** for the scope guardrail where correctness is a pass/fail
 *      against a known label embedded in the fixture name.
 *   3. **Heuristic** for onboarding + template where we deterministically
 *      inspect the JSON shape (question count, personalisation references,
 *      etc.) without needing a judge call.
 */
import { PromptModuleKey } from '@/lib/praxis/prompts';

export enum EvalMode {
  RUBRIC = 'rubric',
  BINARY = 'binary',
  HEURISTIC = 'heuristic',
}

/** Rubric criteria are module-specific; scored 0–3 each. */
export interface RubricScore {
  criterion: string;
  score: number;
  note: string;
}

export interface EvalResult {
  module: PromptModuleKey;
  fixtureName: string;
  model: string;
  mode: EvalMode;
  /** Raw model output before parsing. Trimmed to 4 KB in reports. */
  rawOutput: string;
  /** Present when output parsed as JSON (structured prompts only). */
  parsed: unknown;
  /** True iff the fixture meets the module's exit bar. */
  passed: boolean;
  /** Rubric scores, when mode is RUBRIC. */
  rubric?: RubricScore[];
  /** Aggregate 0–3 score (mean of criteria) when mode is RUBRIC. */
  meanScore?: number;
  /** Short, human explanation of pass/fail. */
  summary: string;
  /** Upstream token spend for this fixture run. */
  inputTokens: number;
  outputTokens: number;
  /** Wall-clock ms for the generation call. */
  durationMs: number;
  /** Any error encountered. Null on success. */
  error: string | null;
}

export interface EvalRun {
  startedAt: string;
  finishedAt: string;
  /** Model id passed to OpenRouter for generation. */
  generationModel: string;
  /** Model id used for LLM-as-judge rubric scoring. */
  judgeModel: string;
  results: EvalResult[];
}

/** Week-0 exit-bar thresholds from `research.md` §5. */
export const EXIT_BAR = {
  OUTLINE_MIN_MEAN: 2.5,
  UNIT_MIN_MEAN: 2.3,
  SCOPE_MIN_PASS_RATE: 1.0, // zero false negatives required
} as const;
