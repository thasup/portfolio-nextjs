/**
 * T-005 — Adaptive onboarding meta prompt.
 *
 * Generates the 3–5 calibration questions a learner answers right after
 * accepting an outline (FR-014, FR-015). The questions themselves are
 * generated — never hardcoded for sales — so the same flow works for
 * SQL, public speaking, or Thai cooking with no code changes.
 *
 * Design constraints:
 *   - Exactly one required question about the learner's current role or
 *     situation, so every downstream prompt has something to paraphrase.
 *   - Exactly one question that probes the learner's *goal* for this
 *     topic, so Nori can reference it later.
 *   - Remaining 1–3 questions are topic-specific.
 */
import { JSON_ONLY_DIRECTIVE, clamp, localeDirective } from '@/lib/praxis/prompts/_shared';
import {
  OnboardingInputType,
  OutlineUnit,
  PraxisLocale,
  PromptFixture,
} from '@/lib/praxis/prompts/types';

export const VERSION = 'onboarding.meta@1' as const;

export interface OnboardingMetaInput {
  locale: PraxisLocale;
  topic: string;
  /** The accepted outline. Lets the meta-prompt ground questions in units. */
  outline: ReadonlyArray<OutlineUnit>;
}

export interface OnboardingJson {
  questions: Array<{
    id: string;
    prompt: string;
    helperText: string | null;
    inputType: OnboardingInputType;
    /** Options array is present iff inputType === single_select. */
    options?: string[];
  }>;
}

const MIN_Q = 3;
const MAX_Q = 5;
const MAX_TOPIC_CHARS = 240;
const MAX_SUMMARY_CHARS = 200;

function renderOutline(outline: ReadonlyArray<OutlineUnit>): string {
  return outline
    .map((u, i) => `${i + 1}. ${u.title} — ${clamp(u.summary, MAX_SUMMARY_CHARS)}`)
    .join('\n');
}

export function build(input: OnboardingMetaInput): string {
  return [
    'You design short, topic-adaptive onboarding questionnaires for a learning platform called PRAXIS.',
    'The questions you emit will be shown to the learner right after they accept a curriculum outline, before any units are generated.',
    '',
    '## Method',
    `- Emit between ${MIN_Q} and ${MAX_Q} questions, in this order:`,
    '  1. One question about the learner\'s current role, situation, or level. Required.',
    '  2. One question about what they want to walk away able to do (their goal). Required.',
    '  3. 1–3 topic-specific questions that would meaningfully change how a coach personalises examples.',
    '- Each question must be answerable in ≤ 60 seconds.',
    '- Prefer short_text for open questions with clear answers, long_text only when paragraph detail genuinely helps, single_select when the answer space is small and closed.',
    '- For single_select, emit an "options" array of 3–5 plain strings.',
    '- Helper text is optional (use null) and never patronising.',
    '',
    '## Output schema',
    '{',
    '  "questions": [',
    '    {',
    '      "id": string,           // stable slug, lowercase, underscores, ≤ 30 chars',
    '      "prompt": string,       // the question text, ≤ 140 chars',
    '      "helperText": string | null,  // ≤ 140 chars',
    `      "inputType": "${OnboardingInputType.SHORT_TEXT}" | "${OnboardingInputType.LONG_TEXT}" | "${OnboardingInputType.SINGLE_SELECT}",`,
    '      "options": string[]     // present only if inputType is single_select',
    '    }',
    '  ]',
    '}',
    '',
    `## Locale\n${localeDirective(input.locale)}`,
    '',
    JSON_ONLY_DIRECTIVE,
    '',
    '## Topic',
    clamp(input.topic, MAX_TOPIC_CHARS),
    '',
    '## Accepted outline',
    renderOutline(input.outline),
  ].join('\n');
}

export const fixtures: ReadonlyArray<PromptFixture<OnboardingMetaInput>> = [
  {
    name: 'sales',
    input: {
      locale: PraxisLocale.EN,
      topic: 'sales',
      outline: [
        { title: 'Framing the first call', objective: '', summary: 'Openers that earn attention.' },
        { title: 'Finding real pain', objective: '', summary: 'Diagnostic questions that surface root problems.' },
        { title: 'Handling objections', objective: '', summary: 'Acknowledge, reframe, invite.' },
      ],
    },
  },
  {
    name: 'sql',
    input: {
      locale: PraxisLocale.EN,
      topic: 'SQL fundamentals',
      outline: [
        { title: 'Selecting and filtering', objective: '', summary: 'The shape of a query.' },
        { title: 'Joining tables', objective: '', summary: 'How relations line up across tables.' },
        { title: 'Aggregating and grouping', objective: '', summary: 'Summarising rows into answers.' },
      ],
    },
  },
  {
    name: 'thai_cooking',
    input: {
      locale: PraxisLocale.EN,
      topic: 'Thai cooking basics',
      outline: [
        { title: 'Building a pantry', objective: '', summary: 'Five pastes, three sauces, two starches.' },
        { title: 'Balancing the four flavours', objective: '', summary: 'Sweet, salty, sour, spicy on one plate.' },
        { title: 'Cooking a full meal', objective: '', summary: 'Three dishes that share prep.' },
      ],
    },
  },
];
