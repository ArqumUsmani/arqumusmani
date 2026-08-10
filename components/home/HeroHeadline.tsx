"use client";

import { useLayoutEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { DURATION, EASE_ENTER } from "@/lib/motion";

const LINES = ["I design product experiences", "in healthcare, AI, and SaaS,", "and I build them."];

const SESSION_KEY = "hero-headline-played";

export function HeroHeadline() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [instant, setInstant] = useState(false);

  useLayoutEffect(() => {
    const alreadyPlayed = reduceMotion || sessionStorage.getItem(SESSION_KEY);
    if (alreadyPlayed) {
      setInstant(true);
    } else {
      sessionStorage.setItem(SESSION_KEY, "1");
    }
    setVisible(true);
  }, [reduceMotion]);

  return (
    <h1 className="max-w-[20ch] text-display-xl text-ink">
      {LINES.map((line, i) => (
        <span key={line} className="block overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: "100%" }}
            animate={{ y: visible ? "0%" : "100%" }}
            transition={{
              duration: instant ? 0 : DURATION.section,
              delay: instant ? 0 : i * 0.06,
              ease: EASE_ENTER,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}
