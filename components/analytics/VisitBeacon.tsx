"use client";

import { useEffect } from "react";

// Pings /api/visit once per browser session so the site owner gets a phone
// notification (via ntfy) when someone lands. Client-side on purpose: bots and
// crawlers overwhelmingly don't execute JS, so this filters most of the noise
// before the request is even made. Renders nothing.
const SESSION_KEY = "visit-pinged";

export function VisitBeacon() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      // Set before the request so React Strict Mode's double-invoke in dev
      // (and a fast second mount) can't fire two pings.
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // sessionStorage unavailable (private mode / locked-down webview) —
      // fall through; the server dedupes per IP as a backstop.
    }

    const payload = JSON.stringify({
      path: window.location.pathname,
      ref: document.referrer || null,
      screen: `${window.screen.width}x${window.screen.height}`,
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    // keepalive: the request still completes if the visitor navigates away
    // immediately after load.
    fetch("/api/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {
      // A failed ping is not worth surfacing to the visitor.
    });
  }, []);

  return null;
}
