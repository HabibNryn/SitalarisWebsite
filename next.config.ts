// next.config.ts
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: false,

  webpack: (config, { isServer }) => {

    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname),
    };

    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        stream: false,
        crypto: false,
        os: false,
      };
    }

    return config;
  },

  experimental: {
    optimizePackageImports: [],
  },
};

export default nextConfig;
