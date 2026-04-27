import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native addons (resvg, canvas, etc.) can't be bundled by webpack — let Node resolve them directly
  serverExternalPackages: ['@resvg/resvg-js'],
};

export default nextConfig;
