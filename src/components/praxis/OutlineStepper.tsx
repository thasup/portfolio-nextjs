'use client';

/**
 * Lightweight vertical indicator for the outline review.
 *
 * Not a router — the full outline is rendered in one page; this is just
 * a navigational aid when the outline is long enough to scroll. Clicks
 * scroll the matching unit card into view via its `id`.
 */
import { useTranslations } from 'next-intl';

export interface OutlineStepperProps {
  units: ReadonlyArray<{ index: number; title: string }>;
  activeIndex: number | null;
}

export function OutlineStepper({ units, activeIndex }: OutlineStepperProps) {
  const t = useTranslations('praxis.outline');

  return (
    <nav aria-label={t('stepperLabel')} className="sticky top-24 space-y-2">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {t('stepperHeading')}
      </p>
      <ol className="space-y-1">
        {units.map((u) => {
          const active = activeIndex === u.index;
          return (
            <li key={u.index}>
              <a
                href={`#unit-${u.index}`}
                className={[
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                ].join(' ')}
              >
                <span
                  className={[
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium',
                    active
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border',
                  ].join(' ')}
                >
                  {u.index}
                </span>
                <span className="truncate">{u.title}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
