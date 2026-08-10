"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useReducedMotion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/cn";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { DURATION, EASE_ENTER } from "@/lib/motion";

export type WorkIndexItem = {
  slug: string;
  title: string;
  domain: string;
  year: number;
  cover: string;
  outcomeValue: string;
  outcomeLabel: string;
  thesis: string;
};

type WorkIndexProps = {
  items: WorkIndexItem[];
};

export function WorkIndex({ items }: WorkIndexProps) {
  const domains = useMemo(() => {
    const unique = Array.from(new Set(items.map((item) => item.domain)));
    return ["All", ...unique];
  }, [items]);

  const [activeDomain, setActiveDomain] = useState("All");
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  // Damped, not floaty: heavier mass than Motion's default gives the preview
  // real inertia behind the cursor; damping ratio ~0.87 (near-critical) lets
  // it settle firmly with a hair of give instead of snapping dead-stop.
  const springX = useSpring(mouseX, { stiffness: 160, damping: 22, mass: 1 });
  const springY = useSpring(mouseY, { stiffness: 160, damping: 22, mass: 1 });

  const filtered = activeDomain === "All" ? items : items.filter((item) => item.domain === activeDomain);
  const hoveredItem = filtered.find((item) => item.slug === hoveredSlug) ?? null;

  return (
    <div
      className="relative"
      onMouseMove={(event) => {
        mouseX.set(event.clientX);
        mouseY.set(event.clientY);
      }}
    >
      <div className="mb-12 flex flex-wrap gap-x-6 gap-y-3 md:mb-16" role="group" aria-label="Filter by domain">
        {domains.map((domain) => (
          <button
            key={domain}
            type="button"
            onClick={() => setActiveDomain(domain)}
            aria-pressed={activeDomain === domain}
            className={cn(
              "font-mono text-mono-label uppercase transition-colors duration-300",
              activeDomain === domain ? "text-signal" : "text-ash hover:text-ink",
            )}
          >
            {domain}
          </button>
        ))}
      </div>

      <div role="list">
        {filtered.map((item) => (
          // role="listitem" belongs on this wrapper, not the <a> itself —
          // overriding a link's implicit role strips its link semantics
          // from the accessibility tree, even though it still behaves like one.
          <div key={item.slug} role="listitem">
            <Link
              href={`/work/${item.slug}`}
              onMouseEnter={() => setHoveredSlug(item.slug)}
              onMouseLeave={() => setHoveredSlug((current) => (current === item.slug ? null : current))}
              className="group block border-t border-mist py-6 last:border-b md:py-0"
            >
              {/* Desktop ledger row */}
              <div className="hidden items-center gap-6 py-7 md:grid md:grid-cols-12">
                <span
                  className={cn(
                    "col-span-1 font-mono text-mono-label transition-colors duration-300",
                    hoveredSlug === item.slug ? "text-signal" : "text-ash",
                  )}
                >
                  {String(item.year)}
                </span>
                <span
                  className={cn(
                    "col-span-5 text-body-l transition-colors duration-300",
                    hoveredSlug === item.slug ? "text-signal" : "text-ink",
                  )}
                >
                  {item.title}
                </span>
                <span
                  className={cn(
                    "col-span-2 font-mono text-mono-label uppercase transition-colors duration-300",
                    hoveredSlug === item.slug ? "text-signal" : "text-ash",
                  )}
                >
                  {item.domain}
                </span>
                <span
                  className={cn(
                    "col-span-3 text-body tabular-nums transition-colors duration-300",
                    hoveredSlug === item.slug ? "text-signal" : "text-graphite",
                  )}
                >
                  {item.outcomeValue} {item.outcomeLabel}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "col-span-1 flex justify-end text-body transition-all duration-300",
                    hoveredSlug === item.slug ? "translate-x-1 text-signal" : "text-ash",
                  )}
                >
                  →
                </span>
              </div>

              {/* Mobile stacked card */}
              <div className="flex gap-4 md:hidden">
                <div className="h-20 w-28 shrink-0 border border-mist bg-fog">
                  <Image
                    src={item.cover}
                    alt=""
                    width={280}
                    height={175}
                    sizes="112px"
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <MonoLabel className="text-ash">{item.domain}</MonoLabel>
                    <MonoLabel className="text-ash">{String(item.year)}</MonoLabel>
                  </div>
                  <p className="mt-2 text-body-l text-ink">{item.title}</p>
                  <p className="mt-1 text-body-s tabular-nums text-graphite">
                    {item.outcomeValue} {item.outcomeLabel}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Cursor-following preview, desktop only */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-30 hidden w-[360px] -translate-x-1/2 translate-y-6 overflow-hidden border border-mist bg-paper shadow-[0_20px_50px_-20px_rgba(0,0,0,0.35)] md:block"
        style={{ x: reduceMotion ? mouseX : springX, y: reduceMotion ? mouseY : springY }}
        initial={false}
        animate={{ opacity: hoveredItem ? 1 : 0, scale: reduceMotion || hoveredItem ? 1 : 0.97 }}
        transition={{ duration: reduceMotion ? 0 : DURATION.element, ease: EASE_ENTER }}
      >
        <AnimatePresence mode="wait">
          {hoveredItem && (
            <motion.div
              key={hoveredItem.slug}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : DURATION.element, ease: EASE_ENTER }}
            >
              <Image
                src={hoveredItem.cover}
                alt=""
                width={720}
                height={450}
                sizes="360px"
                loading="lazy"
                className="h-[225px] w-full object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
