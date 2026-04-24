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
  const progressPercent = unitList.length > 0 ? Math.round((completed / unitList.length) * 100) : 0;
  const firstReadyIndex = unitList.findIndex((u) => u.status !== 'completed');

  return (
    <section id="module-overview" className="reveal">
      <div className="mod-head">
        <div>
          <div className="eyebrow">{t('eyebrow')}</div>
          <h1>
            <em>{topic.title}</em>
          </h1>
          <div className="mt-5 max-w-[360px]">
            <div className="prog accent">
              <span style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="mt-2 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-ink-3)]">
              <span>{t('progress', { completed, total: unitList.length })}</span>
              <span>{progressPercent}%</span>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              id="talk-to-nori-btn"
              href={`/learn/${topicId}/mate`}
              className="btn ai"
            >
              {t('talkToNori')}
            </Link>
            <Link
              id="edit-onboarding-link"
              href={`/learn/${topicId}/onboarding`}
              className="btn ghost"
            >
              {t('editOnboarding')}
            </Link>
          </div>
        </div>
      </div>

      <ol id="unit-list" className="unit-list">
        {unitList.map((u, i) => {
          const isCompleted = u.status === 'completed';
          const isReady = u.status === 'ready' || u.status === 'pending';
          const isCurrent = i === firstReadyIndex;
          const locked = !isCompleted && !isReady;
          const cls = [
            'unit-row',
            isCompleted ? 'done' : '',
            isCurrent && !isCompleted ? 'current' : '',
            locked ? 'locked' : '',
          ]
            .filter(Boolean)
            .join(' ');
          const content = (
            <>
              <div className="num">{String(u.index).padStart(2, '0')}</div>
              <div>
                <h3>{u.title}</h3>
                <p>{u.objective}</p>
              </div>
              <div className="text-right">
                <div className="state">
                  {t(`status.${u.status}` as 'status.pending')}
                </div>
                {!locked && <div className="chev mt-1.5">→</div>}
              </div>
            </>
          );
          return (
            <li key={u.id}>
              {locked ? (
                <div id={`unit-card-${u.id}`} className={cls}>
                  {content}
                </div>
              ) : (
                <Link
                  id={`unit-card-${u.id}`}
                  href={`/learn/${topicId}/${u.id}`}
                  className={cls}
                >
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
