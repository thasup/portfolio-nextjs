'use client';

import { useTranslations } from 'next-intl';
import { capabilities } from '@/data/tech-capabilities';
import { CapabilityCard } from '@/components/sections/TechCapabilities/CapabilityCard';

const LAYERS = ['Frontend', 'AI', 'Fullstack', 'Product'];

export function TechCapabilities() {
  const t = useTranslations('tech');

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      {/* Section header */}
      <div className="mb-14 max-w-3xl">
        <div className="mb-5 flex flex-wrap items-center gap-2" aria-label="Capability layers">
          {LAYERS.map((layer, i) => (
            <span key={layer} className="flex items-center gap-2">
              <span className="rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
                {layer}
              </span>
              {i < LAYERS.length - 1 && (
                <span className="text-muted-foreground/40 text-xs" aria-hidden="true">
                  →
                </span>
              )}
            </span>
          ))}
        </div>

        <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          {t('sectionTitle')}
        </h2>
        <p className="text-lg text-muted-foreground md:text-xl">
          {t('subtitle')}
        </p>
      </div>

      {/* Cards — 2-column grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {capabilities.map((cap, i) => (
          <CapabilityCard key={cap.id} capability={cap} index={i} />
        ))}
      </div>
    </section>
  );
}
