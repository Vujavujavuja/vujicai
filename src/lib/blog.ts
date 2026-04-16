import fs from 'fs';
import path from 'path';
import { BlogPostMeta, BlogPost, TocHeading } from '@/types';
import { getReadingTime } from '@/lib/utils';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function getAllPostsMeta(): BlogPostMeta[] {
  const raw = fs.readFileSync(path.join(BLOG_DIR, 'metadata.json'), 'utf-8');
  const posts: BlogPostMeta[] = JSON.parse(raw);
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAllSlugs(): string[] {
  return getAllPostsMeta().map((p) => p.slug);
}

function extractHeadings(content: string): TocHeading[] {
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

export function getPostBySlug(slug: string): BlogPost | null {
  const allMeta = getAllPostsMeta();
  const meta = allMeta.find((p) => p.slug === slug);
  if (!meta) return null;

  const filePath = path.join(BLOG_DIR, meta.filename);
  if (!fs.existsSync(filePath)) return null;

  const content = fs.readFileSync(filePath, 'utf-8');
  const headings = extractHeadings(content);
  const readingTime = getReadingTime(content);

  return { ...meta, content, readingTime, headings };
}

export function getPostSummaries(): (BlogPostMeta & { readingTime: number })[] {
  const allMeta = getAllPostsMeta();
  return allMeta.map((meta) => {
    const filePath = path.join(BLOG_DIR, meta.filename);
    let readingTime = 1;
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      readingTime = getReadingTime(content);
    }
    return { ...meta, readingTime };
  });
}

export function markdownToHtml(content: string): string {
  let html = content;

  // Code blocks (must be before inline code)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, lang, code) => {
    const langAttr = lang ? ` class="language-${lang}"` : '';
    return `<pre><code${langAttr}>${escapeHtml(code.trim())}</code></pre>`;
  });

  // Split into blocks by double newlines
  const blocks = html.split(/\n\n+/);
  const processed: string[] = [];

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    // Already processed code blocks
    if (trimmed.startsWith('<pre>')) {
      processed.push(trimmed);
      continue;
    }

    // Headings
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const id = slugify(text);
      processed.push(`<h${level} id="${id}">${processInline(text)}</h${level}>`);
      continue;
    }

    // Blockquotes
    if (trimmed.startsWith('>')) {
      const quoteContent = trimmed
        .split('\n')
        .map((line) => line.replace(/^>\s?/, ''))
        .join(' ');
      processed.push(`<blockquote><p>${processInline(quoteContent)}</p></blockquote>`);
      continue;
    }

    // Unordered lists
    if (/^[-*]\s/.test(trimmed)) {
      const items = trimmed.split('\n').map((line) => {
        const itemText = line.replace(/^[-*]\s+/, '');
        return `<li>${processInline(itemText)}</li>`;
      });
      processed.push(`<ul>${items.join('')}</ul>`);
      continue;
    }

    // Ordered lists
    if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split('\n').map((line) => {
        const itemText = line.replace(/^\d+\.\s+/, '');
        return `<li>${processInline(itemText)}</li>`;
      });
      processed.push(`<ol>${items.join('')}</ol>`);
      continue;
    }

    // Regular paragraphs
    processed.push(`<p>${processInline(trimmed)}</p>`);
  }

  return processed.join('\n');
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
  // Links
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return result;
}
