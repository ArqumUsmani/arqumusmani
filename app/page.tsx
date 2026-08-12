import { Section } from "@/components/primitives/Section";
import { Hero } from "@/components/home/Hero";
import { IntroSequence } from "@/components/home/IntroSequence";
import { Marquee } from "@/components/home/Marquee";
import { DesignBuild } from "@/components/home/DesignBuild";
import { JsonLd } from "@/components/JsonLd";
import { personJsonLd } from "@/lib/json-ld";

export default function Home() {
  return (
    <>
      <JsonLd data={personJsonLd()} />
      <IntroSequence />
      {/* Header (h-24 / h-28) + hero together fill exactly 100dvh — dvh
          rather than vh so mobile browser chrome showing/hiding doesn't
          leave the hero either clipped or oversized. Hero fills the section
          via absolute inset-0 (its portrait backdrop needs full-bleed
          sizing the Container's padding would otherwise cut into), so the
          section itself carries the height with no in-flow content. */}
      <Section className="bg-grain relative min-h-[calc(100dvh-6rem)] overflow-hidden md:min-h-[calc(100dvh-7rem)]">
        <Hero />
      </Section>

      <Marquee />

      <DesignBuild />
    </>
  );
}
