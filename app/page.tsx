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
      {/* Header (h-20 / h-24) + hero together fill exactly 100dvh — dvh
          rather than vh so mobile browser chrome showing/hiding doesn't
          leave the hero either clipped or oversized. */}
      <Section
        spec={{ index: "01 / HOME", type: "display-xl · 500", grid: "12 col · 32 gutter", space: "160 / 96" }}
        className="flex min-h-[calc(100dvh-5rem)] items-center pt-16 md:min-h-[calc(100dvh-6rem)] md:pt-24"
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
