import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/primitives/Reveal";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { AvailabilityPill } from "@/components/layout/AvailabilityPill";
import { HeroHeadline } from "@/components/home/HeroHeadline";
import { SelectedWork } from "@/components/home/SelectedWork";
import { Proof } from "@/components/home/Proof";
import { DesignBuild } from "@/components/home/DesignBuild";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { JsonLd } from "@/components/JsonLd";
import { personJsonLd } from "@/lib/json-ld";

export default function Home() {
  return (
    <>
      <JsonLd data={personJsonLd()} />
      {/* Height is bounded, not full-viewport: on a short laptop window the hero
          should still feel substantial, but on a tall external monitor an
          uncapped 100vh here just stretches into dead space above the fold. */}
      <Section
        spec={{ index: "01 / HOME", type: "display-xl · 500", grid: "12 col · 32 gutter", space: "160 / 96" }}
        className="flex min-h-[min(calc(100vh-5rem),46rem)] items-center pt-16 md:min-h-[min(calc(100vh-6rem),52rem)] md:pt-24"
      >
        <Container>
          <Reveal inView={false}>
            <MonoLabel as="p" className="mb-6">
              Arqum Usmani
            </MonoLabel>
          </Reveal>
          <HeroHeadline />
          <div className="mt-10">
            <AvailabilityPill />
          </div>
        </Container>
      </Section>

      <SelectedWork />
      <Proof />
      <DesignBuild />
      <AboutTeaser />
    </>
  );
}
