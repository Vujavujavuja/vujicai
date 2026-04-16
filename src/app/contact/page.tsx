'use client';

import { StarButton } from '@/components/ui/star-button';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export default function ContactPage() {
  const { theme } = useTheme();
  const [lightColor, setLightColor] = useState('#FAFAFA');

  useEffect(() => {
    setLightColor(theme === 'dark' ? '#FAFAFA' : '#EC4E02');
  }, [theme]);

  return (
    <div className="py-20 pb-32 md:pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-xl md:pl-24">
        <div className="mb-12 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-medium tracking-tight mb-4">
            Get in Touch
          </h1>
          <p className="text-muted-foreground">
            Always open to discussing AI, technology, and new opportunities
          </p>
        </div>

        <form
          action="https://formspree.io/f/mwpqpepj"
          method="POST"
          className="space-y-5"
        >
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea
              name="message"
              rows={5}
              required
              className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
              placeholder="Your message..."
            />
          </div>

          <div className="flex justify-center pt-2">
            <StarButton lightColor={lightColor} className="rounded-3xl px-8 h-12">
              Send Message
            </StarButton>
          </div>
        </form>
      </div>
    </div>
  );
}
