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
      <div className="hero">
        <div className="kicker">
          <div className="line" />
          <div className="eyebrow">{t('welcome')}</div>
        </div>
        <h1>
          Good afternoon, <br className="hidden md:block" />
          <em>{displayName}</em>.
        </h1>
        <p className="sub">
          This is your personal learning environment. Every topic here is generated specifically for you, tailored to your pace and goals.
        </p>

        <div className="teach-box">
          <div className="prompt">
            <span className="arrow">→</span>
            <input type="text" placeholder="I want to learn about..." />
          </div>
          <div className="row">
            <div className="chips">
              <button className="chip">System Design</button>
              <button className="chip">Product Strategy</button>
              <button className="chip">User Research</button>
            </div>
            <Link href="/learn/new" className="btn sm">Build syllabus</Link>
          </div>
        </div>
      </div>

      {topics.length === 0 ? (
        <section className="card inset text-center my-12">
          <h2 className="text-lg font-medium text-[var(--color-ink)]">{t('emptyHeading')}</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-[var(--color-ink-3)]">
            {t('emptyBody')}
          </p>
        </section>
      ) : (
        <div className="lib-grid">
          <div className="lib-section-head">
            <div className="n">01</div>
            <div className="eyebrow">{t('topicsHeading')}</div>
          </div>
          {topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      )}
    </>
  );
}
