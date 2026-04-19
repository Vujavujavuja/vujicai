import './globals.css';
import { Cormorant_Garamond, Literata } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { FloatingNav } from '@/components/floating-nav';
import { MobileMenu } from '@/components/ui/modern-mobile-menu';
import { FooterSection } from '@/components/ui/footer-section';
import { cn } from '@/lib/utils';

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

const SITE_URL = 'https://vujic.ai';
const DESCRIPTION =
  'Building, experiencing, researching, talking and listening. From AI and tech to Music and Geopolitics — putting my own thoughts in words.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Nemanja Vujić',
    template: '%s · Nemanja Vujić',
  },
  description: DESCRIPTION,
  authors: [{ name: 'Nemanja Vujić', url: SITE_URL }],
  creator: 'Nemanja Vujić',
  keywords: [
    'Nemanja Vujić',
    'Nemanja Vujic',
    'vujic.ai',
    'Forward Deployed Engineer',
    'DataCebo',
    'Serbia',
    'Belgrade',
    'AI Engineer',
    'Data Scientist',
  ],
  openGraph: {
    title: 'Nemanja Vujić',
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: 'Nemanja Vujić',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Nemanja Vujić',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nemanja Vujić',
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
    canonical: SITE_URL,
  },
  icons: {
    icon: [{ url: '/favicon.ico', sizes: 'any' }],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
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
    name: 'Nemanja Vujić',
    alternateName: ['Nemanja Vujic', 'Vuja'],
    givenName: 'Nemanja',
    familyName: 'Vujić',
    url: SITE_URL,
    description: DESCRIPTION,
    jobTitle: 'Forward Deployed Engineer',
    worksFor: {
      '@type': 'Organization',
      name: 'DataCebo',
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
    sameAs: [
      'https://linkedin.com/in/nemanja-vujic-vuja43',
      'https://github.com/vujavujavuja',
      'https://map.vujic.ai',
      'https://paper.vujic.ai',
    ],
    knowsAbout: [
      'Artificial Intelligence',
      'Large Language Models',
      'Retrieval-Augmented Generation',
      'Data Science',
      'Forward Deployed Engineering',
      'Powerlifting',
      'Mentoring',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Nemanja Vujić',
    url: SITE_URL,
    description: DESCRIPTION,
    inLanguage: 'en',
    author: {
      '@type': 'Person',
      name: 'Nemanja Vujić',
      url: SITE_URL,
    },
  };

  return (
    <html lang="en" suppressHydrationWarning className={cn(cormorant.variable, literata.variable)}>
      <head>
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
