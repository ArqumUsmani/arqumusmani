"use client";

import { useLayoutEffect, useState } from "react";
import { cn } from "@/lib/cn";

const THEME_COOKIE = "theme";
type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=31536000; samesite=lax`;
}

// Icons represent the mode a click switches TO (sun while dark, moon while
// light) — same convention the text label followed ("Dark"/"Light" already
// named the current state, this just gives the compact nav a glyph for it).
function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.3" />
      <path
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        d="M8 1v1.5M8 13.5V15M15 8h-1.5M2.5 8H1M12.7 3.3l-1.06 1.06M4.36 11.64l-1.06 1.06M12.7 12.7l-1.06-1.06M4.36 4.36 3.3 3.3"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
        d="M14 9.8A6.2 6.2 0 1 1 6.2 2a5 5 0 0 0 7.8 7.8Z"
      />
    </svg>
  );
}

type ThemeToggleProps = {
  className?: string;
  /** Renders a sun/moon glyph instead of the "Dark"/"Light" text label —
   * for compact nav contexts where the full word doesn't fit. */
  iconOnly?: boolean;
};

export function ThemeToggle({ className, iconOnly }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useLayoutEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  if (theme === null) {
    return iconOnly ? (
      <span aria-hidden="true" className={cn("block h-4 w-4", className)} />
    ) : (
      <span
        aria-hidden="true"
        className={cn("font-mono text-mono-label uppercase text-graphite", className)}
      >
        Theme
      </span>
    );
  }

  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => {
        applyTheme(next);
        setTheme(next);
      }}
      aria-label={`Switch to ${next} mode`}
      className={cn(
        "text-graphite transition-colors duration-150 hover:text-ink",
        iconOnly ? "flex items-center justify-center" : "font-mono text-mono-label uppercase",
        className,
      )}
    >
      {iconOnly ? theme === "dark" ? <SunIcon /> : <MoonIcon /> : theme === "dark" ? "Dark" : "Light"}
    </button>
  );
}
