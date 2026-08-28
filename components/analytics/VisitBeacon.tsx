"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Two signals to the owner's phone (via /api/visit* → ntfy):
//
//  1. Arrival  — one ping when someone lands (once per browser session).
//  2. Session  — pages seen, seconds on each, and max scroll depth, sent when
//                the visitor leaves or backgrounds the tab.
//
// Client-side on purpose: bots don't run JS, so most noise is filtered before
// a request is even made. Renders nothing.

const ARRIVAL_KEY = "visit-arrival-sent";
const PAGES_KEY = "visit-pages";
const SUMMARY_AT_KEY = "visit-summary-at";

type PageStat = { path: string; seconds: number; scroll: number };

function readPages(): PageStat[] {
  try {
    const raw = JSON.parse(sessionStorage.getItem(PAGES_KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function writePages(pages: PageStat[]): void {
  try {
    sessionStorage.setItem(PAGES_KEY, JSON.stringify(pages.slice(-15)));
  } catch {
    /* storage blocked — the in-memory array still drives this page load */
  }
}

function posthogSessionId(): string | null {
  try {
    const ph = (window as unknown as { posthog?: { get_session_id?: () => string } }).posthog;
    return ph?.get_session_id?.() ?? null;
  } catch {
    return null;
  }
}

function scrollPercent(): number {
  const doc = document.documentElement;
  const scrollable = doc.scrollHeight - doc.clientHeight;
  if (scrollable <= 0) return 100; // page fits the viewport — all of it was seen
  return Math.round((doc.scrollTop / scrollable) * 100);
}

export function VisitBeacon() {
  const pathname = usePathname();
  const trackedPath = useRef(pathname);
  // Set on mount (Date.now() can't be called during render).
  const pageStart = useRef(0);
  const maxScroll = useRef(0);
  // A fallback copy of the completed pages, in case sessionStorage is blocked.
  const memoryPages = useRef<PageStat[]>([]);

  // Fold the page currently being tracked into the completed-pages list.
  // Merges into the last entry if it's the same path (visitor came back to it).
  // Only touches refs and Web APIs, so it's stable — safe as a [] callback.
  const bankCurrentPage = useCallback(() => {
    const seconds = Math.round((Date.now() - pageStart.current) / 1000);
    pageStart.current = Date.now();
    if (seconds < 1) return;

    const stat: PageStat = { path: trackedPath.current, seconds, scroll: maxScroll.current };
    const pages = readPages();
    const source = pages.length ? pages : memoryPages.current;
    const last = source[source.length - 1];
    if (last && last.path === stat.path) {
      last.seconds += stat.seconds;
      last.scroll = Math.max(last.scroll, stat.scroll);
    } else {
      source.push(stat);
    }
    memoryPages.current = source;
    writePages(source);
  }, []);

  const sendSummary = useCallback((final: boolean) => {
    bankCurrentPage();
    const pages = readPages().length ? readPages() : memoryPages.current;
    if (pages.length === 0) return;

    const total = pages.reduce((s, p) => s + p.seconds, 0);
    const deepest = pages.reduce((m, p) => Math.max(m, p.scroll), 0);
    if (total < 5 && deepest < 25 && pages.length < 2) return;

    if (!final) {
      const lastAt = Number(sessionStorage.getItem(SUMMARY_AT_KEY) || 0);
      if (Date.now() - lastAt < 60_000) return;
      try {
        sessionStorage.setItem(SUMMARY_AT_KEY, String(Date.now()));
      } catch {
        /* noop */
      }
    }

    const payload = JSON.stringify({
      pages,
      ref: document.referrer || null,
      screen: `${window.screen.width}x${window.screen.height}`,
      sessionId: posthogSessionId(),
      final,
    });
    const url = "/api/visit/session";
    const blob = new Blob([payload], { type: "application/json" });
    if (!(navigator.sendBeacon && navigator.sendBeacon(url, blob))) {
      fetch(url, { method: "POST", body: payload, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(
        () => {},
      );
    }
  }, [bankCurrentPage]);

  // Start the clock for the first page.
  useEffect(() => {
    pageStart.current = Date.now();
  }, []);

  // Arrival ping — once per session.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(ARRIVAL_KEY)) return;
      sessionStorage.setItem(ARRIVAL_KEY, "1");
    } catch {
      /* fall through; server dedupes per IP */
    }
    fetch("/api/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: window.location.pathname,
        ref: document.referrer || null,
        screen: `${window.screen.width}x${window.screen.height}`,
      }),
      keepalive: true,
    }).catch(() => {});
  }, []);

  // Track max scroll depth for the current page.
  useEffect(() => {
    const onScroll = () => {
      const pct = scrollPercent();
      if (pct > maxScroll.current) maxScroll.current = Math.min(100, pct);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Route change (client-side nav): bank the finished page, start the next.
  useEffect(() => {
    if (trackedPath.current === pathname) return;
    bankCurrentPage();
    trackedPath.current = pathname;
    pageStart.current = Date.now();
    maxScroll.current = 0;
  }, [pathname, bankCurrentPage]);

  // Leaving / backgrounding the tab: send the session summary.
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "hidden") sendSummary(false);
    };
    const onPageHide = () => sendSummary(true);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, [sendSummary]);

  return null;
}
