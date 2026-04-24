'use client';

/**
 * Editable outline review — redesigned with proper form styling.
 *
 * Each unit is a clearly defined card with visible input fields for
 * `title`, `objective`, and `summary`. Clean visual hierarchy with
 * proper labels, subtle borders, and elegant typography.
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
    <div className="outline-v2">
      {/* Header */}
      <header className="outline-header">
        <div className="outline-badge">
          {cached ? t('cachedBadge') : t('freshBadge')}
        </div>
        <h2 className="outline-title">{t('heading')}</h2>
        <p className="outline-subtitle">{t('hint')}</p>
      </header>

      {/* Units */}
      <div className="outline-units">
        {units.map((u) => (
          <article
            key={u.index}
            id={`unit-${u.index}`}
            className="outline-unit-card"
          >
            {/* Unit Header with Number */}
            <div className="outline-unit-header">
              <span className="outline-unit-number">
                {u.index < 10 ? `0${u.index}` : u.index}
              </span>
              <div className="outline-unit-field outline-unit-field--title">
                <label htmlFor={`unit-${u.index}-title`} className="outline-field-label">
                  {t('unitTitleLabel')}
                </label>
                <input
                  id={`unit-${u.index}-title`}
                  type="text"
                  value={u.title}
                  onChange={(e) => update(u.index, { title: e.target.value.slice(0, 120) })}
                  disabled={busy}
                  className="outline-input outline-input--title"
                  placeholder={t('unitTitlePlaceholder')}
                />
              </div>
            </div>

            {/* Objective Field */}
            <div className="outline-unit-field">
              <label htmlFor={`unit-${u.index}-objective`} className="outline-field-label">
                {t('unitObjective')}
              </label>
              <textarea
                id={`unit-${u.index}-objective`}
                value={u.objective}
                onChange={(e) => update(u.index, { objective: e.target.value.slice(0, 280) })}
                disabled={busy}
                rows={2}
                className="outline-textarea"
                placeholder={t('unitObjectivePlaceholder')}
              />
            </div>

            {/* Summary Field */}
            <div className="outline-unit-field">
              <label htmlFor={`unit-${u.index}-summary`} className="outline-field-label">
                {t('unitSummary')}
              </label>
              <textarea
                id={`unit-${u.index}-summary`}
                value={u.summary}
                onChange={(e) => update(u.index, { summary: e.target.value.slice(0, 640) })}
                disabled={busy}
                rows={3}
                className="outline-textarea"
                placeholder={t('unitSummaryPlaceholder')}
              />
            </div>
          </article>
        ))}
      </div>

      {/* Actions */}
      <footer className="outline-actions">
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
      </footer>
    </div>
  );
}
