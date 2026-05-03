/**
 * CapitalOS — auth helper for API routes.
 *
 * Verifies the request is from an authenticated ADMIN user.
 * CapitalOS is a personal financial tool — only the owner can access data.
 */
import "server-only";
import { getUser } from "@/lib/nexus/session/getUser";
import type { NexusSession } from "@/lib/nexus/session/getUser";
import { NextResponse } from "next/server";

export interface AuthResult {
  session: NexusSession;
}

/**
 * Authenticate and authorize a CapitalOS API request.
 * Returns the session or a 401/403 NextResponse.
 */
export async function requireCapitalOSAuth(): Promise<
  AuthResult | NextResponse
> {
  const session = await getUser();

  if (!session) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "CapitalOS requires ADMIN access" },
      { status: 403 },
    );
  }

  return { session };
}

/** Type guard to check if auth result is a session (not an error response). */
export function isAuthed(
  result: AuthResult | NextResponse,
): result is AuthResult {
  return "session" in result;
}
