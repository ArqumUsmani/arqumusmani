import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/primitives/Reveal";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { SelectedWorkStack, type SelectedWorkItem } from "@/components/home/SelectedWorkStack";
import { getFeaturedWork } from "@/lib/content/work";

export async function SelectedWork() {
  const featured = await getFeaturedWork();

  const items: SelectedWorkItem[] = featured.map((entry) => ({
    slug: entry.frontmatter.slug,
    title: entry.frontmatter.title,
    domain: entry.frontmatter.domain,
    year: entry.frontmatter.year,
    cover: entry.frontmatter.cover,
    thesis: entry.frontmatter.thesis,
    metricValue: entry.frontmatter.outcomes[0].value,
    metricLabel: entry.frontmatter.outcomes[0].label,
  }));

  return (
    <Section
      spec={{ index: "02 / WORK", type: "display-m · 500", grid: "12 col · 32 gutter", space: "160 / 96" }}
    >
      <Container>
        <Reveal>
          <MonoLabel as="p" className="mb-10">
            Selected work
          </MonoLabel>
        </Reveal>
      </Container>

      <Container>
        <SelectedWorkStack items={items} />
      </Container>
    </Section>
  );
}
