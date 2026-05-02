/**
 * Server-side helper used by the `/learn/callback` route to verify that
 * an email is on the invitation allowlist before establishing a session.
 *
 * Uses the service-role admin client because:
 *   - The caller is not yet authenticated (this runs pre-login).
 *   - `praxis_invitations` has RLS enabled without permissive policies,
 *     so only the service role can read it.
 *
 * Invitation validity rules (from `data-model.md` and `contracts/auth.invite.md`):
 *   - Row exists for the email.
 *   - `revoked_at` is null.
 *
 * Token verification (JWT) is handled separately in the callback route
 * itself; this helper only gates on the invitation table.
 */
import "server-only";
import { createAdminClient } from "@/lib/praxis/supabase/admin";
import type { InvitationRow } from "@/lib/praxis/supabase/tables";

export enum InviteFailureReason {
  NOT_FOUND = "not_found",
  REVOKED = "revoked",
  LOOKUP_ERROR = "lookup_error",
}

export class InviteRejectionError extends Error {
  readonly reason: InviteFailureReason;

  constructor(reason: InviteFailureReason, detail?: string) {
    super(
      detail
        ? `Invite rejected: ${reason} — ${detail}`
        : `Invite rejected: ${reason}`,
    );
    this.name = "InviteRejectionError";
    this.reason = reason;
  }
}

/**
 * Throws `InviteRejectionError` unless an active (non-revoked)
 * invitation exists for `email`. Returns the matched row on success.
 *
 * Email matching is case-insensitive; Supabase stores normalised lower
 * case per the `praxis_invitations.email unique` constraint, so we
 * lowercase at the query site for safety.
 */
export async function requireInvite(email: string): Promise<InvitationRow> {
  const normalised = email.trim().toLowerCase();
  if (!normalised) {
    throw new InviteRejectionError(
      InviteFailureReason.NOT_FOUND,
      "empty email",
    );
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("praxis_invitations")
    .select("*")
    .eq("email", normalised)
    .maybeSingle();

  if (error) {
    throw new InviteRejectionError(
      InviteFailureReason.LOOKUP_ERROR,
      error.message,
    );
  }
  if (!data) {
    throw new InviteRejectionError(InviteFailureReason.NOT_FOUND);
  }
  if (data.revoked_at) {
    throw new InviteRejectionError(
      InviteFailureReason.REVOKED,
      data.revoked_at,
    );
  }
  return data;
}
