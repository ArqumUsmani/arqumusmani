"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/primitives/Container";
import { AvailabilityPill } from "@/components/layout/AvailabilityPill";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import GlassSurface from "@/components/GlassSurface";
import { DURATION, EASE_ENTER, RISE_PX } from "@/lib/motion";
import { cn } from "@/lib/cn";

const CONDENSE_AT = 80;

// Notes lives in the footer, not here — two posts nine months apart in the
// primary nav reads as an abandoned blog. It's still fully indexed/routable,
// just not promoted above the fold on every page.
const NAV_ITEMS = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// A large fixed radius, not something computed from the pill's actual
// height — CSS clamps border-radius to half the shortest side on its own,
// so any generously large number keeps both pills fully rounded regardless
// of their exact px height (h-16 vs h-20, condensed vs not).
const PILL_RADIUS = 999;

function NavLinks({ pathname, className }: { pathname: string; className?: string }) {
  return (
    <nav aria-label="Primary" className={className}>
      {NAV_ITEMS.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className="flex items-center gap-2 font-mono text-mono-label uppercase text-graphite transition-colors duration-150 hover:text-ink"
          >
            {item.label}
            {isActive && <span className="h-1 w-1 rounded-full bg-signal" aria-hidden="true" />}
          </Link>
        );
      })}
    </nav>
  );
}

export function Header() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // On desktop, past CONDENSE_AT, the top bar hides entirely rather than
  // shrinking in place — a separate compact pill takes over at the bottom
  // of the viewport instead (see below). Mobile keeps the top bar always
  // visible at every scroll position: its "Menu" trigger is already the
  // compact form, there's no second condensed state to convert into.
  useEffect(() => {
    let raf = 0;
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setCondensed(window.scrollY > CONDENSE_AT));
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      {/* Fixed reserved height regardless of condensed state — this pill
          only ever fades/slides within that space, so nothing below the
          header reflows when it hides. */}
      <header className="sticky top-0 z-50 h-24 px-4 md:h-28 md:px-6">
        {/* Translucent floating pill: content scrolls under it through a
            blur, not behind bare links on paper. rounded-full matches the
            condensed bottom pill; the px on <header> above keeps it off the
            screen edges on mobile. Solid + blur-free under
            reduced-transparency / increased-contrast. */}
        <div
          className={cn(
            "mx-auto h-16 w-full max-w-[calc(var(--container-page)-4rem)] rounded-full border border-mist/60 bg-paper/70 shadow-[0_2px_12px_-4px_rgb(0_0_0/0.08)] backdrop-blur-xl transition-[opacity,transform] duration-300 md:h-20 md:max-w-[calc(var(--container-page)-6rem)]",
            "mt-4 md:mt-6",
            "reduce-transparency:bg-paper reduce-transparency:backdrop-blur-none more-contrast:border-ink more-contrast:bg-paper",
            condensed && "md:pointer-events-none md:-translate-y-2 md:opacity-0",
          )}
        >
          <Container className="flex h-full w-full items-center justify-between px-5! md:px-8!">
            <Link href="/about" className="font-display text-body font-semibold tracking-[-0.01em] text-ink">
              Arqum Usmani
            </Link>

            <NavLinks pathname={pathname} className="hidden items-center gap-8 md:flex" />

            <div className="hidden items-center gap-6 md:flex">
              <ThemeToggle iconOnly />
              <AvailabilityPill />
            </div>

            <button
              ref={triggerRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              className="font-mono text-mono-label uppercase md:hidden"
            >
              Menu
            </button>
          </Container>
        </div>

        <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} triggerRef={triggerRef} />
      </header>

      {/* The condensed form: fixed to the viewport bottom (not part of the
          sticky header's own box, so it can't affect the height that
          reserves), desktop-only, and only mounted while condensed —
          AnimatePresence plays its exit animation before that unmount.
          Rise + scale together (not just opacity/y like the top pill's
          plain CSS fade) — a floating glass panel arriving reads better as
          a deliberate materialization than a flat fade, and it's the one
          moment on the page that's allowed to call a little attention to
          itself since it's replacing the entire primary nav. */}
      <AnimatePresence>
        {condensed && (
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : RISE_PX * 1.5, scale: reduceMotion ? 1 : 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : RISE_PX, scale: reduceMotion ? 1 : 0.97 }}
            transition={{ duration: reduceMotion ? 0 : DURATION.section, ease: EASE_ENTER }}
            className="fixed inset-x-0 bottom-6 z-50 hidden justify-center md:flex"
          >
            {/* width/height "auto" (not a percentage) — this pill has no
                fixed-size ancestor to resolve a percentage against; it's
                sized by its own content, same as the plain-div version it
                replaced. GlassSurface still measures the real rendered box
                via ResizeObserver regardless of which sizing mode set it. */}
            {/* forceCssGlass: this pill is auto-sized AND scale-animated
                into view on mount (see the motion.div above) — the SVG
                displacement-map path measures geometry via ResizeObserver,
                which doesn't fire for a CSS transform:scale (not a layout
                change), so the map ends up mismatched with the settled
                size and renders as visible RGB noise. The plain CSS
                backdrop-filter path doesn't have that failure mode. */}
            <GlassSurface width="auto" height="auto" borderRadius={PILL_RADIUS} forceCssGlass>
              <div className="flex items-center gap-6 px-4 py-1">
                <NavLinks pathname={pathname} className="flex items-center gap-6" />
                <span className="h-4 w-px bg-mist" aria-hidden="true" />
                <ThemeToggle iconOnly />
              </div>
            </GlassSurface>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
