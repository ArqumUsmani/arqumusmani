import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/site-config";
import { getAllWork } from "@/lib/content/work";
import { getAllNotes } from "@/lib/content/notes";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [work, notes] = await Promise.all([getAllWork(), getAllNotes()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_CONFIG.url, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_CONFIG.url}/work`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_CONFIG.url}/about`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_CONFIG.url}/contact`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_CONFIG.url}/notes`, changeFrequency: "weekly", priority: 0.7 },
  ];

  const workRoutes: MetadataRoute.Sitemap = work.map((entry) => ({
    url: `${SITE_CONFIG.url}/work/${entry.frontmatter.slug}`,
    changeFrequency: "yearly",
    priority: 0.8,
  }));

  const noteRoutes: MetadataRoute.Sitemap = notes.map((entry) => ({
    url: `${SITE_CONFIG.url}/notes/${entry.frontmatter.slug}`,
    lastModified: new Date(entry.frontmatter.date),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  // /styleguide is intentionally excluded — internal tooling, not content.
  return [...staticRoutes, ...workRoutes, ...noteRoutes];
}
