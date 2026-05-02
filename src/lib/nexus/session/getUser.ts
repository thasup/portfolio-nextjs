/**
 * Server-side helper for resolving the current Nexus user.
 *
 * This is the "universal" session resolver for all prototypes.
 * It provides the authenticated user session along with their role and permissions.
 */
import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/praxis/supabase/database.types";
import type { UserRow } from "@/lib/praxis/supabase/tables";

export interface NexusSession {
  userId: string;
  email: string;
  user: UserRow;
}

function readEnv(): { url: string; key: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return { url, key };
}

export async function getUser(): Promise<NexusSession | null> {
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
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser || !authUser.email) return null;

  const { data: userRow, error } = await supabase
    .from("nexus_users")
    .select("*")
    .eq("id", authUser.id)
    .maybeSingle();

  if (error || !userRow) return null;

  return { userId: authUser.id, email: authUser.email, user: userRow };
}

/**
 * Same as `getUser()` but throws when no user is resolved.
 * Use inside server components that live under a route the middleware
 * already gates.
 */
export async function requireUser(): Promise<NexusSession> {
  const session = await getUser();
  if (!session) {
    throw new Error("requireUser: no authenticated user found. Access denied.");
  }
  return session;
}
