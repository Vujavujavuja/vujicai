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
    default: 'Nemanja Vujić',
    template: '%s · Nemanja Vujić',
  },
  description:
    'Building, experiencing, researching, talking and listening. From AI and tech to Music and Geopolitics — putting my own thoughts in words.',
  authors: [{ name: 'Nemanja Vujić', url: 'https://vujic.ai' }],
  creator: 'Nemanja Vujić',
  openGraph: {
    title: 'Nemanja Vujić',
    description:
      'Building, experiencing, researching, talking and listening. From AI and tech to Music and Geopolitics — putting my own thoughts in words.',
    url: 'https://vujic.ai',
    siteName: 'Nemanja Vujić',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Nemanja Vujić',
    description:
      'Building, experiencing, researching, talking and listening. From AI and tech to Music and Geopolitics — putting my own thoughts in words.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://vujic.ai',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
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
