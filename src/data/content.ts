import { PersonalInfo, NavigationItem, SocialLink } from '@/types';

export const personalInfo: PersonalInfo = {
  name: {
    en: "Nemanja Vujić",
    sr: "Nemanja Vujić"
  },
  title: {
    en: "Data Scientist & AI Engineer",
    sr: "Naučnik podataka i AI inženjer"
  },
  location: {
    en: "Pančevo, Serbia",
    sr: "Pančevo, Srbija"
  },
  company: {
    en: "Vega IT",
    sr: "Vega IT"
  },
  bio: {
    en: "I'm a **Data Scientist & AI Engineer** from Pančevo, Serbia – currently working on advanced AI projects at **Vega IT** in Belgrade. I specialize in building **smart, scalable, and production-ready AI systems** that solve real-world problems.",
    sr: "Ja sam **naučnik podataka i AI inženjer** iz Pančeva, Srbija – trenutno radim na naprednim AI projektima u **Vega IT-u** u Beogradu. Specijalizovan sam za izgradnju **pametnih, skalabilnih i produkciono-spremnih AI sistema** koji rešavaju probleme iz stvarnog sveta."
  },
  about: {
    en: "I'm obsessed with **AI research**, especially the latest in **LLMs, generative models, and prompt engineering**. My journey into AI started with **annotating LLM outputs** and evolved into developing **full-scale ML pipelines, model evaluations, and RAG architectures**.",
    sr: "Opsednut sam **AI istraživanjem**, posebno najnovijim dostignućima u **LLM-ovima, generativnim modelima i prompt engineering-u**. Moj put u AI je počeo sa **anotiranjem LLM izlaza** i evoluirao je u razvoj **potpunih ML pipeline-ova, evaluaciju modela i RAG arhitekture**."
  },
  skills: {
    en: "My main language is **Python**. I use libraries like **LangChain, LangGraph, PyTorch, Pandas, NumPy**, and more. I've worked with vector DBs like **FAISS and Milvus** to create **semantic search engines and RAG pipelines**. I'm also confident in model monitoring with **MLflow and Weights & Biases**, including **A/B testing setups** for production ML models.",
    sr: "Moj glavni jezik je **Python**. Koristim biblioteke kao što su **LangChain, LangGraph, PyTorch, Pandas, NumPy** i druge. Radio sam sa vektorskim bazama podataka kao što su **FAISS i Milvus** za kreiranje **semantičkih pretraživača i RAG pipeline-ova**. Takođe sam siguran u praćenju modela sa **MLflow i Weights & Biases**, uključujući **A/B testiranje** za production ML modele."
  },
  experience: {
    en: "My **cloud experience** spans across:\n• **Azure**: OpenAI, AI Studio, Cognitive Services, AI Foundry\n• **GCP**: Vertex AI, Natural Language AI\n• **AWS**: Bedrock, Comprehend, Personalize\n\nI frequently use **Docker** for containerization and deployment of machine learning applications across these platforms.",
    sr: "Moje **cloud iskustvo** obuhvata:\n• **Azure**: OpenAI, AI Studio, Cognitive Services, AI Foundry\n• **GCP**: Vertex AI, Natural Language AI\n• **AWS**: Bedrock, Comprehend, Personalize\n\nČesto koristim **Docker** za kontejnerizaciju i deployment machine learning aplikacija na ovim platformama."
  },
  powerlifting: {
    en: "I used to compete in **powerlifting** and placed **4th nationally** in Serbia's Junior -105kg category. These days, I lift models more than weights – but I still chase progress every day.",
    sr: "Takmičio sam se u **powerlifting-u** i zauzeo **4. mesto na nacionalnom nivou** u Srbiji u Junior -105kg kategoriji. Danas više podižem modele nego tegove – ali još uvek jurim napredak svaki dan."
  },
  mentoring: {
    en: "Beyond engineering, I'm passionate about **mentoring and education**. I guide **junior data scientists** at Vega IT and have developed **AI learning labs for high school students**. These programs teach young minds how to leverage AI tools for learning and problem-solving, helping bridge the gap between traditional education and modern AI capabilities. I believe in empowering the next generation with practical AI skills.",
    sr: "Pored inženjeringa, strastan sam za **mentorstvo i edukaciju**. Vodim **mlade naučnike podataka** u Vega IT-u i razvio sam **AI laboratorije za učenike srednjih škola**. Ovi programi uče mlade umove kako da koriste AI alate za učenje i rešavanje problema, pomažući da se premosti jaz između tradicionalne edukacije i modernih AI mogućnosti. Verujem u osnažavanje sledeće generacije praktičnim AI veštinama."
  }
};

export const navigation: NavigationItem[] = [
  {
    label: { en: "Home", sr: "Početna" },
    href: "/"
  },
  {
    label: { en: "About", sr: "O meni" },
    href: "/about"
  },
  {
    label: { en: "Blog", sr: "Blog" },
    href: "/blog"
  },
  {
    label: { en: "Contact", sr: "Kontakt" },
    href: "/contact"
  }
];

export const socialLinks: SocialLink[] = [
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/nemanja-vujic",
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