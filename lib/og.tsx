import { ImageResponse } from "next/og";
import { getInterTightMedium } from "@/lib/og-font";

const INK = "#0b0b0b";
const PAPER = "#fafaf8";
const ASH = "#6e6e6a";
const SIGNAL = "#b4531f";

export const OG_SIZE = { width: 1200, height: 630 };

type OgImageProps = {
  eyebrow: string;
  title: string;
};

export async function renderOgImage({ eyebrow, title }: OgImageProps) {
  const font = await getInterTightMedium();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: INK,
          padding: "80px",
          fontFamily: font ? "Inter Tight" : "sans-serif",
        }}
      >
        <div style={{ display: "flex", width: "64px", height: "4px", backgroundColor: SIGNAL }} />
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              display: "flex",
              fontSize: "22px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: ASH,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "60px",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: PAPER,
              maxWidth: "980px",
            }}
          >
            {title}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: font ? [{ name: "Inter Tight", data: font, style: "normal", weight: 500 }] : undefined,
    },
  );
}
