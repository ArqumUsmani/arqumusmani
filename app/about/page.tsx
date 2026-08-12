import type { Metadata } from "next";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/primitives/Reveal";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { Rule } from "@/components/primitives/Rule";
import { ArrowLink } from "@/components/primitives/ArrowLink";
import { PortraitFrame } from "@/components/home/PortraitFrame";
import { ToolGrid, type Tool } from "@/components/about/ToolGrid";
import { CareerTimeline, type TimelineEntry } from "@/components/about/CareerTimeline";
import { JsonLd } from "@/components/JsonLd";
import { personJsonLd } from "@/lib/json-ld";
import { CAREER, formatCareerPeriod } from "@/data/career";
import { getWorkBySlug } from "@/lib/content/work";

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

const RESEARCH_PROCESS =
  "My process blends AI-assisted research, product analysis, user psychology, and curated design inspiration to transform ambiguity into clear product direction.";

const TOOL_GROUPS: { name: string; clause: string; years: string; tools: Tool[] }[] = [
  {
    name: "Interface & Systems",
    clause: "Interface design, prototyping, and product structure",
    years: "7+ yrs",
    tools: [
      { name: "Figma", logoSrc: "/logos/figma.svg" },
      { name: "ChatGPT", logoSrc: "/logos/chatgpt.png" },
      { name: "Claude", logoSrc: "/logos/claude.svg" },
    ],
  },
  {
    name: "Build & Ship",
    clause: "Building and shipping production interfaces, including mobile apps",
    years: "7+ yrs",
    tools: [
      { name: "React", logoSrc: "/logos/react.svg" },
      { name: "Angular", logoSrc: "/logos/angular.svg" },
      { name: "HTML", logoSrc: "/logos/html5.svg" },
      { name: "CSS", logoSrc: "/logos/css.svg" },
      { name: "Tailwind CSS", logoSrc: "/logos/tailwindcss.svg" },
      { name: "TypeScript", logoSrc: "/logos/typescript.svg" },
      { name: "JavaScript", logoSrc: "/logos/javascript.svg" },
      { name: "Claude Code", logoSrc: "/logos/claudecode.svg" },
      { name: "Framer", logoSrc: "/logos/framer.svg" },
      { name: "Webflow", logoSrc: "/logos/webflow.svg" },
    ],
  },
  {
    name: "Code Management",
    clause: "Version control and code management",
    years: "7+ yrs",
    tools: [{ name: "GitHub", logoSrc: "/logos/github.svg" }],
  },
];

export default async function AboutPage() {
  const timelineEntries: TimelineEntry[] = await Promise.all(
    FULL_TIME.map(async (entry) => {
      const caseStudy = entry.caseStudySlug ? await getWorkBySlug(entry.caseStudySlug) : undefined;
      const outcome = caseStudy?.frontmatter.outcomes[0];

      return {
        org: entry.org,
        period: formatCareerPeriod(entry),
        role: entry.role,
        scope: caseStudy?.frontmatter.team ?? entry.scope,
        outcomeValue: outcome?.value,
        outcomeLabel: outcome?.label,
      };
    }),
  );

  return (
    <>
      <JsonLd data={personJsonLd()} />
      <Section
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
        className="border-t border-mist"
      >
        <Container>
          <Reveal>
            <MonoLabel as="p" className="mb-10">
              Career
            </MonoLabel>
          </Reveal>
          <CareerTimeline entries={timelineEntries} />

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
        className="border-t border-mist"
      >
        <Container>
          <Reveal>
            <MonoLabel as="p" className="mb-10">
              Tools
            </MonoLabel>
          </Reveal>
          <Reveal index={1}>
            <p className="max-w-[60ch] text-body text-graphite">{RESEARCH_PROCESS}</p>
          </Reveal>
          <div className="mt-12 space-y-12">
            {TOOL_GROUPS.map((group, i) => (
              <div key={group.name}>
                <Reveal index={i}>
                  <MonoLabel as="p" className="text-ink">
                    {group.name}
                  </MonoLabel>
                  <p className="mt-2 max-w-[52ch] text-body-s text-ash">
                    {group.clause} &middot; {group.years}
                  </p>
                </Reveal>
                <div className="mt-5">
                  <ToolGrid tools={group.tools} />
                </div>
              </div>
            ))}
          </div>
          <Rule className="mt-16" />
        </Container>
      </Section>
    </>
  );
}
