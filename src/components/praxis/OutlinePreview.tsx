'use client';

/**
 * Editable outline review.
 *
 * Each unit is a card with inline-editable `title`, `objective`, and
 * `summary` fields. No rich-text — plain textareas. The Accept button
 * is owned by the parent; this component only reports edits via
 * `onChange`.
 *
 * Design note: the initial outline arrives from the cache-aware
 * endpoint and should NOT mutate the shared cache unless the learner
 * accepts with materially different content. That heuristic lives in
 * `src/lib/praxis/curriculum/service.ts#outlineEditedMaterially`.
 */
import { useCallback } from 'react';
import { useTranslations } from 'next-intl';

export interface OutlineUnitDraft {
  index: number;
  title: string;
  objective: string;
  summary: string;
}

export interface OutlinePreviewProps {
  units: ReadonlyArray<OutlineUnitDraft>;
  busy?: boolean;
  onChange: (units: OutlineUnitDraft[]) => void;
  onAccept: () => void;
  onDiscard: () => void;
  cached: boolean;
}

export function OutlinePreview({
  units,
  busy = false,
  onChange,
  onAccept,
  onDiscard,
  cached,
}: OutlinePreviewProps) {
  const t = useTranslations('praxis.outline');

  const update = useCallback(
    (index: number, patch: Partial<OutlineUnitDraft>) => {
      onChange(units.map((u) => (u.index === index ? { ...u, ...patch } : u)));
    },
    [onChange, units],
  );

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {cached ? t('cachedBadge') : t('freshBadge')}
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {t('heading')}
        </h2>
        <p className="text-base text-muted-foreground">{t('hint')}</p>
      </header>

      <ol className="space-y-4">
        {units.map((u) => (
          <li
            key={u.index}
            id={`unit-${u.index}`}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-sm font-medium text-muted-foreground">
                {u.index}
              </span>
              <input
                type="text"
                value={u.title}
                onChange={(e) => update(u.index, { title: e.target.value.slice(0, 120) })}
                disabled={busy}
                aria-label={t('unitTitleLabel')}
                className="w-full bg-transparent text-lg font-medium text-foreground focus:outline-none"
              />
            </div>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t('unitObjective')}
              </span>
              <textarea
                value={u.objective}
                onChange={(e) => update(u.index, { objective: e.target.value.slice(0, 280) })}
                disabled={busy}
                rows={2}
                className="w-full resize-none rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
              />
            </label>
            <label className="mt-3 block space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t('unitSummary')}
              </span>
              <textarea
                value={u.summary}
                onChange={(e) => update(u.index, { summary: e.target.value.slice(0, 640) })}
                disabled={busy}
                rows={3}
                className="w-full resize-none rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
              />
            </label>
          </li>
        ))}
      </ol>

      <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
        <button
          type="button"
          onClick={onDiscard}
          disabled={busy}
          className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
        >
          {t('discard')}
        </button>
        <button
          type="button"
          onClick={onAccept}
          disabled={busy}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? t('accepting') : t('accept')}
        </button>
      </div>
    </section>
  );
}
