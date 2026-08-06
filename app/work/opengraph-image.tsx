import { renderOgImage, OG_SIZE } from "@/lib/og";

export const alt = "Selected work by Arqum Usmani";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return renderOgImage({
    eyebrow: "Arqum Usmani · Work",
    title: "Case studies from healthcare, AI, and SaaS.",
  });
}
