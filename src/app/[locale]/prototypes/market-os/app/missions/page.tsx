import { MissionsView } from '@/components/prototypes/market-os/app/MissionsView';
import { getOrgBySlug } from '@/lib/marketos/queries/orgs';
import { listMissions } from '@/lib/marketos/queries/missions';
import { DEMO_ORG_SLUG } from '@/lib/marketos/constants';

export default async function MissionsPage() {
  const org = await getOrgBySlug(DEMO_ORG_SLUG);
  const missions = org ? await listMissions(org.id) : [];
  return <MissionsView missions={missions} />;
}
