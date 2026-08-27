// Client-side instrumentation — runs after the HTML loads, before hydration
// (Next.js convention, see node_modules/next/dist/docs/.../instrumentation-client.md).
//
// PostHog init lives here so capture starts as early as possible. The import
// is dynamic and deliberately not awaited: analytics must never sit on the
// hydration critical path, and posthog-js is ~60kb. Everything is gated on
// NEXT_PUBLIC_POSTHOG_KEY, so with no env var set nothing loads and nothing
// runs — safe to ship dormant.
//
// GA4 is loaded separately via <GoogleAnalytics> in app/layout.tsx.

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
// Where the PostHog UI lives — only used to build "open in PostHog" links from
// the toolbar / session replay. Event traffic goes through the /ingest proxy.
const posthogUiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.posthog.com";

if (posthogKey) {
  import("posthog-js")
    .then(({ default: posthog }) => {
      posthog.init(posthogKey, {
        // Same-origin proxy (rewrites in next.config.ts) so ad/tracker
        // blockers don't silently drop events.
        api_host: "/ingest",
        ui_host: posthogUiHost,
        // Modern default bundle: SPA pageviews via history API, pageleave
        // events (needed for time-on-page and scroll depth), sensible
        // autocapture. Pin the date so behaviour doesn't shift under us on a
        // posthog-js upgrade.
        defaults: "2025-05-24",
        // Build a person profile for every visitor, not just identified ones —
        // "maximum data" was the ask. Uses more event quota.
        person_profiles: "always",
        // $autocapture on every click/submit/change — this is what records
        // which project links get clicked without any per-element wiring.
        autocapture: true,
        // Rage-click / scroll / mousemove heatmap data per page.
        enable_heatmaps: true,
        // Session replay is gated by the PostHog project setting
        // ("Record user sessions") — leave that ON in the dashboard.
        capture_pageview: "history_change",
        capture_pageleave: true,
      });

      // App-specific super-property: which theme the visitor is in. Attached
      // to every event for the session so you can segment behaviour by
      // dark/light. Re-registers on the next page load if they toggle.
      try {
        const theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
        posthog.register({ theme });
      } catch {
        /* non-fatal */
      }
    })
    .catch(() => {
      /* analytics failing to load must not surface anywhere */
    });
}
