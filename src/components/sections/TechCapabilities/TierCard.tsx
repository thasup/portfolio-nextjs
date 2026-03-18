'use client';

import { useTranslations } from 'next-intl';
import { Zap, Shield, BarChart3 } from 'lucide-react';
import { TechTier } from '@/types/tech-capabilities';
import { GlassCard } from '@/components/glass/GlassCard';

interface TierCardProps {
  tier: TechTier;
}

const iconMap = {
  Zap,
  Shield,
  BarChart3,
};

export function TierCard({ tier }: TierCardProps) {
  const t = useTranslations();
  const Icon = iconMap[tier.iconName];

  return (
    <GlassCard
      elevation="e2"
      hover={true}
      interactive={false}
      className="flex flex-col p-6"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className={`rounded-lg bg-background/50 p-2 ${tier.color}`}>
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-semibold">{t(tier.titleKey)}</h3>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        {t(tier.subtitleKey)}
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {tier.tools.map((tool) => (
          <span
            key={tool}
            className="rounded-md bg-background/80 px-2.5 py-1 text-xs font-medium"
          >
            {tool}
          </span>
        ))}
      </div>

      <div className="mt-auto border-t border-border/50 pt-4">
        <p className="text-sm font-medium italic text-foreground/80">
          {t(tier.proofKey)}
        </p>
      </div>
    </GlassCard>
  );
}
