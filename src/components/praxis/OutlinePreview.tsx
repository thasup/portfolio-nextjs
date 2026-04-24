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
    <div className="outline">
      <header className="mb-6">
        <p className="eyebrow mb-2">
          {cached ? t('cachedBadge') : t('freshBadge')}
        </p>
        <h2 className="display text-[32px] text-[var(--color-ink)] mb-2">
          {t('heading')}
        </h2>
        <p className="text-[15px] text-[var(--color-ink-2)]">{t('hint')}</p>
      </header>

      <div className="space-y-3">
        {units.map((u) => (
          <div
            key={u.index}
            id={`unit-${u.index}`}
            className="unit-draft group"
          >
            <div className="n">{u.index < 10 ? `0${u.index}` : u.index}</div>
            <div className="flex-1 space-y-3">
              <input
                type="text"
                value={u.title}
                onChange={(e) => update(u.index, { title: e.target.value.slice(0, 120) })}
                disabled={busy}
                aria-label={t('unitTitleLabel')}
                className="w-full bg-transparent font-display text-[22px] text-[var(--color-ink)] outline-none border-b border-transparent focus:border-[var(--color-line)] transition-colors placeholder:text-[var(--color-ink-4)]"
                placeholder="Unit Title"
              />
              
              <div className="space-y-1">
                <span className="eyebrow">{t('unitObjective')}</span>
                <textarea
                  value={u.objective}
                  onChange={(e) => update(u.index, { objective: e.target.value.slice(0, 280) })}
                  disabled={busy}
                  rows={2}
                  className="w-full resize-none bg-transparent text-[14px] text-[var(--color-ink-2)] outline-none border border-transparent focus:border-[var(--color-line)] rounded p-1 transition-colors"
                  placeholder="Objective..."
                />
              </div>

              <div className="space-y-1">
                <span className="eyebrow">{t('unitSummary')}</span>
                <textarea
                  value={u.summary}
                  onChange={(e) => update(u.index, { summary: e.target.value.slice(0, 640) })}
                  disabled={busy}
                  rows={3}
                  className="w-full resize-none bg-transparent text-[14px] text-[var(--color-ink-2)] outline-none border border-transparent focus:border-[var(--color-line)] rounded p-1 transition-colors"
                  placeholder="Summary..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="nav-row border-t border-[var(--color-line-soft)] mt-8 pt-6">
        <button
          type="button"
          onClick={onDiscard}
          disabled={busy}
          className="btn ghost"
        >
          {t('discard')}
        </button>
        <button
          type="button"
          onClick={onAccept}
          disabled={busy}
          className="btn primary"
        >
          {busy ? t('accepting') : t('accept')}
        </button>
      </div>
    </div>
  );
}
