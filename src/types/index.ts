export interface BlogPostMeta {
  slug: string;
  filename: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
}

export interface TocHeading {
  text: string;
  level: number;
  id: string;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
  readingTime: number;
  headings: TocHeading[];
}

export interface PlaygroundProject {
  title: string;
  description: string;
  tags: string[];
  url: string;
}

export interface Accomplishment {
  id: string;
  icon: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  date: string;
  blogSlug?: string;
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
