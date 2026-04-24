import Link from 'next/link';
import { useTranslations } from 'next-intl';

export interface TopicCardData {
  id: string;
  title: string;
  status: 'pending_guardrail' | 'rejected' | 'outline_ready' | 'active' | 'archived';
  lastActiveAt: string;
}

export interface TopicCardProps {
  topic: TopicCardData;
}

/**
 * Compact row on the library page. Pure presentational — resolution of
 * the list itself is in `LibraryHome.tsx`.
 *
 * `status` is rendered as a translated badge because learners will see
 * "outline_ready" and wonder what it means. The translations live under
 * `praxis.library.statuses.*`.
 */
export function TopicCard({ topic }: TopicCardProps) {
  const t = useTranslations('praxis.library');
  return (
    <Link
      href={`/learn/${topic.id}`}
      className="group flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:border-primary"
    >
      <span className="font-medium text-foreground group-hover:text-primary">{topic.title}</span>
      <span className="text-xs uppercase tracking-wider text-muted-foreground">
        {t(`statuses.${topic.status}` as 'statuses.active')}
      </span>
    </Link>
  );
}
