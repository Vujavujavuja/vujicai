import { NavigationItem, SocialLink } from '@/types';

// Visible in main navigation (floating nav + mobile bottom menu)
export const navigation: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Thoughts", href: "/thoughts" },
  { label: "Deep Thoughts", href: "/deep-thoughts" },
  { label: "Contact", href: "/contact" },
];

// Hidden pages - only accessible via footer
export const hiddenNavigation: NavigationItem[] = [
  { label: "Playground", href: "/playground" },
  { label: "Corner", href: "/corner" },
  { label: "Wins", href: "/accomplishments" },
];

export const socialLinks: SocialLink[] = [
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/nemanja-vujic-vuja43",
    icon: "linkedin",
  },
  {
    name: "GitHub",
    url: "https://github.com/vujavujavuja",
    icon: "github",
  },
  {
    name: "Email",
    url: "mailto:nemanja@vujic.ai",
    icon: "mail",
  },
];
