export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  pubDate: string;
  updatedDate?: string;
  heroImage?: string;
  content: string;
}

export interface Translation {
  en: string;
  sr: string;
}

export type Language = 'en' | 'sr';

export interface PersonalInfo {
  name: Translation;
  title: Translation;
  location: Translation;
  company: Translation;
  bio: Translation;
  about: Translation;
  powerlifting: Translation;
  skills: Translation;
  experience: Translation;
  mentoring: Translation;
}

export interface NavigationItem {
  label: Translation;
  href: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}