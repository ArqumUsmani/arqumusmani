import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/primitives/Reveal";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { preventOrphans } from "@/lib/typography";

export function DesignBuild() {
  return (
    <Section
      spec={{ index: "04 / WEDGE", type: "body-l · 400", grid: "12 col · 32 gutter", space: "96 / 96" }}
      className="border-t border-mist"
    >
      <Container>
        <Reveal>
          <MonoLabel as="p" className="mb-12">
            Design / Build
          </MonoLabel>
        </Reveal>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-0">
          <div className="md:col-span-5 md:pr-12">
            <Reveal>
              <h2 className="max-w-[14ch] text-display-m text-ink">{preventOrphans("Design decides.")}</h2>
              <p className="mt-6 max-w-[42ch] text-body-l text-graphite">
                Most of what I do is still design in the traditional sense: research, information
                architecture, interaction, visual systems. I sit in on the calls, shadow the users,
                argue for the scope that the evidence actually supports.
              </p>
              <p className="mt-6 max-w-[42ch] text-body text-graphite">
                I&rsquo;m judged on whether the product got better, not on how the file was organized.
                A well-reasoned Figma file that never ships is a cost, not an output.
              </p>
            </Reveal>
          </div>

          <div className="hidden md:col-span-1 md:flex md:items-stretch md:justify-center">
            <div className="w-px bg-mist" />
          </div>

          <div className="md:col-span-6 md:pl-12">
            <Reveal index={1}>
              <h2 className="max-w-[14ch] text-display-m text-ink">{preventOrphans("Code closes the gap.")}</h2>
              <p className="mt-6 max-w-[46ch] text-body-l text-graphite">
                I write the production front end myself: React, Next.js, the same design tokens
                from the same file. Nothing gets lost between a mockup and what the user actually
                receives, because there&rsquo;s no handoff for it to get lost in.
              </p>
              <p className="mt-6 max-w-[46ch] text-body text-graphite">
                It also changes what I&rsquo;m willing to propose. I&rsquo;ve felt the cost of my own
                decisions in a codebase, which makes me more honest about which ones are actually
                worth the engineering time, and faster at defending the ones that are.
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
