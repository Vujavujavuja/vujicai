import { HeroSection } from '@/components/ui/hero-dithering-card';
import { LatestPostCard } from '@/components/ui/latest-post-card';
import { JourneyTimeline, JourneyStep } from '@/components/ui/journey-timeline';
import { getPostSummaries } from '@/lib/blog';

const journey: JourneyStep[] = [
  { age: 12, role: 'Website Admin', where: 'OŠ "Branko Radičević"' },
  { age: 17, role: 'Data Entry Associate', where: 'Srbija Gas' },
  { age: 19, role: 'Prompt Engineer', where: 'Data Annotation Tech' },
  { age: 21, role: 'Software Engineer', where: 'Luxoft · DXC Technology' },
  { age: 22, role: 'Data Scientist', where: 'Vega IT' },
  { age: 24, role: 'Forward Deployed Engineer', where: 'DataCebo' },
  { age: '?', role: 'What comes next?', where: 'What comes next?', placeholder: true },
];

export default function HomePage() {
  const posts = getPostSummaries();
  const latestPost = posts[0];

  return (
    <div className="pb-20 md:pb-0">
      <HeroSection />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl md:pl-24 py-16 space-y-20">
        {/* About Me */}
        <section>
          <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-8">
            About Me
          </h2>
          <div className="space-y-5 text-foreground/90 leading-relaxed text-lg">
            <p>
              I don&apos;t usually like to classify myself as something, and that is why I
              absolutely hate writing about-me paragraphs and pages &mdash; so bear with me.
              I would say that I am a tech guy (more specifically an <em>AI guy</em>, as some
              of my ex-colleagues used to call me). I am based in Europe, right now more
              specifically Belgrade, Serbia, where I have been most of my life.
            </p>
          </div>
        </section>

        {/* Journey */}
        <section>
          <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-8">
            My Journey so far
          </h2>
          <div className="space-y-5 text-foreground/90 leading-relaxed text-lg mb-12">
            <p>
              I started my tech / AI journey really early in both my life and this AI craze
              that is currently ongoing. It all first started when I was asked to be the
              website admin for my middle school at the age of 12. I enjoyed that so much
              that I almost certainly knew where my life was headed next. After a few years
              of studying, going to a new high school and competing in Maths and Programming,
              I started my first real part-time role as a Data Entry Associate at Srbija Gas
              at the age of 17. That job did not last &mdash; I had to go to Uni &mdash; so I
              decided to enroll at University Union (Faculty of Computing) to get my
              bachelor&apos;s in computer science.
            </p>
            <p>
              During my time at Uni I started working part-time again, but this time got way
              closer to AI as a Prompt Engineer and Evaluator at Data Annotation Tech. I
              loved that job, but there was one issue: it was US-only, and I&apos;m from
              Serbia &mdash; so when that got found out I had to move on. My next stop was
              Luxoft Serbia, a DXC Technology company. I was hired as a Software Engineer
              (Python and Go) and I stayed there for nearly a year, but I was still trying
              to get closer to AI and the cutting edge of data technology &mdash; which
              Luxoft couldn&apos;t offer me.
            </p>
            <p>
              That is why, as soon as I got the chance, I went to Vega to be a Data
              Scientist. I excelled there, quickly moving up, getting more responsibilities
              and better projects, and I got the chance to do what I&apos;d wanted from the
              start: consulting, prototyping and pre-sales. I also got to lead a team on a
              long-term project, and on the side I was a mentor across three separate
              internship cohorts &mdash; which is what I&apos;m proudest of from my time at
              Vega.
            </p>
            <p>
              Most recently I decided on a big move to DataCebo as a Forward Deployed
              Engineer. It was a hard decision, but one I do not regret. The FDE role is a
              wide one, and that is exactly why I love it: it covers technical sales and
              field engineering, content and marketing and developer education, bug hunting
              on the product, and account management across enterprise accounts. It&apos;s
              the closest thing to running a little piece of the company end to end, and
              it&apos;s everything I was trying to move towards for years.
            </p>
          </div>

          {/* Timeline rail with scroll-animated fill */}
          <JourneyTimeline items={journey} />
        </section>

        {/* Giving Back */}
        <section>
          <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-8">
            Giving Back
          </h2>
          <div className="space-y-5 text-foreground/90 leading-relaxed text-lg">
            <p>
              That seems like a lot, and trust me it is, but it&apos;s only one part of my
              whole journey. I love giving back as much as I can &mdash; I truly do &mdash;
              and I do so via a couple of channels. One of which is my powerlifting club
              that I started with two of my friends in my hometown of Pančevo, Serbia.
              It&apos;s free to train with us, and on top of that we provide financial help
              to lifters and competitors who lack the means to compete by themselves:
              covering entry fees, gear, travel to meets, whatever we can.
            </p>
            <p>
              I also adore mentoring people &mdash; it&apos;s one of the things I did the
              most at Vega. Outside of work I currently mentor two promising people who I
              am trying to give the best head start possible.
            </p>
          </div>
        </section>

        {/* Non-professional */}
        <section>
          <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-8">
            Non-professional
          </h2>
          <div className="space-y-5 text-foreground/90 leading-relaxed text-lg">
            <p>
              On things I do and am outside of my professional career &mdash; of which there
              are many. Some of them are my obsession with body health: not just surface
              level, but deep understanding and reading of research in that area. As I
              mentioned, powerlifting used to be a big part of it and still is
              occasionally, as I retired from competing. Geopolitics and the financial state
              of the world, shocker right &mdash; but I find all the nuances so intriguing
              and interesting, and the level to which people think it&apos;s all black and
              white when talking to them shocks me. More on that on my blog.
            </p>
            <p>
              A lot of what I do outside work is reading. Research papers mostly &mdash; AI,
              ML, tech, geopolitics, health and longevity &mdash; I try to stay close to the
              primary sources instead of whatever makes it into the headlines. On the books
              side I lean heavily into the classics: <em>1984</em>, <em>The Master and
              Margarita</em>, <em>Fahrenheit 451</em>, <em>Crime and Punishment</em>, and so
              on.
            </p>
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
