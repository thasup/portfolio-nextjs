/**
 * T-006 — Template generator prompt.
 *
 * Produces a `TemplateSpec` JSON object that renderers in
 * `src/lib/praxis/templates/` (Week 6) convert into DOCX or XLSX.
 * PDF is out of scope for Phase 1 (research.md §8) but the kind enum
 * accepts it for architectural forward-compat.
 *
 * Personalisation is *required* here — a generic template is worse
 * than no template (see spec.md User Story 4). The prompt must
 * reference the learner's onboarding context in at least three
 * concrete substitutions.
 */
import {
  JSON_ONLY_DIRECTIVE,
  clamp,
  localeDirective,
  renderLearner,
  renderUnit,
} from "@/lib/praxis/prompts/_shared";
import {
  LearnerContext,
  PraxisLocale,
  PromptFixture,
  TemplateKind,
  UnitContext,
} from "@/lib/praxis/prompts/types";

export const VERSION = "template.generator@1" as const;

export interface TemplateGeneratorInput {
  locale: PraxisLocale;
  topic: string;
  /** Optional: the unit the template was requested from. */
  unit: UnitContext | null;
  learner: LearnerContext;
  kind: TemplateKind;
  /**
   * Free-form instruction from the regenerate affordance
   * (e.g. "make it for enterprise buyers, not SMB"). Empty string on
   * first generation.
   */
  regenerateNote: string;
  /** A short, human title (shown in preview). Derived from unit or topic. */
  desiredTitle: string;
}

export interface TemplateSpecJson {
  kind: TemplateKind;
  title: string;
  sections: Array<{
    heading: string;
    body: string;
    table?: {
      columns: string[];
      rows: string[][];
    };
  }>;
}

const MAX_TOPIC_CHARS = 240;
const MAX_TITLE_CHARS = 120;
const MAX_NOTE_CHARS = 400;

function kindGuidance(kind: TemplateKind): string {
  switch (kind) {
    case TemplateKind.DOCX:
      return "Prefer sections with short paragraph bodies. Tables are allowed but optional. Target a one-to-two page document when printed.";
    case TemplateKind.XLSX:
      return "Most sections MUST include a `table` field. Each table has a column header row plus 3–10 example data rows. Keep column count ≤ 6.";
    case TemplateKind.PDF:
      return "Prefer a clean layout suitable for print. Same structure as DOCX.";
    default:
      return "";
  }
}

export function build(input: TemplateGeneratorInput): string {
  const { locale, topic, unit, learner, kind, regenerateNote, desiredTitle } =
    input;

  return [
    "You are preparing a downloadable template for one specific learner inside PRAXIS.",
    "The template must be immediately useful for a real situation the learner described — not a generic framework.",
    "",
    "## Personalisation budget",
    "- Reference at least THREE concrete details from the learner block across the sections (product, audience, goal, role, or named extras).",
    '- Where you name a detail, integrate it naturally — never write "INSERT YOUR PRODUCT HERE".',
    "- Do not invent facts the learner did not provide.",
    "",
    "## Section guidance",
    `- ${kindGuidance(kind)}`,
    "- Each section has a `heading` (≤ 80 chars) and a `body` (markdown, ≤ 480 chars).",
    "- Tables: `columns` is a string array (header row); `rows` is a string matrix. Omit `table` when not useful.",
    "- Emit 3–6 sections total. Fewer when the template is a pure checklist; more when a worked example is needed.",
    "",
    "## Output schema",
    "{",
    `  "kind": "${kind}",`,
    '  "title": string,',
    '  "sections": [',
    "    {",
    '      "heading": string,',
    '      "body": string,',
    '      "table": { "columns": string[], "rows": string[][] } | undefined',
    "    }",
    "  ]",
    "}",
    "",
    `## Locale\n${localeDirective(locale)}`,
    "",
    JSON_ONLY_DIRECTIVE,
    "",
    "## Topic",
    clamp(topic, MAX_TOPIC_CHARS),
    "",
    "## Unit (may be empty for topic-level templates)",
    renderUnit(unit),
    "",
    "## Learner",
    renderLearner(learner),
    "",
    `## Template kind\n${kind}`,
    `## Desired title\n${clamp(desiredTitle, MAX_TITLE_CHARS)}`,
    regenerateNote
      ? `\n## Regeneration note (apply this first)\n${clamp(regenerateNote, MAX_NOTE_CHARS)}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export const fixtures: ReadonlyArray<PromptFixture<TemplateGeneratorInput>> = [
  {
    name: "sales_discovery_call_docx",
    input: {
      locale: PraxisLocale.EN,
      topic: "sales",
      unit: {
        title: "Framing the first call",
        objective: "Earn the first sixty seconds of attention.",
        summary: "Openers that work across industries.",
      },
      learner: {
        displayName: "Jane",
        role: "Sales rep",
        product: "SaaS payroll for Thai SMBs",
        audience: "HR managers at 10–50 person firms",
        goal: "Book 3 qualified demos per week",
      },
      kind: TemplateKind.DOCX,
      regenerateNote: "",
      desiredTitle: "Discovery call opening script",
    },
  },
  {
    name: "sales_pipeline_xlsx",
    input: {
      locale: PraxisLocale.EN,
      topic: "sales",
      unit: null,
      learner: {
        displayName: "Jane",
        role: "Sales rep",
        product: "SaaS payroll for Thai SMBs",
        audience: "HR managers at 10–50 person firms",
        goal: "Book 3 qualified demos per week",
      },
      kind: TemplateKind.XLSX,
      regenerateNote: "focus on weekly review, not monthly",
      desiredTitle: "Weekly pipeline tracker",
    },
  },
];
