/**
 * Barrel exports for all PRAXIS prompt modules.
 *
 * Each module exports at minimum:
 *   - `VERSION` constant (string literal like `"<name>@1"`)
 *   - `build(input)` pure function returning a prompt string
 *   - `fixtures` array consumed by `scripts/praxis-eval.ts`
 *
 * Route handlers import via namespace (e.g.
 * `import * as outlinePrompt from '@/lib/praxis/prompts/curriculum.outline'`)
 * so the `VERSION` constant stays adjacent to the `build` call.
 */
export * from '@/lib/praxis/prompts/types';
export * as nori from '@/lib/praxis/prompts/nori.persona';
export * as scopeGuardrail from '@/lib/praxis/prompts/scope.guardrail';
export * as curriculumOutline from '@/lib/praxis/prompts/curriculum.outline';
export * as curriculumUnit from '@/lib/praxis/prompts/curriculum.unit';
export * as onboardingMeta from '@/lib/praxis/prompts/onboarding.meta';
export * as templateGenerator from '@/lib/praxis/prompts/template.generator';

/**
 * Registry of every prompt's version identifier.
 * Write this into `praxis_curriculum_cache.model_version` and
 * `praxis_unit_cache.model_version` so bumping any prompt invalidates
 * stale cached content (research.md §6).
 */
export const PROMPT_VERSIONS = {
  nori: 'nori.persona@1',
  scopeGuardrail: 'scope.guardrail@1',
  curriculumOutline: 'curriculum.outline@1',
  curriculumUnit: 'curriculum.unit@2',
  onboardingMeta: 'onboarding.meta@1',
  templateGenerator: 'template.generator@1',
} as const;

export type PromptModuleKey = keyof typeof PROMPT_VERSIONS;
