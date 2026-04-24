import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/praxis/session/updateSession';

const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'th'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
});

/**
 * Strips an optional locale prefix (`/en` or `/th`) so subsequent
 * matching is locale-agnostic. Mirrors the helper in
 * `src/lib/praxis/session/updateSession.ts` — kept local to avoid a
 * second client-bundle dependency on `server-only` marked code.
 */
function stripLocale(pathname: string): string {
  const match = pathname.match(/^\/(en|th)(\/.*)?$/);
  return match ? match[2] ?? '/' : pathname;
}

function isPraxisPath(pathname: string): boolean {
  const rest = stripLocale(pathname);
  return rest.startsWith('/learn') || rest.startsWith('/api/praxis');
}

function isApiPath(pathname: string): boolean {
  return stripLocale(pathname).startsWith('/api/');
}

/**
 * Paths that must bypass BOTH the auth gate AND next-intl locale
 * rewriting. The `/auth/callback` route handler lives at
 * `app/auth/callback/route.ts` (outside `[locale]`), so next-intl
 * must never touch it — otherwise it rewrites to `/en/auth/callback`
 * which doesn't exist and yields a 404.
 */
function isAuthApiPath(pathname: string): boolean {
  return pathname.startsWith('/auth/');
}

/**
 * Copies refreshed Supabase auth cookies from the session response onto
 * the downstream (next-intl) response, so a single round-trip both
 * rewrites URLs for i18n and persists the refreshed auth token.
 */
function mergeCookies(from: NextResponse, to: NextResponse): NextResponse {
  for (const cookie of from.cookies.getAll()) {
    to.cookies.set(cookie);
  }
  return to;
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // 0. Auth callback routes live outside [locale] — never touch them.
  //    /auth/callback is the Supabase OAuth code-exchange handler.
  if (isAuthApiPath(pathname)) {
    return NextResponse.next({ request });
  }

  // 1. API routes never go through next-intl. Only /api/praxis/* needs
  //    the auth gate; any other /api/* path short-circuits.
  if (isApiPath(pathname)) {
    if (!isPraxisPath(pathname)) {
      return NextResponse.next({ request });
    }
    const { response } = await updateSession(request);
    return response;
  }

  // 2. PRAXIS page routes: run the auth gate first, then defer to
  //    next-intl for locale rewrites if we weren't redirected.
  if (isPraxisPath(pathname)) {
    const { response: authResponse, redirected } = await updateSession(request);
    if (redirected) return authResponse;
    const intlResponse = intlMiddleware(request);
    return mergeCookies(authResponse, intlResponse);
  }

  // 3. All other pages: vanilla next-intl, unchanged from previous behaviour.
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Every non-static, non-Next-internal path. The middleware itself
    // branches on `/api/*` vs page routes, so we don't pre-filter here.
    '/((?!_next|_vercel|.*\\..*).*)',
  ],
};
