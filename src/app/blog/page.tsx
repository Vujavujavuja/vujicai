import { getPostSummaries } from '@/lib/blog';
import { formatDate } from '@/lib/utils';
import { InfiniteBlogList } from '@/components/ui/infinite-blog-list';

export const metadata = {
  title: 'Blog',
  description: 'Thoughts on AI, technology, and my journey in data science.',
};

export default function BlogPage() {
  const posts = getPostSummaries().map((post) => ({
    slug: post.slug,
    title: post.title,
    date: formatDate(post.date),
    description: post.description,
  }));

  return (
    <div className="py-20 pb-32 md:pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl md:pl-24">
        <div className="mb-16 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-medium tracking-tight mb-4">
            Blog
          </h1>
          <p className="text-muted-foreground">
            Thoughts on AI, technology, and the craft of building
          </p>
        </div>

        <InfiniteBlogList posts={posts} batchSize={5} />
      </div>
    </div>
  );
}
