import { notFound } from 'next/navigation';
import { MissionDetailView } from '@/components/prototypes/market-os/app/MissionDetailView';
import { getOrgBySlug } from '@/lib/marketos/queries/orgs';
import { getMissionBySlugOrId } from '@/lib/marketos/queries/missions';
import { listBidsForMission } from '@/lib/marketos/queries/bids';
import { DEMO_ORG_SLUG } from '@/lib/marketos/constants';

export default async function MissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const org = await getOrgBySlug(DEMO_ORG_SLUG);
  if (!org) notFound();
  const mission = await getMissionBySlugOrId(org.id, id);
  if (!mission) notFound();
  const existingBids = await listBidsForMission(mission.id);
  return <MissionDetailView mission={mission} existingBids={existingBids} />;
}
