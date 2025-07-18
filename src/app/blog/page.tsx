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
    slug: 'why-every-product-should-have-a-dedicated-mcp-server',
    title: 'Why Every Product Should Have a Dedicated MCP Server',
    description: 'How Claude Code is quietly changing the way we build AI products and speeding up development for data scientists and engineers.',
    pubDate: '2025-07-18',
    heroImage: '/blog-placeholder-2.png',
    content: `What is MCP?

MCP stands for Model Context Protocol. It's an open protocol created by Anthropic, designed to make products work seamlessly with AI agents. Picture this: your AI agent wants to interact with your GitHub repo. That is only possible because GitHub already has its own MCP Server running in the background.

An MCP Server is the code that lives on the product side and exposes it to MCP Clients. These clients live inside AI agents or chat apps. The owner or developer of the agent integrates the client, giving the agent the ability to "speak" to the server and actually understand how to interact with the product. Or, as Anthropic puts it:

"MCP is an open protocol that standardizes how applications provide context to LLMs. Think of MCP like a USB-C port for AI applications. Just as USB-C provides a standardized way to connect your devices to various peripherals and accessories, MCP provides a standardized way to connect AI models to different data sources and tools."

Why every product should have it

Adding an MCP Server to your product now, while most companies have not even started thinking about it, puts you ahead of the game. This is how you make your product AI-native before it becomes the industry norm, not just an extra feature. Say you're running a booking website and you add an MCP Server that lets agents browse available rooms and make reservations for users.

When someone is chatting with their favorite AI assistant about travel plans, the assistant can actually book a room on your platform directly. No extra steps, no lost users, no competing with platforms that are not ready for agents. The AI plugs into your MCP Server and your product becomes the obvious choice.

The future of MCP

Products everywhere are starting to ship with their own MCP Servers. Cloudflare, Gmail, GitHub, and others are getting on board. At the same time, more AI apps are rolling out MCP Clients, with OpenAI planning to put MCP Clients directly into ChatGPT. If you want to stay ahead, this is the moment to make your product part of the next generation, while most are still catching up.`,
  },
  {
    slug: 'claude-code-ai-development',
    title: 'Transforming AI Development with Claude Code (and other tools)',
    description: 'How Claude Code is revolutionizing the way we build AI applications and accelerating development workflows for data scientists and engineers.',
    pubDate: '2025-07-16',
    heroImage: '/blog-placeholder-1.png',
    content: `Claude code has boosted my productivity, both on personal projects (such as this) and on my job. It can be really good to have someone sitting by your side and helping you understand legacy code that you are just opening for the first time, however on most projects that is not the case, resources are tight, the developer who developed that app has left the company and no one can reach him, so on and so on.

That is where a tool like this can jump in to help. The first project I got contained a large amount of legacy code, comments in other languages (other than English yea that kind of comments) and I did not know where to start. At that time I was not using claude code nor was I using any other AI coding assistants and had to spend around a week or two just going through the code reading and understanding it. If I got myself into that situation again here is what I would do differently:

## The AI approach to a new project

Setup a coding assistant, initiate the coding assistant by telling it to read the readme.md file and go through the architecture of the code to gather knowledge. After that, tell it to create a comprehensive Developers.md file which future developer can reference when trying to work on the application. The AI itself will also reference this Developers.md file when starting a new session so that we do not spend our tokens on repeat tasks.

Now you have a starting point, and you can also query the AI anything related to the current codebase and it will be abel to answer. 

## What else can AI do for you?

This approach is all good and fine until you start falling down the **vibe coding** rabbithole, which is hard to escape, trust me. You should never give AI full features to develop nor should you trust it like you would another developer working on the application. The current state of coding agents is not at the point where it doesn't make mistakes, it's more like an intern. You would not give some hard new feature implementation to your intent wouldn't you? Then why give similar tasks to coding assistants?

Coding assistants act best as helpers that work alongside you. Either use them as an extension of yourself, like asking it to tell you which files might possibly be affected by some changes you made and then going and checking for yourself. Or asking them how certain things are connected in the code.

## The Future of AI-Assisted Development

As AI development becomes more complex, tools like Claude Code will become essential. The ability to have a coding partner that understands both the technical requirements and the business context is transformative.

The key is not replacing human creativity and problem-solving, but augmenting it with AI capabilities that handle the routine tasks and provide intelligent suggestions for the complex ones.

Remember one thing, **DO NOT** trust AI to come up with ideas, at the end of the day ideas are only human while LLMs and thinking models are algorithms that generate and predict the next word in a given sentence.`,
  },
  {
    slug: 'how-to-pass-azure-ai-engineer-ai-102-certificate-exam',
    title: 'How to Pass Azure AI Engineer AI-102 Certificate Exam',
    description: 'Coming soon - A comprehensive guide to preparing for and passing the Azure AI Engineer AI-102 certification exam.',
    pubDate: '2025-07-20',
    heroImage: '/blog-placeholder-3.jpg',
    content: `This blog post is coming soon. Stay tuned for a comprehensive guide on how to prepare for and pass the Azure AI Engineer AI-102 certification exam.`,
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