/** One slide of a post's photo carousel (rendered by PostGallery). */
export interface GalleryImage {
  imageSrc: string;
  title: string;
  description?: string;
  tag?: string;
}

/** How a post's carousel is presented. */
export interface GalleryOptions {
  /** Where the carousel sits relative to the article body. Default 'top'. */
  placement?: 'top' | 'bottom';
  /** Card height as a fraction of its width. 0.66 = 3:2 photos, 1.25 = 4:5 slides. */
  aspect?: number;
  /** Overlay the title/description on the card. Off for slides that carry their own text. */
  captions?: boolean;
  /** Max card width in px. */
  maxWidth?: number;
}

export interface BlogPostMeta {
  slug: string;
  filename: string;
  title: string;
  /** Short title shown on the Thoughts index card (falls back to title). */
  cardTitle?: string;
  description: string;
  tags: string[];
  date: string;
  /** Optional photo carousel shown with the post. */
  gallery?: GalleryImage[];
  galleryOptions?: GalleryOptions;
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
