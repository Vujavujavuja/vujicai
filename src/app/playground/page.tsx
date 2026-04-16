import { ExternalLink } from 'lucide-react';
import { getAllProjects } from '@/lib/playground';

export const metadata = {
  title: 'Playground',
  description: 'AI-powered tools and projects by Nemanja Vujic.',
};

export default function PlaygroundPage() {
  const projects = getAllProjects();

  return (
    <div className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Playground
          </h1>
          <p className="text-lg text-muted-foreground">
            AI-powered tools and side projects
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {projects.map((project) => (
            <a
              key={project.title}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block border rounded-lg p-6 hover:border-foreground/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-xl font-bold">{project.title}</h2>
                <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
              </div>

              <p className="text-muted-foreground mb-4 text-sm">
                {project.description}
              </p>

              {project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-muted rounded"
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
