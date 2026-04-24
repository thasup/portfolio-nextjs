/**
 * `/learn` — the PRAXIS library shell.
 *
 * Phase 1 scope for this page is intentionally small (FR-006):
 *   - Greet the learner by name.
 *   - List their existing topics, newest activity first.
 *   - Empty state with a "Start a topic" affordance that links to the
 *     blank-canvas flow at `/learn/new`.
 *
 * The middleware has already guaranteed an authenticated session by the
 * time this component runs, so `requireLearner()` is safe. Presentation
 * lives in `src/components/praxis/LibraryHome.tsx`.
 */
import { cookies } from 'next/headers';
import { LibraryHome } from '@/components/praxis/LibraryHome';
import type { TopicCardData } from '@/components/praxis/TopicCard';
import { requireLearner } from '@/lib/praxis/session/getLearner';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

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
    status: row.status as TopicCardData['status'],
    lastActiveAt: row.last_active_at,
  }));
}

export default async function LibraryPage() {
  const session = await requireLearner();
  const topics = await loadTopics(session.userId);
  const displayName = session.learner.display_name ?? session.email.split('@')[0];

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <LibraryHome displayName={displayName} topics={topics} />
    </main>
  );
}
