// Phone alerts for site visits, via ntfy (transport + env vars in lib/ntfy.ts).
//
//  - notifyVisit:        someone just landed. Fires once per session, on arrival.
//  - notifyVisitSession: what they actually did — pages, time, scroll depth.
//                        Fires when they leave / background the tab.

import { sendNtfy } from "@/lib/ntfy";
import { deviceLabel, placeLabel, type GeoContext } from "@/lib/visit-request";

export type VisitInfo = GeoContext & {
  path: string;
  referrer: string | null;
  userAgent: string;
  screen: string | null;
};

export type PageView = {
  /** Pathname, already trimmed/validated by the route. */
  path: string;
  /** Seconds spent on the page. */
  seconds: number;
  /** Max scroll depth reached, 0–100. */
  scroll: number;
};

export type VisitSession = {
  geo: GeoContext;
  pages: PageView[];
  referrer: string | null;
  userAgent: string;
  screen: string | null;
  /** PostHog session id, for a deep link into the recording. */
  sessionId: string | null;
};

function fmtDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}m ${rem.toString().padStart(2, "0")}s`;
}

function fmtClock(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}

function scrollBar(pct: number): string {
  const clamped = Math.max(0, Math.min(100, Math.round(pct)));
  const filled = Math.round(clamped / 10);
  return `${"█".repeat(filled)}${"░".repeat(10 - filled)} ${clamped}%`;
}

export async function notifyVisit(info: VisitInfo): Promise<void> {
  const message = [
    placeLabel(info),
    `Page: ${info.path}`,
    `From: ${info.referrer ?? "direct / bookmark"}`,
    `${deviceLabel(info.userAgent)}${info.screen ? ` · ${info.screen}` : ""}`,
    `IP: ${info.ip}${info.timezone ? ` · ${info.timezone}` : ""}`,
  ].join("\n");

  await sendNtfy({
    title: "Portfolio visit",
    tags: "eyes",
    priority: "low",
    message: `${info.flag} ${message}`.trim(),
    click:
      info.latitude && info.longitude
        ? `https://www.google.com/maps?q=${info.latitude},${info.longitude}`
        : undefined,
  });
}

export async function notifyVisitSession(session: VisitSession): Promise<void> {
  const { geo, pages } = session;
  const totalSeconds = pages.reduce((sum, p) => sum + p.seconds, 0);

  // Align the page column so the clock + bar line up in the notification.
  const width = Math.min(28, Math.max(...pages.map((p) => p.path.length)));
  const pageLines = pages.map(
    (p) => `${p.path.padEnd(width).slice(0, width)}  ${fmtClock(p.seconds)}  ${scrollBar(p.scroll)}`,
  );

  const message = [
    `${placeLabel(geo)} · ${fmtDuration(totalSeconds)}`,
    "",
    ...pageLines,
    "",
    [
      session.referrer ?? "direct / bookmark",
      deviceLabel(session.userAgent),
      session.screen,
    ]
      .filter(Boolean)
      .join(" · "),
  ].join("\n");

  const uiHost = (process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.posthog.com").replace(/\/$/, "");
  const projectId = process.env.POSTHOG_PROJECT_ID;
  const click =
    session.sessionId && projectId
      ? `${uiHost}/project/${projectId}/replay/${session.sessionId}`
      : geo.latitude && geo.longitude
        ? `https://www.google.com/maps?q=${geo.latitude},${geo.longitude}`
        : undefined;

  await sendNtfy({
    title: "Portfolio session",
    tags: "eyes",
    message: `${geo.flag} ${message}`.trim(),
    click,
  });
}
