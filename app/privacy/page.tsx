import type { Metadata } from "next";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/primitives/Reveal";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { Rule } from "@/components/primitives/Rule";
import { preventOrphans } from "@/lib/typography";
import { SITE_CONFIG } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What this site collects when you visit, why, and how to have it removed.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "August 2026";

type Row = { what: string; why: string; who: string };

const COLLECTED: Row[] = [
  {
    what: "Pages viewed, time on page, scroll depth, navigation path, clicks",
    why: "Understanding which work gets attention and where people lose interest",
    who: "PostHog, Google Analytics, Vercel Analytics",
  },
  {
    what: "Approximate location (city / country) derived from your IP address",
    why: "Rough sense of audience geography; a real-time alert that someone is viewing",
    who: "Vercel (edge geolocation), PostHog, Google Analytics",
  },
  {
    what: "Referrer — the site or search that sent you here",
    why: "Knowing whether visitors arrive from LinkedIn, Behance, search, or direct",
    who: "PostHog, Google Analytics, Vercel Analytics",
  },
  {
    what: "Device, browser, operating system, screen size, language",
    why: "Making sure the site renders well across what people actually use",
    who: "PostHog, Google Analytics, Vercel Analytics",
  },
  {
    what: "Session recordings (mouse movement, clicks, scrolling — not keystrokes in inputs)",
    why: "Watching real sessions to find friction in the case studies",
    who: "PostHog",
  },
  {
    what: "Name, email, and message — only when you submit the contact form",
    why: "Replying to you",
    who: "Delivered by email (Resend); not added to any marketing list",
  },
];

export default function PrivacyPage() {
  return (
    <Section className="pt-16 md:pt-24">
      <Container>
        <Reveal inView={false}>
          <MonoLabel as="p" className="mb-6">
            Privacy
          </MonoLabel>
          <h1 className="max-w-[18ch] text-display-xl text-ink">
            {preventOrphans("What this site knows about your visit.")}
          </h1>
        </Reveal>
        <Reveal inView={false} index={1} className="mt-8">
          <p className="max-w-[62ch] text-body-l text-graphite">
            This is a personal portfolio, not a product. It runs standard web analytics to
            see which work resonates — nothing is sold, and there is no advertising or
            cross-site ad tracking on this site.
          </p>
          <p className="mt-3 text-body-s text-ash">Last updated: {LAST_UPDATED}</p>
        </Reveal>

        <Rule className="my-12 md:my-16" />

        <Reveal>
          <MonoLabel as="p" className="mb-8">
            What&rsquo;s collected
          </MonoLabel>
        </Reveal>
        <dl className="space-y-8">
          {COLLECTED.map((row, i) => (
            <Reveal key={row.what} index={i} className="grid grid-cols-1 gap-2 md:grid-cols-12 md:gap-8">
              <dt className="text-body text-ink md:col-span-5">{row.what}</dt>
              <dd className="text-body-s text-graphite md:col-span-4">{row.why}</dd>
              <dd className="text-body-s text-ash md:col-span-3">{row.who}</dd>
            </Reveal>
          ))}
        </dl>

        <Rule className="my-12 md:my-16" />

        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-6">
            <Reveal>
              <MonoLabel as="p" className="mb-4">
                Cookies &amp; storage
              </MonoLabel>
              <p className="max-w-[52ch] text-body text-graphite">
                Analytics providers set first-party cookies and use local storage to tell a
                returning visit from a new one. A functional cookie also remembers your
                light/dark theme choice. No third-party advertising cookies are set.
              </p>
              <p className="mt-4 max-w-[52ch] text-body-s text-ash">
                You can block cookies in your browser, or send a Global Privacy Control /
                Do Not Track signal, without breaking the site.
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-6">
            <Reveal index={1}>
              <MonoLabel as="p" className="mb-4">
                Retention &amp; your rights
              </MonoLabel>
              <p className="max-w-[52ch] text-body text-graphite">
                Aggregated analytics are kept up to 14 months. Contact-form messages are
                kept as long as the conversation is useful, then deleted. You can ask to
                see what&rsquo;s held about you, or to have it erased, at any time.
              </p>
              <p className="mt-4 text-body">
                <a
                  href={`mailto:${SITE_CONFIG.email}?subject=Privacy%20request`}
                  className="text-ink underline decoration-mist decoration-1 underline-offset-4 transition-colors duration-150 hover:decoration-signal"
                >
                  {SITE_CONFIG.email}
                </a>
              </p>
            </Reveal>
          </div>
        </div>

        <Rule className="my-12 md:my-16" />

        <Reveal>
          <MonoLabel as="p" className="mb-4">
            Third-party policies
          </MonoLabel>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              { label: "PostHog", href: "https://posthog.com/privacy" },
              { label: "Google Analytics", href: "https://policies.google.com/privacy" },
              { label: "Vercel", href: "https://vercel.com/legal/privacy-policy" },
              { label: "Resend", href: "https://resend.com/legal/privacy-policy" },
            ].map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-mono-label uppercase text-graphite transition-colors duration-150 hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}
