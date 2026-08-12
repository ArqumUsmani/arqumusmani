"use client";

import { useLayoutEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { DURATION, EASE_ENTER } from "@/lib/motion";

// `serif` marks a line for the italic accent face — same treatment as the
// About page's "actually true." (font-serif italic), not a new pattern.
// Exactly two LINES entries, deliberately — each one forces its own line
// via the block/overflow-hidden wrapper below regardless of container
// width, so the split has to be hard-coded here rather than left to wrap
// naturally at some max-width.
const LINES: { text: string; serif?: boolean }[] = [
  { text: "I design products" },
  { text: "that makes sense.", serif: true },
];

// Exported so IntroSequence.tsx can read the same signal — both decide
// "first visit this session" from one source of truth, without
// IntroSequence needing to control this component's own timing directly:
// it already starts animating on mount, IntroSequence's overlay just
// happens to be covering it for the first ~450ms.
export const SESSION_KEY = "hero-headline-played";

// Computed once at module evaluation, not inside a component effect. Two
// components (this one and IntroSequence) both need the same "already
// played" answer, and reading-then-writing sessionStorage from two
// separate effects races on whichever effect happens to fire first — in dev,
// React's Strict Mode double-invoking effects made this concrete: the
// second invocation would see the flag the first invocation had just set,
// and both components would immediately conclude "already played" on a
// genuine first visit. Module evaluation runs exactly once per page load
// (client-side navigations back to "/" reuse the already-evaluated
// module), so there's no ordering to race.
export const ALREADY_PLAYED_THIS_SESSION =
  typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY) !== null;

if (typeof window !== "undefined" && !ALREADY_PLAYED_THIS_SESSION) {
  sessionStorage.setItem(SESSION_KEY, "1");
}

const SIZE_CLASS = {
  xl: "text-display-xl max-w-[16ch]",
  l: "text-display-l max-w-[20ch]",
} as const;

type HeroHeadlineProps = {
  /** "xl" (default) for a top-anchored hero with room to breathe; "l" for
   * a bottom-anchored layout sharing the strip with a pill and a second
   * text block, plus a large portrait eating into the available width. */
  size?: keyof typeof SIZE_CLASS;
};

export function HeroHeadline({ size = "xl" }: HeroHeadlineProps) {
  // useReducedMotion() resolves to null during SSR/first paint, then to a
  // real boolean shortly after mount via its own effect — a plain derived
  // value (not state) here means this stays correct on that later
  // re-render automatically, without needing its own effect to track it.
  const reduceMotion = useReducedMotion();
  const instant = reduceMotion || ALREADY_PLAYED_THIS_SESSION;
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    setVisible(true);
  }, []);

  return (
    <h1 className={`font-display text-ink ${SIZE_CLASS[size]}`}>
      {LINES.map((line, i) => (
        <span key={line.text} className="block overflow-hidden" style={{ height:"150px"}}>
          <motion.span
            className={line.serif ? "block font-serif italic" : "block"}
            style={{ height:"150px", marginTop:"-12px"}}
            initial={{ y: "100%" }}
            animate={{ y: visible ? "0%" : "100%" }}
            transition={{
              duration: instant ? 0 : DURATION.section,
              delay: instant ? 0 : i * 0.06,
              ease: EASE_ENTER,
            }}
          >
            {line.text}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}
