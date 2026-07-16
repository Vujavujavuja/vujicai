import { sharePreview } from '@/lib/seo';

const DESC = 'What data vujic.ai collects, why, and the rights you have over it.';

export const metadata = {
  title: 'Privacy Policy',
  description: DESC,
  ...sharePreview('Privacy Policy · Nemanja Vujić', DESC),
};

export default function PrivacyPage() {
  return (
    <div className="py-20 pb-32 md:pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl md:pl-24">
        <div className="mb-12 text-center">
          <p className="text-xs md:text-sm text-muted-foreground/50 italic tracking-wide mb-2">
            the fine print
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-medium tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-sm">Last updated 22 June 2026</p>
        </div>

        <div className="prose max-w-none">
          <p>
            This is a personal website and blog operated by Nemanja Vujić (&ldquo;I&rdquo;,
            &ldquo;me&rdquo;) at <strong>vujic.ai</strong>. I try to collect as little about you as
            possible. This page explains what is collected, why, and what you can do about it. If
            anything here is unclear, email me at{' '}
            <a href="mailto:nemanja@vujic.ai">nemanja@vujic.ai</a>.
          </p>

          <h2>Who is responsible for your data</h2>
          <p>
            Nemanja Vujić, based in Belgrade, Serbia, is the data controller for this site. You can
            reach me about any privacy matter at{' '}
            <a href="mailto:nemanja@vujic.ai">nemanja@vujic.ai</a>.
          </p>

          <h2>What I collect</h2>
          <ul>
            <li>
              <strong>Contact form.</strong> If you use the contact form, the name, email address,
              and message you submit are sent to me through Formspree, a third-party form provider.
              I use this only to read and reply to you.
            </li>
            <li>
              <strong>Theme preference.</strong> Your light/dark mode choice is stored locally in
              your browser (local storage). It never leaves your device and is not personal data.
            </li>
            <li>
              <strong>Server and hosting logs.</strong> The site is hosted on Cloudflare Pages. Like
              most hosting providers, Cloudflare may automatically process technical data such as
              your IP address and browser type to serve the site securely and protect against abuse.
            </li>
          </ul>
          <p>
            I do not use advertising cookies, cross-site trackers, or sell your data to anyone.
          </p>

          <h2>Third parties</h2>
          <ul>
            <li>
              <strong>Formspree</strong>, which processes contact form submissions. See{' '}
              <a href="https://formspree.io/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">
                Formspree&rsquo;s privacy policy
              </a>
              .
            </li>
            <li>
              <strong>Cloudflare</strong>, for hosting and content delivery. See{' '}
              <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">
                Cloudflare&rsquo;s privacy policy
              </a>
              .
            </li>
          </ul>

          <h2>How long it is kept</h2>
          <p>
            Contact messages are kept for as long as needed to handle your enquiry and any follow-up,
            then deleted. Hosting logs are retained by Cloudflare according to their own retention
            schedule.
          </p>

          <h2>Your rights</h2>
          <p>
            Depending on where you live (including under the EU/EEA GDPR), you may have the right to
            access, correct, or delete the personal data I hold about you, to object to or restrict
            its processing, and to data portability. To exercise any of these, just email{' '}
            <a href="mailto:nemanja@vujic.ai">nemanja@vujic.ai</a> and I will respond within a
            reasonable time.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            If this policy changes, the &ldquo;last updated&rdquo; date above will change with it.
            Significant changes will be reflected on this page.
          </p>
        </div>
      </div>
    </div>
  );
}
