import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/primitives/Reveal";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { HeroHeadline } from "@/components/home/HeroHeadline";
import { IntroSequence } from "@/components/home/IntroSequence";
import { GenerativeField } from "@/components/home/GenerativeField";
import { SelectedWork } from "@/components/home/SelectedWork";
import { DesignedFor } from "@/components/home/DesignedFor";
import { DesignBuild } from "@/components/home/DesignBuild";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { JsonLd } from "@/components/JsonLd";
import { personJsonLd } from "@/lib/json-ld";
import { EXPERIENCE_YEARS } from "@/lib/site-config";

export default function Home() {
  return (
    <>
      <JsonLd data={personJsonLd()} />
      <IntroSequence />
      {/* Header (h-20 / h-24) + hero together fill exactly 100dvh — dvh
          rather than vh so mobile browser chrome showing/hiding doesn't
          leave the hero either clipped or oversized.

          The availability pill lives in the nav only now, not here too —
          it was the same badge appearing twice above the fold. */}
      <Section
        spec={{ index: "01 / HOME", type: "display-xl · 500", grid: "12 col · 32 gutter", space: "160 / 96" }}
        className="relative flex min-h-[calc(100dvh-5rem)] items-center overflow-hidden pt-16 md:min-h-[calc(100dvh-6rem)] md:pt-24"
      >
        <GenerativeField />
        <Container>
          <Reveal inView={false}>
            <MonoLabel as="p" className="mb-6">
              Arqum Usmani
            </MonoLabel>
          </Reveal>
          <HeroHeadline />
          {/* The proof line: years, domains, and the single strongest
              number, all real and pulled from the case study frontmatter —
              answers "is he any good" before anyone has to scroll. */}
          <Reveal inView={false} index={1} className="mt-8 max-w-[52ch]">
            <p className="text-body-l text-graphite">
              {EXPERIENCE_YEARS}+ years across healthcare, AI, and SaaS, including a{" "}
              <span className="tabular-nums text-ink">63% cut in clicks-per-note</span> for a hospital EMR
              now in production.
            </p>
          </Reveal>
        </Container>
      </Section>

      <SelectedWork />
      <DesignedFor />
      <DesignBuild />
      <AboutTeaser />
    </>
  );
}
