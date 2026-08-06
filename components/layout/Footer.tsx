import { Container } from "@/components/primitives/Container";
import { Rule } from "@/components/primitives/Rule";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { preventOrphans } from "@/lib/typography";
import { SITE_CONFIG } from "@/lib/site-config";

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: SITE_CONFIG.social.linkedin },
  { label: "Behance", href: SITE_CONFIG.social.behance },
  { label: "Dribbble", href: SITE_CONFIG.social.dribbble },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-mist">
      <Container className="py-24 md:py-40">
        <MonoLabel as="p" className="mb-6">
          Availability
        </MonoLabel>
        <h2 className="max-w-[16ch] text-display-m text-ink">
          {preventOrphans("Let's build something worth shipping.")}
        </h2>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <a
            href={`mailto:${SITE_CONFIG.email}?subject=Full-time%20role`}
            className="inline-flex items-center justify-center rounded-sm bg-ink px-6 py-4 font-mono text-mono-label uppercase text-paper transition-colors duration-300 hover:bg-graphite"
          >
            Hire me full-time
          </a>
          <a
            href={`mailto:${SITE_CONFIG.email}?subject=Project%20inquiry`}
            className="inline-flex items-center justify-center rounded-sm border border-mist px-6 py-4 font-mono text-mono-label uppercase text-ink transition-colors duration-300 hover:border-ink"
          >
            Work with me
          </a>
        </div>

        <Rule className="my-16" />

        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="font-mono text-mono-label uppercase text-graphite transition-colors duration-300 hover:text-ink"
            >
              {SITE_CONFIG.email}
            </a>
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-mono-label uppercase text-graphite transition-colors duration-300 hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </div>

          <p className="font-mono text-mono-label uppercase text-ash">
            Designed &amp; built by Arqum · {year}
          </p>
        </div>
      </Container>
    </footer>
  );
}
