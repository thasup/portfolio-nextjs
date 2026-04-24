'use client';

/**
 * `UnitRenderer` — the full unit view orchestrator.
 *
 * Responsibilities:
 *   1. On mount, call `POST /api/praxis/unit { action: "generate" }`
 *      if the unit status is `pending` or `failed`.
 *   2. Render a loading state while generating.
 *   3. Render the block list via `ContentBlock` once ready.
 *   4. Show a "Mark complete" button + progress.
 */
import { useState, useEffect, useCallback } from 'react';
import { ContentBlock, type ContentBlockProps } from '@/components/praxis/ContentBlock';
import type { UnitBlockKind } from '@/lib/praxis/prompts/types';

interface UnitBlock {
  id: string;
  kind: UnitBlockKind;
  content: string;
  regeneratedFrom: string | null;
  generatedAt: string;
}

export interface UnitRendererProps {
  unitId: string;
  unitTitle: string;
  unitObjective: string;
  unitIndex: number;
  initialStatus: string;
  initialBlocks: UnitBlock[];
  topicId: string;
  topicTitle: string;
}

enum Phase {
  LOADING = 'loading',
  GENERATING = 'generating',
  READY = 'ready',
  COMPLETED = 'completed',
  ERROR = 'error',
}

export function UnitRenderer({
  unitId,
  unitTitle,
  unitObjective,
  unitIndex,
  initialStatus,
  initialBlocks,
  topicId,
  topicTitle,
}: UnitRendererProps) {
  const [phase, setPhase] = useState<Phase>(() => {
    if (initialStatus === 'completed') return Phase.COMPLETED;
    if (initialStatus === 'ready' && initialBlocks.length > 0) return Phase.READY;
    return Phase.LOADING;
  });
  const [blocks, setBlocks] = useState<UnitBlock[]>(initialBlocks);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  // Auto-generate if unit isn't ready yet.
  useEffect(() => {
    if (phase !== Phase.LOADING) return;

    let cancelled = false;

    async function generate() {
      setPhase(Phase.GENERATING);

      try {
        const res = await fetch('/api/praxis/unit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'generate', unitId }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error?.message ?? `Generation failed (${res.status})`);
        }

        const data = await res.json();
        if (!cancelled) {
          // Filter to latest version of each block kind (skip old regenerated ones).
          const latestBlocks = getLatestBlocks(data.unit.blocks ?? []);
          setBlocks(latestBlocks);
          setPhase(data.unit.status === 'completed' ? Phase.COMPLETED : Phase.READY);
        }
      } catch (err) {
        if (!cancelled) {
          setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
          setPhase(Phase.ERROR);
        }
      }
    }

    generate();
    return () => {
      cancelled = true;
    };
  }, [phase, unitId]);

  const handleBlockRegenerated = useCallback(
    (newBlock: { id: string; kind: UnitBlockKind; content: string; regeneratedFrom: string }) => {
      setBlocks((prev) => {
        const updated = [...prev, { ...newBlock, generatedAt: new Date().toISOString() }];
        return getLatestBlocks(updated);
      });
    },
    [],
  );

  const handleMarkComplete = useCallback(async () => {
    setIsCompleting(true);
    try {
      const res = await fetch('/api/praxis/unit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'complete', unitId }),
      });
      if (!res.ok) {
        throw new Error('Failed to mark complete');
      }
      setPhase(Phase.COMPLETED);
    } catch {
      // Don't block the UI on failure.
    } finally {
      setIsCompleting(false);
    }
  }, [unitId]);

  const handleRetry = useCallback(() => {
    setErrorMessage(null);
    setPhase(Phase.LOADING);
  }, []);

  return (
    <div id="unit-renderer" className="space-y-8">
      {/* Header */}
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {unitIndex}
          </span>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Unit {unitIndex} · {topicTitle}
          </p>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{unitTitle}</h1>
        <p className="text-sm text-muted-foreground">{unitObjective}</p>
      </header>

      {/* Phase: generating */}
      {phase === Phase.GENERATING && (
        <div
          id="unit-generating-indicator"
          className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card px-6 py-16 text-center"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-foreground">Generating your unit content…</p>
          <p className="text-xs text-muted-foreground">This usually takes 10–20 seconds.</p>
        </div>
      )}

      {/* Phase: error */}
      {phase === Phase.ERROR && (
        <div
          id="unit-error-card"
          className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-destructive/30 bg-card px-6 py-12 text-center"
        >
          <p className="text-sm font-medium text-foreground">Something went wrong</p>
          <p className="text-xs text-muted-foreground">{errorMessage}</p>
          <button
            id="unit-retry-btn"
            type="button"
            onClick={handleRetry}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Try again
          </button>
        </div>
      )}

      {/* Phase: ready / completed — render blocks */}
      {(phase === Phase.READY || phase === Phase.COMPLETED) && (
        <>
          <div className="space-y-4">
            {blocks.map((block) => (
              <ContentBlock
                key={block.id}
                id={block.id}
                kind={block.kind}
                content={block.content}
                regeneratedFrom={block.regeneratedFrom}
                unitId={unitId}
                onRegenerated={handleBlockRegenerated}
              />
            ))}
          </div>

          {/* Completion bar */}
          <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-5">
            {phase === Phase.COMPLETED ? (
              <div className="flex items-center gap-2">
                <span className="text-lg" aria-hidden="true">
                  ✅
                </span>
                <p className="text-sm font-medium text-foreground">Unit complete</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Finished reading? Mark this unit as complete.
                </p>
                <button
                  id="mark-complete-btn"
                  type="button"
                  onClick={handleMarkComplete}
                  disabled={isCompleting}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {isCompleting ? 'Saving…' : 'Mark complete'}
                </button>
              </>
            )}

            <a
              href={`/learn/${topicId}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              Back to overview
            </a>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Given a blocks array that may contain old + regenerated versions,
 * return only the latest version of each block kind. The convention
 * is append-only: newer blocks have `regeneratedFrom` pointing at
 * the older block they replaced.
 */
function getLatestBlocks(blocks: UnitBlock[]): UnitBlock[] {
  // Build a set of IDs that have been superseded.
  const superseded = new Set<string>();
  for (const b of blocks) {
    if (b.regeneratedFrom) {
      superseded.add(b.regeneratedFrom);
    }
  }
  // Return only blocks that haven't been superseded.
  return blocks.filter((b) => !superseded.has(b.id));
}
