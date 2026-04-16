import { ExternalLink } from 'lucide-react';
import { getAllProjects } from '@/lib/playground';

export const metadata = {
  title: 'Playground',
  description: 'AI-powered tools and projects by Nemanja Vujic.',
};

export default function PlaygroundPage() {
  const projects = getAllProjects();

  return (
    <div className="py-20 pb-32 md:pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-16 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-medium tracking-tight mb-4">
            Playground
          </h1>
          <p className="text-muted-foreground">
            AI-powered tools and side projects
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <a
              key={project.title}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl border border-border p-6 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <h2 className="font-serif text-2xl font-medium group-hover:text-primary transition-colors">
                  {project.title}
                </h2>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-2 transition-colors" />
              </div>

              <p className="text-muted-foreground mb-5 text-sm leading-relaxed">
                {project.description}
              </p>

              {project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 bg-primary/10 text-primary rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
