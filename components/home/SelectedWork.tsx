import Link from "next/link";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/primitives/Reveal";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { Rule } from "@/components/primitives/Rule";
import { getFeaturedWork } from "@/lib/content/work";
import { preventOrphans } from "@/lib/typography";

export async function SelectedWork() {
  const featured = await getFeaturedWork();

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

        <div>
          {featured.map((entry, i) => {
            const { frontmatter } = entry;
            const metric = frontmatter.outcomes[0];
            return (
              <Reveal key={frontmatter.slug} index={i}>
                <Link
                  href={`/work/${frontmatter.slug}`}
                  className="group block border-t border-mist py-10 first:border-t md:py-14"
                >
                  <div className="grid grid-cols-4 gap-6 md:grid-cols-12 md:gap-8">
                    <div className="col-span-4 flex items-start gap-4 md:col-span-2">
                      <MonoLabel className="text-ash">{String(i + 1).padStart(2, "0")}</MonoLabel>
                      <MonoLabel className="text-ash">{frontmatter.domain}</MonoLabel>
                    </div>
                    <div className="col-span-4 md:col-span-7">
                      <h2 className="max-w-[22ch] text-display-m text-ink transition-colors duration-300 group-hover:text-signal">
                        {preventOrphans(frontmatter.title)}
                      </h2>
                      <p className="mt-4 max-w-[52ch] text-body text-graphite">{frontmatter.thesis}</p>
                    </div>
                    <div className="col-span-4 flex items-end justify-between md:col-span-3 md:flex-col md:items-end md:justify-between">
                      <div className="md:text-right">
                        <p className="text-display-l tabular-nums text-ink">{metric.value}</p>
                        <MonoLabel className="mt-2 block text-ash">{metric.label}</MonoLabel>
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
        <Rule />
      </Container>
    </Section>
  );
}
