import type { NextConfig } from "next";

// Static export: `next build` writes the whole site to /out for Cloudflare Pages.
// The pilot form posts to a Cloudflare Pages Function (functions/api/pilot.ts),
// which runs alongside the static files.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
