'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Code, Brain, Zap, Users, Award, Globe2, Cloud } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { MarkdownText } from '@/components/markdown-text';
import { personalInfo } from '@/data/content';

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
      <section className="relative overflow-hidden py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div
              variants={itemVariants}
              className="relative mb-8 inline-block"
            >
              <Image
                src="/placeholder-avatar.jpeg"
                alt="Nemanja Vujić"
                width={150}
                height={150}
                className="rounded-full mx-auto shadow-xl object-cover object-center"
                style={{ transform: 'scale(1.35)' }}
                priority
              />
            </motion.div>
            
            <motion.h1
              variants={itemVariants}
              className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-6 heading-enhanced"
            >
              Hey there, I&apos;m <span className="text-primary">{personalInfo.name}</span>
            </motion.h1>
            
            <motion.div
              variants={itemVariants}
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-enhanced"
            >
              <MarkdownText>{personalInfo.bio}</MarkdownText>
            </motion.div>
            
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Learn More About Me
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              
              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-md border border-white/20 bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm px-8 py-3 text-sm font-medium hover:bg-white/20 dark:hover:bg-gray-800/30 transition-colors"
              >
                Read My Blog
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto max-w-4xl"
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4 heading-enhanced">
                About My Work
              </h2>
              <div className="text-lg text-muted-foreground text-enhanced">
                <MarkdownText>{personalInfo.about}</MarkdownText>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                variants={itemVariants}
                className="p-6 rounded-lg border border-white/20 bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm text-card-foreground shadow-sm hover:shadow-md transition-shadow card-bounce"
              >
                <Brain className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">
                  AI Research
                </h3>
                <p className="text-muted-foreground">
                  Deep dive into LLMs, generative models, and cutting-edge AI technologies.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="p-6 rounded-lg border border-white/20 bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm text-card-foreground shadow-sm hover:shadow-md transition-shadow card-bounce"
              >
                <Code className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">
                  ML Engineering
                </h3>
                <p className="text-muted-foreground">
                  Building scalable ML pipelines and production-ready AI systems.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="p-6 rounded-lg border border-white/20 bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm text-card-foreground shadow-sm hover:shadow-md transition-shadow card-bounce"
              >
                <Zap className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">
                  Prompt Engineering
                </h3>
                <p className="text-muted-foreground">
                  Crafting effective prompts and optimizing AI model interactions.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto max-w-4xl"
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4 heading-enhanced">
                Technical Skills
              </h2>
              <div className="text-lg text-muted-foreground text-enhanced">
                <MarkdownText>{personalInfo.skills}</MarkdownText>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                variants={itemVariants}
                className="p-6 rounded-lg border border-white/20 bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm text-card-foreground shadow-sm"
              >
                <Cloud className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">
                  Cloud Experience
                </h3>
                <div className="text-muted-foreground">
                  <MarkdownText>{personalInfo.experience}</MarkdownText>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="p-6 rounded-lg border border-white/20 bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm text-card-foreground shadow-sm"
              >
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">
                  Mentoring & Education
                </h3>
                <div className="text-muted-foreground">
                  <MarkdownText>{personalInfo.mentoring}</MarkdownText>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Fun Fact Section */}
      <section className="py-20">
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
              className="p-8 rounded-lg border border-white/20 bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm text-card-foreground shadow-sm card-bounce"
            >
              <Award className="h-16 w-16 text-primary mb-6 mx-auto" />
              <h2 className="text-2xl font-bold mb-4">
                Fun Fact
              </h2>
              <div className="text-lg text-muted-foreground text-enhanced">
                <MarkdownText>{personalInfo.powerlifting}</MarkdownText>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}