"use client";

/**
 * Orchestrator for the per-topic onboarding flow.
 *
 * Phases:
 *   GENERATING → ANSWERING → SAVING → redirect to /prototypes/praxis/[topic]
 *   any → ERROR (dismissible, retries from GENERATING)
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  AdaptiveQuestion,
  type AdaptiveQuestionData,
} from "@/components/praxis/AdaptiveQuestion";
import { OnboardingProgress } from "@/components/praxis/OnboardingProgress";
import { OnboardingInputType } from "@/lib/praxis/prompts/types";
import {
  showApiError,
  showLoading,
  updateToastToSuccess,
  updateToastToError,
  dismissToast,
} from "@/lib/praxis/toast";

enum Phase {
  GENERATING = "generating",
  ANSWERING = "answering",
  SAVING = "saving",
  ERROR = "error",
}

interface GenerateResponse {
  questions: AdaptiveQuestionData[];
}

export interface OnboardingFlowProps {
  topicId: string;
}

export function OnboardingFlow({ topicId }: OnboardingFlowProps) {
  const t = useTranslations("praxis.onboarding");
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>(Phase.GENERATING);
  const [questions, setQuestions] = useState<AdaptiveQuestionData[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const toastIdRef = useRef<string | number | null>(null);
  const isMountedRef = useRef(false);

  const loadQuestions = useCallback(async () => {
    setPhase(Phase.GENERATING);
    if (toastIdRef.current) {
      dismissToast(toastIdRef.current);
    }

    const toastId = showLoading("Preparing questions...");
    toastIdRef.current = toastId;

    try {
      const res = await fetch("/api/praxis/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate_questions", topicId }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: { code?: string; message?: string };
        } | null;
        const error = new Error(body?.error?.message ?? `HTTP ${res.status}`);
        (error as { code?: string }).code = body?.error?.code;
        throw error;
      }
      const data = (await res.json()) as GenerateResponse;
      setQuestions(data.questions);
      setAnswers({});
      dismissToast(toastId);
      toastIdRef.current = null;
      setPhase(Phase.ANSWERING);
    } catch (err) {
      updateToastToError(toastId, "Failed to load questions");
      toastIdRef.current = null;
      showApiError(err, { onRetry: loadQuestions });
      setPhase(Phase.ERROR);
    }
  }, [topicId]);

  useEffect(() => {
    // Prevent double fetch in Strict Mode - only run once
    if (isMountedRef.current) return;
    isMountedRef.current = true;
    void loadQuestions();
  }, [loadQuestions]);

  const submit = useCallback(async () => {
    setPhase(Phase.SAVING);
    if (toastIdRef.current) {
      dismissToast(toastIdRef.current);
    }

    const toastId = showLoading("Saving your answers...");
    toastIdRef.current = toastId;

    try {
      const payload = {
        action: "save_answers",
        topicId,
        answers: questions.map((q) => ({
          questionId: q.id,
          prompt: q.prompt,
          helperText: q.helperText,
          inputType: q.inputType,
          answer: (answers[q.id] ?? "").trim(),
        })),
      };
      const res = await fetch("/api/praxis/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: { code?: string; message?: string };
        } | null;
        const error = new Error(body?.error?.message ?? `HTTP ${res.status}`);
        (error as { code?: string }).code = body?.error?.code;
        throw error;
      }
      updateToastToSuccess(toastId, "Answers saved!");
      toastIdRef.current = null;
      router.push(`/prototypes/praxis/${topicId}`);
    } catch (err) {
      updateToastToError(toastId, "Failed to save answers");
      toastIdRef.current = null;
      showApiError(err, { onRetry: submit });
      setPhase(Phase.ERROR);
    }
  }, [answers, questions, router, topicId]);

  if (phase === Phase.ERROR) {
    return (
      <section
        role="alert"
        className="rounded-2xl border border-destructive/40 bg-destructive/10 p-6"
      >
        <h2 className="text-lg font-semibold text-foreground">
          {t("errorHeading")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("errorDescription")}
        </p>
        <button
          type="button"
          onClick={loadQuestions}
          className="mt-4 text-sm font-medium text-primary hover:underline"
        >
          {t("retry")}
        </button>
      </section>
    );
  }

  if (phase === Phase.GENERATING) {
    return (
      <section className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">{t("loading")}</p>
      </section>
    );
  }

  const answered = questions.reduce((n, q) => {
    const v = (answers[q.id] ?? "").trim();
    if (!v) return n;
    if (
      q.inputType === OnboardingInputType.SINGLE_SELECT &&
      !(q.options ?? []).includes(v)
    )
      return n;
    return n + 1;
  }, 0);
  const canSubmit = answered === questions.length && phase === Phase.ANSWERING;

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {t("eyebrow")}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {t("heading")}
        </h1>
        <p className="text-base text-muted-foreground">{t("hint")}</p>
      </header>

      <OnboardingProgress current={answered} total={questions.length} />

      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (canSubmit) void submit();
        }}
      >
        {questions.map((q) => (
          <AdaptiveQuestion
            key={q.id}
            question={q}
            value={answers[q.id] ?? ""}
            busy={phase === Phase.SAVING}
            onChange={(v) => setAnswers((prev) => ({ ...prev, [q.id]: v }))}
          />
        ))}
        <div className="flex items-center justify-end border-t border-border pt-5">
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {phase === Phase.SAVING ? t("saving") : t("submit")}
          </button>
        </div>
      </form>
    </div>
  );
}
