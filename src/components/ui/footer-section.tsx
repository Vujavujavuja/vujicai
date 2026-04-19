'use client';

import React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react';

interface FooterLink {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  external?: boolean;
  me?: boolean;
}

interface FooterSection {
  label: string;
  links: FooterLink[];
}

const footerLinks: FooterSection[] = [
  {
    label: 'Navigate',
    links: [
      { title: 'Home', href: '/' },
      { title: 'Blog', href: '/blog' },
      { title: 'Playground', href: '/playground' },
      { title: 'Corner', href: '/corner' },
      { title: 'Wins', href: '/accomplishments' },
      { title: 'Contact', href: '/contact' },
    ],
  },
  {
    label: 'Projects',
    links: [
      { title: 'Vuja Mapapp', href: 'https://map.vujic.ai', external: true },
      { title: 'Vuja Paper', href: 'https://paper.vujic.ai', external: true },
      { title: 'PromptStratum', href: 'https://promptstratum.com', external: true },
    ],
  },
  {
    label: 'Connect',
    links: [
      { title: 'LinkedIn', href: 'https://linkedin.com/in/nemanja-vujic-vuja43', icon: Linkedin, external: true, me: true },
      { title: 'GitHub', href: 'https://github.com/vujavujavuja', icon: Github, external: true, me: true },
      { title: 'Email', href: 'mailto:nemanja@vujic.ai', icon: Mail, me: true },
    ],
  },
];

export function FooterSection() {
  return (
    <footer className="relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center rounded-t-3xl md:rounded-t-[48px] border-t bg-[radial-gradient(35%_128px_at_50%_0%,hsl(var(--primary)/8%),transparent)] px-6 py-12 lg:py-16">
      <div className="absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur bg-foreground/20" />

      <div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8">
        <AnimatedContainer className="space-y-4">
          <div className="font-serif text-2xl font-medium tracking-tight">Nemanja Vujić</div>
          <p className="text-muted-foreground text-sm italic">
            Building, experiencing, researching, talking and listening.
            <br />
            Putting my own thoughts in words.
          </p>
          <p className="text-muted-foreground mt-8 text-xs md:mt-0">
            &copy; {new Date().getFullYear()} Nemanja Vujić. All rights reserved.
          </p>
        </AnimatedContainer>

        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-3 xl:col-span-2 xl:mt-0">
          {footerLinks.map((section, index) => (
            <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
              <div className="mb-10 md:mb-0">
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground/70">{section.label}</h3>
                <ul className="text-muted-foreground mt-4 space-y-2 text-sm">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <a
                        href={link.href}
                        className="hover:text-foreground inline-flex items-center transition-all duration-300"
                        {...(link.external
                          ? {
                              target: '_blank',
                              rel: `noopener noreferrer${link.me ? ' me' : ''}`,
                            }
                          : link.me
                            ? { rel: 'me' }
                            : {})}
                      >
                        {link.icon && <link.icon className="me-1.5 size-3.5" />}
                        {link.title}
                        {link.external && !link.icon && <ExternalLink className="ms-1 size-3" />}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </footer>
  );
}

type ViewAnimationProps = {
  delay?: number;
  className?: ComponentProps<typeof motion.div>['className'];
  children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
