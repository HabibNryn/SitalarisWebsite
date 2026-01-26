// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,

  turbopack: {
    resolveAlias: {
      "@": "./",
    },
  },

  experimental: {
    optimizePackageImports: [],
  },
};

export default nextConfig;
