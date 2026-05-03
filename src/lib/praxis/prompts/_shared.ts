/**
 * Shared prompt fragments. Kept deliberately tiny so every module can
 * stay under the NFR-008 budget (≤ 800 static tokens per prompt).
 */
import {
  LearnerContext,
  PraxisLocale,
  UnitContext,
} from "@/lib/praxis/prompts/types";

/**
 * Strict JSON-mode directive appended to every structured generation prompt.
 * Keeping this identical across modules lets us swap providers without
 * re-tuning each prompt individually.
 */
export const JSON_ONLY_DIRECTIVE =
  "Return ONLY a single JSON object. No prose before or after. No code fences. No comments. If a field is unknown, use null — never omit keys.";

/** Language instruction applied to every prompt. */
export function localeDirective(locale: PraxisLocale): string {
  switch (locale) {
    case PraxisLocale.TH:
      return "Respond in Thai. Use natural, conversational Thai (not translated English).";
    case PraxisLocale.EN:
    default:
      return "Respond in English. Use plain, conversational language — no jargon for its own sake.";
  }
}

/**
 * Render a learner block used by every generation and chat prompt.
 * Must stay compact: learner fields are already short by construction.
 */
export function renderLearner(learner: LearnerContext | null): string {
  if (!learner) return "<learner>unknown</learner>";
  const parts: string[] = [];
  if (learner.displayName) parts.push(`name=${learner.displayName}`);
  if (learner.role) parts.push(`role=${learner.role}`);
  if (learner.product) parts.push(`product=${learner.product}`);
  if (learner.audience) parts.push(`audience=${learner.audience}`);
  if (learner.goal) parts.push(`goal=${learner.goal}`);
  if (learner.extras?.length) {
    for (const e of learner.extras) parts.push(`${e.question}=${e.answer}`);
  }
  if (!parts.length) return "<learner>unspecified</learner>";
  return `<learner>\n${parts.join("\n")}\n</learner>`;
}

/** Render a unit reference block (title + objective + compact summary). */
export function renderUnit(unit: UnitContext | null): string {
  if (!unit) return "<unit>none</unit>";
  return `<unit>\ntitle=${unit.title}\nobjective=${unit.objective}\nsummary=${unit.summary}\n</unit>`;
}

/**
 * Clamp free-form strings before they enter the prompt. Guards against
 * pathological inputs (10k-char topic strings, pasted docs) blowing the
 * token budget. The clamp is generous by design — real topics are short.
 */
export function clamp(value: string, max: number): string {
  const trimmed = value.trim().replace(/\s+/g, " ");
  return trimmed.length <= max ? trimmed : `${trimmed.slice(0, max - 1)}…`;
}
