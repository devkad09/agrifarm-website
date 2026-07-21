export const SITE_URL = "https://agrifarm.gh";
export const SITE_NAME = "AgriFarm";
export const DEFAULT_OG_IMAGE = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80";

export function getCanonicalUrl(path: string = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath === "/" ? "" : cleanPath}`;
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": SITE_NAME,
    "url": SITE_URL,
    "logo": `${SITE_URL}/favicon.ico`,
    "description": "Real-time crop market prices and SMS alerts for Ghanaian farmers across major regional markets.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "GH",
      "addressLocality": "Accra",
    },
  };
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE_NAME,
    "url": SITE_URL,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${SITE_URL}/blog?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildBlogSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "AgriFarm Journal",
    "description": "Field reports, price trend analysis, and agricultural updates from market officers across Ghana.",
    "url": `${SITE_URL}/blog`,
    "publisher": buildOrganizationSchema(),
  };
}

export function buildBlogPostSchema(post: {
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  cover_image_url?: string | null;
  published_at?: string | null;
  created_at?: string;
}) {
  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  const publishDate = post.published_at || post.created_at || new Date().toISOString();

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": postUrl,
    },
    "headline": post.title,
    "description": post.excerpt || post.title,
    "image": post.cover_image_url || DEFAULT_OG_IMAGE,
    "datePublished": publishDate,
    "dateModified": publishDate,
    "author": {
      "@type": "Organization",
      "name": "AgriFarm Field Officers",
    },
    "publisher": buildOrganizationSchema(),
  };
}
