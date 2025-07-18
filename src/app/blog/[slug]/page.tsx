import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { formatDate, getReadingTime } from '@/lib/utils';

// Blog posts data
const blogPosts = [
  {
    slug: 'how-to-pass-azure-ai-engineer-ai-102-certificate-exam',
    title: 'How to Pass Azure AI Engineer AI-102 Certificate Exam',
    description: 'Coming soon - A comprehensive guide to preparing for and passing the Azure AI Engineer AI-102 certification exam.',
    pubDate: '2025-07-20',
    heroImage: '/blog-placeholder-3.jpg',
    content: `
      <p class="mb-4">This blog post is <strong>coming soon</strong>. Stay tuned for a comprehensive guide on how to prepare for and pass the Azure AI Engineer AI-102 certification exam.</p>
      
      <p class="mb-4">Topics will include:</p>
      <ul class="list-disc ml-6 mb-4">
        <li>Exam overview and structure</li>
        <li>Study resources and materials</li>
        <li>Hands-on practice recommendations</li>
        <li>Key Azure AI services to master</li>
        <li>Tips for exam day success</li>
      </ul>
    `,
  },
  {
    slug: 'why-every-product-should-have-a-dedicated-mcp-server',
    title: 'Why Every Product Should Have a Dedicated MCP Server',
    description: 'A practical look at why Model Context Protocol (MCP) is about to become the essential bridge between AI agents and real-world applications. If you want your product to be usable by the next generation of LLM powered tools like Claude Code or the upcoming GPT agents setting up a dedicated MCP server is the best way to future-proof your stack and stand out. This article breaks down what MCP actually is, why it matters right now, and how early adopters can leapfrog the competition by building for the new AI-native ecosystem.',
    pubDate: '2025-07-18',
    heroImage: '/blog-placeholder-2.png',
    content: `
      <h2 class="text-2xl font-bold mt-8 mb-4">What is MCP?</h2>
      
      <p class="mb-4">MCP stands for <strong>Model Context Protocol</strong>. It's an open protocol created by Anthropic, designed to make products work seamlessly with AI agents. Picture this: your AI agent wants to interact with your GitHub repo. That is only possible because GitHub already has its own MCP Server running in the background.</p>
      
      <p class="mb-4">An MCP Server is the code that lives on the product side and exposes it to MCP Clients. These clients live inside AI agents or chat apps. The owner or developer of the agent integrates the client, giving the agent the ability to "speak" to the server and actually understand how to interact with the product. Or, as Anthropic puts it:</p>
      
      <p class="mb-4 italic border-l-4 border-gray-300 pl-4">"MCP is an open protocol that standardizes how applications provide context to LLMs. Think of MCP like a <strong>USB-C port for AI applications</strong>. Just as USB-C provides a standardized way to connect your devices to various peripherals and accessories, MCP provides a standardized way to connect AI models to different data sources and tools."</p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Why every product should have it</h2>
      
      <p class="mb-4">Adding an MCP Server to your product now, while most companies have not even started thinking about it, puts you <strong>ahead of the game</strong>. This is how you make your product AI-native before it becomes the industry norm, not just an extra feature. Say you're running a booking website and you add an MCP Server that lets agents browse available rooms and make reservations for users.</p>
      
      <p class="mb-4">When someone is chatting with their favorite AI assistant about travel plans, the assistant can actually book a room on your platform directly. <strong>No extra steps, no lost users, no competing with platforms that are not ready for agents.</strong> The AI plugs into your MCP Server and your product becomes the obvious choice.</p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">The future of MCP</h2>
      
      <p class="mb-4">Products everywhere are starting to ship with their own MCP Servers. <strong>Cloudflare, Gmail, GitHub, and others are getting on board.</strong> At the same time, more AI apps are rolling out MCP Clients, with OpenAI planning to put MCP Clients directly into ChatGPT. If you want to stay ahead, this is the moment to make your product part of the next generation, while most are still catching up.</p>
    `,
  },
  {
    slug: 'claude-code-ai-development',
    title: 'Transforming AI Development with Claude Code (and other tools)',
    description: 'How Claude Code is revolutionizing the way we build AI applications and accelerating development workflows for data scientists and engineers.',
    pubDate: '2025-07-16',
    heroImage: '/blog-placeholder-1.png',
    content: `
      <p>Claude code has boosted my productivity, both on personal projects (such as this) and on my job. It can be really good to have someone sitting by your side and helping you understand legacy code that you are just opening for the first time, however on most projects that is not the case, resources are tight, the developer who developed that app has left the company and no one can reach him, so on and so on.</p>
      
      <p>That is where a tool like this can jump in to help. The first project I got contained a large amount of legacy code, comments in other languages (other than English yea that kind of comments) and I did not know where to start. At that time I was not using claude code nor was I using any other AI coding assistants and had to spend around a week or two just going through the code reading and understanding it. If I got myself into that situation again here is what I would do differently:</p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">The AI approach to a new project</h2>
      
      <p class="mb-4">Setup a coding assistant, initiate the coding assistant by telling it to read the readme.md file and go through the architecture of the code to gather knowledge. After that, tell it to create a comprehensive Developers.md file which future developer can reference when trying to work on the application. The AI itself will also reference this Developers.md file when starting a new session so that we do not spend our tokens on repeat tasks.</p>
      
      <p class="mb-4">Now you have a starting point, and you can also query the AI anything related to the current codebase and it will be <strong>able</strong> to answer.</p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">What else can AI do for you?</h2>
      
      <p class="mb-4">This approach is all good and fine until you start falling down the <strong>vibe coding</strong> rabbithole, which is hard to escape, trust me. You should never give AI full features to develop nor should you trust it like you would another developer working on the application. The current state of coding agents is not at the point where it doesn't make mistakes, it's more like an intern. You would not give some hard new feature implementation to your <strong>intern</strong> wouldn't you? Then why give similar tasks to coding assistants?</p>
      
      <p class="mb-4">Coding assistants act best as helpers that work alongside you. Either use them as an extension of yourself, like asking it to tell you which files might possibly be affected by some changes you made and then going and checking for yourself. Or asking them how certain things are connected in the code.</p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">The Future of AI-Assisted Development</h2>
      
      <p class="mb-4">As AI development becomes more complex, tools like Claude Code will become essential. The ability to have a coding partner that understands both the technical requirements and the business context is transformative.</p>
      
      <p class="mb-4">The key is not replacing human creativity and problem-solving, but augmenting it with AI capabilities that handle the routine tasks and provide intelligent suggestions for the complex ones.</p>
      
      <p class="mb-4">Remember one thing, <strong>DO NOT</strong> trust AI to come up with ideas, at the end of the day ideas are only human while LLMs and thinking models are algorithms that generate and predict the next word in a given sentence.</p>
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
            className="prose prose-lg max-w-none prose-gray dark:prose-invert text-justify"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>
    </div>
  );
}