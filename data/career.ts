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
  },
  { org: "Freelance", role: "Design & front-end, Karachi", startYear: 2017, endYear: 2019, commitment: "full-time" },
];

export const CAREER_START_YEAR = Math.min(...CAREER.map((entry) => entry.startYear));

export function formatCareerPeriod(entry: CareerEntry): string {
  return `${entry.startYear}–${entry.endYear}`;
}
