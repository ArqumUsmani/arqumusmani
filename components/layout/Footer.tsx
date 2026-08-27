import { Container } from "@/components/primitives/Container";
import { Reveal } from "@/components/primitives/Reveal";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import SplitText from "@/components/primitives/SplitText";
import { Clock } from "@/components/layout/Clock";
import { preventOrphans } from "@/lib/typography";
import { SITE_CONFIG } from "@/lib/site-config";

const FOOTER_COLUMNS = [
  {
    heading: "Explore",
    links: [
      { label: "Selected work", href: "/work" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Say hello",
    links: [
      { label: "Email", href: `mailto:${SITE_CONFIG.email}` },
      { label: "WhatsApp", href: `https://wa.me/${SITE_CONFIG.whatsapp.replace("+", "")}`, external: true },
      { label: "LinkedIn", href: SITE_CONFIG.social.linkedin, external: true },
    ],
  },
  {
    heading: "Elsewhere",
    links: [{ label: "Behance", href: SITE_CONFIG.social.behance, external: true }],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="px-4 pb-8 pt-16 md:px-6 md:pb-10 md:pt-24">
      {/* rounded-[2rem] is a deliberate one-off: the site caps radius at 2px
          everywhere else, but this card treatment was a direct, specific
          request, not a drift. Don't reuse this radius elsewhere. */}
      <div className="overflow-hidden rounded-[2rem] bg-fog">
        <Container className="pb-0 pt-16 md:pt-24">
          <Reveal>
            <MonoLabel as="p" className="mb-6">
              Availability
            </MonoLabel>
          </Reveal>

          <div className="flex flex-col justify-between gap-12 lg:flex-row lg:gap-8">
            <div className="lg:max-w-[24ch]">
              <Reveal>
                <h2 className="text-display-m text-ink">
                  {preventOrphans("Let's build something worth shipping.")}
                </h2>
              </Reveal>
              {/* One dominant ask, not two competing ones: full-time
                  Lead/Principal roles is the primary CTA (the pill button,
                  rounded-full is a deliberate one-off matching the footer
                  card radius above). Contract/advisory availability is real
                  but secondary — a quiet text line, not an equal button. */}
              <Reveal index={1} className="mt-10">
                <a
                  href={`mailto:${SITE_CONFIG.email}?subject=Full-time%20role`}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-ink px-7 py-4 font-mono text-mono-label uppercase text-paper transition-colors duration-150 hover:bg-graphite active:scale-[0.97] active:opacity-100"
                >
                  Hire me full-time
                </a>
                <p className="mt-4 text-body-s text-ash">
                  Also open to contract and advisory work,{" "}
                  <a
                    href={`mailto:${SITE_CONFIG.email}?subject=Project%20inquiry`}
                    className="text-graphite underline decoration-mist decoration-1 underline-offset-4 transition-colors duration-150 hover:text-ink hover:decoration-signal"
                  >
                    reach out directly
                  </a>
                  .
                </p>
              </Reveal>
            </div>

            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:gap-16">
              {FOOTER_COLUMNS.map((column, i) => {
                const links = column.links.filter((link) => link.href);
                if (links.length === 0) return null;
                return (
                  <Reveal key={column.heading} index={i + 2}>
                    <MonoLabel as="p" className="mb-5 text-ink">
                      {column.heading}
                    </MonoLabel>
                    <ul className="space-y-3">
                      {links.map((link) => (
                        <li key={link.label}>
                          <a
                            href={link.href}
                            target={"external" in link && link.external ? "_blank" : undefined}
                            rel={"external" in link && link.external ? "noreferrer" : undefined}
                            className="text-body text-graphite transition-colors duration-150 hover:text-ink"
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </Container>

        <div className="mt-16 select-none md:mt-24">
          <SplitText
            ariaHidden
            text="Arqum Usmani"
            tag="p"
            splitType="chars"
            duration={2}
            delay={22}
            ease="power3.out"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.2}
            rootMargin="-80px"
            textAlign="center"
            className="-mb-[0.12em] block w-full px-4 font-sans text-[16vw] font-bold leading-none tracking-tighter text-ink md:-mb-[0.19em] md:text-[13vw]"
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between px-2">
        <p className="font-mono text-mono-label uppercase text-ash">
          {SITE_CONFIG.name} &copy; {year}
        </p>
        <Clock />
      </div>
    </footer>
  );
}
