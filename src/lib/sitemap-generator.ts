import { SITE_URL } from "./seo";

export interface SitemapUrlEntry {
  url: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export function generateSitemapXml(
  posts: Array<{ slug: string; published_at?: string | null; updated_at?: string }> = []
): string {
  const todayIso = new Date().toISOString();

  const staticEntries: SitemapUrlEntry[] = [
    { url: `${SITE_URL}/`, lastmod: todayIso, changefreq: "daily", priority: "1.0" },
    { url: `${SITE_URL}/blog`, lastmod: todayIso, changefreq: "daily", priority: "0.8" },
    { url: `${SITE_URL}/auth`, lastmod: todayIso, changefreq: "monthly", priority: "0.3" },
  ];

  const postEntries: SitemapUrlEntry[] = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastmod: p.published_at || p.updated_at || todayIso,
    changefreq: "weekly",
    priority: "0.7",
  }));

  const allEntries = [...staticEntries, ...postEntries];

  const urlsXml = allEntries
    .map(
      (e) => `  <url>
    <loc>${e.url}</loc>
    <lastmod>${e.lastmod || todayIso}</lastmod>
    <changefreq>${e.changefreq || "weekly"}</changefreq>
    <priority>${e.priority || "0.5"}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;
}
