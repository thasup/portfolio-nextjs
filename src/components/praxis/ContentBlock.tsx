'use client';

/**
 * `ContentBlock` — renders a single content block from a generated unit.
 *
 * Each block has a kind badge, markdown content, and an optional
 * "regenerate" action that triggers inline block regeneration.
 *
 * Markdown rendering is intentionally simple (no MDX): we use
 * `dangerouslySetInnerHTML` with a minimal markdown-to-HTML transform
 * since the content is server-generated (not user-authored).
 */
import { useState, useCallback } from 'react';
import { UnitBlockKind } from '@/lib/praxis/prompts/types';
import { BlockRegenerateAction } from '@/components/praxis/BlockRegenerateAction';

export interface ContentBlockProps {
  id: string;
  kind: UnitBlockKind;
  content: string;
  regeneratedFrom: string | null;
  unitId: string;
  onRegenerated?: (newBlock: {
    id: string;
    kind: UnitBlockKind;
    content: string;
    regeneratedFrom: string;
  }) => void;
}

const KIND_LABELS: Record<UnitBlockKind, string> = {
  [UnitBlockKind.OBJECTIVES]: 'Objectives',
  [UnitBlockKind.EXPLAINER]: 'Explainer',
  [UnitBlockKind.EXAMPLE]: 'Example',
  [UnitBlockKind.DIAGRAM_NOTE]: 'Diagram Note',
  [UnitBlockKind.PRACTICE]: 'Practice',
};

const KIND_ICONS: Record<UnitBlockKind, string> = {
  [UnitBlockKind.OBJECTIVES]: '🎯',
  [UnitBlockKind.EXPLAINER]: '📖',
  [UnitBlockKind.EXAMPLE]: '💡',
  [UnitBlockKind.DIAGRAM_NOTE]: '📊',
  [UnitBlockKind.PRACTICE]: '🏋️',
};

/**
 * Minimal markdown-to-HTML. Handles: headings, bold, italic, bullets,
 * code blocks, inline code, paragraphs. No external dependency.
 */
function markdownToHtml(md: string): string {
  let html = md
    // Code blocks (``` ... ```)
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Headings (### > ## > #)
    .replace(/^### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^## (.+)$/gm, '<h3>$1</h3>')
    .replace(/^# (.+)$/gm, '<h2>$1</h2>');

  // Bullet lists: group consecutive `- ` lines.
  html = html.replace(/(^- .+\n?)+/gm, (match) => {
    const items = match
      .trim()
      .split('\n')
      .map((line) => `<li>${line.replace(/^- /, '')}</li>`)
      .join('');
    return `<ul>${items}</ul>`;
  });

  // Paragraphs: wrap remaining bare lines.
  html = html
    .split('\n\n')
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (
        trimmed.startsWith('<h') ||
        trimmed.startsWith('<ul') ||
        trimmed.startsWith('<pre') ||
        trimmed.startsWith('<ol')
      ) {
        return trimmed;
      }
      return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`;
    })
    .join('');

  return html;
}

export function ContentBlock({
  id,
  kind,
  content,
  regeneratedFrom,
  unitId,
  onRegenerated,
}: ContentBlockProps) {
  const [currentContent, setCurrentContent] = useState(content);
  const [currentId, setCurrentId] = useState(id);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerated = useCallback(
    (newBlock: { id: string; kind: UnitBlockKind; content: string; regeneratedFrom: string }) => {
      setCurrentContent(newBlock.content);
      setCurrentId(newBlock.id);
      setIsRegenerating(false);
      onRegenerated?.(newBlock);
    },
    [onRegenerated],
  );

  return (
    <section
      id={`block-${currentId}`}
      className={`group relative ${
        kind === UnitBlockKind.PRACTICE
          ? 'practice'
          : kind === UnitBlockKind.DIAGRAM_NOTE || kind === UnitBlockKind.EXAMPLE
          ? 'callout'
          : 'mb-8'
      }`}
    >
      {/* Kind badge (only prominent for certain blocks in Praxis, but we keep it subtle for standard blocks) */}
      {(kind === UnitBlockKind.PRACTICE || kind === UnitBlockKind.DIAGRAM_NOTE || kind === UnitBlockKind.EXAMPLE) ? (
        <h4>{KIND_ICONS[kind]} {KIND_LABELS[kind]}</h4>
      ) : (
        <div className="mb-2 flex items-center gap-2">
          <span className="eyebrow opacity-50 group-hover:opacity-100 transition-opacity">
            {KIND_ICONS[kind]} {KIND_LABELS[kind]}
          </span>
          {regeneratedFrom && (
            <span className="rounded-full bg-[var(--color-praxis-accent-soft)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-praxis-accent)]">
              Regenerated
            </span>
          )}
        </div>
      )}

      {regeneratedFrom && (kind === UnitBlockKind.PRACTICE || kind === UnitBlockKind.DIAGRAM_NOTE || kind === UnitBlockKind.EXAMPLE) && (
        <div className="mb-4">
          <span className="rounded-full bg-[var(--color-praxis-accent-soft)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-praxis-accent)]">
            Regenerated
          </span>
        </div>
      )}

      {/* Content */}
      <div
        dangerouslySetInnerHTML={{ __html: markdownToHtml(currentContent) }}
      />

      {/* Regenerate action */}
      <div className="mt-2 flex justify-end opacity-0 transition-opacity group-hover:opacity-100">
        <BlockRegenerateAction
          unitId={unitId}
          blockId={currentId}
          blockKind={kind}
          isRegenerating={isRegenerating}
          onStartRegenerate={() => setIsRegenerating(true)}
          onRegenerated={handleRegenerated}
        />
      </div>
    </section>
  );
}
