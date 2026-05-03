import { NewTopicFlow } from "@/components/praxis/NewTopicFlow";
import { requireUser } from "@/lib/nexus/session/getUser";
import { PraxisLocale } from "@/lib/praxis/prompts/types";

export const dynamic = "force-dynamic";

interface NewTopicPageProps {
  params: Promise<{ locale: string }>;
}

export default async function NewTopicPage({ params }: NewTopicPageProps) {
  await requireUser();

  const { locale } = await params;
  const praxisLocale = locale === "th" ? PraxisLocale.TH : PraxisLocale.EN;

  return <NewTopicFlow locale={praxisLocale} />;
}
