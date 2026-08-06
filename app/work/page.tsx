import type { Metadata } from "next";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/primitives/Reveal";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { WorkIndex } from "@/components/work/WorkIndex";
import { getAllWork } from "@/lib/content/work";
import { preventOrphans } from "@/lib/typography";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies in healthcare, AI, and SaaS product design — Arqum Usmani, Lead Product Designer and UI/UX Engineer.",
  alternates: {
    canonical: "/work",
  },
};

export default async function WorkPage() {
  const work = await getAllWork();

  const items = work.map((entry) => ({
    slug: entry.frontmatter.slug,
    title: entry.frontmatter.title,
    domain: entry.frontmatter.domain,
    year: entry.frontmatter.year,
    cover: entry.frontmatter.cover,
    outcomeValue: entry.frontmatter.outcomes[0].value,
    outcomeLabel: entry.frontmatter.outcomes[0].label,
    thesis: entry.frontmatter.thesis,
  }));

  return (
    <Section
      spec={{ index: "01 / WORK INDEX", type: "body-l · 400", grid: "12 col · 32 gutter", space: "160 / 96" }}
      className="pt-16 md:pt-24"
    >
      <Container>
        <Reveal inView={false}>
          <MonoLabel as="p" className="mb-6">
            Work
          </MonoLabel>
          <h1 className="max-w-[16ch] text-display-xl text-ink">{preventOrphans("Selected case studies.")}</h1>
          <p className="mt-8 max-w-[55ch] text-body-l text-graphite">
            Four projects across healthcare, AI, and SaaS. Each one written as an argument, not a
            gallery — the problem, the constraints, and what I&rsquo;d change.
          </p>
        </Reveal>

        <div className="mt-16 md:mt-24">
          <WorkIndex items={items} />
        </div>
      </Container>
    </Section>
  );
}
