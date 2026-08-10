"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { SpecRailValues } from "@/components/primitives/Section";
import { DURATION, EASE_ENTER } from "@/lib/motion";

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function readSpec(el: Element): SpecRailValues | null {
  const raw = el.getAttribute("data-spec-rail");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SpecRailValues;
  } catch {
    return null;
  }
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=31536000; samesite=lax`;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="w-10 shrink-0">{label}</span>
      <span>{value}</span>
    </div>
  );
}

// Design-spec debug overlay — dev tooling, not a feature. Off by default in
// production; opt back in per-session with ?spec=1 (e.g. for a design review
// on the live site) without needing a separate deploy.
const IS_PRODUCTION = process.env.NODE_ENV === "production";

export function SpecRail() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [activeSpec, setActiveSpec] = useState<SpecRailValues | null>(null);
  const [enabled, setEnabled] = useState(!IS_PRODUCTION);

  useEffect(() => {
    if (readCookie("spec-rail") === "off") setVisible(false);
  }, []);

  useEffect(() => {
    if (IS_PRODUCTION && new URLSearchParams(window.location.search).get("spec") === "1") {
      setEnabled(true);
    }
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("[data-spec-rail]"));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (intersecting) {
          setActiveSpec(readSpec(intersecting.target));
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  if (!enabled || reduceMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="group fixed top-1/2 z-40 hidden -translate-y-1/2 select-none xl:block"
      style={{ right: "clamp(1rem, 2vw, 4rem)" }}
    >
      {visible && (
        <div className="w-[150px] font-mono text-[10px] leading-relaxed text-ash transition-colors duration-300 group-hover:text-ink">
          <AnimatePresence mode="wait">
            {activeSpec && (
              <motion.div
                key={activeSpec.index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DURATION.element, ease: EASE_ENTER }}
              >
                <p className="mb-2 whitespace-nowrap">── {activeSpec.index}</p>
                <div className="space-y-1">
                  {activeSpec.type && <Row label="type" value={activeSpec.type} />}
                  {activeSpec.grid && <Row label="grid" value={activeSpec.grid} />}
                  {activeSpec.space && <Row label="space" value={activeSpec.space} />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <button
        type="button"
        tabIndex={-1}
        onClick={() => {
          const next = !visible;
          setVisible(next);
          setCookie("spec-rail", next ? "on" : "off");
        }}
        className={`font-mono text-[10px] uppercase tracking-[0.08em] text-ash transition-colors duration-300 hover:text-ink group-hover:text-ink ${visible ? "mt-3" : ""}`}
      >
        {visible ? "Hide spec" : "Spec"}
      </button>
    </div>
  );
}
