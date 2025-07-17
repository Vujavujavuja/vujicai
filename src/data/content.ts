import { PersonalInfo, NavigationItem, SocialLink } from '@/types';

export const personalInfo: PersonalInfo = {
  name: "Nemanja Vujić",
  title: "Data Scientist & AI Engineer",
  location: "Pančevo, Serbia",
  company: "Vega IT",
  bio: "I'm a **Data Scientist & AI Engineer** from Pančevo, Serbia – currently working on advanced AI projects at **Vega IT** in Belgrade. I specialize in building **smart, scalable, and production-ready AI systems** that solve real-world problems.",
  about: "I'm obsessed with **AI research**, especially the latest in **LLMs, generative models, and prompt engineering**. My journey into AI started with **annotating LLM outputs** and evolved into developing **full-scale ML pipelines, model evaluations, and RAG architectures**.",
  skills: "My main language is **Python**. I use libraries like **LangChain, LangGraph, PyTorch, Pandas, NumPy**, and more. I've worked with vector DBs like **FAISS and Milvus** to create **semantic search engines and RAG pipelines**. I'm also confident in model monitoring with **MLflow and Weights & Biases**, including **A/B testing setups** for production ML models.",
  experience: "My **cloud experience** spans across:\n• **Azure**: OpenAI, AI Studio, Cognitive Services, AI Foundry\n• **GCP**: Vertex AI, Natural Language AI\n• **AWS**: Bedrock, Comprehend, Personalize\n\nI frequently use **Docker** for containerization and deployment of machine learning applications across these platforms.",
  powerlifting: "I used to compete in **powerlifting** and placed **4th nationally** in Serbia's Junior -105kg category. These days, I lift models more than weights – but I still chase progress every day.",
  mentoring: "Beyond engineering, I'm passionate about **mentoring and education**. I guide **junior data scientists** at Vega IT and have developed **AI learning labs for high school students**. These programs teach young minds how to leverage AI tools for learning and problem-solving, helping bridge the gap between traditional education and modern AI capabilities. I believe in empowering the next generation with practical AI skills."
};

export const navigation: NavigationItem[] = [
  {
    label: "Home",
    href: "/"
  },
  {
    label: "About",
    href: "/about"
  },
  {
    label: "Blog",
    href: "/blog"
  },
  {
    label: "Services",
    href: "/services"
  }
];

export const socialLinks: SocialLink[] = [
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/nemanja-vujic-vuja43",
    icon: "linkedin"
  },
  {
    name: "GitHub",
    url: "https://github.com/vujavujavuja",
    icon: "github"
  },
  {
    name: "Email",
    url: "mailto:nemanja@vujic.ai",
    icon: "mail"
  }
];