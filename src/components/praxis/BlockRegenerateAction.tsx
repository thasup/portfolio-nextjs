'use client';

/**
 * `BlockRegenerateAction` — inline UI for block-level regeneration.
 *
 * Shows a "Regenerate" button. On click, expands into a text input
 * where the learner provides an instruction (e.g. "use a Thai company
 * example"). Submits to `POST /api/praxis/unit` with action
 * `regenerate_block`.
 */
import { useState, useRef, useCallback } from 'react';
import type { UnitBlockKind } from '@/lib/praxis/prompts/types';
import { showApiError } from '@/lib/praxis/toast';

export interface BlockRegenerateActionProps {
  unitId: string;
  blockId: string;
  blockKind: UnitBlockKind;
  isRegenerating: boolean;
  onStartRegenerate: () => void;
  onRegenerated: (newBlock: {
    id: string;
    kind: UnitBlockKind;
    content: string;
    regeneratedFrom: string;
  }) => void;
}

export function BlockRegenerateAction({
  unitId,
  blockId,
  blockKind,
  isRegenerating,
  onStartRegenerate,
  onRegenerated,
}: BlockRegenerateActionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [instruction, setInstruction] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleExpand = useCallback(() => {
    setIsExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const handleCancel = useCallback(() => {
    setIsExpanded(false);
    setInstruction('');
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!instruction.trim()) return;

    onStartRegenerate();

    try {
      const res = await fetch('/api/praxis/unit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'regenerate_block',
          unitId,
          blockId,
          instruction: instruction.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const error = new Error(data?.error?.message ?? `Request failed (${res.status})`);
        (error as { code?: string }).code = data?.error?.code;
        throw error;
      }

      const data = await res.json();
      onRegenerated({
        id: data.block.id,
        kind: blockKind,
        content: data.block.content,
        regeneratedFrom: data.block.regeneratedFrom,
      });

      setIsExpanded(false);
      setInstruction('');
    } catch (err) {
      showApiError(err, {
        description: 'Block regeneration failed. You can try again.',
      });
    }
  }, [unitId, blockId, blockKind, instruction, onStartRegenerate, onRegenerated]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
      if (e.key === 'Escape') {
        handleCancel();
      }
    },
    [handleSubmit, handleCancel],
  );

  if (!isExpanded) {
    return (
      <button
        id={`regen-btn-${blockId}`}
        type="button"
        onClick={handleExpand}
        disabled={isRegenerating}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
          <path d="M16 21h5v-5" />
        </svg>
        Regenerate
      </button>
    );
  }

  return (
    <div className="flex w-full items-center gap-2">
      <input
        ref={inputRef}
        id={`regen-input-${blockId}`}
        type="text"
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="What should change?"
        disabled={isRegenerating}
        maxLength={500}
        className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none disabled:opacity-50"
      />
      <button
        id={`regen-submit-${blockId}`}
        type="button"
        onClick={handleSubmit}
        disabled={isRegenerating || !instruction.trim()}
        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isRegenerating ? (
          <>
            <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            Regenerating…
          </>
        ) : (
          'Go'
        )}
      </button>
      {!isRegenerating && (
        <button
          type="button"
          onClick={handleCancel}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
