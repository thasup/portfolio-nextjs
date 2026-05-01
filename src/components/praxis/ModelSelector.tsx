'use client';

import { useState, useCallback, useEffect } from 'react';
import { ModelTask, type ModelPreferences } from '@/lib/praxis/openrouter/models';

interface ModelOption {
  slug: string;
  label: string;
  provider: string;
}

interface TaskConfig {
  task: ModelTask;
  current: string;
  available: ModelOption[];
}

interface ModelSelectorProps {
  onSave?: (prefs: ModelPreferences) => void;
  onClose?: () => void;
}

const TASK_LABELS: Record<ModelTask, string> = {
  [ModelTask.GUARDRAIL]: 'Scope Guardrail',
  [ModelTask.CURRICULUM]: 'Curriculum / Outline',
  [ModelTask.UNIT]: 'Unit Generation',
  [ModelTask.ONBOARDING]: 'Onboarding Questions',
  [ModelTask.JUDGE]: 'Eval / Judge',
};

const TASK_DESCRIPTIONS: Record<ModelTask, string> = {
  [ModelTask.GUARDRAIL]: 'Filters unsafe or off-topic requests',
  [ModelTask.CURRICULUM]: 'Generates the course outline and structure',
  [ModelTask.UNIT]: 'Creates individual learning units with content blocks',
  [ModelTask.ONBOARDING]: 'Generates personalized intake questions',
  [ModelTask.JUDGE]: 'Evaluates output quality during testing',
};

export function ModelSelector({ onSave, onClose }: ModelSelectorProps) {
  const [tasks, setTasks] = useState<TaskConfig[]>([]);
  const [preferences, setPreferences] = useState<ModelPreferences>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [universalDefault, setUniversalDefault] = useState<string>('');

  // Fetch current preferences
  useEffect(() => {
    fetch('/api/praxis/models')
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to load models');
        }
        return res.json();
      })
      .then((data: { universalDefault: string; preferences: ModelPreferences | null; tasks: TaskConfig[] }) => {
        setUniversalDefault(data.universalDefault);
        setTasks(data.tasks);
        setPreferences(data.preferences ?? {});
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      });
  }, []);

  const handleModelChange = useCallback((task: ModelTask, slug: string | null) => {
    setPreferences((prev) => ({
      ...prev,
      [task]: slug === 'default' ? undefined : slug,
    }));
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/praxis/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save preferences');
      }

      onSave?.(preferences);
      onClose?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSaving(false);
    }
  }, [preferences, onSave, onClose]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-line)] border-t-[var(--color-praxis-accent)]" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl font-medium text-[var(--color-ink)]">
            Model Selection
          </h3>
          <p className="mt-1 text-sm text-[var(--color-ink-3)]">
            Default: <code className="rounded bg-[var(--color-paper-2)] px-1 py-0.5 text-xs">{universalDefault}</code>
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-md p-2 text-[var(--color-ink-3)] hover:bg-[var(--color-paper-2)] hover:text-[var(--color-ink)]"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {tasks.map(({ task, available }) => {
          const selectedValue = preferences[task] ?? 'default';
          const isDefault = selectedValue === 'default' || !preferences[task];

          return (
            <div
              key={task}
              className="rounded-lg border border-[var(--color-line)] bg-[var(--color-paper)] p-4 transition-colors hover:border-[var(--color-line)]"
            >
              <div className="mb-3">
                <label className="block font-display font-medium text-[var(--color-ink)]">
                  {TASK_LABELS[task]}
                </label>
                <p className="text-xs text-[var(--color-ink-3)]">{TASK_DESCRIPTIONS[task]}</p>
              </div>

              <div className="relative">
                <select
                  value={selectedValue}
                  onChange={(e) => handleModelChange(task, e.target.value)}
                  className="w-full appearance-none rounded-md border border-[var(--color-line)] bg-[var(--color-paper)] px-4 py-2.5 pr-10 text-sm text-[var(--color-ink)] outline-none transition-all hover:border-[var(--color-line)] focus:border-[var(--color-praxis-accent)] focus:ring-2 focus:ring-[var(--color-praxis-accent-soft)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="default">
                    Use Default ({universalDefault})
                  </option>
                  <option disabled>─ Provider Models ─</option>
                  {available.map((model) => (
                    <option key={model.slug} value={model.slug}>
                      {model.label} ({model.provider})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[var(--color-ink-3)]">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {!isDefault && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-[var(--color-praxis-accent-soft)] px-2 py-0.5 text-xs font-medium text-[var(--color-praxis-accent)]">
                    Custom
                  </span>
                  <span className="text-xs text-[var(--color-ink-3)]">Selected: {preferences[task]}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        {onClose && (
          <button
            onClick={onClose}
            className="btn btn--secondary"
            disabled={saving}
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn--primary"
        >
          {saving ? (
            <>
              <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving…
            </>
          ) : (
            'Save Preferences'
          )}
        </button>
      </div>
    </div>
  );
}

// Compact dropdown version for inline use
interface ModelSelectorDropdownProps {
  task: ModelTask;
  value: string | null | undefined;
  onChange: (slug: string | null) => void;
  disabled?: boolean;
}

export function ModelSelectorDropdown({ task, value, onChange, disabled }: ModelSelectorDropdownProps) {
  const [models, setModels] = useState<ModelOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/praxis/models')
      .then((res) => res.json())
      .then((data: { tasks: TaskConfig[] }) => {
        const taskConfig = data.tasks.find((t) => t.task === task);
        setModels(taskConfig?.available ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [task]);

  if (loading) {
    return (
      <div className="h-9 w-32 animate-pulse rounded-md bg-[var(--color-paper-2)]" />
    );
  }

  return (
    <div className="relative inline-block">
      <select
        value={value ?? 'default'}
        onChange={(e) => onChange(e.target.value === 'default' ? null : e.target.value)}
        disabled={disabled}
        className="appearance-none rounded-md border border-[var(--color-line)] bg-[var(--color-paper)] px-3 py-1.5 pr-8 text-sm text-[var(--color-ink)] outline-none transition-all hover:border-[var(--color-line)] focus:border-[var(--color-praxis-accent)] focus:ring-2 focus:ring-[var(--color-praxis-accent-soft)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="default">Default Model</option>
        {models.map((model) => (
          <option key={model.slug} value={model.slug}>
            {model.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--color-ink-3)]">
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
