/**
 * Factory that produces a memoised OpenRouter client for server
 * runtimes. Route handlers import `getClient()` instead of constructing
 * the client directly, so the env lookup + referer/title defaults stay
 * in one place.
 */
import 'server-only';
import { OpenRouterClient } from '@/lib/praxis/openrouter/client';
import {
  defaultModel,
  getUniversalModel,
  ModelTask,
  getModel,
  getGuardrailModel,
  getCurriculumModel,
  getUnitModel,
  getOnboardingModel,
  getJudgeModel,
  createModelResolver,
  AVAILABLE_MODELS,
  DEFAULT_MODEL,
} from '@/lib/praxis/openrouter/models';

// Re-export model getters for convenience.
export {
  defaultModel,
  getUniversalModel,
  ModelTask,
  getModel,
  getGuardrailModel,
  getCurriculumModel,
  getUnitModel,
  getOnboardingModel,
  getJudgeModel,
  // Runtime preference support
  createModelResolver,
  AVAILABLE_MODELS,
  DEFAULT_MODEL,
};

// Re-export types
export type {
  ModelPreferences,
  AvailableModelSlug,
  ModelSlug,
} from '@/lib/praxis/openrouter/models';

let cached: OpenRouterClient | null = null;

export function getClient(): OpenRouterClient {
  if (cached) return cached;
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not set');
  }
  cached = new OpenRouterClient({
    apiKey,
    referer: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://thanachon.me',
    title: 'PRAXIS',
  });
  return cached;
}
