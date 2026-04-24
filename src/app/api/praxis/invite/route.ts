/**
 * `POST /api/praxis/invite` — admin-only invitation minter.
 *
 * Spec: `specs/010-praxis-learning-platform/contracts/auth.invite.md`.
 *
 * Authorization:
 *   - Requires `x-praxis-admin-token` header equal to env `PRAXIS_ADMIN_TOKEN`.
 *   - Never relies on Supabase session — this endpoint is the entry
 *     point, called before a learner has any session.
 *
 * Side effects:
 *   1. Inserts a row into `praxis_invitations` (or reuses an existing
 *      active row — `ALREADY_INVITED` is a 400, not idempotent-ok).
 *   2. Mints a 15-minute HS256 JWT with `{ email, invitation_id }`.
 *   3. Emails the learner a magic link via Resend.
 *
 * No spend ledger entry — email is free tier; generation-cost tracking
 * is reserved for LLM calls.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/praxis/supabase/admin';
import { sendInvitationEmail, EmailDeliveryStatus } from '@/lib/praxis/email/resend';
import { mintInviteToken } from '@/lib/praxis/invite/token';

export const runtime = 'nodejs';

const BodySchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  note: z.string().max(200).optional(),
});

/** Consistent error-envelope shape — also used by the chat endpoint later. */
function errorResponse(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  // ---- 1. Authorize ------------------------------------------------------
  const adminToken = process.env.PRAXIS_ADMIN_TOKEN;
  if (!adminToken) {
    return errorResponse(500, 'MISCONFIGURED', 'PRAXIS_ADMIN_TOKEN is not set on the server');
  }
  const provided = request.headers.get('x-praxis-admin-token');
  if (!provided || provided !== adminToken) {
    return errorResponse(401, 'BAD_ADMIN_TOKEN', 'Admin token missing or incorrect');
  }

  // ---- 2. Validate body --------------------------------------------------
  let payload: z.infer<typeof BodySchema>;
  try {
    const json = await request.json();
    payload = BodySchema.parse(json);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid request body';
    return errorResponse(400, 'INVALID_EMAIL', message);
  }

  // ---- 3. Upsert invitation row -----------------------------------------
  const admin = createAdminClient();

  // Check for existing active invitation first. The table has a UNIQUE
  // constraint on `email`, so a simple insert would collide on repeated
  // sends. We look up by email and branch on `revoked_at`.
  const { data: existing, error: lookupErr } = await admin
    .from('praxis_invitations')
    .select('id, email, invited_at, revoked_at, note')
    .eq('email', payload.email)
    .maybeSingle();

  if (lookupErr) {
    return errorResponse(500, 'DB_LOOKUP_FAILED', lookupErr.message);
  }

  let invitationId: string;
  let invitedAt: string;
  let note: string | null;

  if (existing && !existing.revoked_at) {
    // Keep the existing record and resend the email. Still fail the
    // contract-defined ALREADY_INVITED for honesty; operator can revoke
    // and re-invite if they really want a fresh row.
    return errorResponse(400, 'ALREADY_INVITED', `An active invitation already exists for ${payload.email}`);
  }

  if (existing?.revoked_at) {
    // Resurrect the row by clearing revoked_at and updating the note.
    const { data: updated, error: updateErr } = await admin
      .from('praxis_invitations')
      .update({ revoked_at: null, note: payload.note ?? existing.note ?? null })
      .eq('id', existing.id)
      .select('id, invited_at, note')
      .single();
    if (updateErr || !updated) {
      return errorResponse(500, 'DB_UPDATE_FAILED', updateErr?.message ?? 'no row returned');
    }
    invitationId = updated.id;
    invitedAt = updated.invited_at;
    note = updated.note;
  } else {
    // Fresh insert. `invited_by` is required; without a Supabase session
    // we don't have an authenticated UID to attribute. Phase 1 uses a
    // stable system UUID when one is configured, otherwise falls back to
    // the invitee's own row once it exists — but that's a chicken-and-egg
    // for the first invite. Require the operator to set it via env.
    const invitedBy = process.env.PRAXIS_INVITER_USER_ID;
    if (!invitedBy) {
      return errorResponse(
        500,
        'MISCONFIGURED',
        'PRAXIS_INVITER_USER_ID is not set. Add a seed auth.users row and export its id.',
      );
    }

    const { data: inserted, error: insertErr } = await admin
      .from('praxis_invitations')
      .insert({
        email: payload.email,
        invited_by: invitedBy,
        note: payload.note ?? null,
      })
      .select('id, invited_at, note')
      .single();
    if (insertErr || !inserted) {
      return errorResponse(500, 'DB_INSERT_FAILED', insertErr?.message ?? 'no row returned');
    }
    invitationId = inserted.id;
    invitedAt = inserted.invited_at;
    note = inserted.note;
  }

  // ---- 4. Mint JWT + send email -----------------------------------------
  const token = await mintInviteToken({ email: payload.email, invitationId });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const actionUrl = `${siteUrl.replace(/\/$/, '')}/learn/callback?token=${encodeURIComponent(token)}`;

  const delivery = await sendInvitationEmail({
    to: payload.email,
    actionUrl,
  });

  if (delivery.status === EmailDeliveryStatus.FAILED) {
    // Row persists so operator can retry; surface 502 per contract.
    return errorResponse(502, 'RESEND_FAILED', delivery.error ?? 'email provider error');
  }

  return NextResponse.json(
    {
      invitation: {
        id: invitationId,
        email: payload.email,
        invitedAt,
        note,
      },
      deliveryStatus: delivery.status,
    },
    { status: 201 },
  );
}
