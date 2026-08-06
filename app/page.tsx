import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/primitives/Reveal";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { ArrowLink } from "@/components/primitives/ArrowLink";

export default function Home() {
  return (
    <Section
      spec={{ index: "01 / HOME", type: "display-xl · 500", grid: "12 col · 32 gutter", space: "160 / 96" }}
      className="flex min-h-[calc(100vh-5rem)] items-center pt-16 md:min-h-[calc(100vh-6rem)] md:pt-24"
    >
      <Container>
        <Reveal>
          <MonoLabel as="p" className="mb-6">
            Lead Product Designer · UI/UX Engineer
          </MonoLabel>
          <h1 className="max-w-[18ch] text-display-xl text-ink">
            Design that ships as code.
          </h1>
          <p className="mt-8 max-w-[55ch] text-body-l text-graphite">
            Arqum Usmani — 5+ years across healthcare, AI products, and SaaS,
            based in Islamabad, Pakistan. Foundation build in progress; case
            studies land next.
          </p>
          <div className="mt-10">
            <ArrowLink href="/styleguide" variant="mono">
              View the design system
            </ArrowLink>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
