"use client";

import { useLayoutEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const LINES = ["I design product experiences", "in healthcare, AI, and SaaS —", "and I build them."];

const EASE_SIGNATURE = [0.16, 1, 0.3, 1] as const;
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
              duration: instant ? 0 : 0.6,
              delay: instant ? 0 : i * 0.06,
              ease: EASE_SIGNATURE,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}
