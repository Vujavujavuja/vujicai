import fs from 'fs';
import path from 'path';
import { BlogPostMeta, BlogPost } from '@/types';
import { getReadingTime } from '@/lib/utils';
import { slugify, extractHeadings, markdownToHtml } from '@/lib/markdown';

// Two content collections share one pipeline: short "Thoughts" (content/blog,
// served at /thoughts) and long-form "Deep Thoughts" (content/deep, served at
// /deep-thoughts). Everything is keyed by collection; callers that omit it get
// the default 'blog' collection so existing Thoughts code is unchanged.
export type Collection = 'blog' | 'deep';

const DIRS: Record<Collection, string> = {
  blog: path.join(process.cwd(), 'content', 'blog'),
  deep: path.join(process.cwd(), 'content', 'deep'),
};

// Re-exported so existing imports from '@/lib/blog' keep working.
export { slugify, markdownToHtml };

export function getAllPostsMeta(collection: Collection = 'blog'): BlogPostMeta[] {
  const metaPath = path.join(DIRS[collection], 'metadata.json');
  if (!fs.existsSync(metaPath)) return [];
  const posts: BlogPostMeta[] = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAllSlugs(collection: Collection = 'blog'): string[] {
  return getAllPostsMeta(collection).map((p) => p.slug);
}

export function getPostBySlug(slug: string, collection: Collection = 'blog'): BlogPost | null {
  const allMeta = getAllPostsMeta(collection);
  const meta = allMeta.find((p) => p.slug === slug);
  if (!meta) return null;

  const filePath = path.join(DIRS[collection], meta.filename);
  if (!fs.existsSync(filePath)) return null;

  const content = fs.readFileSync(filePath, 'utf-8');
  const headings = extractHeadings(content);
  const readingTime = getReadingTime(content);

  return { ...meta, content, readingTime, headings };
}

export function getPostSummaries(
  collection: Collection = 'blog'
): (BlogPostMeta & { readingTime: number })[] {
  const allMeta = getAllPostsMeta(collection);
  return allMeta.map((meta) => {
    const filePath = path.join(DIRS[collection], meta.filename);
    let readingTime = 1;
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      readingTime = getReadingTime(content);
    }
    return { ...meta, readingTime };
  });
}
