import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllSlugs, getPostBySlug, markdownToHtml } from '@/lib/blog';
import { formatDate } from '@/lib/utils';
import { TableOfContents } from '@/components/table-of-contents';

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.title,
    description: post.description,
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const htmlContent = markdownToHtml(post.content);

  return (
    <div className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <Link
          href="/blog/"
          className="text-sm text-muted-foreground hover:text-foreground mb-8 inline-block"
        >
          &larr; Back to Blog
        </Link>

        {/* Post header */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <time>{formatDate(post.date)}</time>
            <span>&middot;</span>
            <span>{post.readingTime} min read</span>
          </div>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-muted rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Two-column layout: ToC + Article */}
        <div className="flex gap-10">
          {/* Table of Contents - left sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <TableOfContents headings={post.headings} />
          </aside>

          {/* Article content */}
          <article className="flex-1 min-w-0">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </article>
        </div>
      </div>
    </div>
  );
}
