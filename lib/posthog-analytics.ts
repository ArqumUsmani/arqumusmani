// Pulls a short traffic summary from the PostHog Query API (HogQL) and pushes
// it to the phone via ntfy. Driven by the cron at app/api/cron/posthog-digest.
//
//   POSTHOG_PERSONAL_API_KEY — a `phx_...` personal API key (Settings →
//     Personal API keys). Server-side secret — NOT the phc_ client key.
//     Needs the "Query Read" scope (the "MCP Server" preset includes it).
//   POSTHOG_PROJECT_ID       — the numeric id from your PostHog URL
//     (us.posthog.com/project/<id>/...).
//   NEXT_PUBLIC_POSTHOG_HOST — reused as the API host (https://us.posthog.com
//     or https://eu.posthog.com).

import { sendNtfy } from "@/lib/ntfy";

const API_HOST = (process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.posthog.com").replace(/\/$/, "");

type QueryResponse = { results?: unknown[][] };

async function hogql(query: string): Promise<unknown[][]> {
  const key = process.env.POSTHOG_PERSONAL_API_KEY;
  const projectId = process.env.POSTHOG_PROJECT_ID;
  if (!key || !projectId) {
    throw new Error("POSTHOG_PERSONAL_API_KEY and POSTHOG_PROJECT_ID must be set");
  }

  const res = await fetch(`${API_HOST}/api/projects/${projectId}/query/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: { kind: "HogQLQuery", query } }),
    signal: AbortSignal.timeout(20000),
  });

  if (!res.ok) {
    throw new Error(`PostHog query ${res.status}: ${(await res.text().catch(() => "")).slice(0, 200)}`);
  }

  const json = (await res.json()) as QueryResponse;
  return json.results ?? [];
}

type Period = "24h" | "7d";

export async function sendPostHogDigest(period: Period = "24h"): Promise<void> {
  const interval = period === "24h" ? "1 DAY" : "7 DAY";
  const since = `now() - INTERVAL ${interval}`;

  const [totals, pages, referrers] = await Promise.all([
    hogql(`
      SELECT count() AS views, count(DISTINCT person_id) AS visitors
      FROM events
      WHERE event = '$pageview' AND timestamp > ${since}
    `),
    hogql(`
      SELECT properties.$pathname AS path, count() AS views
      FROM events
      WHERE event = '$pageview' AND timestamp > ${since}
      GROUP BY path ORDER BY views DESC LIMIT 5
    `),
    hogql(`
      SELECT coalesce(nullIf(properties.$referring_domain, ''), '$direct') AS src, count() AS views
      FROM events
      WHERE event = '$pageview' AND timestamp > ${since}
      GROUP BY src ORDER BY views DESC LIMIT 5
    `),
  ]);

  const views = Number(totals[0]?.[0] ?? 0);
  const visitors = Number(totals[0]?.[1] ?? 0);
  const label = period === "24h" ? "last 24h" : "last 7d";

  if (views === 0) {
    await sendNtfy({
      title: `Portfolio · ${label}`,
      tags: "chart_with_downwards_trend",
      message: "Quiet — no page views.",
    });
    return;
  }

  const list = (rows: unknown[][]) =>
    rows.map(([name, count]) => `  ${count}×  ${name || "/"}`).join("\n");

  const message = [
    `${views} views · ${visitors} visitors`,
    "",
    "Top pages",
    list(pages),
    "",
    "Referrers",
    list(referrers),
  ].join("\n");

  await sendNtfy({
    title: `Portfolio · ${label}`,
    tags: "bar_chart",
    message,
    click: `${API_HOST}/project/${process.env.POSTHOG_PROJECT_ID}/web`,
  });
}
