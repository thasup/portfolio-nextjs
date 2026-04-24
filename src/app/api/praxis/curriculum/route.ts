/**
 * `POST /api/praxis/curriculum` — outline + accept.
 *
 * Spec: `specs/010-praxis-learning-platform/contracts/curriculum.generate.md`.
 *
 * All business logic lives in `src/lib/praxis/curriculum/service.ts`.
 * This handler is only:
 *   1. Parse + validate the request with zod.
 *   2. Resolve the current learner (already gated by middleware).
 *   3. Dispatch to the service.
 *   4. Format responses per contract.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { getLearner } from '@/lib/praxis/session/getLearner';
import {
  OutlineUnit,
  getOrGenerateOutline,
  outlineEditedMaterially,
  persistAcceptedOutline,
  runScopeGuardrail,
} from '@/lib/praxis/curriculum/service';
import { fingerprint, titleFromRawInput } from '@/lib/praxis/cache/topicFingerprint';
import { BudgetExceededError } from '@/lib/praxis/openrouter/ledger';
import { PraxisLocale, ScopeCategory } from '@/lib/praxis/prompts/types';

export const runtime = 'nodejs';

const LocaleSchema = z.nativeEnum(PraxisLocale);

const OutlineBodySchema = z.object({
  action: z.literal('outline'),
  rawInput: z.string().trim().min(3).max(240),
  locale: LocaleSchema.default(PraxisLocale.EN),
});

const AcceptUnitSchema = z.object({
  index: z.number().int().min(1),
  title: z.string().min(1).max(120),
  objective: z.string().min(1).max(280),
  summary: z.string().min(1).max(640),
});

const AcceptBodySchema = z.object({
  action: z.literal('accept'),
  fingerprint: z.string().regex(/^sha1-[a-f0-9]{40}$/),
  locale: LocaleSchema.default(PraxisLocale.EN),
  rawInput: z.string().trim().min(3).max(240),
  editedUnits: z.array(AcceptUnitSchema).min(3).max(7).optional(),
});

const BodySchema = z.discriminatedUnion('action', [OutlineBodySchema, AcceptBodySchema]);

function errorResponse(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  // ---- auth ------------------------------------------------------------
  const session = await getLearner();
  if (!session) {
    return errorResponse(401, 'NOT_AUTHENTICATED', 'Sign-in required');
  }

  // ---- permission check ------------------------------------------------
  if (!session.learner.can_generate_topics) {
    return errorResponse(403, 'GENERATION_NOT_ALLOWED', 'Topic generation is not enabled for your account. Contact admin for access.');
  }

  // ---- parse -----------------------------------------------------------
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await request.json());
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid body';
    return errorResponse(400, 'INVALID_BODY', message);
  }

  try {
    const preferences = session.learner.model_preferences;
    if (body.action === 'outline') return await handleOutline(body, preferences);
    return await handleAccept(body, session.userId, preferences);
  } catch (err) {
    if (err instanceof BudgetExceededError) {
      return errorResponse(503, 'BUDGET_EXCEEDED', err.message);
    }
    const message = err instanceof Error ? err.message : 'Upstream failure';
    console.error('[praxis/curriculum] unhandled', err);
    return errorResponse(502, 'UPSTREAM_FAILED', message);
  }
}

async function handleOutline(
  body: z.infer<typeof OutlineBodySchema>,
  preferences: unknown,
) {
  const topicFingerprint = fingerprint(body.rawInput);

  // 1. Guardrail.
  const guard = await runScopeGuardrail({
    rawInput: body.rawInput,
    locale: body.locale,
    preferences: preferences as { guardrail?: string } | null,
  });
  if (!guard.admitted) {
    return NextResponse.json(
      { admitted: false, category: guard.category, explanation: guard.explanation },
      { status: 200 },
    );
  }

  // 2. Outline (cache-aware).
  const outline = await getOrGenerateOutline({
    rawInput: body.rawInput,
    fingerprint: topicFingerprint,
    locale: body.locale,
    preferences: preferences as { curriculum?: string } | null,
  });

  return NextResponse.json(
    {
      admitted: true,
      topic: {
        fingerprint: topicFingerprint,
        title: titleFromRawInput(body.rawInput),
        rawInput: body.rawInput,
        locale: body.locale,
      },
      outline: {
        cached: outline.cached,
        modelVersion: outline.modelVersion,
        units: outline.units,
      },
    },
    { status: 200 },
  );
}

async function handleAccept(
  body: z.infer<typeof AcceptBodySchema>,
  learnerId: string,
  preferences: unknown,
) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Dup check: a learner accepting the same topic twice should get 409.
  const { data: existing, error: existErr } = await supabase
    .from('praxis_topics')
    .select('id')
    .eq('learner_id', learnerId)
    .eq('fingerprint', body.fingerprint)
    .in('status', ['outline_ready', 'active'])
    .maybeSingle();
  if (existErr) {
    return errorResponse(502, 'UPSTREAM_FAILED', existErr.message);
  }
  if (existing) {
    return errorResponse(409, 'TOPIC_EXISTS', 'You already accepted this topic');
  }

  // Re-resolve the cached outline.
  const outline = await getOrGenerateOutline({
    rawInput: body.rawInput,
    fingerprint: body.fingerprint,
    locale: body.locale,
    preferences: preferences as { curriculum?: string } | null,
  });

  // Reconcile with edits.
  let finalUnits: OutlineUnit[] = outline.units;
  let edited = false;
  if (body.editedUnits?.length) {
    finalUnits = body.editedUnits
      .slice()
      .sort((a, b) => a.index - b.index)
      .map((u, i) => ({ ...u, index: i + 1 }));
    edited = outlineEditedMaterially(outline.units, finalUnits);
  }

  const persisted = await persistAcceptedOutline({
    learnerId,
    rawInput: body.rawInput,
    title: titleFromRawInput(body.rawInput),
    fingerprint: body.fingerprint,
    locale: body.locale,
    units: finalUnits,
    curriculumId: outline.cacheRowId,
    edited,
    supabase,
  });

  return NextResponse.json(
    {
      topicId: persisted.topicId,
      curriculumId: persisted.curriculumId,
      units: persisted.units,
    },
    { status: 201 },
  );
}
