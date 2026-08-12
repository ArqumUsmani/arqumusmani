/**
 * Single source of truth for employment history. The About page timeline
 * and the home page's "Designed for" credibility strip both render from
 * this list, and SITE_CONFIG's "N+ years" copy is derived from
 * CAREER_START_YEAR rather than hand-typed — so none of these can drift
 * out of sync with each other again.
 *
 * Case studies (content/work/*.mdx) are project engagements, not employers,
 * and keep their own `year`/`timeline` frontmatter as the source of truth
 * for that project's dates. `caseStudySlug` below just links an employer
 * to the case study that documents work done there, where one exists.
 */
export type CareerEntry = {
  org: string;
  role: string;
  startYear: number;
  /** "Present" for the current role. */
  endYear: number | "Present";
  /**
   * "part-time" entries ran concurrently alongside a full-time role rather
   * than sequentially — CloudFruit and CloudBloom both ran during the
   * Stella Technology tenure, not after it.
   */
  commitment: "full-time" | "part-time";
  /** content/work/<slug>.mdx — the public case study for work done here. */
  caseStudySlug?: string;
  /** Named products, for employers that ship more than one (e.g. CloudFruit). */
  products?: string[];
  /**
   * One-line scope (team size, what I owned) for entries with no case
   * study to pull `frontmatter.team` from. Entries that do have a
   * caseStudySlug source this from the case study instead — see
   * app/about/page.tsx — so it isn't set here for those.
   */
  scope?: string;
  /**
   * Whether this entry counts toward the site's "N+ years" positioning
   * claim. Defaults to true. Freelance is real work history (kept in the
   * timeline) but is excluded from the headline years figure, which counts
   * from the first full-time UI/UX role instead.
   */
  countsTowardExperience?: boolean;
};

export const CAREER: CareerEntry[] = [
  { org: "Oak Street Technologies", role: "Product Designer", startYear: 2025, endYear: "Present", commitment: "full-time" },
  {
    org: "CloudFruit",
    role: "Lead Designer",
    startYear: 2023,
    endYear: 2025,
    commitment: "part-time",
    products: ["Hiibo", "OneXerp"],
    caseStudySlug: "hiibo-ai-chat",
  },
  { org: "CloudBloom", role: "Product Designer", startYear: 2023, endYear: 2025, commitment: "part-time", caseStudySlug: "cloudbloom" },
  { org: "Stella Technology", role: "UI/UX Engineer", startYear: 2022, endYear: 2025, commitment: "full-time", caseStudySlug: "equinox-emr" },
  {
    org: "Ingenious Digital Systems",
    role: "UI/UX Designer & Front End Developer",
    startYear: 2019,
    endYear: 2021,
    commitment: "full-time",
    scope: "Kiosk, vehicle-tracking, and industrial automation interfaces for CDC Pakistan, Engro Pakistan, and Sindh Solid Waste Management.",
  },
  {
    org: "Freelance",
    role: "Design & front-end, Karachi",
    startYear: 2017,
    endYear: 2019,
    commitment: "full-time",
    countsTowardExperience: false,
  },
];

/** Full career span, including freelance — used for the About page timeline. */
export const CAREER_START_YEAR = Math.min(...CAREER.map((entry) => entry.startYear));

/**
 * "N+ years" positioning figure — counts from the first full-time UI/UX
 * role, not total career span. See `countsTowardExperience` above.
 */
export const PROFESSIONAL_START_YEAR = Math.min(
  ...CAREER.filter((entry) => entry.countsTowardExperience !== false).map((entry) => entry.startYear),
);

/** Real employers, excluding Freelance (not a company). For the hero facts panel. */
export const COMPANIES_COUNT = CAREER.filter((entry) => entry.countsTowardExperience !== false).length;

/**
 * Distinct shipped products — each entry's named `products` where given,
 * otherwise one per `caseStudySlug` (a case study documents one product).
 * Entries with neither (no public case study yet, or no case study at all)
 * don't contribute a counted product. For the hero facts panel.
 */
export const PRODUCTS_SHIPPED_COUNT = CAREER.reduce(
  (sum, entry) => sum + (entry.products?.length ?? (entry.caseStudySlug ? 1 : 0)),
  0,
);

export function formatCareerPeriod(entry: CareerEntry): string {
  return `${entry.startYear}–${entry.endYear}`;
}
