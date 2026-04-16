import { NavigationItem, SocialLink } from '@/types';

export const navigation: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Playground", href: "/playground" },
  { label: "Corner", href: "/corner" },
  { label: "Wins", href: "/accomplishments" },
  { label: "Contact", href: "/contact" },
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
