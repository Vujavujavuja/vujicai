'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Code, Brain, Zap, Sparkles, Rocket, Target, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

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

export default function HomePage() {

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-5xl text-center"
          >
            <motion.div
              variants={itemVariants}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                Enterprise AI Solutions
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl font-bold tracking-tight text-foreground sm:text-7xl mb-8 heading-enhanced"
            >
              Transform Your Business with{' '}
              <span className="text-primary">Intelligent AI</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto text-enhanced leading-relaxed"
            >
              Vujic AI (vAI) specializes in building production-ready AI systems powered by Large Language Models,
              Generative AI, and cutting-edge machine learning. We turn AI innovation into measurable business impact.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-4 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-md border border-white/20 bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm px-8 py-4 text-base font-medium hover:bg-white/20 dark:hover:bg-gray-800/30 transition-colors"
              >
                Learn About Us
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-24 bg-gradient-to-b from-transparent to-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto max-w-5xl"
          >
            <motion.div variants={itemVariants} className="text-center mb-20">
              <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6 heading-enhanced">
                AI Solutions That Drive Results
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                We build intelligent systems that understand, automate, and optimize your business operations.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                variants={itemVariants}
                className="p-8 rounded-lg border border-white/20 bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm text-card-foreground shadow-lg hover:shadow-xl transition-all card-bounce"
              >
                <Brain className="h-14 w-14 text-primary mb-6" />
                <h3 className="text-2xl font-semibold mb-4">
                  Generative AI
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  ChatGPT-like systems, AI chatbots, and intelligent document processing using state-of-the-art LLMs.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="p-8 rounded-lg border border-white/20 bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm text-card-foreground shadow-lg hover:shadow-xl transition-all card-bounce"
              >
                <Code className="h-14 w-14 text-primary mb-6" />
                <h3 className="text-2xl font-semibold mb-4">
                  ML Engineering
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Production-ready ML pipelines, model deployment, and monitoring systems built for scale.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="p-8 rounded-lg border border-white/20 bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm text-card-foreground shadow-lg hover:shadow-xl transition-all card-bounce"
              >
                <Zap className="h-14 w-14 text-primary mb-6" />
                <h3 className="text-2xl font-semibold mb-4">
                  RAG Systems
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Retrieval-Augmented Generation architectures that combine your data with powerful AI models.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto max-w-5xl"
          >
            <motion.div variants={itemVariants} className="text-center mb-20">
              <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6 heading-enhanced">
                Why Choose Vujic AI?
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                We combine deep technical expertise with practical business understanding.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                variants={itemVariants}
                className="p-8 rounded-lg border border-white/20 bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm"
              >
                <Rocket className="h-12 w-12 text-primary mb-6" />
                <h3 className="text-2xl font-semibold mb-4">
                  Proven Expertise
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>Production deployments across Azure, AWS, and GCP</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>Advanced prompt engineering and model optimization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>Full-stack AI development from concept to deployment</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="p-8 rounded-lg border border-white/20 bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm"
              >
                <Target className="h-12 w-12 text-primary mb-6" />
                <h3 className="text-2xl font-semibold mb-4">
                  Modern Tech Stack
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>LangChain, LangGraph, PyTorch for AI development</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>Vector databases (FAISS, Milvus) for semantic search</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>MLflow and W&B for model monitoring and A/B testing</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div
              variants={itemVariants}
              className="p-12 rounded-2xl border border-white/20 bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm shadow-2xl"
            >
              <h2 className="text-3xl font-bold mb-6 heading-enhanced">
                Ready to Transform Your Business with AI?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Let&apos;s discuss how Vujic AI can help you leverage the power of artificial intelligence
                to solve your unique business challenges.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-4 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
                >
                  Schedule a Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center rounded-md border border-white/20 bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm px-8 py-4 text-base font-medium hover:bg-white/20 dark:hover:bg-gray-800/30 transition-colors"
                >
                  Explore Our Services
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}