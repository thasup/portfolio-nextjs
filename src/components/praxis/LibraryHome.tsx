'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { TopicCard, type TopicCardData } from '@/components/praxis/TopicCard';
import { ModelSelector } from '@/components/praxis/ModelSelector';

export interface LibraryHomeProps {
  displayName: string;
  topics: ReadonlyArray<TopicCardData>;
  canGenerateTopics: boolean;
}

/**
 * Library landing layout. Pure presentational; the page at
 * `/prototypes/praxis/page.tsx` fetches data via `requireLearner()` + Supabase and
 * hands it down.
 */
export function LibraryHome({ displayName, topics, canGenerateTopics }: LibraryHomeProps) {
  const t = useTranslations('praxis.library');
  const [showModelSettings, setShowModelSettings] = useState(false);

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

        {canGenerateTopics && (
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
              <Link href="/prototypes/praxis/new" className="btn sm">Build syllabus</Link>
            </div>
          </div>
        )}

        {/* Model Settings Toggle */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setShowModelSettings(!showModelSettings)}
            className="inline-flex items-center gap-2 rounded-md border border-[var(--color-line)] bg-[var(--color-paper)] px-3 py-1.5 text-sm text-[var(--color-ink-2)] transition-all hover:border-[var(--color-line)] hover:text-[var(--color-ink)]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {showModelSettings ? 'Hide Model Settings' : 'AI Model Settings'}
          </button>
        </div>

        {/* Model Selector Panel */}
        {showModelSettings && (
          <div className="mt-4 rounded-lg border border-[var(--color-line)] bg-[var(--color-paper)] p-6 shadow-sm">
            <ModelSelector onClose={() => setShowModelSettings(false)} />
          </div>
        )}
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

