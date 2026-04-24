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
  const formattedDate = new Date(topic.lastActiveAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Link
      href={`/learn/${topic.id}`}
      className="topic"
    >
      <div className="corner">{t(`statuses.${topic.status}` as 'statuses.active')}</div>
      <h3>{topic.title}</h3>
      <p className="line-clamp-2">{/* Add a brief description if available, otherwise blank */}</p>
      
      <div className="meta">
        <span>Active</span>
        <div className="dot" />
        <span>{formattedDate}</span>
      </div>
      
      {/* We can hardcode 0% for now since we don't pass progress yet, but it keeps the visual consistent */}
      <div className="prog mt-4">
        <span style={{ width: '0%' }} />
      </div>
    </Link>
  );
}
