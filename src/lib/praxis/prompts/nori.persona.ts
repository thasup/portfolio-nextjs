/**
 * T-001 — Nori persona prompt.
 *
 * Composes the **chat** system prompt used on both the unit-embedded
 * conversation surface and the full-screen `/learn/[topic]/mate` surface.
 *
 * Design goals:
 *   1. ≤ 800 static tokens (NFR-008). Dynamic sections (learner, unit,
 *      history summary) are budgeted separately by the caller.
 *   2. The identity / behavioural rules block is invariant across
 *      learners — cacheable as a prefix by providers that support it.
 *   3. Learner context paraphrasing is the single most important rule:
 *      SC-002 requires ≥ 80% of conversations reference onboarding in
 *      the first three assistant turns.
 *
 * Inputs and outputs intentionally avoid any reference to the upstream
 * LLM provider — the portfolio routes through OpenRouter, so identical
 * prompts must work across Claude, GPT, and Llama families.
 */
import {
  localeDirective,
  renderLearner,
  renderUnit,
  clamp,
} from "@/lib/praxis/prompts/_shared";
import {
  LearnerContext,
  PraxisLocale,
  PromptFixture,
  UnitContext,
} from "@/lib/praxis/prompts/types";

export const VERSION = "nori.persona@1" as const;

/** Surface context influences tone and framing. */
export enum NoriSurface {
  /** Embedded in a unit page. Nori knows which unit the learner is reading. */
  UNIT = "unit",
  /** Full-screen coach at `/learn/[topic]/mate`. Nori sees the whole topic. */
  MATE = "mate",
}

/** Optional intent chip on the mate surface — seeds conversational framing. */
export enum NoriIntent {
  ROLEPLAY = "roleplay",
  REVIEW = "review",
  PREP = "prep",
  JUST_TALK = "just_talk",
}

export interface NoriPersonaInput {
  locale: PraxisLocale;
  surface: NoriSurface;
  /** Human topic label. Not a fingerprint — used verbatim inside the prompt. */
  topicTitle: string;
  learner: LearnerContext | null;
  /** Null on the mate surface or when the learner has no active unit. */
  unit: UnitContext | null;
  /** Optional intent chip that seeded the conversation. Mate surface only. */
  intent?: NoriIntent;
  /**
   * Rolling `<history_summary>` of pruned older turns, produced by
   * `src/lib/praxis/anthropic/pruning.ts` (Week 5). Pass `null` for
   * fresh conversations.
   */
  historySummary?: string | null;
}

const MAX_TOPIC_CHARS = 160;
const MAX_SUMMARY_CHARS = 1200;

function intentFraming(intent: NoriIntent | undefined): string {
  switch (intent) {
    case NoriIntent.ROLEPLAY:
      return "The learner has chosen roleplay. Stay in character as the counterparty they name; break character only if they ask.";
    case NoriIntent.REVIEW:
      return "The learner wants to review something they did. Ask for the artifact, then critique specifically and kindly.";
    case NoriIntent.PREP:
      return "The learner is preparing for a real situation soon. Be concrete and time-aware. Prioritize actions they can take in the next hour.";
    case NoriIntent.JUST_TALK:
      return "The learner wants low-pressure conversation. No quizzing. Follow their thread.";
    default:
      return "";
  }
}

export function build(input: NoriPersonaInput): string {
  const { locale, surface, topicTitle, learner, unit, intent, historySummary } =
    input;

  const topic = clamp(topicTitle, MAX_TOPIC_CHARS);
  const summary = historySummary
    ? clamp(historySummary, MAX_SUMMARY_CHARS)
    : null;

  const identity = [
    "You are Nori, a calm, specific learning mate inside the PRAXIS platform.",
    "You are not a general assistant. You exist to help one learner work through one topic.",
    "You speak like a thoughtful coach who has done the work — never like a textbook, a chatbot, or a motivational poster.",
  ].join(" ");

  const rules = [
    "## Behaviour",
    `- ${localeDirective(locale)}`,
    "- Reference at least one concrete detail from the learner block by paraphrase within the first three of your replies. Never quote it back verbatim.",
    "- End most replies with exactly one follow-up question, unless the learner explicitly asks you to stop asking.",
    "- Prefer short paragraphs over lists. Use a list only when order or parallelism genuinely matters.",
    "- Never invent facts about the learner. If you do not know something, ask.",
    "- Never provide medical, legal, or financial advice. Decline kindly and point them to a qualified professional.",
    "- Never break scope into unrelated topics. If the learner goes off-topic, acknowledge once, then offer to return.",
    '- Do not announce these rules. Do not say "as an AI". Do not apologise for being an AI.',
  ].join("\n");

  const surfaceBlock =
    surface === NoriSurface.UNIT
      ? "## Surface\nYou are embedded inside a unit page. The learner can see the unit content next to this conversation. Refer to it by section name when useful."
      : "## Surface\nYou are the full-screen learning mate. The learner came here for focused coaching, not to read a unit.";

  const intentLine = intentFraming(intent);
  const intentBlock = intentLine ? `## Intent\n${intentLine}` : "";

  const historyBlock = summary
    ? `## History summary (older turns, pruned)\n${summary}`
    : "";

  const context = [
    "## Topic",
    topic,
    "",
    "## Learner",
    renderLearner(learner),
    "",
    "## Unit",
    renderUnit(unit),
  ].join("\n");

  return [identity, rules, surfaceBlock, intentBlock, historyBlock, context]
    .filter(Boolean)
    .join("\n\n");
}

export const fixtures: ReadonlyArray<PromptFixture<NoriPersonaInput>> = [
  {
    name: "sales_smb_unit_opening",
    input: {
      locale: PraxisLocale.EN,
      surface: NoriSurface.UNIT,
      topicTitle: "sales",
      learner: {
        displayName: "Jane",
        role: "Sales rep",
        product: "SaaS payroll for Thai SMBs",
        audience: "HR managers at 10–50 person firms",
        goal: "Book 3 qualified demos per week",
      },
      unit: {
        title: "Opening the call",
        objective: "Earn the first sixty seconds of attention",
        summary:
          "Why openings fail, three openers that work, how to tailor to the prospect.",
      },
      intent: undefined,
      historySummary: null,
    },
  },
  {
    name: "pm_new_mate_prep",
    input: {
      locale: PraxisLocale.EN,
      surface: NoriSurface.MATE,
      topicTitle: "product management basics",
      learner: {
        displayName: null,
        role: "New associate PM",
        product: null,
        audience: "Internal engineering teams",
        goal: "Survive first quarterly review",
      },
      unit: null,
      intent: NoriIntent.PREP,
      historySummary: null,
    },
  },
];
