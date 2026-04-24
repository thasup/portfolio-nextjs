/**
 * Append-only spend ledger over `praxis_spend_ledger`.
 *
 * Every generation endpoint records one row per upstream call. The
 * table is RLS-disabled and writable only via the service-role admin
 * client, so this module is `server-only`.
 *
 * Budget enforcement (NFR-001): a monthly cap is configurable via
 * `PRAXIS_MONTHLY_BUDGET_CENTS`. `assertBudget()` short-circuits calls
 * when the rolling 30-day total exceeds the cap.
 */
import 'server-only';
import { createAdminClient } from '@/lib/praxis/supabase/admin';
import { estimateCents } from '@/lib/praxis/openrouter/pricing';

/** Must match the CHECK constraint on `praxis_spend_ledger.endpoint`. */
export enum LedgerEndpoint {
  CHAT = 'chat',
  CURRICULUM = 'curriculum',
  UNIT = 'unit',
  ONBOARDING = 'onboarding',
  TEMPLATE = 'template',
  GUARDRAIL = 'guardrail',
}

export interface LedgerEntry {
  endpoint: LedgerEndpoint;
  model: string;
  inputTokens: number;
  outputTokens: number;
}

/**
 * Inserts a ledger row. Never throws on failure — logging the spend is
 * best-effort and must not break the user-facing request. Errors are
 * surfaced to `console.error` and swallowed.
 */
export async function recordLedgerEntry(entry: LedgerEntry): Promise<void> {
  const admin = createAdminClient();
  const estimatedCents = estimateCents(entry.model, entry.inputTokens, entry.outputTokens);
  const { error } = await admin.from('praxis_spend_ledger').insert({
    endpoint: entry.endpoint,
    model: entry.model,
    input_tokens: entry.inputTokens,
    output_tokens: entry.outputTokens,
    estimated_cents: estimatedCents,
  });
  if (error) {
    console.error('[praxis/ledger] failed to insert row', error);
  }
}

export class BudgetExceededError extends Error {
  readonly monthlyCapCents: number;
  readonly currentSpendCents: number;

  constructor(monthlyCapCents: number, currentSpendCents: number) {
    super(
      `PRAXIS monthly budget exceeded: ${currentSpendCents}/${monthlyCapCents} cents`,
    );
    this.name = 'BudgetExceededError';
    this.monthlyCapCents = monthlyCapCents;
    this.currentSpendCents = currentSpendCents;
  }
}

/**
 * Throws `BudgetExceededError` when the rolling 30-day spend has
 * crossed `PRAXIS_MONTHLY_BUDGET_CENTS`. Does nothing when the env var
 * is unset, so local dev is never blocked.
 */
export async function assertBudget(): Promise<void> {
  const capRaw = process.env.PRAXIS_MONTHLY_BUDGET_CENTS;
  if (!capRaw) return;
  const cap = Number(capRaw);
  if (!Number.isFinite(cap) || cap <= 0) return;

  const admin = createAdminClient();
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await admin
    .from('praxis_spend_ledger')
    .select('estimated_cents')
    .gte('timestamp', since);

  if (error) {
    console.error('[praxis/ledger] budget lookup failed', error);
    return;
  }
  const total = (data ?? []).reduce((sum, row) => sum + row.estimated_cents, 0);
  if (total >= cap) {
    throw new BudgetExceededError(cap, total);
  }
}
