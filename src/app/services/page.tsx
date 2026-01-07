'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Database, Cog, ArrowRight, CheckCircle } from 'lucide-react';

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

const services = [
  {
    id: 'ai-consulting',
    title: 'AI Consulting',
    icon: Brain,
    description: 'Strategic AI guidance to transform your business with cutting-edge artificial intelligence solutions.',
    features: [
      'AI Strategy Development',
      'Technology Assessment',
      'Implementation Roadmap',
      'ROI Analysis',
      'Risk Assessment',
      'Team Training'
    ],
    formAction: 'https://formspree.io/f/mldldrdb'
  },
  {
    id: 'data-science',
    title: 'Data Science',
    icon: Database,
    description: 'Turn your data into actionable insights with advanced analytics and machine learning solutions.',
    features: [
      'Data Analysis & Visualization',
      'Predictive Modeling',
      'Statistical Analysis',
      'Data Pipeline Development',
      'Business Intelligence',
      'Custom Dashboards'
    ],
    formAction: 'https://formspree.io/f/meozojol'
  },
  {
    id: 'ai-engineering',
    title: 'AI Engineering',
    icon: Cog,
    description: 'Build and deploy production-ready AI systems that scale with your business needs.',
    features: [
      'ML Model Development',
      'System Architecture',
      'Model Deployment',
      'Performance Optimization',
      'Monitoring & Maintenance',
      'Integration Support'
    ],
    formAction: 'https://formspree.io/f/mgvzvwvp'
  }
];

export default function ServicesPage() {
  const [activeService, setActiveService] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<{[key: string]: 'idle' | 'submitting' | 'success' | 'error'}>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, serviceId: string, formAction: string) => {
    e.preventDefault();
    setFormStatus(prev => ({ ...prev, [serviceId]: 'submitting' }));

    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch(formAction, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setFormStatus(prev => ({ ...prev, [serviceId]: 'success' }));
        (e.target as HTMLFormElement).reset();
        setTimeout(() => {
          setActiveService(null);
          setFormStatus(prev => ({ ...prev, [serviceId]: 'idle' }));
        }, 3000);
      } else {
        setFormStatus(prev => ({ ...prev, [serviceId]: 'error' }));
      }
    } catch (error) {
      setFormStatus(prev => ({ ...prev, [serviceId]: 'error' }));
    }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-6xl"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
              Services
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive AI and data science services to accelerate your business transformation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = service.icon;
              const isActive = activeService === service.id;
              const status = formStatus[service.id] || 'idle';

              return (
                <motion.div
                  key={service.id}
                  variants={itemVariants}
                  className={`relative p-8 rounded-lg border transition-all duration-300 ${
                    isActive 
                      ? 'border-primary bg-primary/5' 
                      : 'border-white/20 bg-white/10 dark:bg-gray-900/20 hover:border-primary/50'
                  } backdrop-blur-sm`}
                >
                  <div className="text-center mb-6">
                    <Icon className="h-16 w-16 text-primary mb-4 mx-auto" />
                    <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">What&apos;s Included:</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {!isActive ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveService(service.id)}
                      className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center"
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </motion.button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      {status === 'success' ? (
                        <div className="text-center py-8">
                          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                          <h4 className="text-lg font-semibold text-green-500 mb-2">Message Sent!</h4>
                          <p className="text-muted-foreground">Thank you for your interest. I&apos;ll get back to you soon!</p>
                        </div>
                      ) : (
                        <form onSubmit={(e) => handleSubmit(e, service.id, service.formAction)} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Name</label>
                            <input
                              type="text"
                              name="name"
                              required
                              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="Your name"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input
                              type="email"
                              name="email"
                              required
                              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="your.email@example.com"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2">Company (Optional)</label>
                            <input
                              type="text"
                              name="company"
                              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="Your company"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2">Project Description</label>
                            <textarea
                              name="message"
                              rows={4}
                              required
                              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder={`Tell me about your ${service.title.toLowerCase()} needs...`}
                            />
                          </div>
                          
                          <input type="hidden" name="service" value={service.title} />
                          
                          <div className="flex gap-2">
                            <button
                              type="submit"
                              disabled={status === 'submitting'}
                              className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                            >
                              {status === 'submitting' ? 'Sending...' : 'Send Message'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveService(null)}
                              className="px-4 py-2 border border-input rounded-md hover:bg-accent transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                          
                          {status === 'error' && (
                            <p className="text-red-500 text-sm">
                              Something went wrong. Please try again.
                            </p>
                          )}
                        </form>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}