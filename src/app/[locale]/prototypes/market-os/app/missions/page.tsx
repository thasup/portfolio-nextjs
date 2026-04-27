import { MissionsView } from '@/components/prototypes/market-os/app/MissionsView';
import { MISSIONS } from '@/lib/prototypes/market-os/data';

export default function MissionsPage() {
  return <MissionsView missions={MISSIONS} />;
}
