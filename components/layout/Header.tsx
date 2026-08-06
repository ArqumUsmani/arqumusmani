"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/primitives/Container";
import { AvailabilityPill } from "@/components/layout/AvailabilityPill";
import { MobileMenu } from "@/components/layout/MobileMenu";

const NAV_ITEMS = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Notes", href: "/notes" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <header className="sticky top-0 z-50 border-b border-mist bg-paper">
      <Container className="flex h-20 items-center justify-between md:h-24">
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

        <div className="hidden md:block">
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

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} triggerRef={triggerRef} />
    </header>
  );
}
