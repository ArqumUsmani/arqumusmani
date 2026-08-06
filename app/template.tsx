import { ViewTransition } from "react";

// Remounts on every navigation (unlike layout.tsx, which persists), so this
// is where enter/exit actually fire. One universal transition, no per-page
// wiring: 200ms fade out, 400ms fade in + 12px rise. Transform + opacity
// only — no layout shift. CSS in globals.css, reduced-motion override there too.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit">
      {children}
    </ViewTransition>
  );
}
