import { SITE_CONFIG } from "@/lib/site-config";
import type { WorkFrontmatter } from "@/lib/content/schema";

export function personJsonLd() {
  const sameAs = Object.values(SITE_CONFIG.social).filter((url) => url !== "#");

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    email: `mailto:${SITE_CONFIG.email}`,
    jobTitle: "Lead Product Designer & UI/UX Engineer",
    description: SITE_CONFIG.description,
    image: `${SITE_CONFIG.url}/about/portrait.svg`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Islamabad",
      addressCountry: "PK",
    },
    knowsAbout: ["Product Design", "UI/UX Engineering", "Healthcare Software", "AI Products", "SaaS"],
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function creativeWorkJsonLd(frontmatter: WorkFrontmatter) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: frontmatter.title,
    description: frontmatter.thesis,
    url: `${SITE_CONFIG.url}/work/${frontmatter.slug}`,
    image: `${SITE_CONFIG.url}${frontmatter.cover}`,
    datePublished: String(frontmatter.year),
    creator: {
      "@type": "Person",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    keywords: frontmatter.domain,
  };
}
