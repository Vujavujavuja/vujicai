'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navigation } from '@/data/content';
import { StarButton } from '@/components/ui/star-button';

export function FloatingNav() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <nav className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-start gap-1 rounded-2xl border border-primary/20 bg-background/80 backdrop-blur-xl shadow-[0_0_30px_-5px_hsl(var(--primary)/0.3)] px-3 py-4">
      <Link
        href="/"
        className="font-serif text-lg font-semibold px-2 py-1 text-foreground hover:text-primary transition-colors mb-2"
      >
        NV
      </Link>
      <div className="w-full h-px bg-border mb-1" />
      {navigation.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

        if (isActive) {
          return (
            <div key={item.href} className="w-full">
              <StarButton
                lightColor="#EC4E02"
                duration={4}
                borderWidth={1}
                className="rounded-lg w-full text-xs font-medium px-3 py-2 h-auto"
              >
                {item.label}
              </StarButton>
            </div>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className="text-xs font-medium px-3 py-2 rounded-lg transition-all duration-300 w-full text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            {item.label}
          </Link>
        );
      })}
      <div className="w-full h-px bg-border mt-1 mb-1" />
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300 w-full flex items-center justify-center"
        aria-label="Toggle theme"
      >
        <Sun className="h-3.5 w-3.5 hidden dark:block" />
        <Moon className="h-3.5 w-3.5 block dark:hidden" />
      </button>
    </nav>
  );
}
