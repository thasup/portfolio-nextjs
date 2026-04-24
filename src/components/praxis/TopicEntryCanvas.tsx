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
    <div className="generate">
      <h2>
        What do you want to learn <br />
        <em>today?</em>
      </h2>
      <p className="lede" id={hintId}>
        {t('hint')}
      </p>

      <form
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
          className="answer"
        />

        <div className="nav-row">
          <div className="flex gap-2 flex-wrap max-w-[60%]">
            {suggestions.slice(0, 3).map((s) => (
              <button
                key={s}
                type="button"
                disabled={busy}
                onClick={() => setValue(s)}
                className="chip"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-[var(--color-ink-3)] hidden sm:inline-block">
              {t('characters', { count: value.length, max: MAX_LENGTH })}
            </span>
            <button
              type="submit"
              disabled={!canSubmit}
              className="btn primary lg"
            >
              {busy ? t('submitting') : t('submit')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
