import { InboxView } from '@/components/prototypes/market-os/app/InboxView';
import { NOTIFICATIONS } from '@/lib/prototypes/market-os/data';

export default function InboxPage() {
  return <InboxView initial={NOTIFICATIONS} />;
}
