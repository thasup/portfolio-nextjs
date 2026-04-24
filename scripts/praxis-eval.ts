/**
 * PRAXIS Week-0 eval harness CLI.
 *
 * Runs every fixture in `src/lib/praxis/prompts/*` through OpenRouter,
 * scores them against the rubric/binary/heuristic specified by the
 * runner, and writes a CSV + Markdown report to
 * `.windsurf/docs/praxis-eval/<timestamp>.{csv,md}`.
 *
 * Usage:
 *   npm run praxis:eval                 # all modules
 *   npm run praxis:eval -- --module=curriculumOutline
 *   npm run praxis:eval -- --model=openai/gpt-4o-mini
 *   npm run praxis:eval -- --judge=anthropic/claude-sonnet-4
 *
 * Required env (read from `.env.local` via `tsx --env-file`):
 *   - OPENROUTER_API_KEY
 * Optional env:
 *   - PRAXIS_EVAL_MODEL       (default: anthropic/claude-sonnet-4)
 *   - PRAXIS_EVAL_JUDGE_MODEL (default: same as PRAXIS_EVAL_MODEL)
 *   - NEXT_PUBLIC_SITE_URL    (forwarded as HTTP-Referer)
 */
import path from 'node:path';
import {
  curriculumOutline,
  curriculumUnit,
  onboardingMeta,
  scopeGuardrail,
  templateGenerator,
  PromptModuleKey,
} from '@/lib/praxis/prompts';
import { OpenRouterClient } from '@/lib/praxis/openrouter/client';
import { EvalResult, EvalRun } from '@/lib/praxis/eval/types';
import {
  RunnerContext,
  runOnboardingFixture,
  runOutlineFixture,
  runScopeFixture,
  runTemplateFixture,
  runUnitFixture,
} from '@/lib/praxis/eval/runners';
import { writeReport } from '@/lib/praxis/eval/report';

interface CliArgs {
  module: PromptModuleKey | 'all';
  model: string;
  judge: string;
  outputDir: string;
}

const DEFAULT_MODEL = 'anthropic/claude-sonnet-4';
const DEFAULT_OUTPUT_DIR = '.windsurf/docs/praxis-eval';

function parseArgs(argv: string[]): CliArgs {
  const args: Partial<CliArgs> = {};
  for (const raw of argv) {
    const m = raw.match(/^--([^=]+)=(.+)$/);
    if (!m) continue;
    const [, key, value] = m;
    if (key === 'module') args.module = value as CliArgs['module'];
    if (key === 'model') args.model = value;
    if (key === 'judge') args.judge = value;
    if (key === 'out') args.outputDir = value;
  }
  const envModel = process.env.PRAXIS_EVAL_MODEL ?? DEFAULT_MODEL;
  const envJudge = process.env.PRAXIS_EVAL_JUDGE_MODEL ?? envModel;
  return {
    module: args.module ?? 'all',
    model: args.model ?? envModel,
    judge: args.judge ?? envJudge,
    outputDir: args.outputDir ?? DEFAULT_OUTPUT_DIR,
  };
}

async function runModule<T>(
  label: PromptModuleKey,
  filter: CliArgs['module'],
  fixtures: ReadonlyArray<T>,
  runner: (ctx: RunnerContext, fixture: T) => Promise<EvalResult>,
  ctx: RunnerContext,
): Promise<EvalResult[]> {
  if (filter !== 'all' && filter !== label) return [];
  const results: EvalResult[] = [];
  for (const fixture of fixtures) {
    const name = (fixture as { name?: string }).name ?? '(unnamed)';
    process.stdout.write(`  · ${label} / ${name} … `);
    const result = await runner(ctx, fixture);
    process.stdout.write(`${result.passed ? 'PASS' : 'FAIL'} (${result.summary})\n`);
    results.push(result);
  }
  return results;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error(
      'OPENROUTER_API_KEY is not set. Add it to .env.local or export it in your shell.',
    );
    process.exit(2);
  }

  const client = new OpenRouterClient({
    apiKey,
    referer: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://thanachon.me',
    title: 'PRAXIS Eval',
  });

  const ctx: RunnerContext = {
    client,
    generationModel: args.model,
    judgeModel: args.judge,
  };

  console.log(`PRAXIS eval`);
  console.log(`  model: ${args.model}`);
  console.log(`  judge: ${args.judge}`);
  console.log(`  filter: ${args.module}`);
  console.log('');

  const startedAt = new Date().toISOString();
  const results: EvalResult[] = [];

  results.push(...(await runModule('scopeGuardrail', args.module, scopeGuardrail.fixtures, runScopeFixture, ctx)));
  results.push(
    ...(await runModule('curriculumOutline', args.module, curriculumOutline.fixtures, runOutlineFixture, ctx)),
  );
  results.push(...(await runModule('curriculumUnit', args.module, curriculumUnit.fixtures, runUnitFixture, ctx)));
  results.push(
    ...(await runModule('onboardingMeta', args.module, onboardingMeta.fixtures, runOnboardingFixture, ctx)),
  );
  results.push(
    ...(await runModule('templateGenerator', args.module, templateGenerator.fixtures, runTemplateFixture, ctx)),
  );

  const finishedAt = new Date().toISOString();
  const run: EvalRun = {
    startedAt,
    finishedAt,
    generationModel: args.model,
    judgeModel: args.judge,
    results,
  };

  const { csvPath, markdownPath } = await writeReport(run, path.resolve(process.cwd(), args.outputDir));
  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;

  console.log('');
  console.log(`Done. ${passed}/${results.length} passed, ${failed} failed.`);
  console.log(`  CSV:  ${csvPath}`);
  console.log(`  MD:   ${markdownPath}`);

  process.exit(failed === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
