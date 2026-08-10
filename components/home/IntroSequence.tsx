"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion, animate as animateValue } from "motion/react";
import { DURATION, EASE_ENTER, EASE_EXIT } from "@/lib/motion";
import { SESSION_KEY } from "@/components/home/HeroHeadline";

const HOLD_MS = 450; // progress-fill phase, before the wordmark travels
const HARD_CEILING_MS = 1200; // absolute cap regardless of font-load timing

type Phase = "pending" | "hold" | "travel" | "done";

// The one-time first-visit intro: a centered wordmark and progress rule
// hold briefly, then the wordmark travels to the real header logo's
// measured position while the overlay fades — revealing the hero
// underneath, which has been rendering (and painting, for LCP purposes)
// the entire time. Renders nothing at all past the very first check for
// every subsequent page view this session.
export function IntroSequence() {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("pending");
  const wordmarkRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const alreadyPlayed = sessionStorage.getItem(SESSION_KEY);
    const arrivedAtAnchor = window.location.hash.length > 0;

    if (reduceMotion || alreadyPlayed || arrivedAtAnchor) {
      setPhase("done");
      return;
    }

    setPhase("hold");

    let dismissed = false;
    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      setPhase("travel");
    };

    // Any real interaction skips straight to the travel phase, with no
    // floor — a recruiter in a hurry should never be made to wait out an
    // animation on purpose.
    window.addEventListener("scroll", dismiss, { passive: true, once: true });
    window.addEventListener("click", dismiss, { once: true });
    window.addEventListener("keydown", dismiss, { once: true });

    // The natural (non-user-forced) completion path waits for fonts AND the
    // minimum hold time, whichever is later — document.fonts.ready alone
    // resolves near-instantly once fonts are cached (true on every repeat
    // localhost load), which would skip the progress-fill visual entirely
    // rather than actually gate on it.
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

  useLayoutEffect(() => {
    if (phase !== "travel") return;

    const target = document.querySelector<HTMLElement>('header a[href="/"]');
    const source = wordmarkRef.current;
    if (!target || !source) {
      setPhase("done");
      return;
    }

    const targetRect = target.getBoundingClientRect();
    const sourceRect = source.getBoundingClientRect();
    const dx = targetRect.left + targetRect.width / 2 - (sourceRect.left + sourceRect.width / 2);
    const dy = targetRect.top + targetRect.height / 2 - (sourceRect.top + sourceRect.height / 2);
    const scale = targetRect.height / sourceRect.height;

    const controls = animateValue(
      source,
      { x: [0, dx], y: [0, dy], scale: [1, scale], opacity: [1, 0] },
      { duration: DURATION.section, ease: EASE_EXIT },
    );
    const timeout = setTimeout(() => setPhase("done"), DURATION.section * 1000);

    return () => {
      controls.stop();
      clearTimeout(timeout);
    };
  }, [phase]);

  if (phase === "pending" || phase === "done") return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-paper"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "travel" ? 0 : 1 }}
      transition={{ duration: DURATION.element, ease: EASE_EXIT }}
      onAnimationComplete={() => {
        if (phase === "travel") setPhase("done");
      }}
    >
      <div className="flex flex-col items-center gap-4">
        <span ref={wordmarkRef} className="text-display-m text-ink">
          Arqum Usmani
        </span>
        <div className="h-px w-32 overflow-hidden bg-mist">
          <motion.div
            ref={progressRef}
            className="h-full w-full origin-left bg-ink"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: HOLD_MS / 1000, ease: EASE_ENTER }}
          />
        </div>
      </div>
    </motion.div>
  );
}
