import { getAllAccomplishments } from '@/lib/accomplishments';
import { AccomplishmentsStack } from '@/components/ui/accomplishments-stack';

export const metadata = {
  title: 'Accomplishments',
  description: 'Milestones, certifications, and wins along the way.',
};

export default function AccomplishmentsPage() {
  const items = getAllAccomplishments();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="pt-16 md:pt-20 text-center px-4 flex-shrink-0">
        <p className="text-xs md:text-sm text-muted-foreground/50 italic tracking-wide mb-2">
          a few
        </p>
        <h1 className="font-serif text-4xl md:text-6xl font-medium tracking-tight mb-2">
          Accomplishments
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Milestones, certifications, and wins along the way
        </p>
      </div>
      <div className="flex-1 min-h-0">
        <AccomplishmentsStack items={items} />
      </div>
    </div>
  );
}
