import { getAllNotes } from "@/lib/content/notes";
import { SITE_CONFIG } from "@/lib/site-config";

// GET route handlers default to dynamic rendering — force-static keeps this
// prerendered at build time like every other route, since the feed only
// depends on build-time content.
export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const notes = await getAllNotes();

  const items = notes
    .map((entry) => {
      const url = `${SITE_CONFIG.url}/notes/${entry.frontmatter.slug}`;
      return `
    <item>
      <title>${escapeXml(entry.frontmatter.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${new Date(entry.frontmatter.date).toUTCString()}</pubDate>
      <description>${escapeXml(entry.frontmatter.excerpt)}</description>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_CONFIG.name)} — Notes</title>
    <link>${SITE_CONFIG.url}/notes</link>
    <atom:link href="${SITE_CONFIG.url}/notes/rss.xml" rel="self" type="application/rss+xml" />
    <description>Short, opinionated notes on design and engineering from ${escapeXml(SITE_CONFIG.name)}.</description>
    <language>en-us</language>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
