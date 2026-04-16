import './globals.css';
import { Poppins } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { cn } from '@/lib/utils';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
});

export const metadata = {
  metadataBase: new URL('https://vujic.ai'),
  title: {
    default: 'Nemanja Vujic - Data Scientist & AI Engineer | Vujic AI',
    template: '%s | Vujic AI',
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
    siteName: 'Vujic AI',
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
    <html lang="en" suppressHydrationWarning className={poppins.variable}>
      <body className={cn(poppins.className, 'min-h-screen font-sans antialiased')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
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
