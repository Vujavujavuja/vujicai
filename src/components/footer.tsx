'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';
import { useLanguage } from './language-provider';
import { socialLinks } from '@/data/content';

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
};

export function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="border-t border-white/10 bg-white/10 dark:bg-gray-900/20 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Nemanja Vujić. {language === 'en' ? 'All rights reserved.' : 'Sva prava zadržana.'}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {socialLinks.map((link) => {
              const Icon = iconMap[link.icon as keyof typeof iconMap];
              return (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-md hover:bg-accent transition-colors"
                  aria-label={link.name}
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              );
            })}
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t text-center">
          <p className="text-xs text-muted-foreground">
            {language === 'en' 
              ? 'Built with Next.js, TypeScript, and Tailwind CSS'
              : 'Napravljeno sa Next.js, TypeScript i Tailwind CSS'
            }
          </p>
        </div>
      </div>
    </footer>
  );
}