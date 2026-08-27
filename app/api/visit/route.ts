import { isbot } from "isbot";
import { notifyVisit, type VisitInfo } from "@/lib/visit-notify";

// Client beacon (components/analytics/VisitBeacon.tsx) hits this once per
// browser session. This handler decides whether that visit is worth a phone
// alert: real human, not a link-preview bot, not you, not a repeat within the
// dedupe window.

// Best-effort server-side dedupe on top of the client's sessionStorage guard —
// catches the case where sessionStorage is blocked (private mode, some
// in-app browsers) and would otherwise ping on every page load. In-memory, so
// it resets on cold starts; that's an acceptable failure mode for an alert.
const DEDUPE_WINDOW_MS = 30 * 60 * 1000;
const seen = new Map<string, number>();

function isRepeat(key: string): boolean {
  const now = Date.now();
  const last = seen.get(key);
  if (last && now - last < DEDUPE_WINDOW_MS) return true;
  seen.set(key, now);
  if (seen.size > 500) {
    for (const [k, t] of seen) {
      if (now - t > DEDUPE_WINDOW_MS) seen.delete(k);
    }
  }
  return false;
}

function countryFlag(code: string | null): string {
  if (!code || code.length !== 2) return "";
  return code
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

const NOOP = new Response(null, { status: 204 });

export async function POST(request: Request) {
  const h = request.headers;
  const userAgent = h.get("user-agent") ?? "";

  // No UA or a known bot/crawler/link-unfurler → ignore.
  if (userAgent.length < 15 || isbot(userAgent)) return NOOP;

  const forwardedFor = h.get("x-forwarded-for") ?? "";
  const ip = forwardedFor.split(",")[0]?.trim() || h.get("x-real-ip")?.trim() || "unknown";

  // Your own devices — set NOTIFY_IGNORE_IPS to a comma-separated list
  // (check a ping to see what your current IP is, then add it).
  const ignored = (process.env.NOTIFY_IGNORE_IPS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (ignored.includes(ip)) return NOOP;

  const country = h.get("x-vercel-ip-country");

  // No geo header at all = local dev or a request that never touched Vercel's
  // edge. Skip in production (almost certainly a probe); allow through in dev
  // so the wiring is testable.
  if (!country && process.env.NODE_ENV === "production") return NOOP;

  let body: { path?: unknown; ref?: unknown; screen?: unknown; tz?: unknown } = {};
  try {
    body = await request.json();
  } catch {
    /* empty / malformed body is fine */
  }

  const path = typeof body.path === "string" ? body.path.slice(0, 200) : "/";

  if (isRepeat(`${ip}`)) return NOOP;

  const info: VisitInfo = {
    path,
    ip,
    city: decodeURIComponent(h.get("x-vercel-ip-city") ?? "").trim(),
    region: h.get("x-vercel-ip-country-region") ?? "",
    country,
    flag: countryFlag(country),
    timezone: h.get("x-vercel-ip-timezone"),
    latitude: h.get("x-vercel-ip-latitude"),
    longitude: h.get("x-vercel-ip-longitude"),
    referrer: typeof body.ref === "string" && body.ref ? body.ref.slice(0, 300) : null,
    userAgent,
    screen: typeof body.screen === "string" ? body.screen.slice(0, 20) : null,
    clientTimezone: typeof body.tz === "string" ? body.tz.slice(0, 60) : null,
  };

  // Don't make the browser wait on the push; ntfy has its own 4s timeout.
  await notifyVisit(info);

  return NOOP;
}
