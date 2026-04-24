/**
 * `POST /api/praxis/onboarding` — generate or save.
 *
 * Spec: `specs/010-praxis-learning-platform/contracts/onboarding.generate.md`.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { getLearner } from '@/lib/praxis/session/getLearner';
import {
  generateQuestions,
  loadTopicContext,
  saveAnswers,
} from '@/lib/praxis/onboarding/service';
import { BudgetExceededError } from '@/lib/praxis/openrouter/ledger';
import { OnboardingInputType } from '@/lib/praxis/prompts/types';

export const runtime = 'nodejs';

const TopicIdSchema = z.string().uuid();

const GenerateBodySchema = z.object({
  action: z.literal('generate_questions'),
  topicId: TopicIdSchema,
});

const AnswerSchema = z.object({
  questionId: z.string().min(1).max(30),
  prompt: z.string().min(1).max(200),
  answer: z.string().min(1).max(4000),
  helperText: z.string().max(200).nullable().optional(),
  inputType: z.nativeEnum(OnboardingInputType),
});

const SaveBodySchema = z.object({
  action: z.literal('save_answers'),
  topicId: TopicIdSchema,
  answers: z.array(AnswerSchema).min(1).max(10),
});

const BodySchema = z.discriminatedUnion('action', [GenerateBodySchema, SaveBodySchema]);

function errorResponse(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getLearner();
  if (!session) return errorResponse(401, 'NOT_AUTHENTICATED', 'Sign-in required');

  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await request.json());
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid body';
    return errorResponse(400, 'INVALID_BODY', message);
  }

  try {
    if (body.action === 'generate_questions') {
      return await handleGenerate(body, session.userId);
    }
    return await handleSave(body, session.userId);
  } catch (err) {
    if (err instanceof BudgetExceededError) {
      return errorResponse(503, 'BUDGET_EXCEEDED', err.message);
    }
    const message = err instanceof Error ? err.message : 'Upstream failure';
    console.error('[praxis/onboarding] unhandled', err);
    return errorResponse(502, 'UPSTREAM_FAILED', message);
  }
}

async function handleGenerate(
  body: z.infer<typeof GenerateBodySchema>,
  learnerId: string,
) {
  const context = await loadTopicContext(body.topicId, learnerId);
  if (!context) {
    return errorResponse(404, 'TOPIC_NOT_FOUND', 'Topic not found or not owned by caller');
  }

  const questions = await generateQuestions({
    topic: context.title,
    locale: context.locale,
    outline: context.outline,
  });

  return NextResponse.json({ questions }, { status: 200 });
}

async function handleSave(
  body: z.infer<typeof SaveBodySchema>,
  learnerId: string,
) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Ownership check — RLS would handle it too, but a clean 404 beats a
  // silent 0-row insert failure.
  const { data: topic, error: topicErr } = await supabase
    .from('praxis_topics')
    .select('id, learner_id')
    .eq('id', body.topicId)
    .maybeSingle();
  if (topicErr) return errorResponse(502, 'UPSTREAM_FAILED', topicErr.message);
  if (!topic) return errorResponse(404, 'TOPIC_NOT_FOUND', 'Topic not found');
  if (topic.learner_id !== learnerId) return errorResponse(403, 'NOT_OWNER', 'Topic not owned by caller');

  const normalised = body.answers.map((a) => ({
    ...a,
    helperText: a.helperText ?? null,
  }));

  const saved = await saveAnswers({
    learnerId,
    topicId: body.topicId,
    answers: normalised,
    supabase,
  });

  return NextResponse.json(
    {
      profile: {
        id: saved.profileId,
        version: saved.version,
        topicId: saved.topicId,
      },
    },
    { status: 201 },
  );
}
