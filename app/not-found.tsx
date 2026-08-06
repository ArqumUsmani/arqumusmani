import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { ArrowLink } from "@/components/primitives/ArrowLink";
import { preventOrphans } from "@/lib/typography";

export default function NotFound() {
  return (
    <Section
      spec={{ index: "404 / NOT FOUND", type: "display-xl · 500", space: "160 / 160" }}
      className="flex min-h-[calc(100vh-5rem)] items-center pt-16 md:min-h-[calc(100vh-6rem)] md:pt-24"
    >
      <Container>
        <MonoLabel as="p" className="mb-6">
          404
        </MonoLabel>
        <h1 className="max-w-[16ch] text-display-xl text-ink">{preventOrphans("This page doesn't exist.")}</h1>
        <p className="mt-8 max-w-[48ch] text-body-l text-graphite">
          Either it moved, or it was never here. The case studies are still where you left them.
        </p>
        <div className="mt-10">
          <ArrowLink href="/work">Back to work</ArrowLink>
        </div>
      </Container>
    </Section>
  );
}
