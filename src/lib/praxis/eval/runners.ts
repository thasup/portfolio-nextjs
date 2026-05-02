/**
 * Per-module runners for the Week 0 eval harness.
 *
 * Each runner is async: it calls the prompt module's `build()`, dispatches
 * through OpenRouter, parses/validates the response, and returns an
 * `EvalResult`. Runners are intentionally decoupled from the CLI so tests
 * and ad-hoc scripts can reuse them.
 */
import {
  ChatRole,
  OpenRouterClient,
  ResponseFormat,
  extractJson,
} from "@/lib/praxis/openrouter/client";
import {
  curriculumOutline,
  curriculumUnit,
  onboardingMeta,
  scopeGuardrail,
  templateGenerator,
  OnboardingInputType,
  ScopeCategory,
} from "@/lib/praxis/prompts";
import { EvalMode, EvalResult } from "@/lib/praxis/eval/types";
import {
  OUTLINE_CRITERIA,
  UNIT_CRITERIA,
  judge,
} from "@/lib/praxis/eval/judge";

interface RunnerContext {
  client: OpenRouterClient;
  generationModel: string;
  judgeModel: string;
  signal?: AbortSignal;
}

/** Wraps a generation call with timing + error capture. */
async function generate(
  ctx: RunnerContext,
  prompt: string,
  responseFormat: ResponseFormat,
): Promise<{
  content: string;
  inputTokens: number;
  outputTokens: number;
  durationMs: number;
}> {
  const start = Date.now();
  const res = await ctx.client.chat({
    model: ctx.generationModel,
    messages: [{ role: ChatRole.USER, content: prompt }],
    responseFormat,
    temperature: responseFormat === ResponseFormat.JSON_OBJECT ? 0.2 : 0.4,
    signal: ctx.signal,
  });
  return {
    content: res.content,
    inputTokens: res.usage.inputTokens,
    outputTokens: res.usage.outputTokens,
    durationMs: Date.now() - start,
  };
}

// ---------- Scope guardrail (binary) ----------

/** Fixture name prefix encodes the expected verdict. */
function expectedScopeVerdict(fixtureName: string): "admit" | "refuse" {
  if (fixtureName.startsWith("adversarial_")) return "refuse";
  if (fixtureName.startsWith("admit_")) return "admit";
  throw new Error(
    `scope fixture "${fixtureName}" must start with admit_ or adversarial_`,
  );
}

export async function runScopeFixture(
  ctx: RunnerContext,
  fixture: (typeof scopeGuardrail.fixtures)[number],
): Promise<EvalResult> {
  const prompt = scopeGuardrail.build(fixture.input);
  const expected = expectedScopeVerdict(fixture.name);

  try {
    const out = await generate(ctx, prompt, ResponseFormat.JSON_OBJECT);
    const parsed = extractJson<scopeGuardrail.ScopeGuardrailOutput>(
      out.content,
    );

    const actual: "admit" | "refuse" =
      parsed?.admitted === true && parsed.category === ScopeCategory.OK
        ? "admit"
        : "refuse";
    const passed = actual === expected;

    return {
      module: "scopeGuardrail",
      fixtureName: fixture.name,
      model: ctx.generationModel,
      mode: EvalMode.BINARY,
      rawOutput: out.content,
      parsed,
      passed,
      summary: `expected=${expected} actual=${actual}${parsed ? ` cat=${parsed.category}` : " parse_failed"}`,
      inputTokens: out.inputTokens,
      outputTokens: out.outputTokens,
      durationMs: out.durationMs,
      error: parsed ? null : "json parse failed",
    };
  } catch (err) {
    return errorResult(
      "scopeGuardrail",
      fixture.name,
      EvalMode.BINARY,
      ctx.generationModel,
      err,
    );
  }
}

// ---------- Curriculum outline (rubric) ----------

export async function runOutlineFixture(
  ctx: RunnerContext,
  fixture: (typeof curriculumOutline.fixtures)[number],
): Promise<EvalResult> {
  const prompt = curriculumOutline.build(fixture.input);
  try {
    const out = await generate(ctx, prompt, ResponseFormat.JSON_OBJECT);
    const parsed = extractJson<curriculumOutline.OutlineJson>(out.content);

    if (!parsed?.units?.length) {
      return {
        module: "curriculumOutline",
        fixtureName: fixture.name,
        model: ctx.generationModel,
        mode: EvalMode.RUBRIC,
        rawOutput: out.content,
        parsed,
        passed: false,
        summary: "json parse failed or empty units array",
        inputTokens: out.inputTokens,
        outputTokens: out.outputTokens,
        durationMs: out.durationMs,
        error: "schema failure",
      };
    }

    const judged = await judge({
      client: ctx.client,
      model: ctx.judgeModel,
      subject: `Curriculum outline for topic "${fixture.input.topic}"`,
      generated: JSON.stringify(parsed, null, 2),
      criteria: OUTLINE_CRITERIA,
      signal: ctx.signal,
    });

    return {
      module: "curriculumOutline",
      fixtureName: fixture.name,
      model: ctx.generationModel,
      mode: EvalMode.RUBRIC,
      rawOutput: out.content,
      parsed,
      passed: judged.mean >= 2.5,
      rubric: judged.scores,
      meanScore: judged.mean,
      summary: `mean=${judged.mean.toFixed(2)} units=${parsed.units.length}`,
      inputTokens: out.inputTokens + judged.inputTokens,
      outputTokens: out.outputTokens + judged.outputTokens,
      durationMs: out.durationMs,
      error: null,
    };
  } catch (err) {
    return errorResult(
      "curriculumOutline",
      fixture.name,
      EvalMode.RUBRIC,
      ctx.generationModel,
      err,
    );
  }
}

// ---------- Curriculum unit (rubric) ----------

export async function runUnitFixture(
  ctx: RunnerContext,
  fixture: (typeof curriculumUnit.fixtures)[number],
): Promise<EvalResult> {
  const prompt = curriculumUnit.build(fixture.input);
  try {
    const out = await generate(ctx, prompt, ResponseFormat.JSON_OBJECT);
    const parsed = extractJson<curriculumUnit.UnitJson>(out.content);

    if (!parsed?.blocks?.length) {
      return {
        module: "curriculumUnit",
        fixtureName: fixture.name,
        model: ctx.generationModel,
        mode: EvalMode.RUBRIC,
        rawOutput: out.content,
        parsed,
        passed: false,
        summary: "json parse failed or empty blocks",
        inputTokens: out.inputTokens,
        outputTokens: out.outputTokens,
        durationMs: out.durationMs,
        error: "schema failure",
      };
    }

    const judged = await judge({
      client: ctx.client,
      model: ctx.judgeModel,
      subject: `Unit "${fixture.input.unit.title}" for topic "${fixture.input.topic}"`,
      generated: JSON.stringify(parsed, null, 2),
      criteria: UNIT_CRITERIA,
      signal: ctx.signal,
    });

    return {
      module: "curriculumUnit",
      fixtureName: fixture.name,
      model: ctx.generationModel,
      mode: EvalMode.RUBRIC,
      rawOutput: out.content,
      parsed,
      passed: judged.mean >= 2.3,
      rubric: judged.scores,
      meanScore: judged.mean,
      summary: `mean=${judged.mean.toFixed(2)} blocks=${parsed.blocks.length}`,
      inputTokens: out.inputTokens + judged.inputTokens,
      outputTokens: out.outputTokens + judged.outputTokens,
      durationMs: out.durationMs,
      error: null,
    };
  } catch (err) {
    return errorResult(
      "curriculumUnit",
      fixture.name,
      EvalMode.RUBRIC,
      ctx.generationModel,
      err,
    );
  }
}

// ---------- Onboarding meta (heuristic) ----------

const ROLE_KEYWORDS = [
  "role",
  "job",
  "work",
  "title",
  "position",
  "level",
  "experience",
];
const GOAL_KEYWORDS = [
  "goal",
  "want",
  "hope",
  "walk away",
  "achieve",
  "outcome",
  "by the end",
];

export async function runOnboardingFixture(
  ctx: RunnerContext,
  fixture: (typeof onboardingMeta.fixtures)[number],
): Promise<EvalResult> {
  const prompt = onboardingMeta.build(fixture.input);
  try {
    const out = await generate(ctx, prompt, ResponseFormat.JSON_OBJECT);
    const parsed = extractJson<onboardingMeta.OnboardingJson>(out.content);

    if (!parsed?.questions?.length) {
      return schemaFailure(
        "onboardingMeta",
        fixture.name,
        EvalMode.HEURISTIC,
        ctx.generationModel,
        out,
        parsed,
      );
    }

    const count = parsed.questions.length;
    const countOk = count >= 3 && count <= 5;
    const lowerPrompts = parsed.questions.map((q) =>
      (q.prompt ?? "").toLowerCase(),
    );
    const hasRole = lowerPrompts.some((p) =>
      ROLE_KEYWORDS.some((k) => p.includes(k)),
    );
    const hasGoal = lowerPrompts.some((p) =>
      GOAL_KEYWORDS.some((k) => p.includes(k)),
    );
    const typesValid = parsed.questions.every((q) =>
      Object.values(OnboardingInputType).includes(q.inputType),
    );
    const singleSelectsValid = parsed.questions.every(
      (q) =>
        q.inputType !== OnboardingInputType.SINGLE_SELECT ||
        (q.options?.length ?? 0) >= 2,
    );

    const passed =
      countOk && hasRole && hasGoal && typesValid && singleSelectsValid;

    return {
      module: "onboardingMeta",
      fixtureName: fixture.name,
      model: ctx.generationModel,
      mode: EvalMode.HEURISTIC,
      rawOutput: out.content,
      parsed,
      passed,
      summary: `count=${count} role=${hasRole} goal=${hasGoal} types_ok=${typesValid} options_ok=${singleSelectsValid}`,
      inputTokens: out.inputTokens,
      outputTokens: out.outputTokens,
      durationMs: out.durationMs,
      error: null,
    };
  } catch (err) {
    return errorResult(
      "onboardingMeta",
      fixture.name,
      EvalMode.HEURISTIC,
      ctx.generationModel,
      err,
    );
  }
}

// ---------- Template generator (heuristic) ----------

export async function runTemplateFixture(
  ctx: RunnerContext,
  fixture: (typeof templateGenerator.fixtures)[number],
): Promise<EvalResult> {
  const prompt = templateGenerator.build(fixture.input);
  try {
    const out = await generate(ctx, prompt, ResponseFormat.JSON_OBJECT);
    const parsed = extractJson<templateGenerator.TemplateSpecJson>(out.content);

    if (!parsed?.sections?.length) {
      return schemaFailure(
        "templateGenerator",
        fixture.name,
        EvalMode.HEURISTIC,
        ctx.generationModel,
        out,
        parsed,
      );
    }

    // Count personalisation references across the rendered spec.
    const haystack = JSON.stringify(parsed).toLowerCase();
    const learner = fixture.input.learner;
    const candidates = [
      learner.displayName,
      learner.role,
      learner.product,
      learner.audience,
      learner.goal,
    ]
      .filter((v): v is string => !!v)
      .map((v) => v.toLowerCase());
    const refs = candidates.filter((c) =>
      haystack.includes(c.split(" ")[0] ?? c),
    ).length;

    const kindOk = parsed.kind === fixture.input.kind;
    const sectionsOk =
      parsed.sections.length >= 3 && parsed.sections.length <= 6;
    const xlsxNeedsTables =
      fixture.input.kind !== "xlsx" ||
      parsed.sections.filter((s) => s.table?.columns?.length).length >=
        Math.ceil(parsed.sections.length / 2);
    const personalisationOk = refs >= 3;

    const passed = kindOk && sectionsOk && xlsxNeedsTables && personalisationOk;

    return {
      module: "templateGenerator",
      fixtureName: fixture.name,
      model: ctx.generationModel,
      mode: EvalMode.HEURISTIC,
      rawOutput: out.content,
      parsed,
      passed,
      summary: `kind_ok=${kindOk} sections=${parsed.sections.length} refs=${refs} xlsx_tables_ok=${xlsxNeedsTables}`,
      inputTokens: out.inputTokens,
      outputTokens: out.outputTokens,
      durationMs: out.durationMs,
      error: null,
    };
  } catch (err) {
    return errorResult(
      "templateGenerator",
      fixture.name,
      EvalMode.HEURISTIC,
      ctx.generationModel,
      err,
    );
  }
}

// ---------- shared helpers ----------

function errorResult(
  module: EvalResult["module"],
  fixtureName: string,
  mode: EvalMode,
  model: string,
  err: unknown,
): EvalResult {
  const message = err instanceof Error ? err.message : String(err);
  return {
    module,
    fixtureName,
    model,
    mode,
    rawOutput: "",
    parsed: null,
    passed: false,
    summary: `error: ${message.slice(0, 200)}`,
    inputTokens: 0,
    outputTokens: 0,
    durationMs: 0,
    error: message,
  };
}

function schemaFailure(
  module: EvalResult["module"],
  fixtureName: string,
  mode: EvalMode,
  model: string,
  out: {
    content: string;
    inputTokens: number;
    outputTokens: number;
    durationMs: number;
  },
  parsed: unknown,
): EvalResult {
  return {
    module,
    fixtureName,
    model,
    mode,
    rawOutput: out.content,
    parsed,
    passed: false,
    summary: "json parse failed or empty top-level array",
    inputTokens: out.inputTokens,
    outputTokens: out.outputTokens,
    durationMs: out.durationMs,
    error: "schema failure",
  };
}

export type { RunnerContext };
