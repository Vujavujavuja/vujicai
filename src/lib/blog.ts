import fs from 'fs';
import path from 'path';
import { BlogPostMeta, BlogPost } from '@/types';
import { getReadingTime } from '@/lib/utils';
import { slugify, extractHeadings, markdownToHtml } from '@/lib/markdown';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

// Re-exported so existing imports from '@/lib/blog' keep working.
export { slugify, markdownToHtml };

export function getAllPostsMeta(): BlogPostMeta[] {
  const raw = fs.readFileSync(path.join(BLOG_DIR, 'metadata.json'), 'utf-8');
  const posts: BlogPostMeta[] = JSON.parse(raw);
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAllSlugs(): string[] {
  return getAllPostsMeta().map((p) => p.slug);
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
