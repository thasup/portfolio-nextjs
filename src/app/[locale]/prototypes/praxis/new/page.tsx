/**
 * `/learn/new` — blank-canvas entry for a new topic.
 *
 * The middleware + `requireUser()` guarantee an authenticated learner
 * by the time this renders. Server side we only resolve the locale and
 * hand off to the client-side `NewTopicFlow` orchestrator.
 */
import { redirect } from 'next/navigation';
import { NewTopicFlow } from '@/components/praxis/NewTopicFlow';
import { requireUser } from '@/lib/nexus/session/getUser';
import { PraxisLocale } from '@/lib/praxis/prompts/types';

export const dynamic = 'force-dynamic';

interface NewTopicPageProps {
  params: Promise<{ locale: string }>;
}

export default async function NewTopicPage({ params }: NewTopicPageProps) {
  const session = await requireUser();

  const { locale } = await params;
  const praxisLocale = locale === 'th' ? PraxisLocale.TH : PraxisLocale.EN;

  return <NewTopicFlow locale={praxisLocale} />;
}

