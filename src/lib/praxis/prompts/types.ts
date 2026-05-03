/**
 * Shared prompt types for PRAXIS Phase 1.
 *
 * All prompt modules in this folder are pure: they export a `VERSION`,
 * a `build(input): string` function, and a `fixtures` array consumed by
 * the eval harness (`scripts/praxis-eval.ts`).
 *
 * Runtime validation of model JSON output lives in the route handlers
 * (Week 2+). These types describe the *contract* between prompts and
 * callers — the actual model output is typed narrowly at the parse site.
 */

/** Supported UI locales. Phase 1 only emits `en`; `th` is architecture-only. */
export enum PraxisLocale {
  EN = "en",
  TH = "th",
}

/** Scope guardrail verdict categories. */
export enum ScopeCategory {
  OK = "ok",
  MEDICAL = "medical",
  LEGAL = "legal",
  FINANCIAL = "financial",
  EXPLICIT = "explicit",
  MINORS = "minors",
  OTHER = "other",
}

/** Content block kinds emitted by `curriculum.unit.ts`. */
export enum UnitBlockKind {
  OBJECTIVES = "objectives",
  EXPLAINER = "explainer",
  EXAMPLE = "example",
  DIAGRAM_NOTE = "diagram_note",
  PRACTICE = "practice",
}

/** Onboarding question input types emitted by `onboarding.meta.ts`. */
export enum OnboardingInputType {
  SHORT_TEXT = "short_text",
  LONG_TEXT = "long_text",
  SINGLE_SELECT = "single_select",
}

/** Template kinds supported in Phase 1 (DOCX + XLSX; PDF is Phase 3). */
export enum TemplateKind {
  DOCX = "docx",
  XLSX = "xlsx",
  PDF = "pdf",
}

/**
 * Minimal learner context injected into Nori's system prompt.
 * Derived from `OnboardingProfile.answers` at compose time.
 */
export interface LearnerContext {
  displayName: string | null;
  role: string | null;
  product: string | null;
  audience: string | null;
  goal: string | null;
  /** Any additional onboarding Q/A not captured by the common fields above. */
  extras?: ReadonlyArray<{ question: string; answer: string }>;
}

/** One unit's static reference snapshot used when building the chat prompt. */
export interface UnitContext {
  title: string;
  objective: string;
  /** A compact summary — not full block content — to keep prompts under budget. */
  summary: string;
}

/** One outline unit emitted by the curriculum.outline prompt. */
export interface OutlineUnit {
  title: string;
  objective: string;
  summary: string;
}

/** Canonical input shape for any prompt module: extend per-module as needed. */
export interface BasePromptInput {
  locale: PraxisLocale;
}

/**
 * A prompt fixture is a named, minimal input the eval harness and unit
 * tests can feed through `build()` to verify wording stability.
 */
export interface PromptFixture<TInput> {
  name: string;
  input: TInput;
}

/** Canonical persona synthetic fixtures used across eval runs. */
export enum EvalPersonaKey {
  SALES_SMB = "sales_smb",
  PM_NEW = "pm_new",
  NEGOTIATOR = "negotiator",
}
