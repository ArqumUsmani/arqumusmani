import type { Metadata } from "next";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Grid } from "@/components/primitives/Grid";
import { Reveal } from "@/components/primitives/Reveal";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { Rule } from "@/components/primitives/Rule";
import { ArrowLink } from "@/components/primitives/ArrowLink";
import { PortraitFrame } from "@/components/home/PortraitFrame";
import { JsonLd } from "@/components/JsonLd";
import { personJsonLd } from "@/lib/json-ld";
import { CAREER, formatCareerPeriod } from "@/data/career";

export const metadata: Metadata = {
  title: "About",
  description:
    "Arqum Usmani, Lead Product Designer and UI/UX Engineer. Design philosophy, career timeline, and tools.",
  alternates: {
    canonical: "/about",
  },
};

const FULL_TIME = CAREER.filter((entry) => entry.commitment === "full-time");
const PART_TIME = CAREER.filter((entry) => entry.commitment === "part-time");

const DESIGN_TOOLS = ["Figma", "FigJam", "Illustrator", "Principle"];
const BUILD_TOOLS = ["React", "Next.js", "TypeScript", "Tailwind CSS", "Motion"];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={personJsonLd()} />
      <Section
        spec={{ index: "01 / ABOUT", type: "display-xl · 500", grid: "12 col · 32 gutter", space: "160 / 96" }}
        className="pt-16 md:pt-24"
      >
        <Container>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-8">
              <Reveal inView={false}>
                <MonoLabel as="p" className="mb-6">
                  About
                </MonoLabel>
                <h1 className="max-w-[16ch] text-display-xl text-ink">
                  I design for the version of the problem that&rsquo;s{" "}
                  <span className="font-serif italic">actually true.</span>
                </h1>
              </Reveal>
              <Reveal inView={false} index={1} className="mt-10">
                <p className="max-w-[60ch] text-body-l text-graphite">
                  Most product problems get solved twice: once for the version stakeholders
                  describe, and once for the version the evidence actually supports. I try to
                  spend as little time as possible on the first one. That&rsquo;s most of what
                  &ldquo;opinionated&rdquo; means when I say it about my own work.
                </p>
                <p className="mt-6 max-w-[60ch] text-body text-graphite">
                  I care about healthcare, AI, and SaaS specifically because they&rsquo;re the domains
                  where the constraints are real (regulatory, technical, organisational) and a
                  design that ignores them doesn&rsquo;t just look wrong, it doesn&rsquo;t ship.
                </p>
                <p className="mt-6 max-w-[60ch] text-body text-graphite">
                  I use AI daily, for ideation, research, drafting, and debugging, not as a novelty
                  but as how I actually work now. I expect the same of the products I design: if a
                  tool doesn&rsquo;t make someone faster at reaching the right answer, it&rsquo;s not done yet.
                </p>
              </Reveal>
              <Reveal index={2} className="mt-8">
                <ArrowLink href="/resume.pdf" variant="mono">
                  Download resume (PDF)
                </ArrowLink>
              </Reveal>
            </div>

            <div className="md:col-span-4">
              <Reveal inView={false} index={1}>
                <PortraitFrame priority sizes="(max-width: 768px) 100vw, 640px" />
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <Section
        spec={{ index: "02 / TIMELINE", type: "body · 400", grid: "12 col · 32 gutter", space: "96 / 96" }}
        className="border-t border-mist"
      >
        <Container>
          <Reveal>
            <MonoLabel as="p" className="mb-10">
              Career
            </MonoLabel>
          </Reveal>
          <div>
            {FULL_TIME.map((entry, i) => (
              <Reveal key={entry.org} index={i}>
                <div className="grid grid-cols-4 gap-6 border-t border-mist py-6 last:border-b md:grid-cols-12 md:gap-8 md:py-8">
                  <MonoLabel className="col-span-4 self-start text-ash md:col-span-3">
                    {formatCareerPeriod(entry)}
                  </MonoLabel>
                  <p className="col-span-4 text-body-l text-ink md:col-span-5">{entry.org}</p>
                  <p className="col-span-4 text-body text-graphite md:col-span-4">{entry.role}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Part-time work ran concurrently alongside Stella Technology,
              not after it — a second sequential row would misrepresent it
              as later, non-overlapping employment. */}
          {PART_TIME.length > 0 && (
            <Reveal index={FULL_TIME.length} className="mt-10 border-t border-mist pt-8">
              <MonoLabel className="text-ash">
                Also, part-time ({formatCareerPeriod(PART_TIME[0])})
              </MonoLabel>
              <ul className="mt-4 space-y-2">
                {PART_TIME.map((entry) => (
                  <li key={entry.org} className="text-body text-graphite">
                    <span className="text-ink">{entry.org}</span>, {entry.role}
                    {entry.products ? ` (${entry.products.join(", ")})` : ""}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </Container>
      </Section>

      <Section
        spec={{ index: "03 / TOOLS", type: "body · 400", grid: "12 col · 32 gutter", space: "96 / 96" }}
        className="border-t border-mist"
      >
        <Container>
          <Reveal>
            <MonoLabel as="p" className="mb-10">
              Tools
            </MonoLabel>
          </Reveal>
          <Grid>
            <Reveal className="col-span-4 md:col-span-6">
              <MonoLabel as="p" className="mb-5 text-ink">
                Design
              </MonoLabel>
              <ul className="space-y-3">
                {DESIGN_TOOLS.map((tool) => (
                  <li key={tool} className="text-body-l text-graphite">
                    {tool}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal index={1} className="col-span-4 md:col-span-6">
              <MonoLabel as="p" className="mb-5 text-ink">
                Build
              </MonoLabel>
              <ul className="space-y-3">
                {BUILD_TOOLS.map((tool) => (
                  <li key={tool} className="text-body-l text-graphite">
                    {tool}
                  </li>
                ))}
              </ul>
            </Reveal>
          </Grid>
          <Rule className="mt-16" />
        </Container>
      </Section>
    </>
  );
}
