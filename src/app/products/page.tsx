'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Layers, Globe2 } from 'lucide-react';

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

export default function ProductsPage() {
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
              Products
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              AI-powered tools and solutions to enhance your development workflow
            </p>
          </motion.div>

          <div className="grid gap-8">
            <motion.div
              variants={itemVariants}
              className="relative p-8 rounded-lg border border-white/20 bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <Globe2 className="h-16 w-16 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3">Vuja Mapapp</h3>
                  <p className="text-muted-foreground mb-4 text-lg">
                    An AI-powered travel route generator that creates aesthetic travel maps based on your vibes.
                    Describe your dream trip, and let AI design a beautiful route with custom styling and map themes.
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                      AI-Powered
                    </span>
                    <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                      Cloudflare Workers
                    </span>
                    <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                      Interactive Maps
                    </span>
                    <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                      OpenRouter API
                    </span>
                  </div>

                  <motion.a
                    href="https://map.vujic.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center bg-primary text-primary-foreground py-3 px-6 rounded-md hover:bg-primary/90 transition-colors font-medium"
                  >
                    Launch Mapapp
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </motion.a>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="relative p-8 rounded-lg border border-white/20 bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <Layers className="h-16 w-16 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3">PromptStratum</h3>
                  <p className="text-muted-foreground mb-6 text-lg">
                    Get more out of your AI usage with a simple prompt layer (stratum) using my free MCP server
                  </p>

                  <motion.a
                    href="https://promptstratum.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center bg-primary text-primary-foreground py-3 px-6 rounded-md hover:bg-primary/90 transition-colors font-medium"
                  >
                    Visit PromptStratum
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </motion.a>

                  <div className="mt-6 text-sm text-muted-foreground">
                    Coming Soon
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}