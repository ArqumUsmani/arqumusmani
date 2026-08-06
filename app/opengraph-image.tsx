import { renderOgImage, OG_SIZE } from "@/lib/og";

export const alt = "Arqum Usmani, Lead Product Designer & UI/UX Engineer";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return renderOgImage({
    eyebrow: "Arqum Usmani",
    title: "I design product experiences in healthcare, AI, and SaaS, and I build them.",
  });
}
