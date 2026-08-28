// Shared request parsing for the visit alert (/api/visit) and the session
// summary (/api/visit/session): bot filtering, client IP, your-own-IP skip,
// and geolocation from Vercel's edge headers.

import { isbot } from "isbot";

export type GeoContext = {
  ip: string;
  city: string;
  region: string;
  country: string | null;
  /** Emoji flag for `country`, or "" if unknown. */
  flag: string;
  timezone: string | null;
  latitude: string | null;
  longitude: string | null;
};

export function isBotRequest(headers: Headers): boolean {
  const ua = headers.get("user-agent") ?? "";
  // Empty or stub UA, or a known crawler / link-preview bot.
  return ua.length < 15 || isbot(ua);
}

export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for") ?? "";
  return forwarded.split(",")[0]?.trim() || headers.get("x-real-ip")?.trim() || "unknown";
}

export function isIgnoredIp(ip: string): boolean {
  return (process.env.NOTIFY_IGNORE_IPS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .includes(ip);
}

/**
 * True when the request carries no Vercel geo header AND we're in production —
 * i.e. it never went through Vercel's edge, so it's almost certainly a probe.
 * Allowed through in dev so the wiring stays testable.
 */
export function isGeolessProbe(headers: Headers): boolean {
  return !headers.get("x-vercel-ip-country") && process.env.NODE_ENV === "production";
}

export function countryFlag(code: string | null): string {
  if (!code || code.length !== 2) return "";
  return code
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

export function geoContext(headers: Headers): GeoContext {
  const country = headers.get("x-vercel-ip-country");
  return {
    ip: clientIp(headers),
    city: decodeURIComponent(headers.get("x-vercel-ip-city") ?? "").trim(),
    region: headers.get("x-vercel-ip-country-region") ?? "",
    country,
    flag: countryFlag(country),
    timezone: headers.get("x-vercel-ip-timezone"),
    latitude: headers.get("x-vercel-ip-latitude"),
    longitude: headers.get("x-vercel-ip-longitude"),
  };
}

export function placeLabel(geo: GeoContext): string {
  return [geo.city, geo.region, geo.country].filter(Boolean).join(", ") || "Unknown location";
}

export function deviceLabel(ua: string): string {
  const os = /iphone|ipad|ipod/i.test(ua)
    ? "iOS"
    : /android/i.test(ua)
      ? "Android"
      : /mac os x/i.test(ua)
        ? "macOS"
        : /windows/i.test(ua)
          ? "Windows"
          : /linux/i.test(ua)
            ? "Linux"
            : "Unknown OS";
  const browser = /edg\//i.test(ua)
    ? "Edge"
    : /chrome|crios/i.test(ua)
      ? "Chrome"
      : /firefox|fxios/i.test(ua)
        ? "Firefox"
        : /safari/i.test(ua)
          ? "Safari"
          : "Unknown browser";
  return `${browser} · ${os}`;
}
