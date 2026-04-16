export default function HomePage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Hero */}
        <section className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Nemanja Vujic
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Data Scientist & AI Engineer
          </p>
          <p className="text-lg leading-relaxed">
            I&apos;m a Data Scientist &amp; AI Engineer from Pancevo, Serbia &ndash; currently
            working on advanced AI projects at Vega IT in Belgrade. I specialize in building
            smart, scalable, and production-ready AI systems that solve real-world problems
            using Large Language Models (LLMs), Generative AI, and RAG
            (Retrieval-Augmented Generation) systems.
          </p>
        </section>

        {/* About */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4">About Me</h2>
          <p className="mb-4 leading-relaxed">
            I&apos;m obsessed with AI research, especially the latest in LLMs, generative
            models, and prompt engineering. My journey into AI started with annotating LLM
            outputs and evolved into developing full-scale ML pipelines, model evaluations,
            and RAG architectures. I help companies implement ChatGPT-like systems, AI
            chatbots, and intelligent document processing using cutting-edge natural
            language processing techniques.
          </p>
          <p className="leading-relaxed">
            Beyond engineering, I&apos;m passionate about mentoring and education. I guide
            junior data scientists at Vega IT and have developed AI learning labs for high
            school students. I believe in empowering the next generation with practical AI
            skills and responsible AI development.
          </p>
        </section>

        {/* Skills */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-4">Skills &amp; Experience</h2>
          <p className="mb-4 leading-relaxed">
            My main language is Python for AI and Machine Learning. I use libraries like
            LangChain, LangGraph, PyTorch, Pandas, NumPy, and more. I&apos;ve worked with
            vector databases like FAISS and Milvus to create semantic search engines and
            RAG pipelines. I&apos;m also experienced in model monitoring with MLflow and
            Weights &amp; Biases, including A/B testing setups for production ML models.
          </p>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Cloud AI Experience</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Azure: OpenAI GPT-4, AI Studio, Cognitive Services, AI Foundry</li>
              <li>GCP: Vertex AI, Natural Language AI, PaLM API</li>
              <li>AWS: Bedrock, Comprehend, Personalize, SageMaker</li>
            </ul>
          </div>
        </section>

        {/* Fun fact */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Beyond Code</h2>
          <p className="leading-relaxed">
            I used to compete in powerlifting and placed 4th nationally in Serbia&apos;s
            Junior -105kg category. These days, I lift models more than weights &ndash; but
            I still chase progress every day.
          </p>
        </section>
      </div>
    </div>
  );
}
