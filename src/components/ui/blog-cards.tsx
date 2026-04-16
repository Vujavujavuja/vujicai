import Link from 'next/link';

interface BlogCardProps {
  title: string;
  date: string;
  description: string;
  href: string;
}

export function BlogCard({ title, date, description, href }: BlogCardProps) {
  return (
    <Link href={href} className="block">
      <div className="w-full p-3 md:p-4 space-y-1 group hover:cursor-pointer">
        <div className="flex justify-center gap-2 items-end relative">
          <div className="md:text-2xl text-base font-serif whitespace-nowrap text-foreground group-hover:text-primary transition-all duration-500 ease-out truncate max-w-[45%] md:max-w-none">
            {title}
          </div>
          <span className="w-full min-w-8 border-b-[0.5px] border-dashed border-border group-hover:border-primary mb-[6px] flex-shrink" />
          <div className="text-muted-foreground whitespace-nowrap uppercase group-hover:text-primary font-mono md:text-sm text-[10px] flex-shrink-0">
            {date}
          </div>
        </div>
        <div className="text-muted-foreground text-sm md:text-base group-hover:text-primary md:max-w-full max-w-xs transition-all duration-500 ease-out line-clamp-2">
          {description}
        </div>
      </div>
    </Link>
  );
}
