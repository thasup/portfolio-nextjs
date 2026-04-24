/**
 * Static pricing table for cost estimation.
 *
 * OpenRouter does not return per-call pricing in the response, so we
 * maintain a module-local lookup. Values are US cents per **million**
 * tokens, split into input and output, matching the pricing pages on
 * openrouter.ai/models (rounded up to the nearest whole cent).
 *
 * When a model isn't in the table, we fall back to a conservative
 * default that errs on the side of overestimating spend — better to
 * hit the monthly budget guard early than to undercount.
 *
 * Update cadence: check prices once a month while Phase 1 is live.
 * A future T-XXX will replace this with an OpenRouter `/models` fetch
 * cached at build time.
 */

export interface ModelPricing {
  /** US cents per 1,000,000 input tokens. */
  inputCentsPerMillion: number;
  /** US cents per 1,000,000 output tokens. */
  outputCentsPerMillion: number;
}

const PRICING: Record<string, ModelPricing> = {
  // Anthropic
  'anthropic/claude-sonnet-4.6': { inputCentsPerMillion: 300, outputCentsPerMillion: 1500 },
  'anthropic/claude-haiku-4.5': { inputCentsPerMillion: 100, outputCentsPerMillion: 500 },
  // OpenAI
  'openai/gpt-5-nano': { inputCentsPerMillion: 5, outputCentsPerMillion: 40 },
  'openai/gpt-oss-120b:free': { inputCentsPerMillion: 0, outputCentsPerMillion: 0 },
  // Fallback for ledger safety. Intentionally high.
  'default': { inputCentsPerMillion: 500, outputCentsPerMillion: 2000 },
};

/** Returns cents (rounded up) for the given token counts on `model`. */
export function estimateCents(
  model: string,
  inputTokens: number,
  outputTokens: number,
): number {
  const entry = PRICING[model] ?? PRICING['default'];
  const cents =
    (inputTokens * entry.inputCentsPerMillion + outputTokens * entry.outputCentsPerMillion) /
    1_000_000;
  return Math.max(0, Math.ceil(cents));
}

export function isKnownModel(model: string): boolean {
  return Object.prototype.hasOwnProperty.call(PRICING, model);
}
