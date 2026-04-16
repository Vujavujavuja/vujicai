'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Home, BookOpen, Rocket, Mail } from 'lucide-react';

type IconComponentType = React.ElementType<{ className?: string }>;

interface InteractiveMenuItem {
  label: string;
  icon: IconComponentType;
  href: string;
}

const menuItems: InteractiveMenuItem[] = [
  { label: 'home', icon: Home, href: '/' },
  { label: 'blog', icon: BookOpen, href: '/blog' },
  { label: 'playground', icon: Rocket, href: '/playground' },
  { label: 'contact', icon: Mail, href: '/contact' },
];

export function MobileMenu() {
  const pathname = usePathname();
  const router = useRouter();

  const activeIndex = useMemo(() => {
    const idx = menuItems.findIndex((item) =>
      item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
    );
    return idx >= 0 ? idx : 0;
  }, [pathname]);

  const [selectedIndex, setSelectedIndex] = useState(activeIndex);
  const textRefs = useRef<(HTMLElement | null)[]>([]);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    setSelectedIndex(activeIndex);
  }, [activeIndex]);

  useEffect(() => {
    const setLineWidth = () => {
      const activeItemElement = itemRefs.current[selectedIndex];
      const activeTextElement = textRefs.current[selectedIndex];
      if (activeItemElement && activeTextElement) {
        activeItemElement.style.setProperty('--lineWidth', `${activeTextElement.offsetWidth}px`);
      }
    };
    setLineWidth();
    window.addEventListener('resize', setLineWidth);
    return () => window.removeEventListener('resize', setLineWidth);
  }, [selectedIndex]);

  const handleItemClick = (index: number) => {
    setSelectedIndex(index);
    router.push(menuItems[index].href);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-bottom">
      <nav className="menu" role="navigation">
        {menuItems.map((item, index) => {
          const isActive = index === selectedIndex;
          const IconComponent = item.icon;
          return (
            <button
              key={item.label}
              className={`menu__item ${isActive ? 'active' : ''}`}
              onClick={() => handleItemClick(index)}
              ref={(el) => { itemRefs.current[index] = el; }}
              style={{ '--lineWidth': '0px' } as React.CSSProperties}
            >
              <div className="menu__icon">
                <IconComponent className="icon" />
              </div>
              <strong
                className={`menu__text ${isActive ? 'active' : ''}`}
                ref={(el) => { textRefs.current[index] = el; }}
              >
                {item.label}
              </strong>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
