/**
 * PRAXIS middleware session refresh.
 *
 * Invoked by `src/middleware.ts` for every request under `/learn/*` or
 * `/api/praxis/*`. Responsibilities:
 *
 *   1. Refresh the Supabase auth cookies using `@supabase/ssr`'s
 *      cookie-bridge pattern. Running `supabase.auth.getUser()` is what
 *      actually performs the refresh — do NOT interleave other logic
 *      between `createServerClient` and `getUser()`.
 *   2. Redirect unauthenticated traffic on protected paths to
 *      `/learn/login`, preserving locale prefix when present.
 *   3. Leave public PRAXIS paths untouched (`/learn/login`)
 *      so the Google OAuth sign-in page is reachable without a session.
 *
 * This helper does NOT call next-intl. Path-rewriting happens in the
 * outer `middleware.ts` after this returns.
 */
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/lib/praxis/supabase/database.types';

/** Paths under `/learn/*` that bypass the auth gate. */
const PRAXIS_PUBLIC_PATHS: ReadonlyArray<string> = ['/learn/login'];

/** Redirect target for unauthenticated traffic on protected PRAXIS paths. */
const NOT_INVITED_PATH = '/learn/login';

/**
 * Locale-aware path helpers. The site uses next-intl with locale prefix
 * `as-needed`, so Thai routes are `/th/learn/*` while English routes are
 * `/learn/*`. Both must be treated identically for auth purposes.
 */
function stripLocalePrefix(pathname: string): { locale: string | null; rest: string } {
  const match = pathname.match(/^\/(en|th)(\/.*)?$/);
  if (!match) return { locale: null, rest: pathname };
  return { locale: match[1], rest: match[2] ?? '/' };
}

export interface UpdateSessionResult {
  response: NextResponse;
  /** The authenticated user, or `null` if no valid session. */
  userId: string | null;
  /** True if `updateSession` issued a redirect. */
  redirected: boolean;
}

export async function updateSession(request: NextRequest): Promise<UpdateSessionResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // If Supabase isn't configured, let the request pass. The downstream
  // route handlers will surface a 500. This keeps local dev usable on
  // non-PRAXIS portfolio pages.
  if (!supabaseUrl || !supabaseKey) {
    return { response: NextResponse.next({ request }), userId: null, redirected: false };
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Must run immediately after client creation — see @supabase/ssr docs.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { locale, rest } = stripLocalePrefix(request.nextUrl.pathname);
  const isPraxisPath = rest.startsWith('/learn') || rest.startsWith('/api/praxis');
  const isPublicPath = PRAXIS_PUBLIC_PATHS.some(
    (p) => rest === p || rest.startsWith(`${p}/`),
  );

  if (isPraxisPath && !isPublicPath && !user) {
    // API clients get a machine-readable 401; page navigation gets an HTML redirect.
    if (rest.startsWith('/api/')) {
      return {
        response: NextResponse.json(
          { error: { code: 'UNAUTHENTICATED', message: 'Sign-in required' } },
          { status: 401 },
        ),
        userId: null,
        redirected: true,
      };
    }
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = locale ? `/${locale}${NOT_INVITED_PATH}` : NOT_INVITED_PATH;
    redirectUrl.search = '';
    return { response: NextResponse.redirect(redirectUrl), userId: null, redirected: true };
  }

  return { response, userId: user?.id ?? null, redirected: false };
}
