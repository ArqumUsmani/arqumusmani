"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Skipped entirely under prefers-reduced-motion: smoothing is a motion
// effect, and native scroll is the correct fallback, not just a degraded one.
//
// Lenis drives its own requestAnimationFrame loop (not GSAP's ticker — that
// coupling was implicated in an earlier scroll-stall bug). ScrollTrigger is
// just a passive listener on Lenis's scroll event so components like
// SplitText stay in sync with the smoothed position.
export function SmoothScroll() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const lenis = new Lenis({
      duration: 0.7,
      easing: (t: number) => 1 - Math.pow(1 - t, 2),
      wheelMultiplier: 1,
    });

    lenis.on("scroll", ScrollTrigger.update);

    let frameId: number;
    function raf(time: number) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }
    frameId = requestAnimationFrame(raf);

    // Lenis measures the page's scrollable height once on init. Content
    // that restructures the DOM after that — fonts finishing load,
    // SplitText wrapping every character in its own element, images
    // resolving their intrinsic size — changes the real document height
    // without Lenis knowing, so its cached bounds go stale and it can clamp
    // scrolling short of the actual bottom (e.g. About never quite reaching
    // the footer). Watching <body>, not <html>, is what actually catches
    // that: <html> is pinned to `h-full` (100% of the viewport) in the root
    // layout, so its own box never grows no matter how tall the content
    // gets — a ResizeObserver on it only ever fires on real viewport
    // resizes. <body> uses `min-h-full` instead, so its box genuinely grows
    // with content, and re-measuring on every change keeps Lenis (and
    // ScrollTrigger's own trigger positions) honest.
    const resizeObserver = new ResizeObserver(() => {
      lenis.resize();
      ScrollTrigger.refresh();
    });
    resizeObserver.observe(document.body);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  return null;
}
