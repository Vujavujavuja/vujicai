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

export const metadata = {
  metadataBase: new URL('https://vujic.ai'),
  title: {
    default: 'Nemanja Vujic - Data Scientist & AI Engineer',
    template: '%s | Nemanja Vujic',
  },
  description:
    'Nemanja Vujic is a Data Scientist & AI Engineer from Serbia specializing in LLMs, generative AI, RAG systems, and prompt engineering.',
  authors: [{ name: 'Nemanja Vujic', url: 'https://vujic.ai' }],
  creator: 'Nemanja Vujic',
  openGraph: {
    title: 'Nemanja Vujic - Data Scientist & AI Engineer',
    description:
      'AI Engineer from Serbia specializing in LLMs, RAG systems, and production ML pipelines.',
    url: 'https://vujic.ai',
    siteName: 'Nemanja Vujic',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://vujic.ai',
  },
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(cormorant.variable, literata.variable)}>
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
