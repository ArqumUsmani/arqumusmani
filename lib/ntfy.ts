// Thin wrapper over an ntfy.sh push. Shared by the real-time visit alert
// (lib/visit-notify.ts) and the PostHog digest cron
// (app/api/cron/posthog-digest).
//
//   NTFY_TOPIC   — required. The long, unguessable topic string; it's the only
//                  secret, anyone who knows it can read your notifications.
//   NTFY_SERVER  — optional, defaults to https://ntfy.sh.
//
// With no NTFY_TOPIC set, the payload is logged to the server console instead
// of erroring — so local dev and un-provisioned deploys stay quiet.

type NtfyOptions = {
  /** ntfy sends this as an HTTP header — ASCII only (headers are Latin-1). */
  title: string;
  /** Body. Unicode is fine here (flags, accented place names). */
  message: string;
  /** Comma-separated ntfy tag names / emoji shortcodes, e.g. "eyes,bar_chart". */
  tags?: string;
  priority?: "min" | "low" | "default" | "high" | "urgent";
  /** URL opened when the notification is tapped. */
  click?: string;
};

export async function sendNtfy(opts: NtfyOptions): Promise<void> {
  const topic = process.env.NTFY_TOPIC;

  if (!topic) {
    console.log(`[ntfy] NTFY_TOPIC not set — ${opts.title}: ${opts.message.replace(/\n/g, " | ")}`);
    return;
  }

  const server = (process.env.NTFY_SERVER ?? "https://ntfy.sh").replace(/\/$/, "");
  const headers: Record<string, string> = {
    Title: opts.title,
    Priority: opts.priority ?? "default",
  };
  if (opts.tags) headers.Tags = opts.tags;
  if (opts.click) headers.Click = opts.click;

  try {
    const res = await fetch(`${server}/${encodeURIComponent(topic)}`, {
      method: "POST",
      headers,
      body: opts.message,
      // Never let a slow ntfy call hang the caller (a request handler or cron).
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error(`[ntfy] ${res.status}`, await res.text().catch(() => ""));
    }
  } catch (err) {
    console.error("[ntfy] send failed:", err);
  }
}
