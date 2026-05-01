/**
 * CapitalOS landing redirect.
 *
 * Redirects to the app dashboard since CapitalOS doesn't have
 * a standalone landing page (it's a tool, not a product pitch).
 */
import { redirect } from "next/navigation";

export default async function CapitalOSPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/prototypes/capital-os/app/dashboard`);
}
