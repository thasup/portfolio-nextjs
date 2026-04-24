'use client';

/**
 * Single onboarding question input.
 *
 * Supports the three input types produced by the `onboarding.meta`
 * prompt: `short_text`, `long_text`, `single_select`. Rendering is
 * deliberately minimal — these questions are asked once and revisited
 * rarely.
 */
import { useId } from 'react';
import { OnboardingInputType } from '@/lib/praxis/prompts/types';

export interface AdaptiveQuestionData {
  id: string;
  prompt: string;
  helperText: string | null;
  inputType: OnboardingInputType;
  options?: string[];
}

export interface AdaptiveQuestionProps {
  question: AdaptiveQuestionData;
  value: string;
  busy?: boolean;
  onChange: (value: string) => void;
}

const SHORT_MAX = 160;
const LONG_MAX = 2000;

export function AdaptiveQuestion({ question, value, busy = false, onChange }: AdaptiveQuestionProps) {
  const inputId = useId();
  const helperId = useId();

  const input = (() => {
    switch (question.inputType) {
      case OnboardingInputType.SHORT_TEXT:
        return (
          <input
            id={inputId}
            type="text"
            value={value}
            disabled={busy}
            aria-describedby={question.helperText ? helperId : undefined}
            onChange={(e) => onChange(e.target.value.slice(0, SHORT_MAX))}
            className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-base text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
          />
        );
      case OnboardingInputType.LONG_TEXT:
        return (
          <textarea
            id={inputId}
            value={value}
            disabled={busy}
            rows={4}
            aria-describedby={question.helperText ? helperId : undefined}
            onChange={(e) => onChange(e.target.value.slice(0, LONG_MAX))}
            className="w-full resize-none rounded-lg border border-border bg-card px-4 py-3 text-base text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
          />
        );
      case OnboardingInputType.SINGLE_SELECT: {
        const options = question.options ?? [];
        return (
          <ul className="flex flex-wrap gap-2" role="radiogroup" aria-describedby={question.helperText ? helperId : undefined}>
            {options.map((option) => {
              const selected = value === option;
              return (
                <li key={option}>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    disabled={busy}
                    onClick={() => onChange(option)}
                    className={[
                      'rounded-full border px-4 py-2 text-sm transition-colors disabled:opacity-50',
                      selected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-card text-foreground hover:border-primary',
                    ].join(' ')}
                  >
                    {option}
                  </button>
                </li>
              );
            })}
          </ul>
        );
      }
      default:
        return null;
    }
  })();

  return (
    <fieldset className="space-y-3">
      <legend className="block">
        <label htmlFor={inputId} className="text-base font-medium text-foreground">
          {question.prompt}
        </label>
      </legend>
      {question.helperText ? (
        <p id={helperId} className="text-sm text-muted-foreground">
          {question.helperText}
        </p>
      ) : null}
      {input}
    </fieldset>
  );
}
