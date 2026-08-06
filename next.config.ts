import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  images: {
    // AVIF first, WebP fallback — takes effect once real photography/
    // screenshots replace the placeholder SVGs (SVGs are always served
    // unoptimized, so this doesn't touch the current asset set).
    formats: ["image/avif", "image/webp"],
    qualities: [75],
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
