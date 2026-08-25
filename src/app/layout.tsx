import './globals.css';
import { Cormorant_Garamond, Literata } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { FloatingNav } from '@/components/floating-nav';
import { MobileMenu } from '@/components/ui/modern-mobile-menu';
import { FooterSection } from '@/components/ui/footer-section';
import { cn } from '@/lib/utils';
import {
  SITE_URL,
  SITE_NAME,
  SITE_NAME_ALT,
  PERSON_DESCRIPTION,
  PROFILE_LINKS,
} from '@/lib/seo';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-heading',
});

const literata = Literata({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-body',
});

// Title and description now carry the role and employer. The previous pair
// ("Nemanja Vujić" / "Building, experiencing, researching…") read well but was
// unindexable: no employer, no role, no term anyone actually searches for.
const TITLE = `${SITE_NAME} — Forward Deployed Engineer, DataCebo`;
const DESCRIPTION = PERSON_DESCRIPTION;

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  keywords: [
    SITE_NAME,
    SITE_NAME_ALT,
    'vujic.ai',
    'Forward Deployed Engineer',
    'DataCebo',
    'Synthetic Data Vault',
    'EU AI Act',
    'AI governance',
    'Serbia',
    'Belgrade',
    'AI Engineer',
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    // Relative './' resolves per-route against metadataBase, so every page
    // gets a self-referential canonical instead of all pointing at the homepage.
    canonical: './',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48' },
      { url: '/nv-serp-192.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

// Brand dark (#111111) for the browser UI / PWA theme color.
export const viewport = {
  themeColor: '#111111',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // schema.org Person — helps Google build a knowledge panel and
  // associate this URL with a specific human, not just any "Nemanja Vujic".
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE_NAME,
    alternateName: [SITE_NAME_ALT, 'Vuja'],
    givenName: 'Nemanja',
    familyName: 'Vujic',
    url: SITE_URL,
    description: PERSON_DESCRIPTION,
    jobTitle: 'Forward Deployed Engineer',
    worksFor: {
      '@type': 'Organization',
      name: 'DataCebo',
      // The URL is what lets a crawler resolve this to the real DataCebo
      // rather than treating it as a bare string it has never seen.
      url: 'https://datacebo.com',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Belgrade',
      addressCountry: 'RS',
    },
    nationality: {
      '@type': 'Country',
      name: 'Serbia',
    },
    image: `${SITE_URL}/og-image.png`,
    sameAs: PROFILE_LINKS,
    knowsAbout: [
      'Artificial Intelligence',
      'Large Language Models',
      'Retrieval-Augmented Generation',
      'Synthetic Data',
      'EU AI Act',
      'AI Governance and Compliance',
      'Data Science',
      'Forward Deployed Engineering',
      'Powerlifting',
      'Mentoring',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: PERSON_DESCRIPTION,
    inLanguage: 'en',
    author: {
      '@type': 'Person',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  return (
    <html lang="en" suppressHydrationWarning className={cn(cormorant.variable, literata.variable)}>
      <head>
        {/* Emitted raw (not via metadata.manifest) to match the brand head
            snippet exactly — Next would otherwise add crossorigin. */}
        <link rel="manifest" href="/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={cn(literata.className, 'min-h-screen font-sans antialiased')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <FloatingNav />
          <MobileMenu />
          <main className="flex-1">{children}</main>
          <FooterSection />
        </ThemeProvider>
      </body>
    </html>
  );
}
