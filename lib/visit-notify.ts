// Fire-and-forget "someone opened the site" alert to a phone. The ntfy
// transport and its env vars live in lib/ntfy.ts.

import { sendNtfy } from "@/lib/ntfy";

export type VisitInfo = {
  path: string;
  ip: string;
  city: string;
  region: string;
  country: string | null;
  flag: string;
  timezone: string | null;
  latitude: string | null;
  longitude: string | null;
  referrer: string | null;
  userAgent: string;
  screen: string | null;
  clientTimezone: string | null;
};

function deviceLabel(ua: string): string {
  const os =
    /iphone|ipad|ipod/i.test(ua) ? "iOS" :
    /android/i.test(ua) ? "Android" :
    /mac os x/i.test(ua) ? "macOS" :
    /windows/i.test(ua) ? "Windows" :
    /linux/i.test(ua) ? "Linux" :
    "Unknown OS";
  const browser =
    /edg\//i.test(ua) ? "Edge" :
    /chrome|crios/i.test(ua) ? "Chrome" :
    /firefox|fxios/i.test(ua) ? "Firefox" :
    /safari/i.test(ua) ? "Safari" :
    "Unknown browser";
  return `${browser} · ${os}`;
}

function buildMessage(info: VisitInfo): string {
  const place = [info.city, info.region, info.country].filter(Boolean).join(", ") || "Unknown location";
  const lines = [
    `${place}`,
    `Page: ${info.path}`,
    `From: ${info.referrer ?? "direct / bookmark"}`,
    `${deviceLabel(info.userAgent)}${info.screen ? ` · ${info.screen}` : ""}`,
    `IP: ${info.ip}${info.timezone ? ` · ${info.timezone}` : ""}`,
  ];
  return lines.join("\n");
}

export async function notifyVisit(info: VisitInfo): Promise<void> {
  await sendNtfy({
    title: "Portfolio visit",
    tags: "eyes",
    message: `${info.flag} ${buildMessage(info)}`.trim(),
    click:
      info.latitude && info.longitude
        ? `https://www.google.com/maps?q=${info.latitude},${info.longitude}`
        : undefined,
  });
}
