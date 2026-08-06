import { renderOgImage, OG_SIZE } from "@/lib/og";

export const alt = "Contact Arqum Usmani";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return renderOgImage({
    eyebrow: "Arqum Usmani · Contact",
    title: "Let's build something worth shipping.",
  });
}
