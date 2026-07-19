// Regenerates public/llms.txt from the current post metadata so the
// LLM-facing site summary never goes stale. Runs automatically before build
// via the "prebuild" npm script.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://vujic.ai';

function readMeta(rel) {
  const p = join(root, rel);
  if (!existsSync(p)) return [];
  return JSON.parse(readFileSync(p, 'utf-8')).sort((a, b) => new Date(b.date) - new Date(a.date));
}

const posts = readMeta('content/blog/metadata.json');
const deepPosts = readMeta('content/deep/metadata.json');

const thoughts = posts
  .map((p) => `- [${p.title}](${SITE}/thoughts/${p.slug}/): ${p.description}`)
  .join('\n');

const deepSection = deepPosts.length
  ? `\n## Deep Thoughts
- [Deep Thoughts](${SITE}/deep-thoughts/): longer, slower pieces and deep dives.
${deepPosts.map((p) => `- [${p.title}](${SITE}/deep-thoughts/${p.slug}/): ${p.description}`).join('\n')}\n`
  : '';

const out = `# Nemanja Vujić — vujic.ai

> Personal site and blog of Nemanja Vujić, a Forward Deployed Engineer at DataCebo based in Belgrade, Serbia. Writing and building across AI, large language models, retrieval-augmented generation, and data science — with detours into powerlifting, health and longevity research, music, and geopolitics.

## About
- Nemanja Vujić is a Forward Deployed Engineer at DataCebo. He works with AI agents, large language models (LLMs), retrieval-augmented generation (RAG), and data science. Also known as "Vuja". Based in Belgrade, Serbia.

## Thoughts
- [Thoughts](${SITE}/thoughts/): essays and notes on AI, technology, and the craft of building.
${thoughts}
${deepSection}
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
