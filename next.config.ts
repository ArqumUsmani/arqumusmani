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
  // The Vercel preview domain must never outrank the custom domain in
  // search results. Both hosts point at the same deployment, so a host-based
  // redirect (not a DNS-level fix) is the only way to collapse them into one
  // canonical URL.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "ausmani.vercel.app" }],
        destination: "https://www.arqumusmani.com/:path*",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
