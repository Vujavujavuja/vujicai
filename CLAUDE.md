# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "Vujic AI" - Nemanja Vujić's personal website and blog built with **Next.js 14** and modern web technologies. It's a static site deployed on Cloudflare Pages, showcasing AI/ML expertise with responsive design, animations, and multilingual support.

## Essential Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server at localhost:3000 |
| `npm run build` | Build production site to ./out/ |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality |
| `npm run type-check` | Run TypeScript type checking |
| `npm run deploy` | Deploy to Cloudflare Pages |

## Architecture

### Core Framework
- **Next.js 14** with App Router and TypeScript
- **Tailwind CSS** for styling with custom design system
- **Framer Motion** for animations and interactions
- **Cloudflare Pages** for deployment

### Key Features
- **Responsive Design**: Mobile-first approach with breakpoints
- **Dark/Light Mode**: Theme toggle with next-themes
- **Multilingual Support**: Serbian/English language toggle
- **Animations**: Smooth transitions and micro-interactions
- **SEO Optimized**: Meta tags, Open Graph, and Twitter cards

### Key Configuration
- `next.config.js`: Next.js configuration with static export
- `tailwind.config.js`: Tailwind CSS with custom animations and colors
- `wrangler.toml`: Cloudflare Pages deployment settings
- `tsconfig.json`: TypeScript configuration with path aliases

### Project Structure
- `src/app/`: Next.js app directory with pages and layouts
- `src/components/`: Reusable React components
- `src/data/`: Content data and translations
- `src/lib/`: Utility functions and helpers
- `src/types/`: TypeScript type definitions
- `public/`: Static assets and images

### Components Architecture
- **Layout Components**: Header, Footer with navigation
- **Theme Provider**: Dark/light mode state management
- **Language Provider**: Serbian/English language context
- **Animation Components**: Framer Motion wrappers

### Content Management
- **Static Content**: Defined in `src/data/content.ts`
- **Multilingual**: All content has English and Serbian versions
- **Blog Posts**: Currently mock data, ready for CMS integration
- **Images**: Placeholder system with pictures.md guide

## Development Notes

- **Styling**: Tailwind CSS with custom design tokens
- **Animations**: Framer Motion for page transitions and interactions
- **State Management**: React Context for theme and language
- **Type Safety**: Full TypeScript coverage with strict mode
- **Performance**: Optimized images and lazy loading
- **Accessibility**: ARIA labels and keyboard navigation

## Deployment

- **Static Export**: Next.js static export for Cloudflare Pages
- **Auto Deploy**: GitHub Actions workflow on push to main
- **Environment**: Production environment configured in wrangler.toml
- **Assets**: Images and static files served from /public

## Content Translation

All user-facing content supports English and Serbian:
- `personalInfo`: Personal information and bio
- `navigation`: Menu items and labels
- `socialLinks`: Social media links
- Page content has language-specific versions

## Image Requirements

See `pictures.md` for detailed image requirements including:
- Profile photos (150x150px, 300x300px)
- Blog hero images (1020x510px)
- Social media images (1200x630px)
- Favicon and branding assets