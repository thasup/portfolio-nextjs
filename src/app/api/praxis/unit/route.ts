/**
 * `POST /api/praxis/unit` — unit generation + block regeneration.
 *
 * Spec: `specs/010-praxis-learning-platform/contracts/unit.generate.md`.
 *
 * All business logic lives in `src/lib/praxis/unit/service.ts`.
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
import { BudgetExceededError } from '@/lib/praxis/openrouter/ledger';
import {
  BlockNotFoundError,
  UnitGeneratingError,
  UnitNotFoundError,
  UnitNotOwnedError,
  generateUnit,
  markUnitComplete,
  regenerateBlock,
} from '@/lib/praxis/unit/service';

export const runtime = 'nodejs';

const GenerateBodySchema = z.object({
  action: z.literal('generate'),
  unitId: z.string().uuid(),
});

const RegenerateBlockBodySchema = z.object({
  action: z.literal('regenerate_block'),
  unitId: z.string().uuid(),
  blockId: z.string().uuid(),
  instruction: z.string().trim().min(1).max(500),
});

const CompleteBodySchema = z.object({
  action: z.literal('complete'),
  unitId: z.string().uuid(),
});

const BodySchema = z.discriminatedUnion('action', [
  GenerateBodySchema,
  RegenerateBlockBodySchema,
  CompleteBodySchema,
]);

function errorResponse(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  // ---- auth ---------------------------------------------------------------
  const session = await getLearner();
  if (!session) {
    return errorResponse(401, 'NOT_AUTHENTICATED', 'Sign-in required');
  }

  // ---- parse --------------------------------------------------------------
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await request.json());
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid body';
    return errorResponse(400, 'INVALID_BODY', message);
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  try {
    switch (body.action) {
      case 'generate': {
        const result = await generateUnit({
          unitId: body.unitId,
          learnerId: session.userId,
          supabase,
        });
        return NextResponse.json({
          unit: {
            id: result.unitId,
            status: result.status,
            blocks: result.blocks,
            cached: result.cached,
          },
        });
      }

      case 'regenerate_block': {
        const result = await regenerateBlock({
          unitId: body.unitId,
          blockId: body.blockId,
          instruction: body.instruction,
          learnerId: session.userId,
          supabase,
        });
        return NextResponse.json({
          block: {
            id: result.block.id,
            kind: result.block.kind,
            content: result.block.content,
            regeneratedFrom: result.block.regeneratedFrom,
          },
        });
      }

      case 'complete': {
        await markUnitComplete(body.unitId, session.userId, supabase);
        return NextResponse.json({ status: 'completed' });
      }
    }
  } catch (err) {
    if (err instanceof UnitNotFoundError) {
      return errorResponse(404, 'UNIT_NOT_FOUND', err.message);
    }
    if (err instanceof UnitNotOwnedError) {
      return errorResponse(403, 'NOT_OWNER', err.message);
    }
    if (err instanceof UnitGeneratingError) {
      return errorResponse(409, 'UNIT_GENERATING', err.message);
    }
    if (err instanceof BlockNotFoundError) {
      return errorResponse(404, 'BLOCK_NOT_FOUND', err.message);
    }
    if (err instanceof BudgetExceededError) {
      return errorResponse(503, 'BUDGET_EXCEEDED', err.message);
    }
    const message = err instanceof Error ? err.message : 'Upstream failure';
    console.error('[praxis/unit] unhandled', err);
    return errorResponse(502, 'UPSTREAM_FAILED', message);
  }
}
