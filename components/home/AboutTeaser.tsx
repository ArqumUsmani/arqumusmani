import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/primitives/Reveal";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { ArrowLink } from "@/components/primitives/ArrowLink";
import { PortraitFrame } from "@/components/home/PortraitFrame";

export function AboutTeaser() {
  return (
    <Section
      spec={{ index: "05 / ABOUT", type: "body-l · 400", grid: "12 col · 32 gutter", space: "96 / 96" }}
      className="border-t border-mist"
    >
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-8 md:pt-4">
            <Reveal>
              <MonoLabel as="p" className="mb-6">
                About
              </MonoLabel>
              <p className="max-w-[56ch] text-body-l text-graphite">
                I design and build product for teams in the US, mostly healthcare, AI, and SaaS,
                because that&rsquo;s where the problems have gotten specific enough to be interesting.
                I also lean on AI daily, for ideation, research, and speed, not as a gimmick but as
                how the work actually gets done now.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                <ArrowLink href="/about">More about me</ArrowLink>
                <ArrowLink href="/contact">Want to get connected? Let&rsquo;s talk over coffee</ArrowLink>
              </div>
            </Reveal>
          </div>
          <div className="md:col-span-4">
            <Reveal index={1}>
              <PortraitFrame sizes="(max-width: 768px) 100vw, 280px" className="max-w-[280px]" />
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
