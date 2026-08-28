import { notifyVisitSession, type PageView } from "@/lib/visit-notify";
import { isBotRequest, isGeolessProbe, isIgnoredIp, geoContext, clientIp } from "@/lib/visit-request";

// components/analytics/VisitBeacon.tsx posts here when the visitor leaves or
// backgrounds the tab: the pages they saw, seconds on each, and how far they
// scrolled. One notification per visitor for a normal visit; a long
// multi-page session may send an interim summary (throttled) plus a final one.

// Throttle by session (or IP) so a visitor flipping tabs doesn't spam. `final`
// beacons bypass it once — that's the one that matters.
const THROTTLE_MS = 45 * 1000;
const lastSent = new Map<string, number>();

function throttled(key: string, final: boolean): boolean {
  const now = Date.now();
  const prev = lastSent.get(key);
  if (final) {
    // allow one final beacon through even inside the window, then lock it
    if (prev === -1) return true;
    lastSent.set(key, -1);
    return false;
  }
  if (prev === -1) return true;
  if (prev && now - prev < THROTTLE_MS) return true;
  lastSent.set(key, now);
  if (lastSent.size > 500) {
    for (const [k, t] of lastSent) {
      if (t !== -1 && now - t > 60 * 60 * 1000) lastSent.delete(k);
    }
  }
  return false;
}

const NOOP = new Response(null, { status: 204 });

function parsePages(raw: unknown): PageView[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .slice(0, 20)
    .map((p): PageView | null => {
      if (!p || typeof p !== "object") return null;
      const rec = p as Record<string, unknown>;
      if (typeof rec.path !== "string") return null;
      return {
        path: rec.path.slice(0, 120),
        seconds: Math.max(0, Math.min(86_400, Math.round(Number(rec.seconds) || 0))),
        scroll: Math.max(0, Math.min(100, Math.round(Number(rec.scroll) || 0))),
      };
    })
    .filter((p): p is PageView => p !== null);
}

export async function POST(request: Request) {
  const h = request.headers;

  if (isBotRequest(h) || isGeolessProbe(h)) return NOOP;
  const ip = clientIp(h);
  if (isIgnoredIp(ip)) return NOOP;

  let body: { pages?: unknown; ref?: unknown; screen?: unknown; sessionId?: unknown; final?: unknown } = {};
  try {
    body = await request.json();
  } catch {
    return NOOP;
  }

  const pages = parsePages(body.pages);
  const totalSeconds = pages.reduce((sum, p) => sum + p.seconds, 0);
  const deepestScroll = pages.reduce((max, p) => Math.max(max, p.scroll), 0);
  const openedCaseStudy = pages.some((p) => p.path.startsWith("/work/") && p.path.length > "/work/".length);

  // Not worth a notification: a bounce with no real engagement. But always
  // send if they opened a case study — that click is the whole point.
  if (pages.length === 0 || (!openedCaseStudy && totalSeconds < 5 && deepestScroll < 25 && pages.length < 2)) {
    return NOOP;
  }

  const final = body.final === true;
  const sessionId = typeof body.sessionId === "string" ? body.sessionId.slice(0, 100) : null;
  if (throttled(sessionId || ip, final)) return NOOP;

  await notifyVisitSession({
    geo: geoContext(h),
    pages,
    referrer: typeof body.ref === "string" && body.ref ? body.ref.slice(0, 300) : null,
    userAgent: h.get("user-agent") ?? "",
    screen: typeof body.screen === "string" ? body.screen.slice(0, 20) : null,
    sessionId,
  });

  return NOOP;
}
