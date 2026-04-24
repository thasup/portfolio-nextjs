/**
 * `/learn/[topicId]/[unitId]` — unit content page.
 *
 * Server component that loads the unit's current state and hands off
 * to `UnitRenderer` (client component) which handles:
 *   - Auto-generation on first visit (if status is `pending` or `failed`)
 *   - Block rendering with inline regeneration
 *   - Mark-complete flow
 *
 * The middleware guarantees an authenticated session. `requireLearner()`
 * is safe to call here.
 */
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { requireLearner } from '@/lib/praxis/session/getLearner';
import { UnitRenderer } from '@/components/praxis/UnitRenderer';

export const dynamic = 'force-dynamic';

interface UnitPageProps {
  params: Promise<{ topicId: string; unitId: string }>;
}

export default async function UnitPage({ params }: UnitPageProps) {
  const session = await requireLearner();
  const { topicId, unitId } = await params;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Load unit + parent topic in parallel.
  const [{ data: unit }, { data: topic }] = await Promise.all([
    supabase
      .from('praxis_units')
      .select('id, index, title, objective, status, blocks, topic_id')
      .eq('id', unitId)
      .maybeSingle(),
    supabase
      .from('praxis_topics')
      .select('id, title, learner_id')
      .eq('id', topicId)
      .maybeSingle(),
  ]);

  // 404 if unit/topic missing or not owned by current user.
  if (!unit || !topic) notFound();
  if (topic.learner_id !== session.userId) notFound();
  if (unit.topic_id !== topicId) notFound();

  // Parse blocks from JSONB.
  const blocks = Array.isArray(unit.blocks)
    ? (unit.blocks as Array<{
      id: string;
      kind: string;
      content: string;
      regeneratedFrom: string | null;
      generatedAt: string;
    }>)
    : [];

  return (
    <UnitRenderer
      unitId={unit.id}
      unitTitle={unit.title}
      unitObjective={unit.objective}
      unitIndex={unit.index}
      initialStatus={unit.status}
      initialBlocks={blocks as Parameters<typeof UnitRenderer>[0]['initialBlocks']}
      topicId={topicId}
      topicTitle={topic.title}
    />
  );
}
