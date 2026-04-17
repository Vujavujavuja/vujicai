import { HeroSection } from '@/components/ui/hero-dithering-card';
import { LatestPostCard } from '@/components/ui/latest-post-card';
import { getPostSummaries } from '@/lib/blog';

const journey = [
  { age: 12, label: 'Middle school sysadmin' },
  { age: 14, label: 'Data entry' },
  { age: 17, label: 'Software engineering' },
  { age: 22, label: 'Prompt engineering' },
  { age: 23, label: 'Data science' },
  { age: 24, label: 'Forward deployed engineer' },
];

const givingBack = [
  'Powerlifting',
  'Mentoring',
  'Teaching',
  'Reading',
  'Traveling',
  'University talks',
  'Hackathons',
  'Events',
  'Collabs',
  'And now, this',
];

export default function HomePage() {
  const posts = getPostSummaries();
  const latestPost = posts[0];

  return (
    <div className="pb-20 md:pb-0">
      <HeroSection />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl py-16 space-y-20">
        {/* About */}
        <section>
          <p className="text-xs md:text-sm text-muted-foreground/50 italic tracking-wide mb-2">
            a bit about
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-8">
            Me
          </h2>
          <div className="space-y-5 text-foreground/90 leading-relaxed text-lg">
            <p>
              The name is Nemanja Vujić &mdash; though that seems like a lot, and it&apos;s
              really only one part of it.
            </p>
            <p>
              I don&apos;t usually like to classify myself. But if I had to, I&apos;d say
              I&apos;m a tech guy &mdash; or, more specifically, an <em>AI guy</em>, as some of
              my ex-colleagues used to call me. I started my tech and AI journey really
              early: both in my own life and in this AI craze that&apos;s going on.
            </p>
          </div>
        </section>

        {/* The Journey */}
        <section>
          <p className="text-xs md:text-sm text-muted-foreground/50 italic tracking-wide mb-2">
            the
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-8">
            Journey so far
          </h2>
          <ol className="relative border-l border-border/60 pl-6 space-y-6">
            {journey.map((step) => (
              <li key={step.age} className="relative">
                <span className="absolute -left-[31px] flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 ring-2 ring-background">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-xs uppercase tracking-widest text-primary/80">
                    Age {step.age}
                  </span>
                  <span className="font-serif text-xl md:text-2xl font-medium">
                    {step.label}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Giving Back */}
        <section>
          <p className="text-xs md:text-sm text-muted-foreground/50 italic tracking-wide mb-2">
            on
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-8">
            Giving back
          </h2>
          <div className="space-y-5 text-foreground/90 leading-relaxed text-lg">
            <p>
              I love giving back. (Shocker, I know.) I truly do &mdash; and I get to via a
              handful of things I care about deeply.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {givingBack.map((item) => (
              <span
                key={item}
                className="px-4 py-2 rounded-full border border-border/60 bg-card/50 text-sm font-medium text-foreground/80 hover:border-primary/40 hover:text-primary transition-colors"
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      </div>

      {/* Latest Blog Post */}
      {latestPost && (
        <LatestPostCard
          title={latestPost.title}
          description={latestPost.description}
          href={`/blog/${latestPost.slug}/`}
        />
      )}
    </div>
  );
}
