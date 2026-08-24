import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/site-config";
import { getAllWork } from "@/lib/content/work";

// "/" isn't listed here — it 301s to /about (see next.config.ts), so /about
// is the actual landing page and carries the top priority instead.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const work = await getAllWork();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_CONFIG.url}/about`, changeFrequency: "yearly", priority: 1 },
    { url: `${SITE_CONFIG.url}/work`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_CONFIG.url}/contact`, changeFrequency: "yearly", priority: 0.6 },
  ];

  const workRoutes: MetadataRoute.Sitemap = work.map((entry) => ({
    url: `${SITE_CONFIG.url}/work/${entry.frontmatter.slug}`,
    changeFrequency: "yearly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...workRoutes];
}
