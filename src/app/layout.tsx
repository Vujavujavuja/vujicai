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
  metadataBase: new URL('https://vujic.ai'),
  title: {
    default: 'Nemanja Vujić - Data Scientist & AI Engineer | Vujic AI',
    template: '%s | Vujic AI'
  },
  description: 'Nemanja Vujić is a Data Scientist & AI Engineer from Serbia specializing in LLMs, generative AI, RAG systems, and prompt engineering. Expert in Python, LangChain, PyTorch, and cloud AI platforms (Azure, GCP, AWS).',
  keywords: ['Nemanja Vujić', 'Data Scientist Serbia', 'AI Engineer Belgrade', 'LLM Expert', 'Generative AI', 'RAG Systems', 'Prompt Engineering', 'Python AI', 'LangChain', 'PyTorch', 'Azure OpenAI', 'Vega IT', 'Machine Learning Serbia', 'AI Consultant', 'Vector Databases', 'FAISS', 'Milvus', 'MLflow', 'Weights Biases', 'AI Mentoring'],
  authors: [{ name: 'Nemanja Vujić', url: 'https://vujic.ai' }],
  creator: 'Nemanja Vujić',
  publisher: 'Vujic AI',
  category: 'Technology',
  classification: 'Business',
  openGraph: {
    title: 'Nemanja Vujić - Data Scientist & AI Engineer | Expert in LLMs & Generative AI',
    description: 'AI Engineer from Serbia specializing in LLMs, RAG systems, and production ML pipelines. Expert in Python, LangChain, PyTorch, and cloud AI platforms.',
    url: 'https://vujic.ai',
    siteName: 'Vujic AI',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nemanja Vujić - Data Scientist & AI Engineer specializing in LLMs and Generative AI',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nemanja Vujić - Data Scientist & AI Engineer',
    description: 'AI Engineer from Serbia specializing in LLMs, RAG systems, and production ML pipelines. Expert in Python, LangChain, PyTorch.',
    images: ['/twitter-image.jpg'],
    creator: '@nemanja_vujic',
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
  alternates: {
    canonical: 'https://vujic.ai',
  },
  verification: {
    google: 'your-google-site-verification-code',
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
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Nemanja Vujić",
    "givenName": "Nemanja",
    "familyName": "Vujić",
    "jobTitle": "Data Scientist & AI Engineer",
    "description": "Data Scientist & AI Engineer from Serbia specializing in LLMs, generative AI, RAG systems, and prompt engineering",
    "url": "https://vujic.ai",
    "sameAs": [
      "https://linkedin.com/in/nemanja-vujic-vuja43",
      "https://github.com/vujavujavuja"
    ],
    "email": "nemanja@vujic.ai",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Pančevo",
      "addressCountry": "Serbia"
    },
    "worksFor": {
      "@type": "Organization",
      "name": "Vega IT",
      "url": "https://vegait.rs"
    },
    "alumniOf": {
      "@type": "Organization",
      "name": "University of Belgrade"
    },
    "knowsAbout": [
      "Artificial Intelligence",
      "Machine Learning",
      "Large Language Models",
      "Generative AI",
      "RAG Systems",
      "Prompt Engineering",
      "Python Programming",
      "LangChain",
      "PyTorch",
      "Azure OpenAI",
      "Google Cloud AI",
      "AWS Bedrock",
      "Vector Databases",
      "FAISS",
      "Milvus",
      "MLflow",
      "Weights & Biases",
      "Data Science",
      "Deep Learning",
      "Natural Language Processing"
    ],
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Data Scientist & AI Engineer",
      "occupationalCategory": "Computer and Information Technology",
      "skills": [
        "Python",
        "Machine Learning",
        "Artificial Intelligence",
        "Deep Learning",
        "Natural Language Processing",
        "Large Language Models",
        "Generative AI",
        "RAG Systems",
        "Prompt Engineering",
        "LangChain",
        "PyTorch",
        "TensorFlow",
        "Azure",
        "Google Cloud Platform",
        "Amazon Web Services",
        "Vector Databases",
        "MLflow",
        "Docker",
        "Kubernetes"
      ]
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://vujic.ai"
    },
    "image": {
      "@type": "ImageObject",
      "url": "https://vujic.ai/og-image.jpg",
      "width": 1200,
      "height": 630
    }
  };

  return (
    <html lang="en" suppressHydrationWarning className={poppins.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
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