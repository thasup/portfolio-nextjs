/**
 * `/auth/callback` — Supabase OAuth code-exchange handler.
 *
 * Supabase redirects here after the user approves Google OAuth.
 * Responsibilities:
 *   1. Exchange the `code` query param for a session (sets auth cookies).
 *   2. Upsert a `nexus_users` row for first-time sign-ins.
 *   3. Redirect to `/prototypes` on success, or a prototype-specific path.
 *
 * This route is intentionally public — the middleware must not gate it.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createAdminClient } from '@/lib/praxis/supabase/admin';
import type { Database } from '@/lib/praxis/supabase/database.types';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/prototypes';

  if (!code) {
    return NextResponse.redirect(`${origin}/prototypes?error=missing_code`);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('[auth/callback] Supabase env vars missing');
    return NextResponse.redirect(`${origin}/prototypes?error=server_error`);
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

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error('[auth/callback] exchangeCodeForSession failed', exchangeError);
    return NextResponse.redirect(`${origin}/prototypes?error=auth_error`);
  }

  // Fetch the user that was just authenticated.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return NextResponse.redirect(`${origin}/prototypes?error=no_user`);
  }

  // Provision a nexus_users row if this is the first sign-in.
  try {
    const admin = createAdminClient();
    const displayName =
      user.user_metadata?.full_name ??
      user.user_metadata?.name ??
      user.email.split('@')[0];

    await admin.from('nexus_users').upsert(
      {
        id: user.id,
        email: user.email,
        display_name: displayName,
        default_locale: 'en',
        role: 'MEMBER',
      },
      {
        onConflict: 'id',
        ignoreDuplicates: true, // don't overwrite existing profile data
      },
    );
  } catch (err) {
    // Non-fatal: learner row creation failing shouldn't block sign-in.
    // getUser() will return null → requireUser() will throw next render.
    console.error('[auth/callback] nexus_users upsert failed', err);
  }

  const redirectUrl = new URL(next, origin);
  const redirectResponse = NextResponse.redirect(redirectUrl);

  // Copy session cookies onto the redirect response so the browser stores them.
  for (const cookie of response.cookies.getAll()) {
    redirectResponse.cookies.set(cookie);
  }

  return redirectResponse;
}
