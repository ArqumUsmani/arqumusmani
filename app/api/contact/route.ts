import { contactSchema } from "@/lib/contact-schema";
import { SITE_CONFIG } from "@/lib/site-config";

// Stub — swap for the Resend SDK once RESEND_API_KEY is provisioned.
// https://resend.com/docs/send-with-nextjs
async function sendContactEmail(values: { name: string; email: string; type: string; message: string }) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log("[contact] RESEND_API_KEY not set, logging submission instead of sending:", values);
    return;
  }

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Portfolio <contact@arqumusmani.com>",
      to: SITE_CONFIG.email,
      reply_to: values.email,
      subject: `${values.type} inquiry from ${values.name}`,
      text: values.message,
    }),
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = contactSchema.safeParse(body);

  if (!result.success) {
    return Response.json(
      { ok: false, errors: result.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  await sendContactEmail(result.data);

  return Response.json({ ok: true });
}
