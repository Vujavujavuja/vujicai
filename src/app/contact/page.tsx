'use client';

import { motion } from 'framer-motion';
import { Mail, MapPin, Linkedin, Github } from 'lucide-react';
import { useLanguage } from '@/components/language-provider';
import { personalInfo, socialLinks } from '@/data/content';

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

export default function ContactPage() {
  const { language } = useLanguage();

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
              {language === 'en' ? 'Get in Touch' : 'Stupite u kontakt'}
            </h1>
            <p className="text-lg text-muted-foreground">
              {language === 'en' 
                ? "I'm always open to discussing AI, technology, and new opportunities"
                : 'Uvek sam otvoren za razgovor o AI-ju, tehnologiji i novim prilikama'
              }
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold mb-6">
                {language === 'en' ? 'Contact Information' : 'Kontakt informacije'}
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">
                    nemanja@vujic.ai
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">
                    {personalInfo.location[language]}
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">
                  {language === 'en' ? 'Social Links' : 'Društvene mreže'}
                </h3>
                <div className="flex space-x-4">
                  {socialLinks.map((link) => (
                    <motion.a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                    >
                      {link.icon === 'linkedin' && <Linkedin className="h-5 w-5" />}
                      {link.icon === 'github' && <Github className="h-5 w-5" />}
                      {link.icon === 'mail' && <Mail className="h-5 w-5" />}
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold mb-6">
                {language === 'en' ? 'Send a Message' : 'Pošaljite poruku'}
              </h2>
              
              <form 
                action="https://formspree.io/f/xpwzgpbz" 
                method="POST"
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'en' ? 'Name' : 'Ime'}
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={language === 'en' ? 'Your name' : 'Vaše ime'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'en' ? 'Email' : 'Imejl'}
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={language === 'en' ? 'your.email@example.com' : 'vas.email@example.com'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'en' ? 'Message' : 'Poruka'}
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={language === 'en' ? 'Your message...' : 'Vaša poruka...'}
                  />
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
                >
                  {language === 'en' ? 'Send Message' : 'Pošalji poruku'}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}