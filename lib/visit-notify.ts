// Fire-and-forget "someone opened the site" alert to a phone via ntfy.sh
// (https://ntfy.sh). One env var, no account, no SDK:
//
//   NTFY_TOPIC   — a long, unguessable topic string (this IS the only secret;
//                  anyone who knows it can read your alerts). e.g.
//                  `arqum-portfolio-9f3a1c7b2e`
//   NTFY_SERVER  — optional, defaults to https://ntfy.sh. Set if self-hosting.
//
// Install the ntfy app on your phone, subscribe to that exact topic, done.
// If NTFY_TOPIC is unset the visit is logged to the server console instead,
// so local dev and un-provisioned deploys stay quiet rather than erroring.

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
  const topic = process.env.NTFY_TOPIC;
  const message = buildMessage(info);

  if (!topic) {
    console.log("[visit] NTFY_TOPIC not set — visit:", message.replace(/\n/g, " | "));
    return;
  }

  const server = (process.env.NTFY_SERVER ?? "https://ntfy.sh").replace(/\/$/, "");
  const headers: Record<string, string> = {
    // Header values must be Latin-1; a flag emoji or accented city name here
    // throws. Keep the Title ASCII and let Unicode live in the body.
    Title: "Portfolio visit",
    Tags: "eyes",
    Priority: "default",
  };

  if (info.latitude && info.longitude) {
    headers.Click = `https://www.google.com/maps?q=${info.latitude},${info.longitude}`;
  }

  try {
    const res = await fetch(`${server}/${encodeURIComponent(topic)}`, {
      method: "POST",
      headers,
      body: `${info.flag} ${message}`.trim(),
      // Don't let a slow ntfy call hang the request handler.
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) {
      console.error("[visit] ntfy responded", res.status, await res.text().catch(() => ""));
    }
  } catch (err) {
    console.error("[visit] ntfy send failed:", err);
  }
}
