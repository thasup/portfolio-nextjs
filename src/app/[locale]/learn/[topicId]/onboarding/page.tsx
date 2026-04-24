/**
 * `/learn/[topicId]/onboarding` — adaptive onboarding questionnaire.
 *
 * Server component verifies ownership and delegates the full flow to
 * the client-side `OnboardingFlow`. Answers land in
 * `praxis_onboarding` with incrementing `version`, and the topic is
 * bumped to `status = 'active'` on first save.
 */
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { OnboardingFlow } from '@/components/praxis/OnboardingFlow';
import { requireLearner } from '@/lib/praxis/session/getLearner';

export const dynamic = 'force-dynamic';

interface OnboardingPageProps {
  params: Promise<{ topicId: string }>;
}

export default async function OnboardingPage({ params }: OnboardingPageProps) {
  const session = await requireLearner();
  const { topicId } = await params;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: topic } = await supabase
    .from('praxis_topics')
    .select('id, title, learner_id, status')
    .eq('id', topicId)
    .maybeSingle();

  if (!topic || topic.learner_id !== session.userId) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <OnboardingFlow topicId={topic.id} />
    </main>
  );
}
