/**
 * Unit service — the business logic behind `POST /api/praxis/unit`.
 *
 * Two actions:
 *   1. `generateUnit()` — cache-aware unit content generation. Checks
 *      `praxis_unit_cache` by `(fingerprint, locale, unit_index,
 *      model_version)`. On hit, copies blocks + links `cache_id`. On
 *      miss, calls the curriculum.unit prompt, records spend, inserts
 *      into cache, copies blocks to unit.
 *   2. `regenerateBlock()` — block-level regeneration with a learner
 *      instruction. The new block is appended to the unit's blocks
 *      array (append-only — old block stays for history). Regeneration
 *      does NOT update the shared cache.
 *
 * All functions are server-only and use the admin client where needed
 * (shared caches + ledger). Learner-scoped writes still go through
 * the authed cookie client so RLS ownership checks fire.
 *
 * @see specs/010-praxis-learning-platform/contracts/unit.generate.md
 */
import 'server-only';
import { createAdminClient } from '@/lib/praxis/supabase/admin';
import type { Database } from '@/lib/praxis/supabase/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  ChatRole,
  ResponseFormat,
  extractJson,
} from '@/lib/praxis/openrouter/client';
import {
  getClient,
  getUnitModel,
  getUniversalModel,
} from '@/lib/praxis/openrouter/factory';
import {
  LedgerEndpoint,
  assertBudget,
  recordLedgerEntry,
} from '@/lib/praxis/openrouter/ledger';
import { PROMPT_VERSIONS, curriculumUnit } from '@/lib/praxis/prompts';
import type {
  LearnerContext,
  OutlineUnit,
  PraxisLocale,
  UnitBlockKind,
} from '@/lib/praxis/prompts/types';
import { JSON_ONLY_DIRECTIVE, clamp, renderLearner } from '@/lib/praxis/prompts/_shared';

// ---- types -----------------------------------------------------------------

export interface ContentBlock {
  id: string;
  kind: UnitBlockKind;
  content: string;
  regeneratedFrom: string | null;
  generatedAt: string;
}

export interface GenerateUnitInput {
  unitId: string;
  learnerId: string;
  /** Cookie-bound Supabase client for RLS-gated reads/writes. */
  supabase: SupabaseClient<Database>;
}

export interface GenerateUnitResult {
  unitId: string;
  status: string;
  blocks: ContentBlock[];
  cached: boolean;
}

export interface RegenerateBlockInput {
  unitId: string;
  blockId: string;
  instruction: string;
  learnerId: string;
  supabase: SupabaseClient<Database>;
}

export interface RegenerateBlockResult {
  block: ContentBlock;
}

// ---- error classes ---------------------------------------------------------

export class UnitNotFoundError extends Error {
  constructor(unitId: string) {
    super(`Unit not found: ${unitId}`);
    this.name = 'UnitNotFoundError';
  }
}

export class UnitNotOwnedError extends Error {
  constructor() {
    super('Unit does not belong to caller');
    this.name = 'UnitNotOwnedError';
  }
}

export class UnitGeneratingError extends Error {
  constructor() {
    super('Unit is already being generated');
    this.name = 'UnitGeneratingError';
  }
}

export class BlockNotFoundError extends Error {
  constructor(blockId: string) {
    super(`Block not found: ${blockId}`);
    this.name = 'BlockNotFoundError';
  }
}

// ---- generate unit ---------------------------------------------------------

/**
 * Loads a unit's topic context (fingerprint, locale, outline) needed
 * for cache lookup and generation.
 */
async function loadUnitContext(
  unitId: string,
  learnerId: string,
  supabase: SupabaseClient<Database>,
): Promise<{
  unit: { id: string; index: number; title: string; objective: string; status: string; topic_id: string };
  topic: { id: string; title: string; fingerprint: string; locale: string; raw_input: string; curriculum_id: string | null };
  outline: OutlineUnit[];
} | null> {
  // Load unit + topic in one round-trip where possible.
  const { data: unit, error: unitErr } = await supabase
    .from('praxis_units')
    .select('id, index, title, objective, status, topic_id')
    .eq('id', unitId)
    .maybeSingle();

  if (unitErr || !unit) return null;

  const { data: topic, error: topicErr } = await supabase
    .from('praxis_topics')
    .select('id, title, fingerprint, locale, raw_input, curriculum_id, user_id')
    .eq('id', unit.topic_id)
    .maybeSingle();

  if (topicErr || !topic || topic.user_id !== learnerId) return null;

  // Load outline from curriculum cache.
  let outline: OutlineUnit[] = [];
  if (topic.curriculum_id) {
    const admin = createAdminClient();
    const { data: cache } = await admin
      .from('praxis_curriculum_cache')
      .select('units')
      .eq('id', topic.curriculum_id)
      .maybeSingle();

    if (cache) {
      const parsed = cache.units as { units?: Array<{ title: string; objective: string; summary: string }> } | null;
      outline = (parsed?.units ?? []).map((u) => ({
        title: u.title,
        objective: u.objective,
        summary: u.summary,
      }));
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user_id: _ownerId, ...topicWithoutOwner } = topic;
  return { unit, topic: topicWithoutOwner, outline };
}

/**
 * Load the learner's onboarding answers for constructing a
 * LearnerContext to pass to the prompt.
 */
async function loadLearnerContext(
  learnerId: string,
  topicId: string,
  displayName: string | null,
  supabase: SupabaseClient<Database>,
): Promise<LearnerContext | null> {
  const { data: onboarding } = await supabase
    .from('praxis_onboarding')
    .select('answers')
    .eq('user_id', learnerId)
    .eq('topic_id', topicId)
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!onboarding?.answers) return null;

  // Answers are stored as JSON array of { questionId, prompt, answer, ... }.
  const answers = onboarding.answers as Array<{
    questionId: string;
    prompt: string;
    answer: string;
  }>;

  // Map common onboarding fields to the LearnerContext shape.
  // The onboarding prompt typically produces questions whose IDs hint at
  // the field: "role", "product", "audience", "goal". Fallback to extras.
  let role: string | null = null;
  let product: string | null = null;
  let audience: string | null = null;
  let goal: string | null = null;
  const extras: Array<{ question: string; answer: string }> = [];

  for (const a of answers) {
    const id = a.questionId.toLowerCase();
    if (id.includes('role') || id.includes('job') || id.includes('position')) {
      role = a.answer;
    } else if (id.includes('product') || id.includes('sell') || id.includes('offer')) {
      product = a.answer;
    } else if (id.includes('audience') || id.includes('customer') || id.includes('client')) {
      audience = a.answer;
    } else if (id.includes('goal') || id.includes('objective') || id.includes('outcome')) {
      goal = a.answer;
    } else {
      extras.push({ question: a.prompt, answer: a.answer });
    }
  }

  return {
    displayName,
    role,
    product,
    audience,
    goal,
    extras: extras.length > 0 ? extras : undefined,
  };
}

function makeBlockId(): string {
  return crypto.randomUUID();
}

export async function generateUnit(input: GenerateUnitInput): Promise<GenerateUnitResult> {
  const { unitId, learnerId, supabase } = input;
  const admin = createAdminClient();

  // 1. Load context.
  const ctx = await loadUnitContext(unitId, learnerId, supabase);
  if (!ctx) throw new UnitNotFoundError(unitId);

  const { unit, topic, outline } = ctx;

  // 2. If already ready/completed, just return current blocks.
  if (unit.status === 'ready' || unit.status === 'completed') {
    const blocks = await loadBlocks(unitId, supabase);
    return { unitId, status: unit.status, blocks, cached: true };
  }

  // 3. If already generating, conflict.
  if (unit.status === 'generating') {
    throw new UnitGeneratingError();
  }

  // 4. Mark as generating (prevents duplicate concurrent generation).
  await supabase
    .from('praxis_units')
    .update({ status: 'generating', updated_at: new Date().toISOString() })
    .eq('id', unitId);

  try {
    const modelVersion = PROMPT_VERSIONS.curriculumUnit;

    // 5. Check unit cache.
    const { data: cacheHit } = await admin
      .from('praxis_unit_cache')
      .select('id, blocks')
      .eq('fingerprint', topic.fingerprint)
      .eq('locale', topic.locale)
      .eq('unit_index', unit.index)
      .eq('model_version', modelVersion)
      .maybeSingle();

    let blocks: ContentBlock[];
    let cached = false;
    let cacheId: string | null = null;

    if (cacheHit) {
      // Cache hit — copy blocks.
      cached = true;
      cacheId = cacheHit.id;
      const rawBlocks = cacheHit.blocks as Array<{ kind: string; content: string }>;
      blocks = rawBlocks.map((b) => ({
        id: makeBlockId(),
        kind: b.kind as UnitBlockKind,
        content: b.content,
        regeneratedFrom: null,
        generatedAt: new Date().toISOString(),
      }));
    } else {
      // Cache miss — generate.
      await assertBudget();

      // Load learner context for the practice block.
      const { data: learnerRow } = await supabase
        .from('nexus_users')
        .select('display_name')
        .eq('id', learnerId)
        .maybeSingle();

      const learnerContext = await loadLearnerContext(
        learnerId,
        topic.id,
        learnerRow?.display_name ?? null,
        supabase,
      );

      const outlineUnit: OutlineUnit = {
        title: unit.title,
        objective: unit.objective,
        summary: outline[unit.index - 1]?.summary ?? '',
      };

      const prompt = curriculumUnit.build({
        locale: topic.locale as PraxisLocale,
        topic: topic.raw_input,
        unit: outlineUnit,
        outline,
        unitIndex: unit.index,
        learner: learnerContext,
      });

      const client = getClient();
      const model = getUnitModel();

      const res = await client.chat({
        model,
        messages: [{ role: ChatRole.USER, content: prompt }],
        responseFormat: ResponseFormat.JSON_OBJECT,
        temperature: 0.4,
        maxTokens: 4096,
      });

      await recordLedgerEntry({
        endpoint: LedgerEndpoint.UNIT,
        model,
        inputTokens: res.usage.inputTokens,
        outputTokens: res.usage.outputTokens,
      });

      const parsed = extractJson<curriculumUnit.UnitJson>(res.content);
      if (!parsed?.blocks?.length) {
        // Retry once with strict suffix.
        const strictRes = await client.chat({
          model,
          messages: [
            { role: ChatRole.USER, content: prompt + '\n\n' + JSON_ONLY_DIRECTIVE },
          ],
          responseFormat: ResponseFormat.JSON_OBJECT,
          temperature: 0.3,
          maxTokens: 4096,
        });

        await recordLedgerEntry({
          endpoint: LedgerEndpoint.UNIT,
          model,
          inputTokens: strictRes.usage.inputTokens,
          outputTokens: strictRes.usage.outputTokens,
        });

        const strictParsed = extractJson<curriculumUnit.UnitJson>(strictRes.content);
        if (!strictParsed?.blocks?.length) {
          throw new Error('unit generation failed — invalid JSON after retry');
        }
        blocks = strictParsed.blocks.map((b) => ({
          id: makeBlockId(),
          kind: b.kind,
          content: b.content,
          regeneratedFrom: null,
          generatedAt: new Date().toISOString(),
        }));
      } else {
        blocks = parsed.blocks.map((b) => ({
          id: makeBlockId(),
          kind: b.kind,
          content: b.content,
          regeneratedFrom: null,
          generatedAt: new Date().toISOString(),
        }));
      }

      // Insert into unit cache (service-role, bypass RLS).
      const { data: cacheInserted } = await admin
        .from('praxis_unit_cache')
        .insert({
          fingerprint: topic.fingerprint,
          locale: topic.locale,
          unit_index: unit.index,
          model_version: modelVersion,
          blocks: blocks.map(({ kind, content }) => ({ kind, content })),
        })
        .select('id')
        .maybeSingle();

      cacheId = cacheInserted?.id ?? null;
    }

    // 6. Write blocks + status to the unit row.
    await supabase
      .from('praxis_units')
      .update({
        status: 'ready',
        blocks: blocks as unknown as Database['public']['Tables']['praxis_units']['Update']['blocks'],
        cache_id: cacheId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', unitId);

    return { unitId, status: 'ready', blocks, cached };
  } catch (err) {
    // On failure, reset status so the learner can retry.
    await supabase
      .from('praxis_units')
      .update({ status: 'failed', updated_at: new Date().toISOString() })
      .eq('id', unitId);
    throw err;
  }
}

async function loadBlocks(
  unitId: string,
  supabase: SupabaseClient<Database>,
): Promise<ContentBlock[]> {
  const { data } = await supabase
    .from('praxis_units')
    .select('blocks')
    .eq('id', unitId)
    .maybeSingle();

  if (!data?.blocks) return [];
  return data.blocks as unknown as ContentBlock[];
}

// ---- regenerate block ------------------------------------------------------

const MAX_INSTRUCTION_CHARS = 500;
const MAX_BLOCK_CONTENT_CHARS = 2000;

export async function regenerateBlock(
  input: RegenerateBlockInput,
): Promise<RegenerateBlockResult> {
  const { unitId, blockId, instruction, learnerId, supabase } = input;

  // 1. Load context.
  const ctx = await loadUnitContext(unitId, learnerId, supabase);
  if (!ctx) throw new UnitNotFoundError(unitId);

  const { unit, topic, outline } = ctx;

  // 2. Find the target block.
  const blocks = await loadBlocks(unitId, supabase);
  // Find the most recent version of this block (in case of prior regens).
  const targetBlock = blocks.find((b) => b.id === blockId);
  if (!targetBlock) throw new BlockNotFoundError(blockId);

  // 3. Build regen prompt.
  await assertBudget();

  const prompt = buildBlockRegenPrompt({
    topic: topic.raw_input,
    locale: topic.locale as PraxisLocale,
    unitTitle: unit.title,
    unitObjective: unit.objective,
    blockKind: targetBlock.kind,
    previousContent: targetBlock.content,
    learnerInstruction: instruction,
    outline,
    unitIndex: unit.index,
  });

  const client = getClient();
  const model = getUniversalModel();

  const res = await client.chat({
    model,
    messages: [{ role: ChatRole.USER, content: prompt }],
    responseFormat: ResponseFormat.JSON_OBJECT,
    temperature: 0.4,
    maxTokens: 1024,
  });

  await recordLedgerEntry({
    endpoint: LedgerEndpoint.UNIT,
    model,
    inputTokens: res.usage.inputTokens,
    outputTokens: res.usage.outputTokens,
  });

  const parsed = extractJson<{ content: string }>(res.content);
  if (!parsed?.content) {
    throw new Error('block regeneration failed — invalid JSON');
  }

  const newBlock: ContentBlock = {
    id: makeBlockId(),
    kind: targetBlock.kind,
    content: parsed.content,
    regeneratedFrom: blockId,
    generatedAt: new Date().toISOString(),
  };

  // 4. Append new block to the unit's blocks array (append-only).
  const updatedBlocks = [...blocks, newBlock];

  await supabase
    .from('praxis_units')
    .update({
      blocks: updatedBlocks as unknown as Database['public']['Tables']['praxis_units']['Update']['blocks'],
      updated_at: new Date().toISOString(),
    })
    .eq('id', unitId);

  return { block: newBlock };
}

// ---- block regen prompt builder -------------------------------------------

function buildBlockRegenPrompt(opts: {
  topic: string;
  locale: PraxisLocale;
  unitTitle: string;
  unitObjective: string;
  blockKind: UnitBlockKind;
  previousContent: string;
  learnerInstruction: string;
  outline: ReadonlyArray<OutlineUnit>;
  unitIndex: number;
}): string {
  return [
    'You are regenerating one content block of a learning unit inside PRAXIS.',
    'The learner is unsatisfied with the current block and has given you a specific instruction.',
    '',
    '## Rules',
    '- Return ONLY a JSON object: { "content": "..." }.',
    '- The content should be the same kind and approximate length as the previous block.',
    '- Follow the learner\'s instruction faithfully.',
    '- Do NOT fabricate statistics, studies, or quotes.',
    '',
    JSON_ONLY_DIRECTIVE,
    '',
    `## Topic: ${clamp(opts.topic, 240)}`,
    `## Unit: ${opts.unitTitle}`,
    `## Objective: ${opts.unitObjective}`,
    `## Block kind: ${opts.blockKind}`,
    '',
    '## Previous content',
    clamp(opts.previousContent, MAX_BLOCK_CONTENT_CHARS),
    '',
    '## Learner instruction',
    clamp(opts.learnerInstruction, MAX_INSTRUCTION_CHARS),
  ].join('\n');
}

// ---- mark complete ---------------------------------------------------------

export async function markUnitComplete(
  unitId: string,
  learnerId: string,
  supabase: SupabaseClient<Database>,
): Promise<void> {
  const ctx = await loadUnitContext(unitId, learnerId, supabase);
  if (!ctx) throw new UnitNotFoundError(unitId);

  await supabase
    .from('praxis_units')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', unitId);
}

