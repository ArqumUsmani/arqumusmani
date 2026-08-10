/**
 * Single source of truth for employment history. The About page timeline
 * renders this list directly, and SITE_CONFIG's "N+ years" copy is derived
 * from CAREER_START_YEAR rather than hand-typed — so the two can't drift out
 * of sync with each other again.
 *
 * Case studies (content/work/*.mdx) are project engagements, not employers,
 * and keep their own `year`/`timeline` frontmatter as the source of truth
 * for that project's dates — this file is deliberately only about who I
 * worked for and when, not what shipped while I was there.
 */
export type CareerEntry = {
  org: string;
  role: string;
  startYear: number;
  /** "Present" for the current role. */
  endYear: number | "Present";
};

export const CAREER: CareerEntry[] = [
  { org: "Oak Street Technologies", role: "Lead Product Designer", startYear: 2024, endYear: "Present" },
  { org: "Hiibo", role: "Lead Designer", startYear: 2023, endYear: 2024 },
  { org: "Stella Technology", role: "UI/UX Engineer", startYear: 2021, endYear: 2023 },
  { org: "CloudFruit", role: "Product Designer", startYear: 2019, endYear: 2021 },
  { org: "Freelance", role: "Design & front-end, Karachi", startYear: 2017, endYear: 2019 },
];

export const CAREER_START_YEAR = Math.min(...CAREER.map((entry) => entry.startYear));

export function formatCareerPeriod(entry: CareerEntry): string {
  return `${entry.startYear}–${entry.endYear}`;
}
