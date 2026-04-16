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
    <div className="py-20 pb-32 md:pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl md:pl-24">
        <Link
          href="/blog/"
          className="text-sm text-muted-foreground hover:text-primary mb-8 inline-block transition-colors"
        >
          &larr; Back to Blog
        </Link>

        <header className="mb-12">
          <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6 leading-[1.1]">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <time>{formatDate(post.date)}</time>
            <span>&middot;</span>
            <span>{post.readingTime} min read</span>
          </div>
        </header>

        <div className="flex gap-12">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <TableOfContents headings={post.headings} />
          </aside>
          <article className="flex-1 min-w-0">
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </article>
        </div>
      </div>
    </div>
  );
}
