import './globals.css';
import { Poppins } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { AnimatedBackground } from '@/components/animated-background';
import { cn } from '@/lib/utils';

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins'
});

export const metadata = {
  metadataBase: new URL('https://vujicai.com'),
  title: 'Nemanja Vujić - Data Scientist & AI Engineer',
  description: 'Personal website and blog of Nemanja Vujić, Data Scientist & AI Engineer from Serbia specializing in AI systems, machine learning, and prompt engineering.',
  keywords: ['Data Science', 'AI Engineer', 'Machine Learning', 'Python', 'Serbia', 'Artificial Intelligence'],
  authors: [{ name: 'Nemanja Vujić' }],
  creator: 'Nemanja Vujić',
  openGraph: {
    title: 'Nemanja Vujić - Data Scientist & AI Engineer',
    description: 'Personal website and blog of Nemanja Vujić, Data Scientist & AI Engineer from Serbia',
    url: 'https://vujicai.com',
    siteName: 'Vujic AI',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nemanja Vujić - Data Scientist & AI Engineer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nemanja Vujić - Data Scientist & AI Engineer',
    description: 'Personal website and blog of Nemanja Vujić, Data Scientist & AI Engineer from Serbia',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={poppins.variable}>
      <body className={cn(poppins.className, 'min-h-screen font-sans antialiased')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AnimatedBackground />
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}