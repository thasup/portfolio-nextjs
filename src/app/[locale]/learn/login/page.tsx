'use client';

/**
 * `/learn/login` — Google OAuth sign-in entry point for PRAXIS.
 *
 * Middleware redirects any unauthenticated `/learn/*` traffic here.
 * On sign-in success Supabase calls `/auth/callback`, which provisions
 * the learner row and redirects to `/learn`.
 */
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

/**
 * Resolve the base URL for the current environment.
 * - In production: uses NEXT_PUBLIC_SITE_URL.
 * - In local dev / Vercel preview: falls back to the browser origin so
 *   the OAuth callback hits the running server, not the production domain.
 *
 * @see https://supabase.com/docs/guides/auth/redirect-urls#vercel-preview-urls
 */
function getURL(): string {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    'http://localhost:3000';

  // Vercel's NEXT_PUBLIC_VERCEL_URL doesn't include protocol.
  url = url.startsWith('http') ? url : `https://${url}`;
  // Ensure trailing slash.
  url = url.endsWith('/') ? url : `${url}/`;

  // In the browser, prefer origin so local dev always redirects locally.
  if (typeof window !== 'undefined') {
    url = `${window.location.origin}/`;
  }

  return url;
}

async function signInWithGoogle() {
  const supabase = createClient();
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${getURL()}auth/callback`,
    },
  });
}

export default function LearnLoginPage() {
  return (
    <main
      id="learn-login-page"
      className="flex min-h-[100svh] flex-col items-center justify-center bg-background px-6"
    >
      <div className="w-full max-w-sm space-y-8 text-center">
        {/* Logo / wordmark */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            PRAXIS
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Learn anything.
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            AI-powered learning, structured around what you actually want to master.
          </p>
        </div>

        {/* Sign-in card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <p className="mb-6 text-sm text-muted-foreground">
            Sign in to access your learning library.
          </p>
          <button
            id="google-signin-btn"
            type="button"
            onClick={signInWithGoogle}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-muted hover:shadow-md active:scale-[0.98]"
          >
            {/* Google "G" SVG */}
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                fill="#4285F4"
              />
              <path
                d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                fill="#34A853"
              />
              <path
                d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                fill="#FBBC05"
              />
              <path
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>
        </div>

        <p className="text-xs text-muted-foreground">
          PRAXIS is a personal learning tool.{' '}
          <Link href="/contact" className="underline underline-offset-4 hover:text-foreground">
            Get in touch
          </Link>{' '}
          if you&apos;d like access.
        </p>
      </div>
    </main>
  );
}
