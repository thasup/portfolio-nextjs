'use client';

/**
 * Shown when the scope guardrail returns `admitted: false`.
 *
 * FR-031: rejection must be honest, category-aware, and offer a path to
 * qualified help. We show the model's explanation verbatim since the
 * prompt is tuned to be kind + specific, but we also append a
 * category-specific helper link.
 */
import { useTranslations } from 'next-intl';
import { ScopeCategory } from '@/lib/praxis/prompts/types';

export interface ScopeRejectionCardProps {
  category: ScopeCategory;
  explanation: string;
  onTryAgain: () => void;
}

const CATEGORY_ICON: Record<ScopeCategory, string> = {
  [ScopeCategory.OK]: '✓',
  [ScopeCategory.MEDICAL]: '✚',
  [ScopeCategory.LEGAL]: '§',
  [ScopeCategory.FINANCIAL]: '฿',
  [ScopeCategory.EXPLICIT]: '◐',
  [ScopeCategory.MINORS]: '✱',
  [ScopeCategory.OTHER]: '!',
};

export function ScopeRejectionCard({ category, explanation, onTryAgain }: ScopeRejectionCardProps) {
  const t = useTranslations('praxis.scope');

  return (
    <section
      role="alert"
      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="flex items-start gap-4">
        <span
          aria-hidden
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-lg text-muted-foreground"
        >
          {CATEGORY_ICON[category]}
        </span>
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t(`category.${category}` as 'category.ok')}
            </p>
            <h2 className="mt-1 text-lg font-semibold text-foreground">{t('heading')}</h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{explanation || t('fallback')}</p>
          <button
            type="button"
            onClick={onTryAgain}
            className="text-sm font-medium text-primary hover:underline"
          >
            {t('tryAgain')}
          </button>
        </div>
      </div>
    </section>
  );
}
