/**
 * `/learn/callback` — closes the invite → magic-link loop.
 *
 * Flow:
 *   1. User clicks email link → lands here with `?token=<inviteJWT>`.
 *   2. Server-side, we verify the JWT (15-min expiry, HS256).
 *   3. Re-check `praxis_invitations.revoked_at IS NULL` — the JWT alone
 *      is not enough, because an operator may have revoked the invite
 *      between send and click.
 *   4. Use the Supabase admin client to `generateLink({ type: 'magiclink', email })`.
 *   5. Redirect the user to Supabase's verify URL. Supabase sets the
 *      session cookie and redirects back to `${SITE}/learn` per
 *      `redirect_to`.
 *
 * Any failure renders a compact error screen with a path back to
 * `/contact` — no automatic retry, no exposed error details.
 */
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { createAdminClient } from '@/lib/praxis/supabase/admin';
import {
  InviteTokenError,
  InviteTokenVerificationError,
  verifyInviteToken,
} from '@/lib/praxis/invite/token';
import { InviteFailureReason, InviteRejectionError, requireInvite } from '@/lib/praxis/session/requireInvite';

export const dynamic = 'force-dynamic';

enum CallbackErrorKind {
  MISSING_TOKEN = 'missing_token',
  EXPIRED_TOKEN = 'expired_token',
  INVALID_TOKEN = 'invalid_token',
  NOT_INVITED = 'not_invited',
  REVOKED = 'revoked',
  SERVER_ERROR = 'server_error',
}

function classifyTokenError(err: InviteTokenVerificationError): CallbackErrorKind {
  switch (err.code) {
    case InviteTokenError.MISSING:
      return CallbackErrorKind.MISSING_TOKEN;
    case InviteTokenError.EXPIRED:
      return CallbackErrorKind.EXPIRED_TOKEN;
    case InviteTokenError.INVALID:
    case InviteTokenError.MALFORMED:
    default:
      return CallbackErrorKind.INVALID_TOKEN;
  }
}

function classifyInviteError(err: InviteRejectionError): CallbackErrorKind {
  switch (err.reason) {
    case InviteFailureReason.REVOKED:
      return CallbackErrorKind.REVOKED;
    case InviteFailureReason.NOT_FOUND:
      return CallbackErrorKind.NOT_INVITED;
    case InviteFailureReason.LOOKUP_ERROR:
    default:
      return CallbackErrorKind.SERVER_ERROR;
  }
}

async function resolveCallback(token: string | undefined): Promise<CallbackErrorKind | { redirectTo: string }> {
  try {
    const claims = await verifyInviteToken(token);
    await requireInvite(claims.email);

    const admin = createAdminClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
    const redirectTo = `${siteUrl.replace(/\/$/, '')}/learn`;

    const { data, error } = await admin.auth.admin.generateLink({
      type: 'magiclink',
      email: claims.email,
      options: { redirectTo },
    });

    if (error || !data?.properties?.action_link) {
      console.error('[praxis/callback] generateLink failed', error);
      return CallbackErrorKind.SERVER_ERROR;
    }

    return { redirectTo: data.properties.action_link };
  } catch (err) {
    if (err instanceof InviteTokenVerificationError) return classifyTokenError(err);
    if (err instanceof InviteRejectionError) return classifyInviteError(err);
    console.error('[praxis/callback] unexpected error', err);
    return CallbackErrorKind.SERVER_ERROR;
  }
}

interface CallbackPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function CallbackPage({ searchParams }: CallbackPageProps) {
  const { token } = await searchParams;
  const result = await resolveCallback(token);

  if (typeof result !== 'string' && 'redirectTo' in result) {
    redirect(result.redirectTo);
  }

  const t = await getTranslations('praxis.callback');
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-16 text-center">
      <div className="max-w-md space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {t(`${result}.heading` as 'missing_token.heading')}
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          {t(`${result}.body` as 'missing_token.body')}
        </p>
        <Link
          href="/contact"
          className="inline-block text-sm font-medium text-primary hover:underline"
        >
          {t('contactCta')}
        </Link>
      </div>
    </main>
  );
}
