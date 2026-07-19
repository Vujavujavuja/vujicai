import { getPostSummaries } from '@/lib/blog';
import { formatDate } from '@/lib/utils';
import { InfiniteBlogList } from '@/components/ui/infinite-blog-list';
import { sharePreview, SITE_URL } from '@/lib/seo';

const DESC = 'Longer, slower pieces — essays and deep dives that need more room than a thought.';

export const metadata = {
  title: 'Deep Thoughts',
  description: DESC,
  ...sharePreview('Deep Thoughts · Nemanja Vujić', DESC),
};

export default function DeepThoughtsPage() {
  const summaries = getPostSummaries('deep');
  const posts = summaries.map((post) => ({
    slug: post.slug,
    title: post.cardTitle ?? post.title,
    date: formatDate(post.date),
    description: post.description,
  }));

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Deep Thoughts — Nemanja Vujić',
    description: DESC,
    url: `${SITE_URL}/deep-thoughts/`,
    inLanguage: 'en',
    author: { '@type': 'Person', name: 'Nemanja Vujić', url: `${SITE_URL}/author/nemanjavujic/` },
    blogPost: summaries.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.description,
      datePublished: p.date,
      url: `${SITE_URL}/deep-thoughts/${p.slug}/`,
      ...(p.tags?.length ? { keywords: p.tags.join(', ') } : {}),
    })),
  };

  return (
    <div className="py-20 pb-32 md:pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl md:pl-24">
        <div className="mb-16 text-center">
          <p className="text-xs md:text-sm text-muted-foreground/50 italic tracking-wide mb-2">
            my
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-medium tracking-tight mb-4">
            Deep Thoughts
          </h1>
          <p className="text-muted-foreground">
            Longer, slower pieces that need more room than a thought
          </p>
        </div>

        {posts.length > 0 ? (
          <InfiniteBlogList posts={posts} batchSize={5} basePath="/deep-thoughts" />
        ) : (
          <p className="text-center text-muted-foreground/60 italic">
            Nothing here yet. The long pieces are still being written.
          </p>
        )}
      </div>
    </div>
  );
}
