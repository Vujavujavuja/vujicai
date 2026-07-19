// Regenerates public/llms.txt from the current post metadata so the
// LLM-facing site summary never goes stale. Runs automatically before build
// via the "prebuild" npm script.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://vujic.ai';

const posts = JSON.parse(
  readFileSync(join(root, 'content/blog/metadata.json'), 'utf-8')
).sort((a, b) => new Date(b.date) - new Date(a.date));

const thoughts = posts
  .map((p) => `- [${p.title}](${SITE}/thoughts/${p.slug}/): ${p.description}`)
  .join('\n');

const out = `# Nemanja Vujić — vujic.ai

> Personal site and blog of Nemanja Vujić, a Forward Deployed Engineer at DataCebo based in Belgrade, Serbia. Writing and building across AI, large language models, retrieval-augmented generation, and data science — with detours into powerlifting, health and longevity research, music, and geopolitics.

## About
- Nemanja Vujić is a Forward Deployed Engineer at DataCebo. He works with AI agents, large language models (LLMs), retrieval-augmented generation (RAG), and data science. Also known as "Vuja". Based in Belgrade, Serbia.

## Thoughts
- [Thoughts](${SITE}/thoughts/): essays and notes on AI, technology, and the craft of building.
${thoughts}

## Pages
- [Home](${SITE}/)
- [About the author: Nemanja Vujić](${SITE}/author/nemanjavujic/)
- [Contact](${SITE}/contact/)
- [Wins / Accomplishments](${SITE}/accomplishments/)
- [Vuja's Corner](${SITE}/corner/)
- [Playground](${SITE}/playground/)
- [Privacy Policy](${SITE}/privacy/)

## Connect
- LinkedIn: https://linkedin.com/in/nemanja-vujic-vuja43
- GitHub: https://github.com/vujavujavuja
- Email: nemanja@vujic.ai

## Notes
- The full, always-current list of pages and posts is in the sitemap: ${SITE}/sitemap.xml
`;

writeFileSync(join(root, 'public/llms.txt'), out);
console.log(`llms.txt regenerated with ${posts.length} posts`);
