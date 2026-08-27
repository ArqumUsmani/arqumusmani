import { sendPostHogDigest } from "@/lib/posthog-analytics";
import { sendNtfy } from "@/lib/ntfy";

// Daily traffic summary to the phone. Scheduled in vercel.json.
//
// Vercel Cron automatically attaches `Authorization: Bearer $CRON_SECRET` when
// the CRON_SECRET env var is set — we reject anything else so the endpoint
// can't be triggered by a random request. With CRON_SECRET unset (local dev)
// it's open, which is fine for hitting it by hand to test.

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await sendPostHogDigest("24h");
    return Response.json({ ok: true });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error("[posthog-digest]", detail);
    await sendNtfy({
      title: "Digest failed",
      tags: "warning",
      priority: "high",
      message: detail.slice(0, 300),
    }).catch(() => {});
    return Response.json({ ok: false, error: detail }, { status: 500 });
  }
}
