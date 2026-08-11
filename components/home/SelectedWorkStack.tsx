"use client";

import { useRef } from "react";
import { ViewTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { preventOrphans } from "@/lib/typography";

export type SelectedWorkItem = {
  slug: string;
  title: string;
  domain: string;
  year: number;
  cover: string;
  thesis: string;
  metricValue: string;
  metricLabel: string;
};

function Card({ item, index }: { item: SelectedWorkItem; index: number }) {
  return (
    <Link
      href={`/work/${item.slug}`}
      className="group relative block h-full w-full overflow-hidden border border-mist bg-fog"
    >
      {/* Named to match app/work/[slug]/page.tsx's cover image and h1 —
          React's ViewTransition morphs them across the navigation where the
          browser supports it, and falls through to the site's existing
          page-enter/exit fade everywhere else (see app/template.tsx). */}
      <ViewTransition name={`work-image-${item.slug}`}>
        <Image
          src={item.cover}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 90vw"
          className="object-cover"
          priority={index === 0}
        />
      </ViewTransition>
      {/* Fixed black, not the ink/paper tokens: this scrim exists because of
          the photo underneath it, not the site's theme — ink/paper invert
          in dark mode, which would flip this into a light overlay with
          illegible dark text. A photo's own scrim should never do that. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
        <div className="flex items-center gap-4">
          <MonoLabel className="text-white/70">{String(index + 1).padStart(2, "0")}</MonoLabel>
          <MonoLabel className="text-white/70">
            {item.domain} · {item.year}
          </MonoLabel>
        </div>
        <ViewTransition name={`work-title-${item.slug}`}>
          <h2 className="mt-4 max-w-[18ch] text-display-l text-white transition-colors duration-300 group-hover:text-signal">
            {preventOrphans(item.title)}
          </h2>
        </ViewTransition>
        <p className="mt-3 max-w-[52ch] text-body text-white/80">{item.thesis}</p>
        <div className="mt-6">
          <p className="text-display-xl tabular-nums text-white">{item.metricValue}</p>
          <MonoLabel className="mt-1 text-white/70">{item.metricLabel}</MonoLabel>
        </div>
      </div>
    </Link>
  );
}

function StickyCard({ item, index, total }: { item: SelectedWorkItem; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isLast = index === total - 1;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.85]);

  // The last card has nothing to make way for, so it doesn't get the extra
  // 100/110vh scroll runway the others use to hold themselves pinned while
  // the next card slides up and over — that runway on the last card was
  // dead scroll distance with no visual change, which reads as the page
  // being stuck right before the next section.
  if (isLast) {
    return (
      <div ref={ref} className="relative h-[70vh] md:h-[75vh]">
        <Card item={item} index={index} />
      </div>
    );
  }

  return (
    <div ref={ref} className="relative h-[100vh] md:h-[110vh]">
      <div className="sticky top-20 h-[70vh] md:top-24 md:h-[75vh]" style={{ zIndex: index }}>
        <motion.div className="h-full w-full" style={{ scale, opacity }}>
          <Card item={item} index={index} />
        </motion.div>
      </div>
    </div>
  );
}

export function SelectedWorkStack({ items }: { items: SelectedWorkItem[] }) {
  const reduceMotion = useReducedMotion();

  // No sticky, no scroll tracking, no transforms — a plain stacked list.
  if (reduceMotion) {
    return (
      <div className="flex flex-col gap-8">
        {items.map((item, i) => (
          <div key={item.slug} className="h-[70vh] md:h-[75vh]">
            <Card item={item} index={i} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      {items.map((item, i) => (
        <StickyCard key={item.slug} item={item} index={i} total={items.length} />
      ))}
    </div>
  );
}
