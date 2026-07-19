import Link from 'next/link';
import { Linkedin, Github, Instagram, X } from 'lucide-react';
import { PhotoDither } from '@/components/ui/photo-dither';
import { sharePreview, SITE_URL } from '@/lib/seo';

const NAME = 'Nemanja Vujić';
const DESC =
  'Nemanja "Vuja" Vujić — Forward Deployed Engineer at DataCebo, owner of Vujić AI, competitive powerlifter. Writing on synthetic data, compliance, training and the unmeasurable things.';

export const metadata = {
  title: { absolute: NAME },
  description: DESC,
  alternates: { canonical: '/author/nemanjavujic/' },
  ...sharePreview(`${NAME} · Author`, DESC),
};

const SOCIALS = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/nemanja-vujic-vuja43', Icon: Linkedin },
  { label: 'GitHub', href: 'https://github.com/vujavujavuja', Icon: Github },
  { label: 'Instagram', href: 'https://instagram.com/vuja.43', Icon: Instagram },
  { label: 'X', href: 'https://x.com/nemanjavujicc', Icon: X },
];

export default function AuthorPage() {
  // ProfilePage + Person so answer engines tie every post's byline to a single
  // author entity (E-E-A-T). Mirrors the site-wide Person in the root layout.
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    dateModified: '2026-07-19',
    mainEntity: {
      '@type': 'Person',
      name: NAME,
      alternateName: ['Nemanja Vujic', 'Vuja'],
      url: `${SITE_URL}/author/nemanjavujic/`,
      jobTitle: 'Forward Deployed Engineer',
      worksFor: { '@type': 'Organization', name: 'DataCebo' },
      description: DESC,
      image: `${SITE_URL}/author/nemanja.jpg`,
      sameAs: SOCIALS.map((s) => s.href),
      knowsAbout: [
        'Synthetic Data',
        'Artificial Intelligence',
        'AI Governance and Compliance',
        'Large Language Models',
        'Powerlifting',
      ],
    },
  };

  return (
    <div className="py-20 pb-32 md:pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl md:pl-24">
        {/* Dithered portrait — floats top-right, the prose wraps around it. */}
        <figure className="float-right ml-5 mb-4 w-32 sm:w-44 md:w-56 shrink-0">
          <PhotoDither
            src="/author/nemanja.jpg"
            alt="Nemanja Vujić, rendered as orange dither dots"
            className="block w-full"
            cropBiasY={0.45}
          />
        </figure>

        <p className="text-xs md:text-sm text-muted-foreground/50 italic tracking-wide mb-2">
          the author
        </p>
        <h1 className="font-serif text-4xl md:text-6xl font-medium tracking-tight mb-10 leading-[1.05]">
          Nemanja &ldquo;Vuja&rdquo; Vujić
        </h1>

        <section className="space-y-5 text-foreground/90 leading-relaxed text-lg">
          <h2 className="font-serif text-2xl md:text-3xl font-medium tracking-tight text-foreground">
            About
          </h2>
          <p>
            Forward Deployed Engineer at DataCebo, the MIT spinout behind the Synthetic Data Vault.
            Owner of Vujić AI, a one-man consultancy in the heart of Vojvodina. Competitive
            powerlifter, and co-owner of a free powerlifting club getting kids in Pančevo into sports.
          </p>
          <p>
            Three I&rsquo;s, one person. The engineer writes about synthetic data, compliance, and
            what AI models actually do when you measure them. The kid from Pančevo writes about
            building a career from a city almost no one has heard of. The lifter writes about training,
            labs, and protocols; numbers included, always. If it can&rsquo;t be measured, I probably
            won&rsquo;t write about it.
          </p>
        </section>

        <section className="mt-12 space-y-5 text-foreground/90 leading-relaxed text-lg">
          <h2 className="font-serif text-2xl md:text-3xl font-medium tracking-tight text-foreground">
            Favourite&hellip;
          </h2>
          <p>
            Except here, where I&rsquo;ll admit the unmeasurable things. My favourite book is{' '}
            <em>We</em> by Yevgeny Zamyatin, the one this whole site opens with. I love the books it
            fathered, the whole dystopian line that runs through Orwell and Huxley, and I keep drawing
            references from it. You&rsquo;ll notice.
          </p>
          <p>
            On the vinyl player it&rsquo;s <em>Actual Life 3</em> by Fred again.. more often than
            anything else. Real-life samples, real emotion; voice notes and strangers&rsquo; voices
            turned into music. It&rsquo;s the album that got me into electronic music, and from there,
            eventually, into melodic schranz, my favourite genre. There&rsquo;s something fitting about
            a min-maxer loving music built from unquantified, messy life. That&rsquo;s the crimson
            sunset again.
          </p>
        </section>

        <section className="mt-12 clear-both">
          <h2 className="font-serif text-2xl md:text-3xl font-medium tracking-tight text-foreground mb-4">
            Contact
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-lg marker:text-primary/60">
            {SOCIALS.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-foreground/90 hover:text-primary transition-colors"
                >
                  <Icon className="size-4" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
