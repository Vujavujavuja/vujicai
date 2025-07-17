'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock } from 'lucide-react';
import { formatDate, getReadingTime } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Blog posts data
const blogPosts = [
  {
    slug: 'claude-code-ai-development',
    title: 'Transforming AI Development with Claude Code',
    description: 'How Claude Code is revolutionizing the way we build AI applications and streamline development workflows.',
    pubDate: '2025-07-16',
    heroImage: '/blog-placeholder-1.png',
    content: `Claude Code has fundamentally changed how I approach AI development projects. As someone who works extensively with machine learning pipelines, data processing, and AI model deployment, I've found Claude Code to be an invaluable partner in my development workflow.

When I first started using Claude Code, I was impressed by its ability to understand context across multiple files and maintain consistency throughout complex codebases. Unlike traditional coding assistants, Claude Code doesn't just help with syntax - it understands the architectural patterns, follows best practices, and can even suggest improvements to existing code structure.

One of the most powerful features I've discovered is Claude Code's ability to work with multiple programming languages and frameworks simultaneously. In my typical AI project, I might be working with Python for data processing, JavaScript for frontend interfaces, and configuration files for deployment. Claude Code seamlessly transitions between these contexts, maintaining awareness of how changes in one area might affect another.

The tool has been particularly valuable when working with AI-specific libraries like LangChain, PyTorch, and TensorFlow. Claude Code understands the nuances of these frameworks and can suggest optimizations, identify potential issues, and even help debug complex model training scenarios. This has significantly reduced the time I spend on routine coding tasks, allowing me to focus more on the creative and strategic aspects of AI development.

What sets Claude Code apart is its ability to understand the broader context of what you're trying to achieve. When I'm building a new AI application, I can describe the high-level requirements, and Claude Code helps translate those into concrete implementation steps, complete with proper error handling, testing considerations, and deployment strategies.

For anyone working in AI development, I highly recommend giving Claude Code a try. It's not just a coding assistant - it's a collaborative partner that can help you write better code, faster.`,
  },
];

export default function BlogPage() {

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-4xl"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
              Blog
            </h1>
            <p className="text-lg text-muted-foreground">
              Thoughts on AI, technology, and my journey in data science
            </p>
          </motion.div>

          <div className="grid gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.slug}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-lg border border-white/20 bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm text-card-foreground shadow-sm hover:shadow-md transition-shadow card-bounce"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3">
                    <div className="relative h-48 md:h-full">
                      <Image
                        src={post.heroImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {formatDate(post.pubDate)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {getReadingTime(post.content)} min read
                        </span>
                      </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    
                    <p className="text-muted-foreground mb-4">
                      {post.description}
                    </p>
                    
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
                    >
                      Read more
                      <svg
                        className="ml-1 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}