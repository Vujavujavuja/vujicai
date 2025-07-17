import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { formatDate, getReadingTime } from '@/lib/utils';

// Blog posts data
const blogPosts = [
  {
    slug: 'claude-code-ai-development',
    title: 'Transforming AI Development with Claude Code',
    description: 'How Claude Code is revolutionizing the way we build AI applications and streamline development workflows.',
    pubDate: '2025-07-16',
    heroImage: '/blog-placeholder-1.png',
    content: `
      <p>Claude Code has fundamentally changed how I approach AI development projects. As someone who works extensively with machine learning pipelines, data processing, and AI model deployment, I've found Claude Code to be an invaluable partner in my development workflow.</p>
      
      <p>When I first started using Claude Code, I was impressed by its ability to understand context across multiple files and maintain consistency throughout complex codebases. Unlike traditional coding assistants, Claude Code doesn't just help with syntax - it understands the architectural patterns, follows best practices, and can even suggest improvements to existing code structure.</p>
      
      <p>One of the most powerful features I've discovered is Claude Code's ability to work with multiple programming languages and frameworks simultaneously. In my typical AI project, I might be working with Python for data processing, JavaScript for frontend interfaces, and configuration files for deployment. Claude Code seamlessly transitions between these contexts, maintaining awareness of how changes in one area might affect another.</p>
      
      <p>The tool has been particularly valuable when working with AI-specific libraries like LangChain, PyTorch, and TensorFlow. Claude Code understands the nuances of these frameworks and can suggest optimizations, identify potential issues, and even help debug complex model training scenarios. This has significantly reduced the time I spend on routine coding tasks, allowing me to focus more on the creative and strategic aspects of AI development.</p>
      
      <p>What sets Claude Code apart is its ability to understand the broader context of what you're trying to achieve. When I'm building a new AI application, I can describe the high-level requirements, and Claude Code helps translate those into concrete implementation steps, complete with proper error handling, testing considerations, and deployment strategies.</p>
      
      <p>For anyone working in AI development, I highly recommend giving Claude Code a try. It's not just a coding assistant - it's a collaborative partner that can help you write better code, faster.</p>
    `,
  },
];

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = blogPosts.find(p => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen py-20">
      <article className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Back button */}
          <div className="mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </div>

          {/* Hero Image */}
          <div className="relative mb-8 aspect-video overflow-hidden rounded-lg">
            <Image
              src={post.heroImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article Header */}
          <header className="mb-8 text-center">
            <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.pubDate)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{getReadingTime(post.content)} min read</span>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
              {post.title}
            </h1>
            
            <p className="text-lg text-muted-foreground">
              {post.description}
            </p>
          </header>

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none prose-gray dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>
    </div>
  );
}