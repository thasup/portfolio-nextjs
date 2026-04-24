/**
 * `/learn/[topicId]` — topic hub (module overview).
 *
 * Phase 1 scope:
 *   - If onboarding incomplete, redirect to `/onboarding`.
 *   - List units with their status (pending / ready / completed).
 *   - "Edit onboarding" affordance in the header (T-035).
 *   - Link to full-screen Nori (`/learn/[topicId]/mate`) — Week 5.
 *
 * The full-screen Nori and block-level rendering land in Weeks 4–5.
 * For now, clicking a unit simply goes to `/learn/[topicId]/[unit]`
 * which will 404 until T-038 ships — that's expected during Week 3.
 */
import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { requireLearner } from '@/lib/praxis/session/getLearner';

export const dynamic = 'force-dynamic';

interface TopicPageProps {
  params: Promise<{ topicId: string }>;
}

interface TopicUnit {
  id: string;
  index: number;
  title: string;
  objective: string;
  status: 'pending' | 'ready' | 'completed';
}

export default async function TopicPage({ params }: TopicPageProps) {
  const session = await requireLearner();
  const { topicId } = await params;
  const t = await getTranslations('praxis.topic');

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const [{ data: topic }, { data: units }, { data: onboarding }] = await Promise.all([
    supabase
      .from('praxis_topics')
      .select('id, title, status, learner_id')
      .eq('id', topicId)
      .maybeSingle(),
    supabase
      .from('praxis_units')
      .select('id, index, title, objective, status')
      .eq('topic_id', topicId)
      .order('index', { ascending: true }),
    supabase
      .from('praxis_onboarding')
      .select('id')
      .eq('topic_id', topicId)
      .eq('learner_id', session.userId)
      .limit(1)
      .maybeSingle(),
  ]);

  if (!topic || topic.learner_id !== session.userId) notFound();

  // First-time hub visit without onboarding → send to onboarding.
  if (!onboarding) {
    redirect(`/learn/${topicId}/onboarding`);
  }

  const unitList = (units ?? []) as TopicUnit[];
  const completed = unitList.filter((u) => u.status === 'completed').length;

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-10 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t('eyebrow')}
          </p>
          <Link
            href={`/learn/${topicId}/onboarding`}
            className="text-xs font-medium text-primary hover:underline"
          >
            {t('editOnboarding')}
          </Link>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">{topic.title}</h1>
        <p className="text-sm text-muted-foreground">
          {t('progress', { completed, total: unitList.length })}
        </p>
      </header>

      <ol className="space-y-2">
        {unitList.map((u) => (
          <li key={u.id}>
            <Link
              href={`/learn/${topicId}/${u.id}`}
              className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-sm font-medium text-muted-foreground">
                {u.index}
              </span>
              <div className="space-y-1">
                <p className="font-medium text-foreground">{u.title}</p>
                <p className="text-sm text-muted-foreground">{u.objective}</p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {t(`status.${u.status}` as 'status.pending')}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ol>

      <div className="mt-10 border-t border-border pt-6">
        <Link
          href={`/learn/${topicId}/mate`}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
        >
          {t('talkToNori')}
        </Link>
      </div>
    </main>
  );
}
