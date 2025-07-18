'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

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

export default function AboutPage() {
  const aboutContent = {
    title: "About Me",
    intro: "My name is Nemanja Vujić, and I am a passionate and driven Data Scientist, AI Engineer, and AI Consultant - yes, I wear quite a few hats, but they all stem from one deep-rooted interest: using artificial intelligence to solve real-world problems. I come from a small but vibrant town in Serbia called Pančevo, located just across the river from the capital city, Belgrade. I earned my Bachelor's degree in Computer Science at the Faculty of Computing, and I'm currently pursuing a Master's degree - still deciding between specializing in Data Science or Artificial Intelligence, though both fields continue to fascinate me.",
    aiJourney: "My journey into the world of AI began in a rather unexpected and relatable way. Like many students, I was struggling to complete a project for class and turned to ChatGPT in search of help. What started as a shortcut quickly became an obsession. I was amazed: how could a model that \"just predicts the next word\" be so effective at writing code, answering questions, and holding conversations? That moment sparked a deep curiosity in me. I wanted to understand what was happening under the hood - how language models work, what makes them so powerful, and how they can be improved or applied in new ways. Since then, I've been on an immersive journey through machine learning, deep learning, NLP, and beyond. Whether it's building AI-powered tools, exploring ethical implications, or discussing the future of general intelligence, I'm always eager to learn more and share knowledge with others. AI isn't just a career path for me - it's a lens through which I view the world, a toolkit for innovation, and a source of endless inspiration.",
    earlyCareer: "My journey into the world of AI began in a humble yet impactful way - as a Data Annotator for an AI company. My job was to evaluate the performance of Large Language Models (LLMs), specifically reviewing their code generation capabilities. I would meticulously examine outputs, identify flaws, and correct coding errors. Over time, this hands-on experience naturally transitioned into more advanced tasks - most notably, Prompt Engineering. Prompt Engineering quickly became one of my favorite aspects of AI development. There's something incredibly powerful - almost artistic - about guiding a model's behavior through carefully crafted language. It felt like conducting an orchestra using nothing but words and the raw intelligence of generative models. That role helped me develop a deep appreciation for the subtle dynamics between human intent and machine response. Despite my growing interest, I eventually left that position and took a brief detour from the AI world. I joined Luxoft as a Software Delivery Specialist - a title that, in practice, meant I was something of a \"benched\" programmer. During this time, I explored a wide range of technical disciplines: from Software Engineering to Quality Assurance, DevOps, and more. It was a period of exploration, flexibility, and learning - but I knew my true passion still lay in AI. Then came a turning point. I was offered the opportunity to take any Microsoft Azure certification of my choice - and for me, the answer was obvious: Azure AI Engineer Associate. I committed a month to studying and passed the exam with ease. More importantly, it reignited the spark I had for AI - reminding me that this is where I belong and what I want to keep pursuing, professionally and personally.",
    vegaIT: "After my time at Luxoft, I felt a strong pull to return to the world of AI - and that's when Vega IT entered the picture. They offered me a role as a Data Scientist & AI Engineer, and I accepted almost without hesitation. It felt like the right move - and it absolutely was. My experience at Vega IT has been incredibly rewarding. The projects I've worked on are modern, impactful, and aligned with cutting-edge AI trends. I've had the chance to contribute to several Generative AI initiatives, as well as one standout consulting project, which has been my personal favorite so far. Beyond the technical work, one of the most fulfilling parts of my role has been mentoring new interns in the field of Data Science. Guiding and supporting the next generation of AI talent is something I genuinely enjoy, and it's helped me grow not just as an engineer, but also as a communicator and leader.",
    powerlifting: "You might also know me from my time as a powerlifter, a passion I still pursue whenever time allows. I competed semi-professionally as part of IPF Serbia, and it was an incredible chapter of my life that taught me discipline, resilience, and the importance of consistent progress - values that carry over into my work in tech and AI. My proudest achievement in the sport was securing 4th place nationally in the Junior -105kg category."
  };

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
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-8 heading-enhanced">
              {aboutContent.title}
            </h1>
            <div className="relative mb-8 inline-block">
              <Image
                src="/placeholder-about.png"
                alt="Nemanja Vujić"
                width={300}
                height={300}
                className="rounded-lg shadow-xl"
              />
            </div>
          </motion.div>

          <div className="prose prose-lg max-w-none">
            <motion.div variants={itemVariants} className="mb-8">
              <p className="text-lg text-muted-foreground leading-relaxed text-enhanced">
                {aboutContent.intro}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground heading-enhanced">
                My AI Journey
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-enhanced">
                {aboutContent.aiJourney}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground heading-enhanced">
                Early Career
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-enhanced">
                {aboutContent.earlyCareer}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground heading-enhanced">
                Vega IT Experience
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-enhanced">
                {aboutContent.vegaIT}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground heading-enhanced">
                Powerlifting Background
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-enhanced">
                {aboutContent.powerlifting}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}