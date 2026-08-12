import Link from "next/link";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { preventOrphans } from "@/lib/typography";

type ChainedNavProps = {
  slug: string;
  title: string;
  domain: string;
};

export function ChainedNav({ slug, title, domain }: ChainedNavProps) {
  return (
    <Section
      className="border-t border-mist"
    >
      <Container>
        <Link href={`/work/${slug}`} className="group block">
          <MonoLabel as="p" className="mb-6">
            Next case study · {domain}
          </MonoLabel>
          <div className="flex items-end justify-between gap-6">
            <h2 className="max-w-[20ch] text-display-l text-ink transition-colors duration-300 group-hover:text-signal">
              {preventOrphans(title)}
            </h2>
            <span
              aria-hidden="true"
              className="hidden shrink-0 text-display-l text-ash transition-all duration-300 group-hover:translate-x-2 group-hover:text-signal sm:inline"
            >
              →
            </span>
          </div>
        </Link>
      </Container>
    </Section>
  );
}
