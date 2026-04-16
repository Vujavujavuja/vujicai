import { HeroSection } from '@/components/ui/hero-dithering-card';
import { LatestPostCard } from '@/components/ui/latest-post-card';
import { getPostSummaries } from '@/lib/blog';

export default function HomePage() {
  const posts = getPostSummaries();
  const latestPost = posts[0];

  return (
    <div className="pb-20 md:pb-0">
      <HeroSection />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-16 space-y-20">
        {/* About */}
        <section>
          <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-6">
            About Me
          </h2>
          <div className="space-y-5 text-muted-foreground leading-relaxed">
            <p>
              I&apos;m obsessed with AI research, especially the latest in LLMs, generative
              models, and prompt engineering. My journey into AI started with annotating LLM
              outputs and evolved into developing full-scale ML pipelines, model evaluations,
              and RAG architectures.
            </p>
            <p>
              I help companies implement ChatGPT-like systems, AI chatbots, and intelligent
              document processing using cutting-edge natural language processing techniques.
              Beyond engineering, I&apos;m passionate about mentoring junior data scientists
              and developing AI learning labs for high school students.
            </p>
          </div>
        </section>

        {/* Skills */}
        <section>
          <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-6">
            Skills &amp; Experience
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            My main language is Python for AI and Machine Learning. I work with LangChain,
            LangGraph, PyTorch, and vector databases like FAISS and Milvus to build semantic
            search engines and RAG pipelines. Experienced in model monitoring with MLflow
            and Weights &amp; Biases.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-border p-6">
              <h3 className="font-serif text-lg font-medium mb-3 text-primary">Azure</h3>
              <p className="text-sm text-muted-foreground">OpenAI GPT-4, AI Studio, Cognitive Services, AI Foundry</p>
            </div>
            <div className="rounded-2xl border border-border p-6">
              <h3 className="font-serif text-lg font-medium mb-3 text-primary">GCP</h3>
              <p className="text-sm text-muted-foreground">Vertex AI, Natural Language AI, PaLM API</p>
            </div>
            <div className="rounded-2xl border border-border p-6">
              <h3 className="font-serif text-lg font-medium mb-3 text-primary">AWS</h3>
              <p className="text-sm text-muted-foreground">Bedrock, Comprehend, Personalize, SageMaker</p>
            </div>
          </div>
        </section>

        {/* Beyond Code */}
        <section>
          <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-6">
            Beyond Code
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            I used to compete in powerlifting and placed 4th nationally in Serbia&apos;s
            Junior -105kg category. These days, I lift models more than weights &ndash; but
            I still chase progress every day.
          </p>
        </section>
      </div>

      {/* Latest Blog Post */}
      {latestPost && (
        <LatestPostCard
          title={latestPost.title}
          description={latestPost.description}
          href={`/blog/${latestPost.slug}/`}
        />
      )}
    </div>
  );
}
