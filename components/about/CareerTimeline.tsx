"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/primitives/Reveal";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { cn } from "@/lib/cn";

export type TimelineEntry = {
  org: string;
  period: string;
  role: string;
  scope?: string;
  outcomeValue?: string;
  outcomeLabel?: string;
};

// Scrollspy: whichever row crosses the vertical center of the viewport
// becomes "active" and the rest dim, same one-active-at-a-time state shape
// DesignedForStrip already uses for its hover strip. A centered rootMargin
// band (rather than threshold on the full element) is what makes a tall
// row register as active exactly when it's the one actually being read,
// not the instant its top edge appears.
export function CareerTimeline({ entries }: { entries: TimelineEntry[] }) {
  const [activeOrg, setActiveOrg] = useState<string | null>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (observerEntries) => {
        for (const observerEntry of observerEntries) {
          if (observerEntry.isIntersecting) {
            setActiveOrg(observerEntry.target.getAttribute("data-org"));
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    for (const row of rowRefs.current) {
      if (row) observer.observe(row);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {entries.map((entry, i) => {
        const active = entry.org === activeOrg;

        return (
          <div
            key={entry.org}
            ref={(el) => {
              rowRefs.current[i] = el;
            }}
            data-org={entry.org}
            className="relative border-t border-mist pl-5 last:border-b"
          >
            <span
              aria-hidden="true"
              className={cn(
                "absolute left-0 top-6 h-[calc(100%-3rem)] w-0.5 origin-top bg-signal transition-opacity duration-300 md:top-8 md:h-[calc(100%-4rem)]",
                active ? "opacity-100" : "opacity-0",
              )}
            />
            <Reveal index={i} className="grid grid-cols-4 gap-6 py-6 md:grid-cols-12 md:gap-8 md:py-8">
              <MonoLabel
                className={cn(
                  "col-span-4 self-start transition-colors duration-300 md:col-span-3",
                  active ? "text-ink" : "text-ash",
                )}
              >
                {entry.period}
              </MonoLabel>
              <p
                className={cn(
                  "col-span-4 text-body-l transition-colors duration-300 md:col-span-4",
                  active ? "text-ink" : "text-graphite",
                )}
              >
                {entry.org}
              </p>
              <div className="col-span-4 md:col-span-3">
                <p className={cn("text-body transition-colors duration-300", active ? "text-ink" : "text-graphite")}>
                  {entry.role}
                </p>
                {entry.scope && <p className="mt-2 text-body-s text-ash">{entry.scope}</p>}
              </div>
              <div className="col-span-4 md:col-span-2">
                {entry.outcomeValue ? (
                  <>
                    <p className="text-display-m tabular-nums text-ink">{entry.outcomeValue}</p>
                    <p className="mt-1 font-mono text-mono-label uppercase text-ash">{entry.outcomeLabel}</p>
                  </>
                ) : (
                  <p className="font-mono text-mono-label uppercase text-ash">No public case study</p>
                )}
              </div>
            </Reveal>
          </div>
        );
      })}
    </div>
  );
}
