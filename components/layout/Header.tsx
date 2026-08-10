"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/primitives/Container";
import { AvailabilityPill } from "@/components/layout/AvailabilityPill";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
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

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // The outer <header> below keeps a constant h-20/h-24 no matter what —
  // that's what makes this reflow-free. Only the inner pill's own height,
  // padding, margin, and background animate; the space the header reserves
  // in document flow never changes, so nothing below it ever jumps.
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
    <header className="sticky top-0 z-50 h-20 md:h-24">
      {/* rounded-full here is a deliberate one-off, same category as the
          footer card and its CTA buttons: a direct, specific request for
          this exact "floating pill" treatment, not a drift from the
          2px-radius rule everywhere else. */}
      <div
        className={cn(
          "mx-auto border-mist bg-paper transition-[height,margin,padding,border-radius,background-color,border-color] duration-300",
          condensed
            ? "mt-3 h-14 max-w-[calc(var(--container-page)-2rem)] rounded-full border backdrop-blur-md md:mt-4 md:h-16"
            : "h-20 max-w-none border-b md:h-24",
        )}
        style={condensed ? { backgroundColor: "color-mix(in srgb, var(--color-paper) 85%, transparent)" } : undefined}
      >
        <Container className="flex h-full items-center justify-between">
          <Link
            href="/"
            className="text-body font-medium tracking-[-0.01em] text-ink"
          >
            Arqum Usmani
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className="flex items-center gap-2 font-mono text-mono-label uppercase text-graphite transition-colors duration-300 hover:text-ink"
                >
                  {item.label}
                  {isActive && (
                    <span className="h-1 w-1 rounded-full bg-signal" aria-hidden="true" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-6 md:flex">
            <ThemeToggle />
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
  );
}
