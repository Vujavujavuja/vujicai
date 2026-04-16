import Link from 'next/link';
import { getPostSummaries } from '@/lib/blog';
import { formatDate } from '@/lib/utils';

export const metadata = {
  title: 'Blog',
  description: 'Thoughts on AI, technology, and my journey in data science.',
};

export default function BlogPage() {
  const posts = getPostSummaries();

  return (
    <div className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Blog
          </h1>
          <p className="text-lg text-muted-foreground">
            Thoughts on AI, technology, and my journey in data science
          </p>
        </div>

        <div className="space-y-10">
          {posts.map((post) => (
            <article key={post.slug} className="border-b pb-10">
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <time>{formatDate(post.date)}</time>
                <span>&middot;</span>
                <span>{post.readingTime} min read</span>
              </div>

              <h2 className="text-2xl font-bold mb-3">
                <Link
                  href={`/blog/${post.slug}/`}
                  className="hover:underline"
                >
                  {post.title}
                </Link>
              </h2>

              <p className="text-muted-foreground mb-4">{post.description}</p>

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
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
