export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  pubDate: string;
  updatedDate?: string;
  heroImage?: string;
  content: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  location: string;
  company: string;
  bio: string;
  about: string;
  powerlifting: string;
  skills: string;
  experience: string;
  mentoring: string;
}

export interface NavigationItem {
  label: string;
  href: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}