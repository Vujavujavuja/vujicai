import Link from 'next/link';
import { HeroSection } from '@/components/ui/hero-dithering-card';
import { LatestPostCard } from '@/components/ui/latest-post-card';
import { getPostSummaries } from '@/lib/blog';

export default function HomePage() {
  const posts = getPostSummaries();
  const latestPost = posts[0];

  return (
    <div className="pb-20 md:pb-0">
      <HeroSection />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl md:pl-24 py-16">
        <section>
          <h2 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-8">
            About Me
          </h2>

          <blockquote className="font-serif italic text-2xl md:text-3xl text-foreground/70 border-l-2 border-primary/40 pl-6 mb-10 leading-snug">
            &ldquo;If I only knew who I am. Which I am I?&rdquo;
          </blockquote>

          <div className="space-y-5 text-foreground/90 leading-relaxed text-lg">
            <p>
              I sometimes catch myself wondering the exact same thing that D-503, the protagonist
              of Yevgeny Zamyatin&apos;s <em>We</em>, asks himself. I find myself in D-503 more
              often than not, the mathematician-engineer working on tight schedules, whose world
              cracks when he discovers the irrational self that lives within.
            </p>
            <p>
              Am I only an FDE at DataCebo, an MIT spinout? Am I a 24-year-old kid from Pančevo, a
              city almost no one has heard of? Or am I the min-maxing powerlifting competitor?
            </p>
            <p>
              In those clashing I&apos;s, much like Zamyatin&apos;s protagonist, I see cracks
              forming. But unlike D-503, I am not going to succumb to order above all else. The I
              that I will be is the crimson sunset colliding with the cold, ordered city horizon.
              That collision is what makes me truly me.
            </p>
            <p>
              Currently I am, as mentioned, a Forward Deployed Engineer at an MIT spinout, with a
              deep interest in governance and compliance. To some that might come off as boring, but
              boring is exactly where the leverage is, and compliance has been intertwined with my
              career from the very start. Closely following the first AI boom and the ChatGPT craze,
              I was offered a job as a Data Annotator, monitoring chatbot outputs, mainly coding
              ones, flagging mischief and keeping compliance in mind the whole time, all as a
              2nd-year CS student. The transition to a proper Software Engineer role at Luxoft seemed
              like the right call at the time, but in retrospect I didn&apos;t enjoy that bland,
              corporate role. I was wondering about a switch when I got the chance to move to a
              different company and become a Data Scientist, a dream step up. Soon after joining,
              compliance came back into the picture: my first real project was a mental health AI,
              which, as many can imagine, is a compliance nightmare. The acronyms HIPAA, FERPA and
              GDPR are a wall most companies in that space run into, and our team was no exception,
              on top of the underlying issues that come with combining mental health and AI. Not long
              after the project started, I saw an opening when the person leading it left, and I took
              my chance and stepped up, a 23-year-old kid leading a project with big compliance
              implications and a team with three times my experience. The step up was, to say the
              least, amazing: it felt like I was finally where I needed to be, and I shined there.
              Then came the natural next step; instead of dealing with compliance for yourself, help
              others deal with it. Thus, at 24, I am where I am now, working closely with synthetic
              data, the tool built especially for that problem.
            </p>

            <figure className="my-8 max-w-sm mx-auto">
              <img
                src="/home-fde.webp"
                alt="Silhouette of a person working at a wall of monitors, in orange halftone"
                loading="lazy"
                className="w-full rounded-2xl border border-border"
              />
            </figure>

            <p>
              In the background of all of this, I have never stopped working in parallel on my own
              consultancy, a client here and there, helping mostly small businesses achieve their
              big data and AI dreams. Doing all of this while being from Pančevo might seem
              impossible. People often say you have to move to make opportunities for yourself, that
              a small city only ties you down, but with the right mentors I found the small city
              actually gives you the personality and perspective that is often missed in those big
              offices.
            </p>

            <figure className="my-8 max-w-sm mx-auto">
              <img
                src="/home-skyline.webp"
                alt="Silhouette of the Pančevo skyline at dusk reflected in the water, in orange halftone"
                loading="lazy"
                className="w-full rounded-2xl border border-border"
              />
            </figure>

            <p>
              Doing that much must come at a big health cost, right? Well, imagine I told you that
              during that time I first hit my 200kg squat, and later an all-time PR of 255kg, on the
              squat of all exercises. Then came competing at a national level and hitting numbers I
              had only dreamed of before. It all started with a friend suggesting an outlandish idea:
              let&apos;s compete at nationals. The end of that story is that we now own our very own
              powerlifting club, with over 20 competitors, run as a non-profit to get kids into
              sports. My next goal is simple: be the healthiest I can be; I chase performance
              numbers, not vanity ones.
            </p>

            <figure className="my-8 max-w-sm mx-auto">
              <img
                src="/home-squat.webp"
                alt="Silhouette of a lifter at the bottom of a barbell squat, in orange halftone"
                loading="lazy"
                className="w-full rounded-2xl border border-border"
              />
            </figure>

            <p>
              Bringing it all back to the opening question: the combined I of my three I&apos;s is
              now working with Fortune 500 companies to bring them closer to synthetic data, building
              my own consultancy with the goal of growing it into something truly special in the
              heart of Vojvodina, and chasing my first sub-4 marathon.
            </p>
            <p>
              These three I&apos;s keep thinking out loud in the{' '}
              <Link href="/thoughts/" className="text-primary hover:underline">
                Thoughts
              </Link>{' '}
              tab. That&apos;s where this page continues. And if something there strikes you, or you
              think I&apos;ve got it wrong, email me at{' '}
              <a href="mailto:nemanja@vujic.ai" className="text-primary hover:underline">
                nemanja@vujic.ai
              </a>
              . Tell me where I&apos;m wrong; those are my favourite messages.
            </p>
          </div>
        </section>
      </div>

      {/* Latest Thought */}
      {latestPost && (
        <LatestPostCard
          title={latestPost.title}
          description={latestPost.description}
          href={`/thoughts/${latestPost.slug}/`}
        />
      )}
    </div>
  );
}
