'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { navigation } from '@/data/content';

export function FloatingNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-6 right-6 z-50 hidden md:flex items-center gap-1 rounded-full border border-border/60 bg-background/70 backdrop-blur-xl shadow-lg px-2 py-1.5">
      <Link
        href="/"
        className="font-serif text-sm font-medium px-3 py-1.5 text-foreground hover:text-primary transition-colors"
      >
        NV
      </Link>
      <div className="w-px h-4 bg-border" />
      {navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-300',
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
