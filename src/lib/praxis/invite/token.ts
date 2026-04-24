/**
 * Short-lived invite JWTs.
 *
 * Flow (see `contracts/auth.invite.md`):
 *   1. `POST /api/praxis/invite` inserts into `praxis_invitations`, mints
 *      a 15-minute JWT with this module, then emails the learner a link
 *      to `${NEXT_PUBLIC_SITE_URL}/learn/callback?token=<jwt>`.
 *   2. `/learn/callback` verifies the JWT, re-checks the invitation row
 *      is still active (`revoked_at is null`), and forwards to a
 *      Supabase-minted magic link that establishes the session.
 *
 * Signed with HS256 using `PRAXIS_INVITE_SECRET`. Bumping the secret
 * invalidates all outstanding tokens immediately.
 */
import 'server-only';
import { jwtVerify, SignJWT } from 'jose';

const ALGORITHM = 'HS256' as const;
const EXPIRES_IN_SECONDS = 15 * 60;
const ISSUER = 'praxis';
const AUDIENCE = 'praxis.callback';

export interface InviteTokenClaims {
  email: string;
  invitationId: string;
}

/** Internal JWT payload. Kept separate so the public claims stay flat. */
interface InternalPayload {
  email: string;
  inv: string; // invitation_id — short claim name to keep the JWT small
}

function readSecret(): Uint8Array {
  const secret = process.env.PRAXIS_INVITE_SECRET;
  if (!secret) {
    throw new Error(
      'PRAXIS_INVITE_SECRET is not set. Generate one with `npm run praxis:secret` and add it to .env.local.',
    );
  }
  if (secret.length < 32) {
    throw new Error('PRAXIS_INVITE_SECRET must be at least 32 characters.');
  }
  return new TextEncoder().encode(secret);
}

export async function mintInviteToken(claims: InviteTokenClaims): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload: InternalPayload = { email: claims.email, inv: claims.invitationId };
  return await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: ALGORITHM })
    .setIssuedAt(now)
    .setExpirationTime(now + EXPIRES_IN_SECONDS)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .sign(readSecret());
}

export enum InviteTokenError {
  MISSING = 'missing',
  INVALID = 'invalid',
  EXPIRED = 'expired',
  MALFORMED = 'malformed',
}

export class InviteTokenVerificationError extends Error {
  readonly code: InviteTokenError;

  constructor(code: InviteTokenError, cause?: unknown) {
    super(`Invite token ${code}`);
    this.name = 'InviteTokenVerificationError';
    this.code = code;
    if (cause instanceof Error) this.cause = cause;
  }
}

export async function verifyInviteToken(token: string | null | undefined): Promise<InviteTokenClaims> {
  if (!token) throw new InviteTokenVerificationError(InviteTokenError.MISSING);
  try {
    const { payload } = await jwtVerify(token, readSecret(), {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    const email = typeof payload.email === 'string' ? payload.email : null;
    const invitationId = typeof payload.inv === 'string' ? payload.inv : null;
    if (!email || !invitationId) {
      throw new InviteTokenVerificationError(InviteTokenError.MALFORMED);
    }
    return { email, invitationId };
  } catch (err) {
    if (err instanceof InviteTokenVerificationError) throw err;
    const message = err instanceof Error ? err.message.toLowerCase() : '';
    if (message.includes('exp')) {
      throw new InviteTokenVerificationError(InviteTokenError.EXPIRED, err);
    }
    throw new InviteTokenVerificationError(InviteTokenError.INVALID, err);
  }
}
