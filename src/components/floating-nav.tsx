'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { navigation } from '@/data/content';

export function FloatingNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-start gap-1 rounded-2xl border border-border/60 bg-background/80 backdrop-blur-xl shadow-lg px-3 py-4">
      <Link
        href="/"
        className="font-serif text-lg font-semibold px-2 py-1 text-foreground hover:text-primary transition-colors mb-2"
      >
        NV
      </Link>
      <div className="w-full h-px bg-border mb-1" />
      {navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'text-xs font-medium px-3 py-2 rounded-lg transition-all duration-300 w-full',
            pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
