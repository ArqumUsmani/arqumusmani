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

const CASE_PREFIX = "/work/";
const isCaseStudy = (path: string) => path.startsWith(CASE_PREFIX) && path.length > CASE_PREFIX.length;
const caseSlug = (path: string) => path.slice(CASE_PREFIX.length).split(/[/?#]/)[0];

export async function notifyVisitSession(session: VisitSession): Promise<void> {
  const { geo } = session;

  // Collapse repeat visits to the same path: sum the time, keep deepest scroll.
  const byPath = new Map<string, PageView>();
  for (const p of session.pages) {
    const existing = byPath.get(p.path);
    if (existing) {
      existing.seconds += p.seconds;
      existing.scroll = Math.max(existing.scroll, p.scroll);
    } else {
      byPath.set(p.path, { ...p });
    }
  }
  const pages = [...byPath.values()];
  const totalSeconds = pages.reduce((sum, p) => sum + p.seconds, 0);

  // Case studies sorted by time — the first line is what they spent most on.
  const caseStudies = pages.filter((p) => isCaseStudy(p.path)).sort((a, b) => b.seconds - a.seconds);
  const otherPages = pages.filter((p) => !isCaseStudy(p.path)).sort((a, b) => b.seconds - a.seconds);

  const lines: string[] = [
    `${placeLabel(geo)} · ${fmtDuration(totalSeconds)} on site`,
    [`IP ${geo.ip}`, session.referrer ?? "direct", deviceLabel(session.userAgent), session.screen]
      .filter(Boolean)
      .join(" · "),
  ];

  if (caseStudies.length) {
    const w = Math.min(18, Math.max(...caseStudies.map((p) => caseSlug(p.path).length)));
    lines.push("", `Case studies opened (${caseStudies.length})`);
    for (const p of caseStudies) {
      lines.push(`  ${caseSlug(p.path).padEnd(w)}  ${fmtClock(p.seconds)}  ${scrollBar(p.scroll)}`);
    }
  }

  if (otherPages.length) {
    lines.push("", "Other pages");
    for (const p of otherPages) {
      lines.push(`  ${p.path.padEnd(9)}  ${fmtClock(p.seconds)}  ${p.scroll}% scrolled`);
    }
  }

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
    tags: "footprints",
    message: `${geo.flag} ${lines.join("\n")}`.trim(),
    click,
  });
}
