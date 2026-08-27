import type { Metadata } from "next";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/primitives/Reveal";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { Rule } from "@/components/primitives/Rule";
import { AvailabilityPill } from "@/components/layout/AvailabilityPill";
import { ContactForm } from "@/components/contact/ContactForm";
import { preventOrphans } from "@/lib/typography";
import { SITE_CONFIG } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Arqum Usmani for full-time, contract, or advisory design and engineering work.",
  alternates: {
    canonical: "/contact",
  },
};

const ENGAGEMENT_TYPES = [
  { label: "Full-time", body: "Lead or principal product design roles, ideally with a build component." },
  { label: "Contract", body: "Fixed-scope case studies, design systems, or a specific product problem." },
  { label: "Advisory", body: "Design review, hiring input, or a second opinion on an in-flight product." },
];

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: SITE_CONFIG.social.linkedin },
  { label: "Behance", href: SITE_CONFIG.social.behance },
].filter((link) => link.href);

export default function ContactPage() {
  return (
    <Section className="pt-16 md:pt-24">
      <Container>
        <Reveal inView={false}>
          <MonoLabel as="p" className="mb-6">
            Contact
          </MonoLabel>
          <h1 className="max-w-[14ch] text-display-xl text-ink">{preventOrphans("Let's talk.")}</h1>
        </Reveal>
        <Reveal inView={false} index={1} className="mt-8 flex flex-wrap items-center gap-6">
          {/* <AvailabilityPill /> */}
          <p className="text-body-s text-ash">Typical response time: 2 business days</p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-16 md:mt-24 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <Reveal inView={false}>
              <MonoLabel as="p" className="mb-6">
                Engagement types
              </MonoLabel>
              <ul className="space-y-8">
                {ENGAGEMENT_TYPES.map((item) => (
                  <li key={item.label}>
                    <p className="text-body-l text-ink">{item.label}</p>
                    <p className="mt-2 max-w-[42ch] text-body-s text-graphite">{item.body}</p>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Rule className="my-10" />

            <Reveal index={1}>
              <MonoLabel as="p" className="mb-4">
                Direct
              </MonoLabel>
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="text-body-l text-ink underline decoration-mist decoration-1 underline-offset-4 transition-colors duration-150 hover:decoration-signal"
              >
                {SITE_CONFIG.email}
              </a>
              <div className="mt-3">
                <a
                  href={`https://wa.me/${SITE_CONFIG.whatsapp.replace("+", "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-body-l text-ink underline decoration-mist decoration-1 underline-offset-4 transition-colors duration-150 hover:decoration-signal"
                >
                  WhatsApp: {SITE_CONFIG.whatsapp}
                </a>
              </div>
              <p className="mt-6 max-w-[42ch] text-body-s text-graphite">
                Want to get connected? Let&rsquo;s talk over coffee, virtual or otherwise.
              </p>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-mono-label uppercase text-graphite transition-colors duration-150 hover:text-ink"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-7">
            <Reveal index={2}>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
