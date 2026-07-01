import { getPostSummaries } from '@/lib/blog';
import { formatDate } from '@/lib/utils';
import { InfiniteBlogList } from '@/components/ui/infinite-blog-list';
import { sharePreview, SITE_URL } from '@/lib/seo';

const DESC = 'Thoughts on AI, technology, and the craft of building.';

export const metadata = {
  title: 'Thoughts',
  description: DESC,
  ...sharePreview('Thoughts · Nemanja Vujić', DESC),
};

export default function ThoughtsPage() {
  const summaries = getPostSummaries();
  const posts = summaries.map((post) => ({
    slug: post.slug,
    title: post.cardTitle ?? post.title,
    date: formatDate(post.date),
    description: post.description,
  }));

  // Blog collection schema so answer engines see the full post list.
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Thoughts — Nemanja Vujić',
    description: DESC,
    url: `${SITE_URL}/thoughts/`,
    inLanguage: 'en',
    author: { '@type': 'Person', name: 'Nemanja Vujić', url: SITE_URL },
    blogPost: summaries.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.description,
      datePublished: p.date,
      url: `${SITE_URL}/thoughts/${p.slug}/`,
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
            Thoughts
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
