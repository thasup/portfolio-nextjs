/**
 * `/learn` — the PRAXIS library shell.
 *
 * Phase 1 scope for this page is intentionally small (FR-006):
 *   - Greet the learner by name.
 *   - List their existing topics, newest activity first.
 *   - Empty state with a "Start a topic" affordance that links to the
 *     blank-canvas flow. The flow itself lands in Week 2 (T-024+); for
 *     now the empty state is the end of the road.
 *
 * The middleware has already guaranteed an authenticated session by the
 * time this component runs, so `requireLearner()` is safe.
 */
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { requireLearner } from '@/lib/praxis/session/getLearner';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

interface TopicCardData {
  id: string;
  title: string;
  status: string;
  lastActiveAt: string;
}

async function loadTopics(learnerId: string): Promise<TopicCardData[]> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase
    .from('praxis_topics')
    .select('id,title,status,last_active_at')
    .eq('learner_id', learnerId)
    .neq('status', 'rejected')
    .order('last_active_at', { ascending: false })
    .limit(50);

  if (error || !data) return [];
  return data.map((row) => ({
    id: row.id,
    title: row.title,
    status: row.status,
    lastActiveAt: row.last_active_at,
  }));
}

export default async function LibraryPage() {
  const [session, t] = await Promise.all([requireLearner(), getTranslations('praxis.library')]);
  const topics = await loadTopics(session.userId);
  const displayName = session.learner.display_name ?? session.email.split('@')[0];

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-10 space-y-2">
        <p className="text-sm text-muted-foreground">{t('welcome')}</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {t('greeting', { name: displayName })}
        </h1>
      </header>

      {topics.length === 0 ? (
        <section className="rounded-2xl border border-border bg-card p-8 text-center">
          <h2 className="text-lg font-medium text-foreground">
            {t('emptyHeading')}
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            {t('emptyBody')}
          </p>
          <Link
            href="/learn/new"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            {t('startTopic')}
          </Link>
        </section>
      ) : (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              {t('topicsHeading')}
            </h2>
            <Link
              href="/learn/new"
              className="text-sm font-medium text-primary hover:underline"
            >
              {t('startTopic')} →
            </Link>
          </div>
          <ul className="space-y-2">
            {topics.map((topic) => (
              <li key={topic.id}>
                <Link
                  href={`/learn/${topic.id}`}
                  className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:border-primary"
                >
                  <span className="font-medium text-foreground">{topic.title}</span>
                  <span className="text-xs text-muted-foreground">{topic.status}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
