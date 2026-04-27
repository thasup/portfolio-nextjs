import { notFound } from 'next/navigation';
import { MissionDetailView } from '@/components/prototypes/market-os/app/MissionDetailView';
import { getBids, getMission } from '@/lib/prototypes/market-os/data';

export default async function MissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mission = getMission(id);
  if (!mission) notFound();
  const existingBids = getBids(mission.id);
  return <MissionDetailView mission={mission} existingBids={existingBids} />;
}
