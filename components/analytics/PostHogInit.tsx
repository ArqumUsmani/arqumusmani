"use client";

import { useEffect } from "react";

// PostHog init. Must run AFTER hydration, not in instrumentation-client.ts:
// posthog.init() synchronously injects a <script> into the DOM (its remote
// config loader), and doing that before React hydrates <body> displaces the
// theme no-flash script and triggers a hydration mismatch.
//
// Everything is gated on NEXT_PUBLIC_POSTHOG_KEY — dormant with no env var.
// GA4 is loaded separately via <GoogleAnalytics> in app/layout.tsx.

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
// UI host only — for "open in PostHog" links from the toolbar / replay.
// Event traffic goes through the /ingest same-origin proxy (next.config.ts).
const POSTHOG_UI_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.posthog.com";

let started = false;

export function PostHogInit() {
  useEffect(() => {
    if (!POSTHOG_KEY || started) return;
    started = true;

    import("posthog-js")
      .then(({ default: posthog }) => {
        posthog.init(POSTHOG_KEY, {
          api_host: "/ingest",
          ui_host: POSTHOG_UI_HOST,
          // Modern default bundle: SPA pageviews via the History API,
          // pageleave events (time-on-page + scroll depth), autocapture.
          // Pinned so a posthog-js upgrade doesn't shift behaviour.
          defaults: "2025-05-24",
          // Person profile for every visitor, not just identified ones.
          person_profiles: "always",
          autocapture: true,
          enable_heatmaps: true,
          capture_pageview: "history_change",
          capture_pageleave: true,
        });

        // Super-property: which theme the visitor is in, attached to every
        // event this session so behaviour can be segmented by dark/light.
        try {
          posthog.register({
            theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
          });
        } catch {
          /* non-fatal */
        }
      })
      .catch(() => {
        started = false; // let a later mount retry if the chunk failed to load
      });
  }, []);

  return null;
}
