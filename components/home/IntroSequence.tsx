"use client";

import { useLayoutEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { DURATION, EASE_ENTER, EASE_EXIT } from "@/lib/motion";
import { ALREADY_PLAYED_THIS_SESSION } from "@/components/home/HeroHeadline";

const HOLD_MS = 500; // minimum time before the exit collapse is allowed to start
const HARD_CEILING_MS = 1200; // absolute cap regardless of font-load timing

type Phase = "pending" | "hold" | "exit" | "done";

// The one-time first-visit intro: full black, "Arqum Usmani" blur-fades in
// centered, holds briefly, then the whole panel shrinks and blurs away to
// reveal the hero underneath — which has been rendering (and painting, for
// LCP purposes) the entire time. True black (not the paper/ink tokens,
// which would render near-white in light mode) — a deliberate one-off
// brand moment, same category as the footer's rounded-2rem card. Renders
// nothing at all past the very first check for every subsequent page view
// this session.
export function IntroSequence() {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("pending");

  useLayoutEffect(() => {
    const arrivedAtAnchor = window.location.hash.length > 0;

    if (reduceMotion || ALREADY_PLAYED_THIS_SESSION || arrivedAtAnchor) {
      setPhase("done");
      return;
    }

    setPhase("hold");

    let dismissed = false;
    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      setPhase("exit");
    };

    // Any real interaction skips straight to the exit collapse, with no
    // floor — a recruiter in a hurry should never be made to wait out an
    // animation on purpose.
    window.addEventListener("scroll", dismiss, { passive: true, once: true });
    window.addEventListener("click", dismiss, { once: true });
    window.addEventListener("keydown", dismiss, { once: true });

    // The natural (non-user-forced) completion path waits for fonts AND the
    // minimum hold time, whichever is later — document.fonts.ready alone
    // resolves near-instantly once fonts are cached (true on every repeat
    // localhost load), which would skip the hold entirely rather than
    // actually gate on it.
    const minHold = new Promise<void>((resolve) => setTimeout(resolve, HOLD_MS));
    const naturalCompletion = Promise.all([document.fonts.ready, minHold]).then(dismiss);
    const hardCeiling = setTimeout(() => setPhase("done"), HARD_CEILING_MS);

    return () => {
      window.removeEventListener("scroll", dismiss);
      window.removeEventListener("click", dismiss);
      window.removeEventListener("keydown", dismiss);
      clearTimeout(hardCeiling);
      void naturalCompletion;
    };
  }, [reduceMotion]);

  if (phase === "pending" || phase === "done") return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black"
      initial={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      animate={
        phase === "exit"
          ? { opacity: 0, scale: 0.92, filter: "blur(20px)" }
          : { opacity: 1, scale: 1, filter: "blur(0px)" }
      }
      transition={{ duration: DURATION.section, ease: EASE_EXIT }}
      onAnimationComplete={() => {
        if (phase === "exit") setPhase("done");
      }}
    >
      <motion.span
        className="font-display text-display-m text-white"
        initial={{ opacity: 0, filter: "blur(8px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: DURATION.element, ease: EASE_ENTER }}
      >
        Arqum Usmani
      </motion.span>
    </motion.div>
  );
}
