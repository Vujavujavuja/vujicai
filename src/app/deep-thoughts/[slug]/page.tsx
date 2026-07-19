import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllSlugs, getPostBySlug, markdownToHtml } from '@/lib/blog';
import { formatDate } from '@/lib/utils';
import { ImmersiveReader } from '@/components/ui/immersive-reader';

const SITE_URL = 'https://vujic.ai';

export function generateStaticParams() {
  return getAllSlugs('deep').map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug, 'deep');
  if (!post) return { title: 'Post Not Found' };
  const url = `${SITE_URL}/deep-thoughts/${post.slug}/`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/deep-thoughts/${post.slug}/` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url,
      siteName: 'Nemanja Vujić',
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: [`${SITE_URL}/author/nemanjavujic/`],
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

export default function DeepThoughtPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug, 'deep');
  if (!post) notFound();

  const htmlContent = markdownToHtml(post.content);
  const url = `${SITE_URL}/deep-thoughts/${post.slug}/`;

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
      { '@type': 'ListItem', position: 2, name: 'Deep Thoughts', item: `${SITE_URL}/deep-thoughts/` },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  };

  return (
    <div className="py-16 md:py-24 pb-32 md:pb-24">
      <ImmersiveReader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="container mx-auto px-5 sm:px-6 max-w-2xl">
        <Link
          href="/deep-thoughts/"
          className="text-sm text-muted-foreground/60 hover:text-primary mb-10 inline-block transition-colors"
        >
          &larr; Deep Thoughts
        </Link>

        <header className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6 leading-[1.1]">
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

        <article className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    </div>
  );
}
