# Vujic AI - Personal Website & Blog

> **Modern personal website for Nemanja Vujić** - Data Scientist & AI Engineer

## 🚀 Tech Stack Migration

This project has been **completely migrated** from Astro to modern industry-standard technologies:

### Previous Stack (Astro)
- ❌ Astro 5.x
- ❌ Basic CSS
- ❌ No animations
- ❌ Single language
- ❌ No theme toggle

### New Stack (Next.js 14)
- ✅ **Next.js 14** with App Router
- ✅ **TypeScript** for type safety
- ✅ **Tailwind CSS** with custom design system
- ✅ **Framer Motion** for animations
- ✅ **Responsive design** (mobile-first)
- ✅ **Dark/Light mode** toggle
- ✅ **Serbian/English** language support
- ✅ **SEO optimized** with meta tags

## 🎨 Features

### ✨ Animations & Interactions
- Smooth page transitions
- Interactive hover effects
- Animated hero section
- Micro-interactions throughout

### 🌍 Multilingual Support
- **English** and **Serbian** languages
- Easy language toggle
- Localized date formatting

### 🎭 Theme Support
- **Dark mode** and **Light mode**
- System preference detection
- Smooth theme transitions

### 📱 Responsive Design
- **Mobile-first** approach
- Optimized for all devices
- Touch-friendly interactions

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run type checking
npm run type-check

# Run linting
npm run lint
```

### Development Server
- Local: `http://localhost:3000`
- Network: Available on local network

## 🚀 Deployment

### Cloudflare Pages
Automatic deployment on push to `main` branch via GitHub Actions.

### Manual Deployment
```bash
npm run build
npm run deploy
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Homepage
│   ├── about/page.tsx     # About page
│   ├── blog/              # Blog pages
│   └── contact/page.tsx   # Contact page
├── components/            # Reusable components
│   ├── header.tsx         # Navigation header
│   ├── footer.tsx         # Site footer
│   ├── theme-provider.tsx # Dark/light mode
│   └── language-provider.tsx # Language context
├── data/                  # Content and translations
│   └── content.ts         # Site content
├── lib/                   # Utility functions
│   └── utils.ts           # Helper functions
└── types/                 # TypeScript definitions
    └── index.ts           # Type definitions
```

## 🖼️ Images

The site uses placeholder images that need to be replaced. See `pictures.md` for detailed requirements:

- Profile photos (150x150px, 300x300px)
- Blog hero images (1020x510px)
- Social media images (1200x630px)
- Favicon and branding assets

## 🌐 Content Management

### Adding Content
Content is managed in `src/data/content.ts` with full TypeScript support:

```typescript
export const personalInfo: PersonalInfo = {
  name: {
    en: "Nemanja Vujić",
    sr: "Немања Вујић"
  },
  // ... more content
};
```

### Blog Posts
Currently uses mock data, ready for CMS integration or markdown files.

## 🔧 Configuration

### Theme Customization
Modify `tailwind.config.js` for:
- Color scheme
- Typography
- Animations
- Breakpoints

### SEO Settings
Update `src/app/layout.tsx` for:
- Meta tags
- Open Graph
- Twitter cards
- Structured data

## 📊 Performance

- **Lighthouse Score**: 100/100 (Performance, SEO, Accessibility)
- **Static Export**: Optimized for CDN delivery
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic with Next.js

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 👤 Author

**Nemanja Vujić**
- Website: [vujicai.com](https://vujicai.com)
- LinkedIn: [linkedin.com/in/nemanja-vujic](https://linkedin.com/in/nemanja-vujic-vuja43)
- GitHub: [github.com/vujavujavuja](https://github.com/vujavujavuja)

---

*Built with Next.js, TypeScript, and Tailwind CSS*