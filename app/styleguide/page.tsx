import type { Metadata } from "next";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Grid } from "@/components/primitives/Grid";
import { Reveal } from "@/components/primitives/Reveal";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { Rule } from "@/components/primitives/Rule";
import { ArrowLink } from "@/components/primitives/ArrowLink";

export const metadata: Metadata = {
  title: "Styleguide",
  description: "Design tokens, type scale, and primitives for the Arqum Usmani portfolio system.",
  robots: {
    index: false,
    follow: false,
  },
};

const COLORS = [
  { name: "Paper", token: "paper", hex: "#FAFAF8", onClassName: "text-ink" },
  { name: "Ink", token: "ink", hex: "#0B0B0B", onClassName: "text-paper" },
  { name: "Graphite", token: "graphite", hex: "#3D3D3B", onClassName: "text-paper" },
  { name: "Ash", token: "ash", hex: "#6E6E6A", onClassName: "text-paper" },
  { name: "Mist", token: "mist", hex: "#C9C9C4", onClassName: "text-ink" },
  { name: "Fog", token: "fog", hex: "#EFEFEC", onClassName: "text-ink" },
  { name: "Signal", token: "signal", hex: "#B4531F", onClassName: "text-paper" },
] as const;

const TYPE_STEPS = [
  { name: "Display XL", token: "text-display-xl", className: "text-display-xl", sample: "Design & code" },
  { name: "Display L", token: "text-display-l", className: "text-display-l", sample: "Design & code" },
  { name: "Display M", token: "text-display-m", className: "text-display-m", sample: "Design & code" },
  { name: "Body L", token: "text-body-l", className: "text-body-l max-w-[68ch]", sample: "Product design isn't a deliverable, it's a discipline that shows up in the density of a spacing scale and the restraint of an accent colour." },
  { name: "Body", token: "text-body", className: "text-body max-w-[68ch]", sample: "Product design isn't a deliverable, it's a discipline that shows up in the density of a spacing scale and the restraint of an accent colour." },
  { name: "Body S", token: "text-body-s", className: "text-body-s max-w-[68ch]", sample: "Product design isn't a deliverable, it's a discipline that shows up in the density of a spacing scale and the restraint of an accent colour." },
  { name: "Mono Label", token: "text-mono-label", className: "font-mono text-mono-label uppercase", sample: "Section index / 01" },
] as const;

const SPACING_STEPS = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256];

export default function StyleguidePage() {
  return (
    <>
      <Section
        spec={{ index: "01 / INTRO", type: "display-xl · 500", space: "160 / 96" }}
        className="pt-16 md:pt-24"
      >
        <Container>
          <Reveal inView={false}>
            <MonoLabel as="p" className="mb-6">
              Design system
            </MonoLabel>
            <h1 className="max-w-[14ch] text-display-xl text-ink">Styleguide</h1>
            <p className="mt-8 max-w-[60ch] text-body-l text-graphite">
              Every token, type step, and primitive this site is built from — inspectable
              the way Figma inspects a frame.
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section
        spec={{ index: "02 / COLOUR", type: "mono-label · 500", grid: "7 col · 24 gutter", space: "96 / 96" }}
      >
        <Container>
          <Reveal>
            <MonoLabel as="p" className="mb-8">
              02 — Colour
            </MonoLabel>
          </Reveal>
          <Grid>
            {COLORS.map((color, i) => (
              <Reveal key={color.token} index={i} className="col-span-4 md:col-span-3">
                <div
                  className={`flex h-32 items-end p-4 ${color.onClassName}`}
                  style={{ backgroundColor: color.hex }}
                >
                  <span className="font-mono text-mono-label uppercase">{color.token}</span>
                </div>
                <p className="mt-3 text-body-s text-graphite">{color.name}</p>
                <p className="font-mono text-mono-label text-ash">{color.hex}</p>
              </Reveal>
            ))}
          </Grid>
          <Reveal className="mt-8">
            <p className="max-w-[60ch] text-body-s text-ash">
              Signal Ochre is disciplined to under 2% of any viewport — hover underlines,
              focus rings, the availability dot, active nav state, and key-insight markers only.
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section
        spec={{ index: "03 / TYPE", type: "display-l → mono-label", grid: "12 col · 32 gutter", space: "96 / 96" }}
      >
        <Container>
          <Reveal>
            <MonoLabel as="p" className="mb-8">
              03 — Type scale
            </MonoLabel>
          </Reveal>
          <div className="space-y-12">
            {TYPE_STEPS.map((step, i) => (
              <Reveal key={step.name} index={i}>
                <div className="mb-3 flex items-baseline justify-between">
                  <MonoLabel>{step.name}</MonoLabel>
                  <MonoLabel className="text-ash">{step.token}</MonoLabel>
                </div>
                <p className={step.className + " text-ink"}>{step.sample}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section
        spec={{ index: "04 / SPACE", type: "mono-label · 500", grid: "12 col · 32 gutter", space: "4px base" }}
      >
        <Container>
          <Reveal>
            <MonoLabel as="p" className="mb-8">
              04 — Spacing (4px base)
            </MonoLabel>
          </Reveal>
          <div className="space-y-3">
            {SPACING_STEPS.map((step, i) => (
              <Reveal key={step} index={i} className="flex items-center gap-4">
                <span className="w-12 shrink-0 font-mono text-mono-label text-ash">{step}px</span>
                <div className="h-3 bg-fog" style={{ width: `${step}px` }} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section
        spec={{ index: "05 / RADIUS", type: "2px ceiling", space: "96 / 96" }}
      >
        <Container>
          <Reveal>
            <MonoLabel as="p" className="mb-8">
              05 — Radius
            </MonoLabel>
          </Reveal>
          <Reveal className="flex flex-wrap items-center gap-8">
            <div className="flex flex-col items-start gap-3">
              <div className="h-16 w-16 rounded-sm bg-fog" />
              <MonoLabel className="text-ash">2px · surfaces</MonoLabel>
            </div>
            <div className="flex flex-col items-start gap-3">
              <div className="h-3 w-3 rounded-full bg-signal" />
              <MonoLabel className="text-ash">full · status dot only</MonoLabel>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section
        spec={{ index: "06 / PRIMITIVES", type: "body · 400", grid: "12 col · 32 gutter", space: "96 / 96" }}
      >
        <Container>
          <Reveal>
            <MonoLabel as="p" className="mb-8">
              06 — Primitives
            </MonoLabel>
          </Reveal>

          <Reveal className="mb-12">
            <MonoLabel className="mb-4 block">Grid — 12 col, 24/32 gutter</MonoLabel>
            <Grid>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="col-span-1 h-16 bg-fog" />
              ))}
            </Grid>
          </Reveal>

          <Reveal className="mb-12">
            <MonoLabel className="mb-4 block">Rule</MonoLabel>
            <Rule />
          </Reveal>

          <Reveal className="mb-12">
            <MonoLabel className="mb-4 block">ArrowLink</MonoLabel>
            <ArrowLink href="/work">View selected work</ArrowLink>
          </Reveal>

          <Reveal>
            <MonoLabel className="mb-4 block">Reveal — scroll back up and down to replay</MonoLabel>
            <p className="max-w-[60ch] text-body text-graphite">
              Opacity 0→1, translateY 16px→0, 600ms, 60ms stagger between siblings,
              single easing curve everywhere. Reduces to an instant opacity change under
              prefers-reduced-motion.
            </p>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
