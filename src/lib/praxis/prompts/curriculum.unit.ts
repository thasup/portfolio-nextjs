/**
 * T-004 — Unit generation prompt.
 *
 * Expands one outline unit into structured content blocks (FR-012).
 * Blocks are independently regeneratable (FR-013), so the shape is
 * deliberately flat.
 *
 * Personalisation policy (research.md §6): onboarding answers flow in
 * as *reference* only. We do NOT rewrite explainer prose per learner,
 * because doing so destroys `praxis_unit_cache` hit rate. Instead we
 * let Nori's conversation layer do the personalisation at read time.
 *
 * The one exception is the final `practice` block: it is allowed to
 * name the learner's `product` or `goal` verbatim because practice
 * activities lose value when purely abstract. That is a controlled
 * leak of personalisation into the cached content.
 */
import { JSON_ONLY_DIRECTIVE, clamp, localeDirective, renderLearner } from '@/lib/praxis/prompts/_shared';
import {
  LearnerContext,
  OutlineUnit,
  PraxisLocale,
  PromptFixture,
  UnitBlockKind,
} from '@/lib/praxis/prompts/types';

export const VERSION = 'curriculum.unit@1' as const;

export interface CurriculumUnitInput {
  locale: PraxisLocale;
  topic: string;
  /** The accepted outline unit this prompt is expanding. */
  unit: OutlineUnit;
  /** Full outline for context — lets the model avoid repeating later units. */
  outline: ReadonlyArray<OutlineUnit>;
  /** 1-based index of `unit` within `outline`. */
  unitIndex: number;
  /** Null for cold cache generation; set for learner-scoped regeneration. */
  learner: LearnerContext | null;
}

export interface UnitJson {
  blocks: Array<{ kind: UnitBlockKind; content: string }>;
}

const MAX_TOPIC_CHARS = 240;
const MAX_SUMMARY_CHARS = 320;

function renderOutline(outline: ReadonlyArray<OutlineUnit>, activeIdx: number): string {
  return outline
    .map((u, i) => {
      const marker = i + 1 === activeIdx ? '>>' : '  ';
      return `${marker} ${i + 1}. ${u.title} — ${clamp(u.summary, MAX_SUMMARY_CHARS)}`;
    })
    .join('\n');
}

export function build(input: CurriculumUnitInput): string {
  const { locale, topic, unit, outline, unitIndex, learner } = input;

  return [
    'You are writing content for one unit of a personalised learning course inside PRAXIS.',
    'Write like a senior practitioner explaining to a thoughtful peer — concrete, specific, no filler.',
    '',
    '## Block kinds (emit in this order, exactly once each)',
    `1. ${UnitBlockKind.OBJECTIVES}: 3–5 bullet points, each a single sentence beginning with a verb. Markdown bullets.`,
    `2. ${UnitBlockKind.EXPLAINER}: 180–320 words of prose. No bullets. No subheadings. Paragraphs only.`,
    `3. ${UnitBlockKind.EXAMPLE}: One realistic example in 80–160 words, narrated in past tense.`,
    `4. ${UnitBlockKind.DIAGRAM_NOTE}: A short text description of a diagram that would help (≤ 60 words). No ASCII art. Do not emit an image URL.`,
    `5. ${UnitBlockKind.PRACTICE}: One practice activity the learner can do in ≤ 30 minutes. If the learner block names a product or goal, reference it once here by paraphrase.`,
    '',
    '## Rules',
    '- Do NOT personalise the explainer or example. They are cached and shared across learners.',
    '- Do NOT repeat content that belongs in later units of the outline.',
    '- Do NOT fabricate statistics, studies, or quotes.',
    '- Never address the reader as "you" more than twice per block.',
    '- Every block content is a single markdown string — no nested arrays.',
    '',
    '## Output schema',
    '{',
    '  "blocks": [',
    '    { "kind": "objectives", "content": string },',
    '    { "kind": "explainer", "content": string },',
    '    { "kind": "example", "content": string },',
    '    { "kind": "diagram_note", "content": string },',
    '    { "kind": "practice", "content": string }',
    '  ]',
    '}',
    '',
    `## Locale\n${localeDirective(locale)}`,
    '',
    JSON_ONLY_DIRECTIVE,
    '',
    '## Topic',
    clamp(topic, MAX_TOPIC_CHARS),
    '',
    '## Learner (reference for practice block only)',
    renderLearner(learner),
    '',
    '## Outline (>> marks the active unit)',
    renderOutline(outline, unitIndex),
    '',
    '## Active unit',
    `title: ${unit.title}`,
    `objective: ${unit.objective}`,
    `summary: ${clamp(unit.summary, MAX_SUMMARY_CHARS)}`,
  ].join('\n');
}

const SALES_OUTLINE: ReadonlyArray<OutlineUnit> = [
  {
    title: 'Framing the first call',
    objective: 'By the end you can open a discovery call without losing attention in the first minute.',
    summary:
      'Why cold openings fail, three openers that work across industries, how to pick the right one in under ten seconds.',
  },
  {
    title: 'Finding real pain',
    objective:
      'By the end you can surface a prospect\'s actual problem rather than the stated symptom.',
    summary:
      'Distinguishing surface complaints from root problems, five diagnostic questions, how to handle a prospect who has already decided what they want.',
  },
  {
    title: 'Handling four common objections',
    objective:
      'By the end you can respond to price, timing, authority, and "we already have one" without defensiveness.',
    summary:
      'A disciplined acknowledge–reframe–invite pattern, plus scripts for the four objections you will hear weekly.',
  },
  {
    title: 'Closing without pressure',
    objective: 'By the end you can ask for the next step in a way the prospect welcomes.',
    summary:
      'Why "always be closing" is counterproductive in modern B2B, three low-pressure closes, how to recognise when to walk away.',
  },
  {
    title: 'Running a full week end-to-end',
    objective:
      'By the end you can run a realistic week of prospecting, calls, and follow-ups without burning out.',
    summary:
      'Time-blocking the week, a simple pipeline review, what to drop, and how to end each day without unfinished threads.',
  },
];

export const fixtures: ReadonlyArray<PromptFixture<CurriculumUnitInput>> = [
  {
    name: 'sales_unit_1',
    input: {
      locale: PraxisLocale.EN,
      topic: 'sales',
      unit: SALES_OUTLINE[0],
      outline: SALES_OUTLINE,
      unitIndex: 1,
      learner: {
        displayName: 'Jane',
        role: 'Sales rep',
        product: 'SaaS payroll for Thai SMBs',
        audience: 'HR managers at 10–50 person firms',
        goal: 'Book 3 qualified demos per week',
      },
    },
  },
  {
    name: 'sales_unit_3_no_learner',
    input: {
      locale: PraxisLocale.EN,
      topic: 'sales',
      unit: SALES_OUTLINE[2],
      outline: SALES_OUTLINE,
      unitIndex: 3,
      learner: null,
    },
  },
];
