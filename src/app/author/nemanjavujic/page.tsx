import Link from 'next/link';
import { Linkedin, Github, Mail } from 'lucide-react';
import { sharePreview, SITE_URL } from '@/lib/seo';

const NAME = 'Nemanja Vujić';
const ROLE = 'Forward Deployed Engineer at DataCebo';
const DESC =
  'Nemanja Vujić — Forward Deployed Engineer at DataCebo, writing on AI, governance and the craft of building, from Pančevo, Serbia.';

export const metadata = {
  title: { absolute: NAME },
  description: DESC,
  alternates: { canonical: '/author/nemanjavujic/' },
  ...sharePreview(`${NAME} · Author`, DESC),
};

export default function AuthorPage() {
  // ProfilePage + Person so answer engines tie every post's byline to a single
  // author entity (E-E-A-T). Mirrors the site-wide Person in the root layout.
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    dateModified: '2026-07-19',
    mainEntity: {
      '@type': 'Person',
      name: NAME,
      alternateName: ['Nemanja Vujic', 'Vuja'],
      url: `${SITE_URL}/author/nemanjavujic/`,
      jobTitle: 'Forward Deployed Engineer',
      worksFor: { '@type': 'Organization', name: 'DataCebo' },
      description: DESC,
      image: `${SITE_URL}/og-image.png`,
      sameAs: [
        'https://linkedin.com/in/nemanja-vujic-vuja43',
        'https://github.com/vujavujavuja',
        'https://instagram.com/vuja.43',
        'https://x.com/nemanjavujicc',
      ],
      knowsAbout: [
        'Artificial Intelligence',
        'Large Language Models',
        'AI Governance and Compliance',
        'Data Science',
        'Powerlifting',
      ],
    },
  };

  return (
    <div className="py-20 pb-32 md:pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl md:pl-24">
        <div className="mb-12">
          <p className="text-xs md:text-sm text-muted-foreground/50 italic tracking-wide mb-2">
            the author
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-medium tracking-tight mb-3">
            {NAME}
          </h1>
          <p className="text-muted-foreground text-lg">{ROLE}</p>
        </div>

        {/* Placeholder bio — swap for the copy you want to share. */}
        <div className="prose max-w-none">
          <p>
            I&rsquo;m a Forward Deployed Engineer at DataCebo, an MIT spinout, working closely with
            synthetic data and the governance and compliance questions that come with putting AI into
            the real world. I write here about that work, and about everything around it.
          </p>
          <p>
            I&rsquo;m from Pančevo, Serbia, run a powerlifting club as a non-profit, and keep a small
            consultancy on the side. Everything I publish under this name is my own; where I&rsquo;m
            wrong, I&rsquo;d genuinely like to hear it.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <Link href="/thoughts/" className="text-primary hover:underline">
            Read my Thoughts →
          </Link>
          <Link href="/contact/" className="text-muted-foreground hover:text-primary transition-colors">
            Get in touch
          </Link>
          <a
            href="https://linkedin.com/in/nemanja-vujic-vuja43"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Linkedin className="size-4" />
          </a>
          <a
            href="https://github.com/vujavujavuja"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Github className="size-4" />
          </a>
          <a
            href="mailto:nemanja@vujic.ai"
            aria-label="Email"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Mail className="size-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
