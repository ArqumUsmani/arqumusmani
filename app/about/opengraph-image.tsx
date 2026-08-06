import { renderOgImage, OG_SIZE } from "@/lib/og";

export const alt = "About Arqum Usmani";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return renderOgImage({
    eyebrow: "Arqum Usmani · About",
    title: "Karachi to Islamabad, building for US companies.",
  });
}
