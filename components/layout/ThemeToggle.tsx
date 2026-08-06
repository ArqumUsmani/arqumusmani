"use client";

import { useLayoutEffect, useState } from "react";
import { cn } from "@/lib/cn";

const THEME_COOKIE = "theme";
type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=31536000; samesite=lax`;
}

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useLayoutEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  if (theme === null) {
    return (
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
        "font-mono text-mono-label uppercase text-graphite transition-colors duration-300 hover:text-ink",
        className,
      )}
    >
      {theme === "dark" ? "Dark" : "Light"}
    </button>
  );
}
