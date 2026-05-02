/**
 * `/learn/callback` — legacy invite callback. No longer used.
 *
 * Authentication is now handled by Google OAuth via Supabase.
 * The OAuth code exchange happens in `/auth/callback/route.ts`.
 * Redirect anyone landing here to the sign-in page.
 */
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function LegacyCallbackPage() {
  redirect("/learn/login");
}
