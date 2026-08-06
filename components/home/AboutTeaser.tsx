import Image from "next/image";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/primitives/Reveal";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { ArrowLink } from "@/components/primitives/ArrowLink";

export function AboutTeaser() {
  return (
    <Section
      spec={{ index: "05 / ABOUT", type: "body-l · 400", grid: "12 col · 32 gutter", space: "96 / 96" }}
      className="border-t border-mist"
    >
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4">
            <Reveal>
              <div className="w-full max-w-[280px] border border-mist bg-fog">
                <Image
                  src="/about/portrait.svg"
                  alt="Portrait of Arqum Usmani"
                  width={900}
                  height={1120}
                  sizes="(max-width: 768px) 100vw, 280px"
                  loading="lazy"
                  className="h-auto w-full"
                />
              </div>
            </Reveal>
          </div>
          <div className="md:col-span-8 md:pt-4">
            <Reveal index={1}>
              <MonoLabel as="p" className="mb-6">
                About
              </MonoLabel>
              <p className="max-w-[56ch] text-body-l text-graphite">
                I grew up in Karachi, trained and built my career in Islamabad, and now design
                and build product for teams in the US — mostly healthcare, AI, and SaaS,
                because that&rsquo;s where the problems have gotten specific enough to be interesting.
              </p>
              <div className="mt-8">
                <ArrowLink href="/about">More about me</ArrowLink>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
