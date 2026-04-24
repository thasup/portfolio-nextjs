/**
 * `/learn/new` — blank-canvas entry for a new topic.
 *
 * The middleware + `requireLearner()` guarantee an authenticated learner
 * by the time this renders. Server side we only resolve the locale and
 * hand off to the client-side `NewTopicFlow` orchestrator.
 */
import { NewTopicFlow } from '@/components/praxis/NewTopicFlow';
import { requireLearner } from '@/lib/praxis/session/getLearner';
import { PraxisLocale } from '@/lib/praxis/prompts/types';

export const dynamic = 'force-dynamic';

interface NewTopicPageProps {
  params: Promise<{ locale: string }>;
}

export default async function NewTopicPage({ params }: NewTopicPageProps) {
  await requireLearner();
  const { locale } = await params;
  const praxisLocale = locale === 'th' ? PraxisLocale.TH : PraxisLocale.EN;

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <NewTopicFlow locale={praxisLocale} />
    </main>
  );
}
