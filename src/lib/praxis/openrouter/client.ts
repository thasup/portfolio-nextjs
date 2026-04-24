/**
 * OpenRouter REST client.
 *
 * Provider-agnostic wrapper over OpenRouter's OpenAI-compatible
 * `/chat/completions` endpoint. Every PRAXIS call site dispatches through
 * this single client so we can swap underlying models (Claude, GPT, Llama)
 * without touching prompts or route handlers.
 *
 * This Phase 1 surface is intentionally minimal: non-streaming JSON +
 * text completions only. Streaming is added in Week 2 alongside the
 * chat endpoint.
 */
import { setTimeout as delay } from 'node:timers/promises';

/** Canonical message role enum. Matches OpenAI/OpenRouter wire format. */
export enum ChatRole {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant',
}

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

/** Response-format hint. Every structured generation uses `JSON_OBJECT`. */
export enum ResponseFormat {
  TEXT = 'text',
  JSON_OBJECT = 'json_object',
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
}

export interface ChatCompletion {
  content: string;
  model: string;
  usage: TokenUsage;
}

export interface ChatCompletionOptions {
  model: string;
  messages: ChatMessage[];
  responseFormat?: ResponseFormat;
  /** 0–2. Defaults to 0.4 for generation, 0 for classification/judging. */
  temperature?: number;
  /** Output ceiling. Defaults to 2048 which fits every Phase 1 prompt. */
  maxTokens?: number;
  /** Optional cancellation signal forwarded to `fetch`. */
  signal?: AbortSignal;
}

const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MAX_TOKENS = 2048;
const MAX_RETRIES = 2;
const RETRY_BASE_DELAY_MS = 500;

export class OpenRouterError extends Error {
  readonly status: number;
  readonly body: string;

  constructor(status: number, body: string) {
    super(`OpenRouter ${status}: ${body.slice(0, 240)}`);
    this.name = 'OpenRouterError';
    this.status = status;
    this.body = body;
  }
}

export interface OpenRouterClientConfig {
  apiKey: string;
  /** Sent as `HTTP-Referer`. Used by OpenRouter for attribution analytics. */
  referer?: string;
  /** Sent as `X-Title`. Human-readable app label. */
  title?: string;
}

export class OpenRouterClient {
  private readonly apiKey: string;
  private readonly referer: string;
  private readonly title: string;

  constructor(config: OpenRouterClientConfig) {
    if (!config.apiKey) {
      throw new Error('OpenRouterClient: apiKey is required');
    }
    this.apiKey = config.apiKey;
    this.referer = config.referer ?? 'https://thanachon.me';
    this.title = config.title ?? 'PRAXIS';
  }

  async chat(opts: ChatCompletionOptions): Promise<ChatCompletion> {
    const body = {
      model: opts.model,
      messages: opts.messages.map((m) => ({ role: m.role, content: m.content })),
      temperature: opts.temperature ?? 0.4,
      max_tokens: opts.maxTokens ?? DEFAULT_MAX_TOKENS,
      ...(opts.responseFormat === ResponseFormat.JSON_OBJECT
        ? { response_format: { type: 'json_object' as const } }
        : {}),
    };

    let lastError: unknown = null;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
      try {
        const res = await fetch(OPENROUTER_ENDPOINT, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': this.referer,
            'X-Title': this.title,
          },
          body: JSON.stringify(body),
          signal: opts.signal,
        });

        if (!res.ok) {
          const text = await res.text();
          // Retry on 5xx / 429, fail fast on 4xx auth / request errors.
          if (res.status >= 500 || res.status === 429) {
            throw new OpenRouterError(res.status, text);
          }
          throw new OpenRouterError(res.status, text);
        }

        const json = (await res.json()) as {
          model?: string;
          choices?: Array<{ message?: { content?: string } }>;
          usage?: { prompt_tokens?: number; completion_tokens?: number };
        };

        const content = json.choices?.[0]?.message?.content ?? '';
        return {
          content,
          model: json.model ?? opts.model,
          usage: {
            inputTokens: json.usage?.prompt_tokens ?? 0,
            outputTokens: json.usage?.completion_tokens ?? 0,
          },
        };
      } catch (err) {
        lastError = err;
        const retriable =
          err instanceof OpenRouterError && (err.status >= 500 || err.status === 429);
        if (!retriable || attempt === MAX_RETRIES) break;
        await delay(RETRY_BASE_DELAY_MS * 2 ** attempt);
      }
    }

    throw lastError instanceof Error
      ? lastError
      : new Error('OpenRouter request failed');
  }
}

/**
 * Parse a JSON response defensively. OpenRouter may return JSON wrapped
 * in stray backticks or prose preamble despite `response_format`.
 * Returns `null` if parsing fails after cleanup — callers decide how to
 * handle that (retry, score as 0, etc.).
 */
export function extractJson<T = unknown>(raw: string): T | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const candidates: string[] = [trimmed];

  // Strip ```json fences if present.
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence?.[1]) candidates.push(fence[1].trim());

  // Locate the first `{` ... last `}` to peel away prose preambles.
  const first = trimmed.indexOf('{');
  const last = trimmed.lastIndexOf('}');
  if (first !== -1 && last > first) {
    candidates.push(trimmed.slice(first, last + 1));
  }

  for (const c of candidates) {
    try {
      return JSON.parse(c) as T;
    } catch {
      // try next candidate
    }
  }
  return null;
}
