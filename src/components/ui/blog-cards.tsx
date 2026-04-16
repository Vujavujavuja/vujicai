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
      <div className="w-full p-4 space-y-1 group hover:cursor-pointer">
        <div className="flex justify-center gap-1 items-end relative">
          <div className="md:text-2xl text-xl font-serif whitespace-nowrap text-foreground group-hover:text-primary transition-all duration-500 ease-out">
            {title}
          </div>
          <span className="w-full border-b-[0.5px] border-dashed border-border group-hover:border-primary mb-[6px]" />
          <div className="text-muted-foreground whitespace-nowrap uppercase group-hover:text-primary font-mono md:text-base text-xs">
            {date}
          </div>
        </div>
        <div className="text-muted-foreground md:text-lg group-hover:text-primary md:max-w-full max-w-sm transition-all duration-500 ease-out">
          {description}
        </div>
      </div>
    </Link>
  );
}
