/**
 * Eval report writer.
 *
 * Emits two artefacts per run:
 *   1. CSV at `.windsurf/docs/praxis-eval/<date>.csv` — machine-readable
 *      row per fixture, suitable for diffing across iterations.
 *   2. Markdown summary at `.windsurf/docs/praxis-eval/<date>.md` — the
 *      file referenced in `tasks.md` and the living plan changelog.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { EXIT_BAR, EvalRun } from '@/lib/praxis/eval/types';

export interface WrittenReport {
  csvPath: string;
  markdownPath: string;
}

function csvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  const s = String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function buildCsv(run: EvalRun): string {
  const header = [
    'module',
    'fixture',
    'mode',
    'passed',
    'mean_score',
    'input_tokens',
    'output_tokens',
    'duration_ms',
    'summary',
    'error',
  ];
  const rows = run.results.map((r) =>
    [
      r.module,
      r.fixtureName,
      r.mode,
      r.passed ? '1' : '0',
      r.meanScore ?? '',
      r.inputTokens,
      r.outputTokens,
      r.durationMs,
      r.summary,
      r.error ?? '',
    ]
      .map(csvCell)
      .join(','),
  );
  return [header.join(','), ...rows].join('\n');
}

interface ModuleStats {
  total: number;
  passed: number;
  meanScoreAvg: number | null;
  inputTokens: number;
  outputTokens: number;
}

function aggregate(run: EvalRun): Map<string, ModuleStats> {
  const byModule = new Map<string, ModuleStats>();
  for (const r of run.results) {
    const cur = byModule.get(r.module) ?? {
      total: 0,
      passed: 0,
      meanScoreAvg: null,
      inputTokens: 0,
      outputTokens: 0,
    };
    cur.total += 1;
    if (r.passed) cur.passed += 1;
    cur.inputTokens += r.inputTokens;
    cur.outputTokens += r.outputTokens;
    if (typeof r.meanScore === 'number') {
      const prev = cur.meanScoreAvg ?? 0;
      const prevCount = (cur as { _ms?: number })._ms ?? 0;
      const next = (prev * prevCount + r.meanScore) / (prevCount + 1);
      cur.meanScoreAvg = next;
      (cur as { _ms?: number })._ms = prevCount + 1;
    }
    byModule.set(r.module, cur);
  }
  return byModule;
}

function buildMarkdown(run: EvalRun): string {
  const stats = aggregate(run);
  const totalIn = run.results.reduce((s, r) => s + r.inputTokens, 0);
  const totalOut = run.results.reduce((s, r) => s + r.outputTokens, 0);

  const outline = stats.get('curriculumOutline');
  const unit = stats.get('curriculumUnit');
  const scope = stats.get('scopeGuardrail');

  const outlineOk = outline && (outline.meanScoreAvg ?? 0) >= EXIT_BAR.OUTLINE_MIN_MEAN;
  const unitOk = unit && (unit.meanScoreAvg ?? 0) >= EXIT_BAR.UNIT_MIN_MEAN;
  const scopeOk = scope && scope.total > 0 && scope.passed / scope.total >= EXIT_BAR.SCOPE_MIN_PASS_RATE;

  const lines: string[] = [];
  lines.push('# PRAXIS prompt eval');
  lines.push('');
  lines.push(`- **Started**: ${run.startedAt}`);
  lines.push(`- **Finished**: ${run.finishedAt}`);
  lines.push(`- **Generation model**: \`${run.generationModel}\``);
  lines.push(`- **Judge model**: \`${run.judgeModel}\``);
  lines.push(`- **Fixtures**: ${run.results.length}`);
  lines.push(`- **Total tokens**: in=${totalIn}, out=${totalOut}`);
  lines.push('');

  lines.push('## Week 0 exit bar');
  lines.push('');
  lines.push(`- Outline ≥ ${EXIT_BAR.OUTLINE_MIN_MEAN}: ${outlineOk ? 'PASS' : 'FAIL'} (mean=${(outline?.meanScoreAvg ?? 0).toFixed(2)})`);
  lines.push(`- Unit ≥ ${EXIT_BAR.UNIT_MIN_MEAN}: ${unitOk ? 'PASS' : 'FAIL'} (mean=${(unit?.meanScoreAvg ?? 0).toFixed(2)})`);
  lines.push(`- Scope pass rate ≥ ${EXIT_BAR.SCOPE_MIN_PASS_RATE}: ${scopeOk ? 'PASS' : 'FAIL'} (${scope?.passed ?? 0}/${scope?.total ?? 0})`);
  lines.push('');

  lines.push('## Module summary');
  lines.push('');
  lines.push('| Module | Total | Passed | Mean | Tokens in | Tokens out |');
  lines.push('| --- | --- | --- | --- | --- | --- |');
  for (const [name, s] of stats) {
    const mean = typeof s.meanScoreAvg === 'number' ? s.meanScoreAvg.toFixed(2) : '—';
    lines.push(`| ${name} | ${s.total} | ${s.passed} | ${mean} | ${s.inputTokens} | ${s.outputTokens} |`);
  }
  lines.push('');

  lines.push('## Per-fixture results');
  lines.push('');
  lines.push('| Module | Fixture | Pass | Mean | Summary |');
  lines.push('| --- | --- | --- | --- | --- |');
  for (const r of run.results) {
    const mean = typeof r.meanScore === 'number' ? r.meanScore.toFixed(2) : '—';
    const summary = r.summary.replace(/\|/g, '\\|');
    lines.push(`| ${r.module} | ${r.fixtureName} | ${r.passed ? '✅' : '❌'} | ${mean} | ${summary} |`);
  }
  lines.push('');

  const failures = run.results.filter((r) => !r.passed);
  if (failures.length) {
    lines.push('## Failures');
    lines.push('');
    for (const f of failures) {
      lines.push(`### ${f.module} · ${f.fixtureName}`);
      lines.push('');
      lines.push(`- **Summary**: ${f.summary}`);
      if (f.error) lines.push(`- **Error**: ${f.error}`);
      if (f.rubric?.length) {
        lines.push('- **Rubric**:');
        for (const s of f.rubric) {
          lines.push(`  - ${s.criterion}: ${s.score}/3 — ${s.note || '(no note)'}`);
        }
      }
      const raw = f.rawOutput.slice(0, 2000);
      if (raw) {
        lines.push('');
        lines.push('<details><summary>Raw output (first 2 KB)</summary>');
        lines.push('');
        lines.push('```');
        lines.push(raw);
        lines.push('```');
        lines.push('');
        lines.push('</details>');
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}

function dateSlug(iso: string): string {
  // YYYY-MM-DDTHH-MM-SS (filesystem-safe)
  return iso.replace(/:/g, '-').replace(/\..+$/, '');
}

export async function writeReport(run: EvalRun, outputDir: string): Promise<WrittenReport> {
  await mkdir(outputDir, { recursive: true });
  const slug = dateSlug(run.startedAt);
  const csvPath = path.join(outputDir, `${slug}.csv`);
  const markdownPath = path.join(outputDir, `${slug}.md`);
  await Promise.all([
    writeFile(csvPath, buildCsv(run), 'utf8'),
    writeFile(markdownPath, buildMarkdown(run), 'utf8'),
  ]);
  return { csvPath, markdownPath };
}
