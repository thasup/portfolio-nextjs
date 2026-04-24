'use client';

/**
 * Orchestrator for the blank-canvas → outline → accept flow.
 *
 * State machine:
 *   ENTRY → OUTLINE_LOADING → OUTLINE_REVIEW → ACCEPT_SUBMITTING → redirect
 *   ENTRY → OUTLINE_LOADING → REJECTED (terminal, with "try again")
 *   any → ERROR (dismissible)
 *
 * Keeps every side-effect in this single component so server-component
 * pages stay simple and so the state machine is unit-testable.
 */
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { TopicEntryCanvas } from '@/components/praxis/TopicEntryCanvas';
import { OutlinePreview, type OutlineUnitDraft } from '@/components/praxis/OutlinePreview';
import { OutlineStepper } from '@/components/praxis/OutlineStepper';
import { ScopeRejectionCard } from '@/components/praxis/ScopeRejectionCard';
import { ScopeCategory, PraxisLocale } from '@/lib/praxis/prompts/types';

enum Phase {
  ENTRY = 'entry',
  LOADING = 'loading',
  REVIEW = 'review',
  ACCEPTING = 'accepting',
  REJECTED = 'rejected',
  ERROR = 'error',
}

interface OutlineResponse {
  admitted: boolean;
  category?: ScopeCategory;
  explanation?: string;
  topic?: {
    fingerprint: string;
    title: string;
    rawInput: string;
    locale: PraxisLocale;
  };
  outline?: {
    cached: boolean;
    modelVersion: string;
    units: OutlineUnitDraft[];
  };
}

interface AcceptResponse {
  topicId: string;
}

export interface NewTopicFlowProps {
  locale: PraxisLocale;
}

export function NewTopicFlow({ locale }: NewTopicFlowProps) {
  const t = useTranslations('praxis.newTopic');
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>(Phase.ENTRY);
  const [rawInput, setRawInput] = useState('');
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [cached, setCached] = useState(false);
  const [units, setUnits] = useState<OutlineUnitDraft[]>([]);
  const [rejection, setRejection] = useState<{ category: ScopeCategory; explanation: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetToEntry = useCallback(() => {
    setPhase(Phase.ENTRY);
    setRejection(null);
    setErrorMessage(null);
  }, []);

  const requestOutline = useCallback(
    async (input: string) => {
      setRawInput(input);
      setPhase(Phase.LOADING);
      setErrorMessage(null);
      try {
        const res = await fetch('/api/praxis/curriculum', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'outline', rawInput: input, locale }),
        });
        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as { error?: { message?: string } } | null;
          throw new Error(body?.error?.message ?? `HTTP ${res.status}`);
        }
        const data = (await res.json()) as OutlineResponse;
        if (!data.admitted) {
          setRejection({
            category: data.category ?? ScopeCategory.OTHER,
            explanation: data.explanation ?? '',
          });
          setPhase(Phase.REJECTED);
          return;
        }
        if (!data.outline || !data.topic) {
          throw new Error('Malformed response from /api/praxis/curriculum');
        }
        setFingerprint(data.topic.fingerprint);
        setCached(data.outline.cached);
        setUnits(data.outline.units);
        setPhase(Phase.REVIEW);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setErrorMessage(message);
        setPhase(Phase.ERROR);
      }
    },
    [locale],
  );

  const acceptOutline = useCallback(async () => {
    if (!fingerprint) return;
    setPhase(Phase.ACCEPTING);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/praxis/curriculum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'accept',
          fingerprint,
          locale,
          rawInput,
          editedUnits: units,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: { message?: string } } | null;
        throw new Error(body?.error?.message ?? `HTTP ${res.status}`);
      }
      const data = (await res.json()) as AcceptResponse;
      // Send first-time learners straight into onboarding. The topic
      // hub at `/learn/[topicId]` itself redirects here when no
      // onboarding profile exists, so this is just a UX shortcut.
      router.push(`/learn/${data.topicId}/onboarding`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setErrorMessage(message);
      setPhase(Phase.ERROR);
    }
  }, [fingerprint, locale, rawInput, router, units]);

  if (phase === Phase.ERROR) {
    return (
      <div className="hero max-w-[820px] mx-auto my-12 text-center">
        <h2 className="display text-2xl text-[var(--color-destructive)] mb-4">{t('errorHeading')}</h2>
        <p className="sub">{errorMessage}</p>
        <button
          type="button"
          onClick={resetToEntry}
          className="btn primary mt-8"
        >
          {t('tryAgain')}
        </button>
      </div>
    );
  }

  if (phase === Phase.REJECTED && rejection) {
    return (
      <ScopeRejectionCard
        category={rejection.category}
        explanation={rejection.explanation}
        onTryAgain={resetToEntry}
      />
    );
  }

  if (phase === Phase.LOADING) {
    return (
      <div className="hero max-w-[820px] mx-auto my-24 text-center">
        <div className="eyebrow animate-pulse">{t('loading')}</div>
      </div>
    );
  }

  if (phase === Phase.REVIEW || phase === Phase.ACCEPTING) {
    return (
      <div className="flex items-start justify-center gap-12 max-w-[1080px] mx-auto">
        <div className="flex-1 w-full max-w-[820px]">
          <OutlinePreview
            units={units}
            busy={phase === Phase.ACCEPTING}
            cached={cached}
            onChange={setUnits}
            onAccept={acceptOutline}
            onDiscard={resetToEntry}
          />
        </div>
        <aside className="hidden lg:block w-[200px] shrink-0 pt-[40px]">
          <OutlineStepper units={units} activeIndex={units[0]?.index ?? null} />
        </aside>
      </div>
    );
  }

  return <TopicEntryCanvas initialValue={rawInput} onSubmit={requestOutline} />;
}
