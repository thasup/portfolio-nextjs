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
import { showApiError, showLoading, updateToastToSuccess, updateToastToError, dismissToast } from '@/lib/praxis/toast';

enum Phase {
  ENTRY = 'entry',
  LOADING = 'loading',
  REVIEW = 'review',
  ACCEPTING = 'accepting',
  REJECTED = 'rejected',
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
  const [loadingToastId, setLoadingToastId] = useState<string | number | null>(null);

  const resetToEntry = useCallback(() => {
    setPhase(Phase.ENTRY);
    setRejection(null);
    if (loadingToastId) {
      dismissToast(loadingToastId);
      setLoadingToastId(null);
    }
  }, [loadingToastId]);

  const requestOutline = useCallback(
    async (input: string) => {
      setRawInput(input);
      setPhase(Phase.LOADING);

      const toastId = showLoading('Generating outline...', {
        description: 'This usually takes 10–20 seconds.',
      });
      setLoadingToastId(toastId);

      try {
        const res = await fetch('/api/praxis/curriculum', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'outline', rawInput: input, locale }),
        });

        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as { error?: { code?: string; message?: string } } | null;
          const error = new Error(body?.error?.message ?? `HTTP ${res.status}`);
          (error as { code?: string }).code = body?.error?.code;
          throw error;
        }

        const data = (await res.json()) as OutlineResponse;
        if (!data.admitted) {
          dismissToast(toastId);
          setLoadingToastId(null);
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
        updateToastToSuccess(toastId, 'Outline ready!', {
          description: data.outline.cached ? 'Loaded from cache.' : 'Generated fresh.',
        });
        setLoadingToastId(null);
        setPhase(Phase.REVIEW);
      } catch (err) {
        updateToastToError(toastId, 'Failed to generate outline');
        setLoadingToastId(null);
        showApiError(err, { onRetry: () => void requestOutline(input) });
        setPhase(Phase.ENTRY);
      }
    },
    [locale],
  );

  const acceptOutline = useCallback(async () => {
    if (!fingerprint) return;
    setPhase(Phase.ACCEPTING);

    const toastId = showLoading('Creating your topic...');
    setLoadingToastId(toastId);

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
        const body = (await res.json().catch(() => null)) as { error?: { code?: string; message?: string } } | null;
        const error = new Error(body?.error?.message ?? `HTTP ${res.status}`);
        (error as { code?: string }).code = body?.error?.code;
        throw error;
      }

      const data = (await res.json()) as AcceptResponse;
      updateToastToSuccess(toastId, 'Topic created!');
      setLoadingToastId(null);
      // Send first-time learners straight into onboarding. The topic
      // hub at `/prototypes/praxis/[topicId]` itself redirects here when no
      // onboarding profile exists, so this is just a UX shortcut.
      router.push(`/prototypes/praxis/${data.topicId}/onboarding`);
    } catch (err) {
      updateToastToError(toastId, 'Failed to create topic');
      setLoadingToastId(null);
      showApiError(err, { onRetry: acceptOutline });
      setPhase(Phase.REVIEW);
    }
  }, [fingerprint, locale, rawInput, router, units]);


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

