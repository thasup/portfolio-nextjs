/**
 * Curriculum service — the business logic behind
 * `POST /api/praxis/curriculum`.
 *
 * Split into three phases:
 *   1. `runScopeGuardrail()` — classifies a raw topic string. Records
 *      a `GUARDRAIL` ledger entry.
 *   2. `getOrGenerateOutline()` — cache-aware outline generation.
 *      Records a `CURRICULUM` ledger entry on cache miss. On JSON
 *      parse failure, retries ONCE with a stricter suffix appended
 *      (per `contracts/curriculum.generate.md`).
 *   3. `persistAcceptedOutline()` — creates the learner's topic and
 *      unit rows in a single batch.
 *
 * All three are server-only and use the admin client so they bypass
 * RLS where appropriate (shared caches + ledger). Learner-scoped
 * writes in `persistAcceptedOutline()` still go through the authed
 * cookie client so RLS ownership checks fire.
 */
import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createAdminClient } from '@/lib/praxis/supabase/admin';
import type { Database } from '@/lib/praxis/supabase/database.types';
import {
  ChatRole,
  ResponseFormat,
  extractJson,
} from '@/lib/praxis/openrouter/client';
import {
  getClient,
  createModelResolver,
  ModelTask,
} from '@/lib/praxis/openrouter/factory';
import type { ModelPreferences } from '@/lib/praxis/openrouter/factory';
import {
  LedgerEndpoint,
  assertBudget,
  recordLedgerEntry,
} from '@/lib/praxis/openrouter/ledger';
import {
  PROMPT_VERSIONS,
  ScopeCategory,
  curriculumOutline,
  scopeGuardrail,
} from '@/lib/praxis/prompts';
import type { PraxisLocale } from '@/lib/praxis/prompts/types';

// ---- scope guardrail -------------------------------------------------------

export interface ScopeGuardrailResult {
  admitted: boolean;
  category: ScopeCategory;
  explanation: string;
}

export async function runScopeGuardrail(opts: {
  rawInput: string;
  locale: PraxisLocale;
  preferences?: ModelPreferences | null;
}): Promise<ScopeGuardrailResult> {
  await assertBudget();
  const client = getClient();
  const model = createModelResolver(opts.preferences)(ModelTask.GUARDRAIL);
  const prompt = scopeGuardrail.build({ topic: opts.rawInput, locale: opts.locale });

  const res = await client.chat({
    model,
    messages: [{ role: ChatRole.USER, content: prompt }],
    responseFormat: ResponseFormat.JSON_OBJECT,
    temperature: 0,
    maxTokens: 256,
  });

  await recordLedgerEntry({
    endpoint: LedgerEndpoint.GUARDRAIL,
    model,
    inputTokens: res.usage.inputTokens,
    outputTokens: res.usage.outputTokens,
  });

  const parsed = extractJson<scopeGuardrail.ScopeGuardrailOutput>(res.content);
  // A failed parse is treated as "admitted" — we'd rather let a topic
  // through to outline generation than reject on a JSON hiccup. The
  // outline prompt itself will refuse frankly unsafe topics.
  if (!parsed) {
    return { admitted: true, category: ScopeCategory.OK, explanation: '' };
  }
  return {
    admitted: !!parsed.admitted && parsed.category === ScopeCategory.OK,
    category: (parsed.category as ScopeCategory) ?? ScopeCategory.OK,
    explanation: parsed.explanation ?? '',
  };
}

// ---- outline generation ----------------------------------------------------

export interface OutlineUnit {
  index: number;
  title: string;
  objective: string;
  summary: string;
}

export interface OutlineResult {
  cached: boolean;
  modelVersion: string;
  units: OutlineUnit[];
  cacheRowId: string;
}

const JSON_RETRY_SUFFIX = '\n\nReturn ONLY valid JSON matching the schema above. Do not include prose before or after.';

async function generateOutlineOnce(opts: {
  rawInput: string;
  locale: PraxisLocale;
  strict?: boolean;
  preferences?: ModelPreferences | null;
}): Promise<{ units: OutlineUnit[] } | null> {
  const client = getClient();
  const model = createModelResolver(opts.preferences)(ModelTask.CURRICULUM);
  const basePrompt = curriculumOutline.build({ topic: opts.rawInput, locale: opts.locale });
  const prompt = opts.strict ? basePrompt + JSON_RETRY_SUFFIX : basePrompt;

  const res = await client.chat({
    model,
    messages: [{ role: ChatRole.USER, content: prompt }],
    responseFormat: ResponseFormat.JSON_OBJECT,
    temperature: 0.4,
    maxTokens: 2048,
  });

  await recordLedgerEntry({
    endpoint: LedgerEndpoint.CURRICULUM,
    model,
    inputTokens: res.usage.inputTokens,
    outputTokens: res.usage.outputTokens,
  });

  const parsed = extractJson<curriculumOutline.OutlineJson>(res.content);
  if (!parsed?.units?.length) return null;
  return {
    units: parsed.units.map((u, i) => ({
      index: i + 1,
      title: u.title,
      objective: u.objective,
      summary: u.summary,
    })),
  };
}

export async function getOrGenerateOutline(opts: {
  rawInput: string;
  fingerprint: string;
  locale: PraxisLocale;
  preferences?: ModelPreferences | null;
}): Promise<OutlineResult> {
  const admin = createAdminClient();
  const modelVersion = PROMPT_VERSIONS.curriculumOutline;

  // 1. Cache lookup.
  const { data: hit, error: hitErr } = await admin
    .from('praxis_curriculum_cache')
    .select('id, units, hit_count')
    .eq('fingerprint', opts.fingerprint)
    .eq('locale', opts.locale)
    .eq('model_version', modelVersion)
    .maybeSingle();

  if (hitErr) {
    console.error('[praxis/curriculum] cache lookup failed', hitErr);
  }

  if (hit) {
    // Increment hit_count opportunistically; don't block on failure.
    admin
      .from('praxis_curriculum_cache')
      .update({ hit_count: (hit.hit_count ?? 0) + 1 })
      .eq('id', hit.id)
      .then(({ error }) => {
        if (error) console.error('[praxis/curriculum] hit_count bump failed', error);
      });

    const unitsJson = hit.units as { units?: Array<{ title: string; objective: string; summary: string }> } | null;
    const cachedUnits = unitsJson?.units ?? [];
    return {
      cached: true,
      modelVersion,
      cacheRowId: hit.id,
      units: cachedUnits.map((u, i) => ({
        index: i + 1,
        title: u.title,
        objective: u.objective,
        summary: u.summary,
      })),
    };
  }

  // 2. Cache miss — generate with one retry.
  await assertBudget();
  let generated = await generateOutlineOnce({ rawInput: opts.rawInput, locale: opts.locale, preferences: opts.preferences });
  if (!generated) {
    generated = await generateOutlineOnce({ rawInput: opts.rawInput, locale: opts.locale, strict: true, preferences: opts.preferences });
  }
  if (!generated) {
    throw new Error('outline generation failed — invalid JSON after retry');
  }

  // 3. Persist into cache.
  const { data: inserted, error: insertErr } = await admin
    .from('praxis_curriculum_cache')
    .insert({
      fingerprint: opts.fingerprint,
      locale: opts.locale,
      model_version: modelVersion,
      units: {
        units: generated.units.map(({ title, objective, summary }) => ({ title, objective, summary })),
      },
    })
    .select('id')
    .single();

  if (insertErr || !inserted) {
    throw new Error(`cache insert failed: ${insertErr?.message ?? 'no row'}`);
  }

  return {
    cached: false,
    modelVersion,
    cacheRowId: inserted.id,
    units: generated.units,
  };
}

// ---- accept outline --------------------------------------------------------

export interface PersistAcceptedOutlineInput {
  learnerId: string;
  rawInput: string;
  title: string;
  fingerprint: string;
  locale: PraxisLocale;
  units: OutlineUnit[];
  /** Cache row id resolved from the outline phase. */
  curriculumId: string;
  /**
   * True if the learner edited the outline materially. When true, a new
   * cache row is created so the shared cache stays pristine.
   */
  edited: boolean;
  /** Cookie-bound Supabase client so RLS fires on learner-scoped writes. */
  supabase: SupabaseClient<Database>;
}

export interface PersistAcceptedOutlineResult {
  topicId: string;
  curriculumId: string;
  units: Array<{ id: string; index: number; title: string; status: string }>;
}

const TITLE_EDIT_THRESHOLD = 0.3;

/**
 * Cheap edit-distance for the "materially edited" heuristic. Character-
 * level Levenshtein normalised by longer-string length. Not accurate
 * for semantic edits, but fine for detecting "learner fundamentally
 * rewrote the outline".
 */
function editRatio(a: string, b: string): number {
  if (a === b) return 0;
  const longer = a.length >= b.length ? a : b;
  const shorter = a.length >= b.length ? b : a;
  if (longer.length === 0) return 0;

  const dp: number[] = new Array(shorter.length + 1).fill(0);
  for (let j = 0; j <= shorter.length; j += 1) dp[j] = j;
  for (let i = 1; i <= longer.length; i += 1) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= shorter.length; j += 1) {
      const tmp = dp[j];
      dp[j] = longer[i - 1] === shorter[j - 1]
        ? prev
        : 1 + Math.min(prev, dp[j - 1], dp[j]);
      prev = tmp;
    }
  }
  return dp[shorter.length] / longer.length;
}

export function outlineEditedMaterially(
  original: ReadonlyArray<OutlineUnit>,
  edited: ReadonlyArray<OutlineUnit>,
): boolean {
  const origTitles = original.map((u) => u.title).join(' | ');
  const editTitles = edited.map((u) => u.title).join(' | ');
  return editRatio(origTitles, editTitles) > TITLE_EDIT_THRESHOLD;
}

export async function persistAcceptedOutline(
  input: PersistAcceptedOutlineInput,
): Promise<PersistAcceptedOutlineResult> {
  const {
    learnerId,
    rawInput,
    title,
    fingerprint,
    locale,
    units,
    edited,
    supabase,
  } = input;

  // If the learner materially edited the outline, clone the cache row
  // under a new UUID so the shared cache isn't mutated.
  let curriculumId = input.curriculumId;
  if (edited) {
    const admin = createAdminClient();
    const { data: clone, error: cloneErr } = await admin
      .from('praxis_curriculum_cache')
      .insert({
        fingerprint: `${fingerprint}+edited-${learnerId}`,
        locale,
        model_version: PROMPT_VERSIONS.curriculumOutline,
        units: {
          units: units.map(({ title, objective, summary }) => ({ title, objective, summary })),
        },
      })
      .select('id')
      .single();
    if (cloneErr || !clone) {
      throw new Error(`cache clone failed: ${cloneErr?.message ?? 'no row'}`);
    }
    curriculumId = clone.id;
  }

  // Insert topic.
  const { data: topic, error: topicErr } = await supabase
    .from('praxis_topics')
    .insert({
      user_id: learnerId,
      title,
      raw_input: rawInput,
      fingerprint,
      locale,
      status: 'outline_ready',
      curriculum_id: curriculumId,
    })
    .select('id')
    .single();
  if (topicErr || !topic) {
    throw new Error(`topic insert failed: ${topicErr?.message ?? 'no row'}`);
  }

  // Insert units in one batch.
  const unitsPayload = units.map((u) => ({
    topic_id: topic.id,
    index: u.index,
    title: u.title,
    objective: u.objective,
    status: 'pending' as const,
  }));
  const { data: insertedUnits, error: unitsErr } = await supabase
    .from('praxis_units')
    .insert(unitsPayload)
    .select('id, index, title, status');

  if (unitsErr || !insertedUnits) {
    throw new Error(`units insert failed: ${unitsErr?.message ?? 'no rows'}`);
  }

  return {
    topicId: topic.id,
    curriculumId,
    units: insertedUnits
      .sort((a, b) => a.index - b.index)
      .map((u) => ({ id: u.id, index: u.index, title: u.title, status: u.status })),
  };
}

