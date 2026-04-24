/**
 * Server-side helper for resolving the current learner.
 *
 * Usable from server components (`app/(praxis)/learn/**`) and route
 * handlers (`app/api/praxis/**`). Relies on the existing
 * `@/utils/supabase/server` client and the cookie store.
 *
 * Returns `null` when:
 *   - No session cookie is present.
 *   - Session cookie is invalid / expired.
 *   - Auth user exists but has no corresponding `praxis_learners` row.
 *     (This can only happen transiently during the invite callback
 *      handshake; steady state is 1:1.)
 *
 * Callers that must NOT be reachable by anonymous traffic should assume
 * `null` means "redirect to /learn/not-invited" and handle accordingly.
 * The middleware in `src/middleware.ts` already redirects, so most
 * server components can treat `null` as an invariant violation and
 * throw.
 */
import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/lib/praxis/supabase/database.types';
import type { LearnerRow } from '@/lib/praxis/supabase/tables';

export interface PraxisSession {
  userId: string;
  email: string;
  learner: LearnerRow;
}

function readEnv(): { url: string; key: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return { url, key };
}

export async function getLearner(): Promise<PraxisSession | null> {
  const env = readEnv();
  if (!env) return null;

  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(env.url, env.key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // setAll is called in server components where cookie mutation
          // is disallowed. Middleware handles session refresh; ignore.
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) return null;

  const { data: learner, error } = await supabase
    .from('praxis_learners')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error || !learner) return null;

  return { userId: user.id, email: user.email, learner };
}

/**
 * Same as `getLearner()` but throws when no learner is resolved.
 * Use inside server components that live under a route the middleware
 * already gates, where `null` indicates a programming error rather than
 * an auth state.
 */
export async function requireLearner(): Promise<PraxisSession> {
  const session = await getLearner();
  if (!session) {
    throw new Error(
      'requireLearner: no authenticated learner. The middleware should have redirected to /learn/not-invited.',
    );
  }
  return session;
}
