import { notifyVisit } from "@/lib/visit-notify";
import {
  isBotRequest,
  isGeolessProbe,
  isIgnoredIp,
  geoContext,
  clientIp,
} from "@/lib/visit-request";

// Client beacon (components/analytics/VisitBeacon.tsx) hits this once per
// browser session, on arrival. It decides whether that landing is worth a
// phone alert: real human, not a link-preview bot, not you, not a repeat
// within the dedupe window. The richer "what did they do" summary comes from
// /api/visit/session when they leave.

// Best-effort server-side dedupe on top of the client's sessionStorage guard —
// catches sessionStorage being blocked (private mode, some in-app browsers).
// In-memory, resets on cold starts; acceptable for an alert.
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

const NOOP = new Response(null, { status: 204 });

export async function POST(request: Request) {
  const h = request.headers;

  if (isBotRequest(h) || isGeolessProbe(h)) return NOOP;

  const ip = clientIp(h);
  if (isIgnoredIp(ip)) return NOOP;
  if (isRepeat(ip)) return NOOP;

  let body: { path?: unknown; ref?: unknown; screen?: unknown } = {};
  try {
    body = await request.json();
  } catch {
    /* empty / malformed body is fine */
  }

  await notifyVisit({
    ...geoContext(h),
    path: typeof body.path === "string" ? body.path.slice(0, 200) : "/",
    referrer: typeof body.ref === "string" && body.ref ? body.ref.slice(0, 300) : null,
    userAgent: h.get("user-agent") ?? "",
    screen: typeof body.screen === "string" ? body.screen.slice(0, 20) : null,
  });

  return NOOP;
}
