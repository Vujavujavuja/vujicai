// Pure, dependency-free markdown renderer shared by the build (lib/blog.ts)
// and the wrttr editor preview. No `fs`, so it's safe in client components.
import type { TocHeading } from '@/types';

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function extractHeadings(content: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const regex = /^(#{2,4})\s+(.+)$/gm;
  let match;
  while ((match = regex.exec(content)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2].trim(),
      id: slugify(match[2].trim()),
    });
  }
  return headings;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function processInline(text: string): string {
  let result = text;
  // Inline code
  result = result.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Bold
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Italic
  result = result.replace(/\*(.+?)\*/g, '<em>$1</em>');
  // Images (before links so ![alt](src) isn't parsed as a link)
  result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" />');
  // Links — external ones open in a new tab and carry rel for safety.
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, text, href) => {
    const external = /^https?:\/\//i.test(href);
    const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${href}"${attrs}>${text}</a>`;
  });
  return result;
}

export function markdownToHtml(content: string): string {
  let html = content;

  // Code blocks are lifted out before any block-level work: their content can
  // contain blank lines, which the paragraph splitter below would otherwise
  // tear in half. They are put back verbatim at the end.
  const codeBlocks: string[] = [];
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, lang, code) => {
    const langAttr = lang ? ` class="language-${lang}"` : '';
    codeBlocks.push(`<pre><code${langAttr}>${escapeHtml(code.trim())}</code></pre>`);
    return `\u0000CODE${codeBlocks.length - 1}\u0000`;
  });

  const blocks = html.split(/\n\n+/);
  const processed: string[] = [];

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('<pre>')) {
      processed.push(trimmed);
      continue;
    }

    // Standalone image -> figure
    const imageMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imageMatch) {
      processed.push(
        `<figure><img src="${imageMatch[2]}" alt="${imageMatch[1]}" loading="lazy" /></figure>`
      );
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const id = slugify(text);
      processed.push(`<h${level} id="${id}">${processInline(text)}</h${level}>`);
      continue;
    }

    if (trimmed.startsWith('>')) {
      const quoteContent = trimmed
        .split('\n')
        .map((line) => line.replace(/^>\s?/, ''))
        .join(' ');
      processed.push(`<blockquote><p>${processInline(quoteContent)}</p></blockquote>`);
      continue;
    }

    if (/^[-*]\s/.test(trimmed)) {
      const items = trimmed.split('\n').map((line) => {
        const itemText = line.replace(/^[-*]\s+/, '');
        return `<li>${processInline(itemText)}</li>`;
      });
      processed.push(`<ul>${items.join('')}</ul>`);
      continue;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split('\n').map((line) => {
        const itemText = line.replace(/^\d+\.\s+/, '');
        return `<li>${processInline(itemText)}</li>`;
      });
      processed.push(`<ol>${items.join('')}</ol>`);
      continue;
    }

    processed.push(`<p>${processInline(trimmed)}</p>`);
  }

  // Put the code blocks back, unwrapping the paragraph their placeholder
  // picked up on the way through.
  return processed
    .join('\n')
    .replace(/(?:<p>)?\u0000CODE(\d+)\u0000(?:<\/p>)?/g, (_m, i) => codeBlocks[Number(i)]);
}
