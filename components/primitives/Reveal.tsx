"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { cn } from "@/lib/cn";
import { DURATION, EASE_ENTER, RISE_PX } from "@/lib/motion";

type RevealProps = React.ComponentProps<typeof motion.div> & {
  /** Position within a group of siblings — multiplied by 60ms for stagger. */
  index?: number;
  /**
   * false animates on mount instead of on scroll-into-view. Use only for
   * content that's guaranteed to already be on screen at first paint (e.g.
   * the hero) — whileInView's IntersectionObserver round-trip measurably
   * delays LCP for content that never needed a scroll trigger to begin with.
   * Defaults to true, matching every other call site's scroll-reveal behavior.
   */
  inView?: boolean;
};

export function Reveal({ className, index = 0, inView = true, ...props }: RevealProps) {
  const reduceMotion = useReducedMotion();

  const variants: Variants = reduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0, y: RISE_PX }, visible: { opacity: 1, y: 0 } };

  const viewportProps = inView
    ? { whileInView: "visible", viewport: { once: true, margin: "-80px" } }
    : { animate: "visible" };

  return (
    <motion.div
      initial="hidden"
      {...viewportProps}
      variants={variants}
      transition={{
        duration: reduceMotion ? 0 : DURATION.section,
        delay: reduceMotion ? 0 : index * 0.06,
        ease: EASE_ENTER,
      }}
      className={cn(className)}
      {...props}
    />
  );
}
