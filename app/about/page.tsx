import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Grid } from "@/components/primitives/Grid";
import { Reveal } from "@/components/primitives/Reveal";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { Rule } from "@/components/primitives/Rule";
import { ArrowLink } from "@/components/primitives/ArrowLink";
import { preventOrphans } from "@/lib/typography";
import { JsonLd } from "@/components/JsonLd";
import { personJsonLd } from "@/lib/json-ld";

export const metadata: Metadata = {
  title: "About",
  description:
    "Arqum Usmani — Lead Product Designer and UI/UX Engineer. Design philosophy, career timeline, and tools.",
  alternates: {
    canonical: "/about",
  },
};

const TIMELINE = [
  {
    period: "2024 — Present",
    org: "Oak Street Technologies",
    role: "Lead Product Designer",
  },
  {
    period: "2023 — 2024",
    org: "Hiibo",
    role: "Lead Designer",
  },
  {
    period: "2021 — 2023",
    org: "Stella Technology",
    role: "UI/UX Engineer",
  },
  {
    period: "2019 — 2021",
    org: "CloudFruit",
    role: "Product Designer",
  },
  {
    period: "2017 — 2019",
    org: "Freelance",
    role: "Design & front-end, Karachi",
  },
];

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
                  {preventOrphans("I design for the version of the problem that's actually true.")}
                </h1>
              </Reveal>
              <Reveal inView={false} index={1} className="mt-10">
                <p className="max-w-[60ch] text-body-l text-graphite">
                  Most product problems get solved twice — once for the version stakeholders
                  describe, and once for the version the evidence actually supports. I try to
                  spend as little time as possible on the first one. That&rsquo;s most of what
                  &ldquo;opinionated&rdquo; means when I say it about my own work.
                </p>
                <p className="mt-6 max-w-[60ch] text-body text-graphite">
                  I care about healthcare, AI, and SaaS specifically because they&rsquo;re the domains
                  where the constraints are real — regulatory, technical, organisational — and a
                  design that ignores them doesn&rsquo;t just look wrong, it doesn&rsquo;t ship.
                </p>
                <p className="mt-6 max-w-[60ch] text-body text-graphite">
                  I grew up in Karachi and trained as a designer in Islamabad, where I still live
                  and work. Every team I&rsquo;ve shipped for since has been based in the US, which in
                  practice mostly means my mornings start with someone else&rsquo;s afternoon.
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
                <div className="w-full border border-mist bg-fog">
                  <Image
                    src="/about/portrait.svg"
                    alt="Portrait of Arqum Usmani"
                    width={900}
                    height={1120}
                    priority
                    sizes="(max-width: 768px) 100vw, 320px"
                    className="h-auto w-full"
                  />
                </div>
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
            {TIMELINE.map((item, i) => (
              <Reveal key={item.org} index={i}>
                <div className="grid grid-cols-4 gap-6 border-t border-mist py-6 last:border-b md:grid-cols-12 md:gap-8 md:py-8">
                  <MonoLabel className="col-span-4 self-start text-ash md:col-span-3">
                    {item.period}
                  </MonoLabel>
                  <p className="col-span-4 text-body-l text-ink md:col-span-5">{item.org}</p>
                  <p className="col-span-4 text-body text-graphite md:col-span-4">{item.role}</p>
                </div>
              </Reveal>
            ))}
          </div>
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
