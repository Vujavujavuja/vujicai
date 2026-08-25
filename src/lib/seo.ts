// Shared SEO helpers. Next.js does NOT deep-merge `openGraph`/`twitter` from
// parent metadata, so any page that sets them must include the image too —
// otherwise the inherited og:image is dropped. This helper keeps that correct
// and per-page in one place.

export const SITE_URL = 'https://vujic.ai';

// ASCII is the primary spelling everywhere a search or answer engine reads the
// name: it is what people actually type, and leading with the diacritic form
// was splitting this entity against an unrelated "Nemanja Vujić". The ć
// spelling stays on as alternateName so both resolve to the same person.
export const SITE_NAME = 'Nemanja Vujic';
export const SITE_NAME_ALT = 'Nemanja Vujić';

/** The one-line entity description, repeated verbatim across meta, schema and
 *  every off-site bio. Corroboration across independent sources is what makes
 *  search and answer engines resolve them all to one person. */
export const PERSON_DESCRIPTION =
  'Nemanja Vujic is a Forward Deployed Engineer at DataCebo, the MIT spinout behind the Synthetic Data Vault. Writing on AI systems, RAG and EU AI Act compliance.';

/** Off-site profiles, single-sourced so the root layout and the author page
 *  cannot drift apart. This is the `sameAs` set, so only third-party links
 *  belong here — self-owned subdomains corroborate nothing. */
export const PROFILE_LINKS = [
  'https://linkedin.com/in/nemanja-vujic-vuja43',
  'https://github.com/Vujavujavuja',
  // Second GitHub account — carries the sdv-dev/SDV commits and a
  // name-matching URL. Listed so both profiles resolve to one person.
  'https://github.com/nemanja-vujic',
  'https://x.com/nemanjavujicc',
  'https://instagram.com/vuja.43',
];

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
