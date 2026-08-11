import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/primitives/Reveal";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { DesignedForStrip, type DesignedForCompany } from "@/components/home/DesignedForStrip";
import { CAREER, formatCareerPeriod } from "@/data/career";
import { getWorkBySlug } from "@/lib/content/work";

// Real orgs only — "Freelance" has no logo/entity to show here, and no
// case study of its own.
const LOGO_SRC: Record<string, string> = {
  "Oak Street Technologies": "/logos/oak-street.png",
  CloudBloom: "/logos/cloudbloom.svg",
  CloudFruit: "/logos/cloudfruit.png",
  "Stella Technology": "/logos/stella-technology.svg",
  "Ingenious Digital Systems": "/logos/ingenious-digital-systems.svg",
};

// "Owned" line for entries without a public case study to pull a thesis
// from — real work, just not written up as a case study (yet, in Oak
// Street's case; it won't be, for client confidentiality, in Ingenious's).
const FALLBACK_OWNED: Record<string, string> = {
  "Oak Street Technologies": "Current product design work. Ongoing, not yet public.",
  "Ingenious Digital Systems":
    "Kiosk, vehicle-tracking, and industrial automation interfaces for CDC Pakistan, Engro Pakistan, and Sindh Solid Waste Management.",
};

export async function DesignedFor() {
  const orgs = Object.keys(LOGO_SRC);

  const companies: DesignedForCompany[] = await Promise.all(
    orgs.map(async (org) => {
      const entry = CAREER.find((c) => c.org === org)!;
      const caseStudy = entry.caseStudySlug ? await getWorkBySlug(entry.caseStudySlug) : undefined;
      const metric = caseStudy?.frontmatter.outcomes[0];

      return {
        org,
        logoSrc: LOGO_SRC[org],
        role: entry.role,
        period: formatCareerPeriod(entry),
        owned: caseStudy?.frontmatter.thesis ?? FALLBACK_OWNED[org] ?? "",
        metricValue: metric?.value,
        metricLabel: metric?.label,
        caseStudyHref: caseStudy ? `/work/${caseStudy.frontmatter.slug}` : undefined,
      };
    }),
  );

  return (
    <Section
      spec={{ index: "03 / PROOF", type: "body-l · 400", space: "96 / 64" }}
      className="border-t border-mist"
    >
      <Container>
        <Reveal>
          <MonoLabel as="p" className="mb-8">
            Designed for
          </MonoLabel>
        </Reveal>
        <Reveal index={1}>
          <DesignedForStrip companies={companies} />
        </Reveal>
      </Container>
    </Section>
  );
}
