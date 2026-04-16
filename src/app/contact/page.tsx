import { Mail, MapPin, Linkedin, Github } from 'lucide-react';
import { socialLinks } from '@/data/content';

export const metadata = {
  title: 'Contact',
  description: 'Get in touch with Nemanja Vujic.',
};

export default function ContactPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground">
            I&apos;m always open to discussing AI, technology, and new opportunities
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact info */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span>nemanja@vujic.ai</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>Pancevo, Serbia</span>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-4">Social Links</h3>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 border rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={link.name}
                >
                  {link.icon === 'linkedin' && <Linkedin className="h-5 w-5" />}
                  {link.icon === 'github' && <Github className="h-5 w-5" />}
                  {link.icon === 'mail' && <Mail className="h-5 w-5" />}
                </a>
              ))}
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Send a Message</h2>

            <form
              action="https://formspree.io/f/mwpqpepj"
              method="POST"
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  rows={4}
                  required
                  className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-foreground text-background py-2 px-4 rounded-md hover:opacity-90 transition-opacity"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
