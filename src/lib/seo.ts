// Shared SEO helpers. Next.js does NOT deep-merge `openGraph`/`twitter` from
// parent metadata, so any page that sets them must include the image too —
// otherwise the inherited og:image is dropped. This helper keeps that correct
// and per-page in one place.

export const SITE_URL = 'https://vujic.ai';
export const SITE_NAME = 'Nemanja Vujić';
export const OG_IMAGE = { url: '/og-image.png', width: 1200, height: 630, alt: SITE_NAME };

/** Per-page Open Graph + Twitter preview with the page's own title/description. */
export function sharePreview(title: string, description: string) {
  return {
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      locale: 'en_US',
      type: 'website' as const,
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
