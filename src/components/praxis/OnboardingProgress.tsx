'use client';

/**
 * Onboarding progress indicator.
 *
 * A filled bar + "X of Y" counter. Deliberately not a stepper — the
 * questions are answered one at a time on a single page, and clicking
 * between them doesn't mesh with the save-at-end UX.
 */
import { useTranslations } from 'next-intl';

export interface OnboardingProgressProps {
  current: number;
  total: number;
}

export function OnboardingProgress({ current, total }: OnboardingProgressProps) {
  const t = useTranslations('praxis.onboarding');
  const pct = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

  return (
    <div className="space-y-2" role="progressbar" aria-valuenow={current} aria-valuemin={0} aria-valuemax={total}>
      <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <span>{t('progressLabel')}</span>
        <span>
          {current} / {total}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
