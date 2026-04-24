import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { TopicCard, type TopicCardData } from '@/components/praxis/TopicCard';

export interface LibraryHomeProps {
  displayName: string;
  topics: ReadonlyArray<TopicCardData>;
}

/**
 * Library landing layout. Pure presentational; the page at
 * `/learn/page.tsx` fetches data via `requireLearner()` + Supabase and
 * hands it down.
 */
export function LibraryHome({ displayName, topics }: LibraryHomeProps) {
  const t = useTranslations('praxis.library');

  return (
    <>
      <header className="mb-10 space-y-2">
        <p className="text-sm text-muted-foreground">{t('welcome')}</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {t('greeting', { name: displayName })}
        </h1>
      </header>

      {topics.length === 0 ? (
        <section className="rounded-2xl border border-border bg-card p-8 text-center">
          <h2 className="text-lg font-medium text-foreground">{t('emptyHeading')}</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            {t('emptyBody')}
          </p>
          <Link
            href="/learn/new"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            {t('startTopic')}
          </Link>
        </section>
      ) : (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              {t('topicsHeading')}
            </h2>
            <Link
              href="/learn/new"
              className="text-sm font-medium text-primary hover:underline"
            >
              {t('startTopic')} →
            </Link>
          </div>
          <ul className="space-y-2">
            {topics.map((topic) => (
              <li key={topic.id}>
                <TopicCard topic={topic} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
