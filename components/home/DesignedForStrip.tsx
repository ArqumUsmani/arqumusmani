"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { DURATION, EASE_ENTER } from "@/lib/motion";

export type DesignedForCompany = {
  org: string;
  logoSrc: string;
  role: string;
  period: string;
  owned: string;
  metricValue?: string;
  metricLabel?: string;
  caseStudyHref?: string;
};

function DetailBody({ company }: { company: DesignedForCompany }) {
  return (
    <>
      <p className="font-mono text-mono-label uppercase text-ash">
        {company.role} · {company.period}
      </p>
      <p className="mt-3 max-w-[52ch] text-body text-graphite">{company.owned}</p>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        {company.metricValue ? (
          <div>
            <p className="text-display-m tabular-nums text-ink">{company.metricValue}</p>
            <p className="mt-1 font-mono text-mono-label uppercase text-ash">{company.metricLabel}</p>
          </div>
        ) : (
          <p className="font-mono text-mono-label uppercase text-ash">No public case study</p>
        )}
        {company.caseStudyHref && (
          <Link
            href={company.caseStudyHref}
            className="font-mono text-mono-label uppercase text-ink underline decoration-mist decoration-1 underline-offset-4 transition-colors duration-300 hover:decoration-signal"
          >
            View case study →
          </Link>
        )}
      </div>
    </>
  );
}

export function DesignedForStrip({ companies }: { companies: DesignedForCompany[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const active = companies[activeIndex];

  return (
    <div>
      {/* Desktop / hover-capable: logo row + one shared detail panel below. */}
      <div className="hidden md:block">
        <div
          role="list"
          className="flex flex-wrap items-center gap-x-10 gap-y-6"
          onMouseLeave={() => {
            /* Intentionally not resetting activeIndex — the panel stays on
               the last company you looked at instead of going blank. */
          }}
        >
          {companies.map((company, i) => (
            // role="listitem" belongs on this wrapper, not the <button> itself —
            // aria-pressed (toggle-button semantics) isn't a supported property
            // on the listitem role, so the two can't share one element.
            <div key={company.org} role="listitem">
              <button
                type="button"
                aria-label={`${company.org}, ${company.role}`}
                aria-pressed={i === activeIndex}
                onMouseEnter={() => setActiveIndex(i)}
                onFocus={() => setActiveIndex(i)}
                className="opacity-45 grayscale transition-[opacity,filter] duration-300 hover:opacity-100 hover:grayscale-0 focus-visible:opacity-100 focus-visible:grayscale-0 data-[active=true]:opacity-100 data-[active=true]:grayscale-0"
                data-active={i === activeIndex}
              >
                <Image src={company.logoSrc} alt="" width={200} height={48} className="h-6 w-auto md:h-7" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-mist pt-8" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.org}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: reduceMotion ? 0 : DURATION.element, ease: EASE_ENTER }}
            >
              <DetailBody company={active} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile / no hover: horizontally scrollable cards, detail baked in. */}
      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:hidden">
        {companies.map((company) => (
          <div
            key={company.org}
            className={cn(
              "w-[82vw] shrink-0 snap-center border border-mist bg-fog p-6",
              "flex flex-col",
            )}
          >
            <Image src={company.logoSrc} alt={company.org} width={200} height={48} className="h-6 w-auto" />
            <div className="mt-6">
              <DetailBody company={company} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
