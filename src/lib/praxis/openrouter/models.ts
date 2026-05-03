/**
 * Centralized LLM model configuration for PRAXIS.
 *
 * All model selection flows through this module. The hierarchy:
 * 1. Per-learner runtime preference (from DB) — highest priority, set via UI
 * 2. Environment override (PRAXIS_LLM_<TASK>_MODEL) — for deployment tuning
 * 3. Universal env model (PRAXIS_LLM_MODEL) — the deployment default
 * 4. Code fallback — provider-agnostic sensible default
 *
 * Environment variables:
 * - PRAXIS_LLM_MODEL — Universal model for all generation tasks
 * - PRAXIS_LLM_JUDGE_MODEL — Eval/judge harness (defaults to PRAXIS_LLM_MODEL)
 * - PRAXIS_LLM_GUARDDRAIL_MODEL — Scope guardrail (defaults to PRAXIS_LLM_MODEL)
 * - PRAXIS_LLM_ONBOARDING_MODEL — Onboarding questions (defaults to PRAXIS_LLM_MODEL)
 * - PRAXIS_LLM_UNIT_MODEL — Unit generation (defaults to PRAXIS_LLM_MODEL)
 * - PRAXIS_LLM_CURRICULUM_MODEL — Curriculum/outline (defaults to PRAXIS_LLM_MODEL)
 *
 * Legacy compatibility (deprecated, will warn):
 * - PRAXIS_GENERATION_MODEL → maps to PRAXIS_LLM_MODEL
 * - PRAXIS_EVAL_MODEL → maps to PRAXIS_LLM_JUDGE_MODEL
 * - PRAXIS_EVAL_JUDGE_MODEL → maps to PRAXIS_LLM_JUDGE_MODEL
 *
 * NOTE: This file is used in both server and client contexts (for AVAILABLE_MODELS).
 * Do not add server-only imports here.
 */

/** Provider-agnostic default that works across OpenRouter. */
export const DEFAULT_MODEL = "anthropic/claude-sonnet-4";

/** Available models for selection. */
export const AVAILABLE_MODELS = [
  {
    slug: "deepseek/deepseek-v3.2",
    label: "DeepSeek V3.2",
    provider: "DeepSeek",
  },
  {
    slug: "google/gemini-3-flash-preview",
    label: "Gemini 3 Flash Preview",
    provider: "Google",
  },
  { slug: "minimax/minimax-m2.7", label: "MiniMax M2.7", provider: "MiniMax" },
  { slug: "x-ai/grok-4.1-fast", label: "Grok 4.1 Fast", provider: "xAI" },
  { slug: "moonshotai/kimi-k2.6", label: "Kimi K2.6", provider: "Moonshot" },
  { slug: "openai/gpt-5.4-nano", label: "GPT-5.4 Nano", provider: "OpenAI" },
  {
    slug: "anthropic/claude-sonnet-4.6",
    label: "Claude Sonnet 4.6",
    provider: "Anthropic",
  },
] as const;

export type AvailableModelSlug = (typeof AVAILABLE_MODELS)[number]["slug"];

/** Task types that can have model overrides. */
export enum ModelTask {
  GUARDRAIL = "guardrail",
  CURRICULUM = "curriculum",
  UNIT = "unit",
  ONBOARDING = "onboarding",
  JUDGE = "judge",
}

/** Validated model slug. */
export type ModelSlug = string;

/** Per-task model preferences stored in DB. */
export interface ModelPreferences {
  guardrail?: ModelSlug;
  curriculum?: ModelSlug;
  unit?: ModelSlug;
  onboarding?: ModelSlug;
  judge?: ModelSlug;
}

interface ModelConfig {
  universal: ModelSlug;
  overrides: Record<ModelTask, ModelSlug | null>;
}

function warnDeprecated(oldName: string, newName: string): void {
  // eslint-disable-next-line no-console
  console.warn(
    `[praxis/models] Deprecated env var ${oldName} detected. Migrate to ${newName}.`,
  );
}

function resolveWithDeprecation(
  primary: string | undefined,
  legacy: string | undefined,
  primaryName: string,
  legacyName: string,
): string | undefined {
  if (legacy) {
    warnDeprecated(legacyName, primaryName);
    if (!primary) {
      return legacy;
    }
  }
  return primary;
}

function loadConfig(): ModelConfig {
  // Handle legacy PRAXIS_GENERATION_MODEL → PRAXIS_LLM_MODEL
  const universalModel = resolveWithDeprecation(
    process.env.PRAXIS_LLM_MODEL,
    process.env.PRAXIS_GENERATION_MODEL,
    "PRAXIS_LLM_MODEL",
    "PRAXIS_GENERATION_MODEL",
  );

  // Handle legacy PRAXIS_EVAL_MODEL / PRAXIS_EVAL_JUDGE_MODEL → PRAXIS_LLM_JUDGE_MODEL
  const judgeModel = resolveWithDeprecation(
    process.env.PRAXIS_LLM_JUDGE_MODEL ?? process.env.PRAXIS_LLM_MODEL,
    process.env.PRAXIS_EVAL_JUDGE_MODEL ?? process.env.PRAXIS_EVAL_MODEL,
    "PRAXIS_LLM_JUDGE_MODEL",
    "PRAXIS_EVAL_JUDGE_MODEL or PRAXIS_EVAL_MODEL",
  );

  const universal = universalModel ?? DEFAULT_MODEL;

  return {
    universal,
    overrides: {
      [ModelTask.GUARDRAIL]: process.env.PRAXIS_LLM_GUARDDRAIL_MODEL ?? null,
      [ModelTask.CURRICULUM]: process.env.PRAXIS_LLM_CURRICULUM_MODEL ?? null,
      [ModelTask.UNIT]: process.env.PRAXIS_LLM_UNIT_MODEL ?? null,
      [ModelTask.ONBOARDING]: process.env.PRAXIS_LLM_ONBOARDING_MODEL ?? null,
      [ModelTask.JUDGE]: judgeModel ?? null,
    },
  };
}

let cachedConfig: ModelConfig | null = null;

function getConfig(): ModelConfig {
  if (!cachedConfig) {
    cachedConfig = loadConfig();
  }
  return cachedConfig;
}

/** Reset cache (useful for testing). */
export function resetModelCache(): void {
  cachedConfig = null;
}

/**
 * Build a model getter function that checks runtime preferences first, then env config.
 * This factory is used server-side to inject learner-specific preferences.
 */
export function createModelResolver(
  preferences: ModelPreferences | null | undefined,
): (task: ModelTask) => ModelSlug {
  const cfg = getConfig();

  return (task: ModelTask): ModelSlug => {
    // 1. Runtime preference from DB (highest priority)
    const prefKey = task as keyof ModelPreferences;
    if (preferences?.[prefKey]) {
      return preferences[prefKey] as ModelSlug;
    }

    // 2. Env override for this task
    const envOverride = cfg.overrides[task];
    if (envOverride) {
      return envOverride;
    }

    // 3. Universal env model
    return cfg.universal;
  };
}

/**
 * Get the model for a specific task (env-only, no runtime preferences).
 * Falls back: task override → universal → default.
 */
export function getModel(task: ModelTask): ModelSlug {
  const cfg = getConfig();
  const override = cfg.overrides[task];
  return override ?? cfg.universal;
}

/** Get the universal model (used when no task-specific override). */
export function getUniversalModel(): ModelSlug {
  return getConfig().universal;
}

/** Convenience: model for scope guardrail. */
export function getGuardrailModel(): ModelSlug {
  return getModel(ModelTask.GUARDRAIL);
}

/** Convenience: model for curriculum/outline generation. */
export function getCurriculumModel(): ModelSlug {
  return getModel(ModelTask.CURRICULUM);
}

/** Convenience: model for unit generation. */
export function getUnitModel(): ModelSlug {
  return getModel(ModelTask.UNIT);
}

/** Convenience: model for onboarding generation. */
export function getOnboardingModel(): ModelSlug {
  return getModel(ModelTask.ONBOARDING);
}

/** Convenience: model for eval judge. */
export function getJudgeModel(): ModelSlug {
  return getModel(ModelTask.JUDGE);
}

/**
 * Backward-compatible alias for existing code.
 * @deprecated Use getUniversalModel() or getCurriculumModel() explicitly.
 */
export function defaultModel(): ModelSlug {
  return getUniversalModel();
}
