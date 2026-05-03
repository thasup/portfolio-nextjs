/**
 * Onboarding service — the business logic behind
 * `POST /api/praxis/onboarding`.
 *
 * Two phases:
 *   1. `generateQuestions()` — calls the `onboarding.meta` prompt with
 *      topic + outline context. NOT cached (per contract §3 — cost is
 *      low and uniqueness per-topic is valuable).
 *   2. `saveAnswers()` — version-bumps the `praxis_onboarding` row for
 *      (learner, topic), preserving history. Also transitions the
 *      topic status from `outline_ready` to `active` on first save.
 *
 * Naming note: the API and prompt module both use `short_text |
 * long_text | single_select`. The published contract doc at
 * `contracts/onboarding.generate.md` currently lists
 * `text_short | text_long | single_choice | multi_choice` — the
 * contract is stale vs the prompt enum (which is what the LLM actually
 * emits). Tracked in the living plan for a doc-only reconciliation.
 */
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/praxis/supabase/admin";
import type { Database } from "@/lib/praxis/supabase/database.types";
import {
  ChatRole,
  ResponseFormat,
  extractJson,
} from "@/lib/praxis/openrouter/client";
import {
  getClient,
  createModelResolver,
  ModelTask,
} from "@/lib/praxis/openrouter/factory";
import type { ModelPreferences } from "@/lib/praxis/openrouter/factory";
import {
  LedgerEndpoint,
  assertBudget,
  recordLedgerEntry,
} from "@/lib/praxis/openrouter/ledger";
import { onboardingMeta } from "@/lib/praxis/prompts";
import type {
  OnboardingInputType,
  OutlineUnit,
  PraxisLocale,
} from "@/lib/praxis/prompts/types";

export interface OnboardingQuestion {
  id: string;
  prompt: string;
  helperText: string | null;
  inputType: OnboardingInputType;
  options?: string[];
}

export interface GenerateQuestionsInput {
  topic: string;
  locale: PraxisLocale;
  outline: ReadonlyArray<OutlineUnit>;
  preferences?: ModelPreferences | null;
}

export async function generateQuestions(
  input: GenerateQuestionsInput,
): Promise<OnboardingQuestion[]> {
  await assertBudget();
  const client = getClient();
  const model = createModelResolver(input.preferences)(ModelTask.ONBOARDING);
  const prompt = onboardingMeta.build({
    topic: input.topic,
    locale: input.locale,
    outline: input.outline,
  });

  const res = await client.chat({
    model,
    messages: [{ role: ChatRole.USER, content: prompt }],
    responseFormat: ResponseFormat.JSON_OBJECT,
    temperature: 0.3,
    maxTokens: 1024,
  });

  await recordLedgerEntry({
    endpoint: LedgerEndpoint.ONBOARDING,
    model,
    inputTokens: res.usage.inputTokens,
    outputTokens: res.usage.outputTokens,
  });

  const parsed = extractJson<onboardingMeta.OnboardingJson>(res.content);
  if (!parsed?.questions?.length) {
    throw new Error("onboarding generation failed — invalid JSON");
  }

  return parsed.questions.map((q) => ({
    id: q.id,
    prompt: q.prompt,
    helperText: q.helperText ?? null,
    inputType: q.inputType,
    options: q.options,
  }));
}

// ---- save answers ----------------------------------------------------------

export interface OnboardingAnswer {
  questionId: string;
  prompt: string;
  answer: string;
  helperText: string | null;
  inputType: OnboardingInputType;
}

export interface SaveAnswersInput {
  learnerId: string;
  topicId: string;
  answers: OnboardingAnswer[];
  supabase: SupabaseClient<Database>;
}

export interface SaveAnswersResult {
  profileId: string;
  version: number;
  topicId: string;
}

export async function saveAnswers(
  input: SaveAnswersInput,
): Promise<SaveAnswersResult> {
  const { learnerId, topicId, answers, supabase } = input;

  // Find the latest version for this learner/topic combo.
  const { data: latest, error: latestErr } = await supabase
    .from("praxis_onboarding")
    .select("version")
    .eq("user_id", learnerId)
    .eq("topic_id", topicId)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestErr) {
    throw new Error(`onboarding version lookup failed: ${latestErr.message}`);
  }
  const nextVersion = (latest?.version ?? 0) + 1;

  const { data: inserted, error: insertErr } = await supabase
    .from("praxis_onboarding")
    .insert({
      user_id: learnerId,
      topic_id: topicId,
      version: nextVersion,
      answers:
        answers as unknown as Database["public"]["Tables"]["praxis_onboarding"]["Insert"]["answers"],
    })
    .select("id, version")
    .single();

  if (insertErr || !inserted) {
    throw new Error(
      `onboarding insert failed: ${insertErr?.message ?? "no row"}`,
    );
  }

  // Bump topic status to 'active'. Fire-and-forget; a failure here is
  // not worth failing the whole save, since the learner's answers are
  // already persisted.
  supabase
    .from("praxis_topics")
    .update({ status: "active", last_active_at: new Date().toISOString() })
    .eq("id", topicId)
    .eq("user_id", learnerId)
    .in("status", ["outline_ready", "active"])
    .then(({ error }) => {
      if (error)
        console.error("[praxis/onboarding] topic status bump failed", error);
    });

  return { profileId: inserted.id, version: inserted.version, topicId };
}

// ---- topic lookup helpers (shared with the route handler) ------------------

export interface OnboardedTopicContext {
  topicId: string;
  title: string;
  locale: PraxisLocale;
  outline: OutlineUnit[];
}

/**
 * Load a topic's outline from the shared cache, using the topic's
 * `curriculum_id` pointer. Used by `generateQuestions()` to ground the
 * meta-prompt in the accepted outline.
 */
export async function loadTopicContext(
  topicId: string,
  learnerId: string,
): Promise<OnboardedTopicContext | null> {
  const admin = createAdminClient();
  const { data: topic, error: topicErr } = await admin
    .from("praxis_topics")
    .select("id, title, locale, user_id, curriculum_id")
    .eq("id", topicId)
    .maybeSingle();

  if (topicErr || !topic) return null;
  if (topic.user_id !== learnerId) return null;
  if (!topic.curriculum_id) return null;

  const { data: cache, error: cacheErr } = await admin
    .from("praxis_curriculum_cache")
    .select("units")
    .eq("id", topic.curriculum_id)
    .maybeSingle();

  if (cacheErr || !cache) return null;

  const unitsJson = cache.units as {
    units?: Array<{ title: string; objective: string; summary: string }>;
  } | null;
  const rawUnits = unitsJson?.units ?? [];

  return {
    topicId: topic.id,
    title: topic.title,
    locale: topic.locale as PraxisLocale,
    outline: rawUnits.map((u) => ({
      title: u.title,
      objective: u.objective,
      summary: u.summary,
    })),
  };
}
