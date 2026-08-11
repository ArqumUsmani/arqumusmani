"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { EASE_ENTER, RISE_PX } from "@/lib/motion";

export type Tool = {
  name: string;
  logoSrc: string;
};

// A fixed 40ms-per-tile stagger and one-time reveal — distinct from the
// shared Reveal primitive, which now replays on every scroll re-entry
// (site-wide) and steps at 60ms. A grid of a dozen small tiles re-animating
// every time it crosses the viewport reads as noise, not craft; once is enough.
export function ToolGrid({ tools }: { tools: Tool[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {tools.map((tool, i) => (
        <motion.li
          key={tool.name}
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: RISE_PX }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            duration: reduceMotion ? 0 : 0.5,
            delay: reduceMotion ? 0 : i * 0.04,
            ease: EASE_ENTER,
          }}
          className="flex items-center gap-3 border border-mist bg-fog px-4 py-3"
        >
          <Image
            src={tool.logoSrc}
            alt=""
            width={20}
            height={20}
            className="h-5 w-5 shrink-0 object-contain dark:invert"
          />
          <span className="text-body-s text-graphite">{tool.name}</span>
        </motion.li>
      ))}
    </ul>
  );
}
