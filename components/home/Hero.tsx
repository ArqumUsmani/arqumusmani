"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Container } from "@/components/primitives/Container";
import { Reveal } from "@/components/primitives/Reveal";
// import { AvailabilityPill } from "@/components/layout/AvailabilityPill";
import { HeroHeadline } from "@/components/home/HeroHeadline";
import { EXPERIENCE_YEARS, SITE_CONFIG } from "@/lib/site-config";
import portraitSrc from "@/public/about/Side.png";

// The portrait as a large right-aligned backdrop — sized to its own aspect
// ratio (so the head-and-shoulders silhouette survives intact) and pinned
// to the right edge rather than centered, with the text block sitting in
// the empty space to its left. No overlap between the two, so no glass/blur
// treatment is needed here — that was only ever for a composition where
// text sat on top of the photo. Radially masked so the edges dissolve
// rather than ending on a hard rectangle. Scales up (not down) on scroll —
// a slow parallax zoom, disabled under reduced motion.
const PORTRAIT_ASPECT = 1236 / 2160;
const PORTRAIT_MASK =
  "radial-gradient(ellipse 82% 92% at 62% 38%, black 62%, color-mix(in srgb, black 45%, transparent) 84%, transparent 100%)";

function PortraitBackdrop({ scale }: { scale: ReturnType<typeof useTransform<number, number>> }) {
  return (
    <motion.div className="absolute top-0 right-0 h-[118%]" style={{ scale, aspectRatio: PORTRAIT_ASPECT }}>
      <Image
        src={portraitSrc}
        alt="Portrait of Arqum Usmani"
        fill
        priority
        sizes="(max-width: 768px) 95vw, 55vw"
        className="object-contain object-top"
        style={{ maskImage: PORTRAIT_MASK, WebkitMaskImage: PORTRAIT_MASK }}
      />
    </motion.div>
  );
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 1.15]);

  return (
    <div ref={ref} className="absolute inset-0">
      <PortraitBackdrop scale={scale} />

      <div className="relative z-10 flex h-full flex-col justify-end pb-10 md:pb-14">
        <Container>
          {/* gap-16 between the two blocks, not justify-between stretching
              the second one to the container's right edge — the portrait
              is right-aligned now, and pinning the proof-text column to
              the same edge put both in the same strip of screen. */}
          <div className="flex flex-col gap-10 md:flex-col md:items-start md:gap-0">
            {/* No max-w on this wrapper — "ch" here would resolve against
                the body font-size (~17px), not the headline's own much
                larger display size, so it'd cap out narrower in real pixels
                than the headline needs and wrap it anyway. HeroHeadline's
                own max-w (computed at its own font-size) is where that
                constraint actually belongs. */}
            <div>
              <Reveal inView={false}>
                {/* <AvailabilityPill /> */}
              </Reveal>
              <div className="mt-6">
                <HeroHeadline size="l" />
              </div>
            </div>

            {/* md:pb-14 lifts this column off the shared bottom baseline —
                the proof line + CTAs sit noticeably higher than the pill +
                headline rather than flush with them. */}
            <div className="max-w-[50ch]">
              <Reveal inView={false} index={1}>
                <p className="text-body-m text-graphite">
                  Product Designer with {EXPERIENCE_YEARS}+ years building AI, SaaS, ERP and
                  Healthcare platforms. From AI assistants to enterprise systems, helping startups
                  and enterprises transform complexity into intuitive digital experiences.
                </p>
              </Reveal>
              <Reveal inView={false} index={2} className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  href="/work"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-ink px-7 py-4 font-mono text-mono-label uppercase text-paper transition-colors duration-300 hover:bg-graphite"
                >
                  View work
                </Link>
                <a
                  href={`mailto:${SITE_CONFIG.email}?subject=Full-time%20role`}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-mist px-7 py-4 font-mono text-mono-label uppercase text-ink transition-colors duration-300 hover:border-ink"
                >
                  Hire me
                </a>
              </Reveal>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
