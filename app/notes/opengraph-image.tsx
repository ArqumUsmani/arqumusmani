import { renderOgImage, OG_SIZE } from "@/lib/og";

export const alt = "Notes — Arqum Usmani";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return renderOgImage({
    eyebrow: "Arqum Usmani · Notes",
    title: "Short, opinionated notes on design and engineering.",
  });
}
