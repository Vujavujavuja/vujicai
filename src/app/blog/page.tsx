import { getPostSummaries } from '@/lib/blog';
import { formatDate } from '@/lib/utils';
import { BlogCard } from '@/components/ui/blog-cards';

export const metadata = {
  title: 'Blog',
  description: 'Thoughts on AI, technology, and my journey in data science.',
};

export default function BlogPage() {
  const posts = getPostSummaries();

  return (
    <div className="py-20 pb-32 md:pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="mb-16 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-medium tracking-tight mb-4">
            Journal
          </h1>
          <p className="text-muted-foreground">
            Thoughts on AI, technology, and the craft of building
          </p>
        </div>

        <div className="flex flex-col space-y-8">
          {posts.map((post) => (
            <BlogCard
              key={post.slug}
              title={post.title}
              date={formatDate(post.date)}
              description={post.description}
              href={`/blog/${post.slug}/`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
