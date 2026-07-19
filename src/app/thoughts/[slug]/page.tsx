import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllSlugs, getPostBySlug, markdownToHtml } from '@/lib/blog';
import { formatDate } from '@/lib/utils';
import { TableOfContents } from '@/components/table-of-contents';

const SITE_URL = 'https://vujic.ai';

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: 'Post Not Found' };
  const url = `${SITE_URL}/thoughts/${post.slug}/`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/thoughts/${post.slug}/` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url,
      siteName: 'Nemanja Vujić',
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: [SITE_URL],
      tags: post.tags,
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: ['/og-image.png'],
    },
  };
}

export default function ThoughtPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const htmlContent = markdownToHtml(post.content);
  const url = `${SITE_URL}/thoughts/${post.slug}/`;

  // BlogPosting + breadcrumb structured data so answer engines can extract,
  // attribute, and cite the post (author, dates, headline).
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Person', name: 'Nemanja Vujić', url: `${SITE_URL}/author/nemanjavujic/` },
    publisher: { '@type': 'Person', name: 'Nemanja Vujić', url: SITE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: `${SITE_URL}/og-image.png`,
    url,
    inLanguage: 'en',
    ...(post.tags?.length ? { keywords: post.tags.join(', ') } : {}),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Thoughts', item: `${SITE_URL}/thoughts/` },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  };

  return (
    <div className="py-20 pb-32 md:pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl md:pl-24">
        <Link
          href="/thoughts/"
          className="text-sm text-muted-foreground hover:text-primary mb-8 inline-block transition-colors"
        >
          &larr; Back to Thoughts
        </Link>

        <header className="mb-12">
          <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6 leading-[1.1]">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <Link
              href="/author/nemanjavujic/"
              className="hover:text-primary transition-colors"
              rel="author"
            >
              by <span className="text-foreground/80">Nemanja Vujić</span>
            </Link>
            <span>&middot;</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
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
