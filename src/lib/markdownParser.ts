/**
 * Simple markdown parser for article content
 * Handles: **bold**, *italic*, [links](url), and paragraph breaks
 */

export function parseMarkdown(text: string): string {
  if (!text) return '';
  
  let parsed = text;
  
  // Parse bold: **text** or __text__
  parsed = parsed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  parsed = parsed.replace(/__(.+?)__/g, '<strong>$1</strong>');
  
  // Parse italic: *text* or _text_
  parsed = parsed.replace(/\*(.+?)\*/g, '<em>$1</em>');
  parsed = parsed.replace(/_(.+?)_/g, '<em>$1</em>');
  
  // Parse links: [text](url)
  parsed = parsed.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Parse inline code: `code`
  parsed = parsed.replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 rounded bg-muted text-sm font-mono">$1</code>');
  
  return parsed;
}

/**
 * Parse content and extract hierarchy for TOC
 * Looks for markdown-style headings in content
 */
export function extractHeadings(content: string): Array<{ text: string; level: number; id: string }> {
  const headings: Array<{ text: string; level: number; id: string }> = [];
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    // Match markdown headings: ### Heading
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      headings.push({ text, level, id: `heading-${index}-${id}` });
    }
  });
  
  return headings;
}

/**
 * Build hierarchical TOC structure
 */
export interface TocItem {
  id: string;
  title: string;
  level: number;
  children?: TocItem[];
}

export function buildHierarchicalToc(sections: Array<{ id: string; title: string; content: string }>): TocItem[] {
  const tocItems: TocItem[] = [];
  
  sections.forEach(section => {
    // Add main section
    const mainItem: TocItem = {
      id: section.id,
      title: section.title,
      level: 1,
      children: [],
    };
    
    // Extract sub-headings from content
    const subHeadings = extractHeadings(section.content);
    if (subHeadings.length > 0) {
      mainItem.children = subHeadings.map(h => ({
        id: h.id,
        title: h.text,
        level: h.level + 1, // Offset by 1 since section title is level 1
      }));
    }
    
    tocItems.push(mainItem);
  });
  
  return tocItems;
}
