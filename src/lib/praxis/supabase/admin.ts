/**
 * Service-role Supabase client.
 *
 * Used exclusively by:
 *   - The invite endpoint (`POST /api/praxis/invite`) — admin `generateLink`.
 *   - The callback route (`/learn/callback`) — invite allowlist lookup
 *     + learner row provisioning.
 *   - Server-side code that writes to the shared caches
 *     (`praxis_curriculum_cache`, `praxis_unit_cache`) and the spend
 *     ledger, which bypass RLS by design.
 *
 * NEVER import this module from a client component or a page. The
 * service-role key grants full database access.
 */
import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/praxis/supabase/database.types";

let cached: SupabaseClient<Database> | null = null;

/**
 * Returns a memoised Supabase client authenticated with the service-role key.
 *
 * @throws if either `NEXT_PUBLIC_SUPABASE_URL` or
 *   `SUPABASE_SERVICE_ROLE_KEY` is not configured. Route handlers should
 *   catch this and fail with a 500 — a missing service-role key is an
 *   operator error, not a user error.
 */
export function createAdminClient() {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error("Supabase admin: NEXT_PUBLIC_SUPABASE_URL is not set");
  }
  if (!serviceRoleKey) {
    throw new Error("Supabase admin: SUPABASE_SERVICE_ROLE_KEY is not set");
  }

  cached = createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        "X-Client-Info": "praxis-admin",
      },
    },
  });
  return cached;
}
