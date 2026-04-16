import { getAllAccomplishments } from '@/lib/accomplishments';
import { AccomplishmentsStack } from '@/components/ui/accomplishments-stack';

export const metadata = {
  title: 'Accomplishments',
  description: 'Milestones, certifications, and wins along the way.',
};

export default function AccomplishmentsPage() {
  const items = getAllAccomplishments();

  return (
    <div className="pb-32 md:pb-20">
      <div className="pt-20 text-center px-4">
        <p className="text-xs md:text-sm text-muted-foreground/50 italic tracking-wide mb-2">
          a few
        </p>
        <h1 className="font-serif text-5xl md:text-6xl font-medium tracking-tight mb-4">
          Accomplishments
        </h1>
        <p className="text-muted-foreground mb-4">
          Milestones, certifications, and wins along the way
        </p>
      </div>
      <AccomplishmentsStack items={items} />
    </div>
  );
}
