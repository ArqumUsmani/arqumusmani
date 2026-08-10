"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AvailabilityPill } from "@/components/layout/AvailabilityPill";
import { DURATION, EASE_ENTER } from "@/lib/motion";

// Kept in sync with components/layout/Header.tsx's NAV_ITEMS — Notes lives
// in the footer only, not the primary nav (see that file for why).
const NAV_ITEMS = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
};

export function MobileMenu({ open, onClose, triggerRef }: MobileMenuProps) {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    );
    focusables?.[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      trigger?.focus();
    };
  }, [open, onClose, triggerRef]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : DURATION.element, ease: EASE_ENTER }}
          className="fixed inset-0 z-[60] flex flex-col bg-paper md:hidden"
        >
          <div className="flex items-center justify-between px-[clamp(1.25rem,5vw,6rem)] py-6">
            <span className="font-medium text-body">Arqum Usmani</span>
            <button
              type="button"
              onClick={onClose}
              className="p-2 font-mono text-mono-label uppercase"
            >
              Close
            </button>
          </div>

          <nav
            aria-label="Primary"
            className="flex flex-1 flex-col justify-center gap-2 px-[clamp(1.25rem,5vw,6rem)]"
          >
            {NAV_ITEMS.map((item, i) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reduceMotion ? 0 : DURATION.section,
                    delay: reduceMotion ? 0 : i * 0.06,
                    ease: EASE_ENTER,
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={isActive ? "page" : undefined}
                    className="flex items-baseline gap-3 py-3 text-display-m text-ink"
                  >
                    {item.label}
                    {isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          <div className="px-[clamp(1.25rem,5vw,6rem)] py-8">
            <AvailabilityPill />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
