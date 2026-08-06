import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/primitives/Reveal";
import { MonoLabel } from "@/components/primitives/MonoLabel";

const COMPANIES = ["Stella Technology", "Hiibo", "CloudFruit", "Oak Street Technologies"];

export function Proof() {
  return (
    <Section
      spec={{ index: "03 / PROOF", type: "body-l · 400", space: "96 / 64" }}
      className="border-t border-mist"
    >
      <Container>
        <Reveal>
          <MonoLabel as="p" className="mb-8">
            Designed for
          </MonoLabel>
        </Reveal>
        <Reveal className="flex flex-wrap gap-x-10 gap-y-4">
          {COMPANIES.map((company) => (
            <span key={company} className="text-body-l text-graphite">
              {company}
            </span>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
