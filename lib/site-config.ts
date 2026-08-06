/**
 * Single source of truth for site identity — name, contact, socials, and the
 * base URL. Swap NEXT_PUBLIC_SITE_URL (or the fallback below) for a custom
 * domain later; nothing else in the codebase should hardcode any of this.
 */
export const SITE_CONFIG = {
  name: "Arqum Usmani",
  title: "Arqum Usmani — Lead Product Designer & UI/UX Engineer",
  description:
    "Lead Product Designer and UI/UX Engineer based in Islamabad, Pakistan. 5+ years across healthcare, AI products, and SaaS — designing systems and writing the production front-end code that ships them.",
  // Defaults to the Vercel preview/production URL until a custom domain is
  // purchased and NEXT_PUBLIC_SITE_URL is set — then this is a one-line change.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://ausmani.vercel.app",
  email: "hello@ausmani.com",
  locale: "en_US",
  social: {
    linkedin: "#",
    behance: "#",
    dribbble: "#",
  },
} as const;
