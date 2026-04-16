import { Mail, MapPin, Linkedin, Github } from 'lucide-react';
import { socialLinks } from '@/data/content';

export const metadata = {
  title: 'Contact',
  description: 'Get in touch with Nemanja Vujic.',
};

export default function ContactPage() {
  return (
    <div className="py-20 pb-32 md:pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-16 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-medium tracking-tight mb-4">
            Get in Touch
          </h1>
          <p className="text-muted-foreground">
            Always open to discussing AI, technology, and new opportunities
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-serif text-2xl font-medium mb-6">Contact Information</h2>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <span>nemanja@vujic.ai</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span>Pancevo, Serbia</span>
              </div>
            </div>

            <h3 className="font-serif text-lg font-medium mb-4">Social Links</h3>
            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-300"
                  aria-label={link.name}
                >
                  {link.icon === 'linkedin' && <Linkedin className="h-5 w-5" />}
                  {link.icon === 'github' && <Github className="h-5 w-5" />}
                  {link.icon === 'mail' && <Mail className="h-5 w-5" />}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-medium mb-6">Send a Message</h2>

            <form
              action="https://formspree.io/f/mwpqpepj"
              method="POST"
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-full font-medium hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
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
