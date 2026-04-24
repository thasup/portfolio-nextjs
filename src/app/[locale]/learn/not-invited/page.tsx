/**
 * `/learn/not-invited` — the landing page for any traffic that hits a
 * PRAXIS route without a valid session. The middleware in
 * `src/middleware.ts` redirects unauthenticated `/learn/*` traffic here.
 *
 * Intentionally minimal: a short, honest explanation of the invite
 * model and a contact link. No sign-in form, no request-access form.
 * FR-001 makes invite-only a deliberate constraint of Phase 1 — this
 * page is the user-facing reflection of that decision.
 */
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export const dynamic = 'force-static';

export default async function NotInvitedPage() {
  const t = await getTranslations('praxis.notInvited');

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-16 text-center">
      <div className="max-w-md space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {t('heading')}
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          {t('body')}
        </p>
        <p className="text-sm text-muted-foreground">
          {t.rich('contact', {
            link: (chunks) => (
              <Link
                href="/contact"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>
    </main>
  );
}
