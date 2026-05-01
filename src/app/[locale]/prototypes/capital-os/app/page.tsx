/**
 * CapitalOS app index — redirects to dashboard.
 */
import { redirect } from "next/navigation";

export default async function CapitalOSAppPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/prototypes/capital-os/app/dashboard`);
}
