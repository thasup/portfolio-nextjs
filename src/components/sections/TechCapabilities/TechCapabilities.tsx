'use client';

import { useTranslations } from 'next-intl';
import { techTiers } from '@/data/tech-capabilities';
import { TierCard } from '@/components/sections/TechCapabilities/TierCard';

export function TechCapabilities() {
  const t = useTranslations('tech');

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="mb-12 text-center">
        {t('label') && (
          <span className="mb-6 inline-block text-xs font-semibold tracking-[0.2em] uppercase text-primary">
            {t('label')}
          </span>
        )}
        <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          {t('title')}
        </h2>
        <p className="mx-auto max-w-3xl text-lg text-muted-foreground md:text-xl">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {techTiers.map((tier) => (
          <TierCard key={tier.id} tier={tier} />
        ))}
      </div>
    </section>
  );
}
