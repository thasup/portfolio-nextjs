'use client';

/**
 * Blank-canvas topic entry.
 *
 * FR-007: the learner can type any topic. No templates, no categories.
 * Suggestion chips are a *navigation aid*, not a taxonomy. Clicking a
 * chip fills the textarea; the learner can still edit before submitting.
 *
 * Accessibility:
 *   - Label + aria-describedby wire the textarea to the hint.
 *   - Submit is disabled until there's ≥ 3 non-whitespace characters.
 *   - Enter-to-submit respected (Ctrl/Cmd+Enter also accepted), while
 *     plain Enter inside the textarea still inserts a newline.
 */
import { useCallback, useId, useState } from 'react';
import { useTranslations } from 'next-intl';

export interface TopicEntryCanvasProps {
  initialValue?: string;
  busy?: boolean;
  suggestions?: ReadonlyArray<string>;
  onSubmit: (rawInput: string) => void;
}

const DEFAULT_SUGGESTIONS = [
  'sales',
  'negotiation',
  'public speaking',
  'giving feedback',
  'SQL fundamentals',
  'product management basics',
] as const;

const MIN_LENGTH = 3;
const MAX_LENGTH = 240;

export function TopicEntryCanvas({
  initialValue = '',
  busy = false,
  suggestions = DEFAULT_SUGGESTIONS,
  onSubmit,
}: TopicEntryCanvasProps) {
  const [value, setValue] = useState(initialValue);
  const t = useTranslations('praxis.newTopic');
  const hintId = useId();
  const canSubmit = value.trim().length >= MIN_LENGTH && !busy;

  const submit = useCallback(() => {
    if (!canSubmit) return;
    onSubmit(value.trim());
  }, [canSubmit, onSubmit, value]);

  return (
    <section className="space-y-5">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {t('heading')}
        </h1>
        <p id={hintId} className="text-base text-muted-foreground">
          {t('hint')}
        </p>
      </header>

      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, MAX_LENGTH))}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
              e.preventDefault();
              submit();
            }
          }}
          aria-describedby={hintId}
          disabled={busy}
          placeholder={t('placeholder')}
          rows={3}
          className="w-full resize-none rounded-2xl border border-border bg-card px-5 py-4 text-base text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {t('characters', { count: value.length, max: MAX_LENGTH })}
          </span>
          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? t('submitting') : t('submit')}
          </button>
        </div>
      </form>

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {t('suggestions')}
        </p>
        <ul className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <li key={s}>
              <button
                type="button"
                disabled={busy}
                onClick={() => setValue(s)}
                className="rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
