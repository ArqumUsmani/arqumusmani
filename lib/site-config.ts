import { CAREER_START_YEAR } from "@/data/career";

/**
 * Single source of truth for site identity — name, contact, socials, and the
 * base URL. Swap NEXT_PUBLIC_SITE_URL (or the fallback below) for a custom
 * domain later; nothing else in the codebase should hardcode any of this.
 */
export const EXPERIENCE_YEARS = new Date().getFullYear() - CAREER_START_YEAR;

export const SITE_CONFIG = {
  name: "Arqum Usmani",
  title: "Arqum Usmani — Lead Product Designer & UI/UX Engineer",
  description:
    `Lead Product Designer and UI/UX Engineer. ${EXPERIENCE_YEARS}+ years across healthcare, AI products, and SaaS, designing systems and writing the production front-end code that ships them.`,
  // The custom domain is live — this is the canonical base for metadataBase,
  // sitemap, robots, RSS, and JSON-LD. Override with NEXT_PUBLIC_SITE_URL for
  // local/preview builds so those don't falsely claim the production URL.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.arqumusmani.com",
  email: "hello@arqumusmani.com",
  whatsapp: "+923332204980",
  locale: "en_US",
  // Empty string, not a placeholder hash — an unpopulated link renders as
  // no link at all (see the filtering in Footer.tsx / contact/page.tsx).
  social: {
    linkedin: "",
    behance: "",
    dribbble: "",
  },
} as const;
