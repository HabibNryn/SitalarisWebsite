// next.config.ts - Versi Minimal
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // Nonaktifkan sementara untuk debug
  
  webpack: (config) => {
    // Fix untuk @react-pdf/renderer
    config.resolve.alias = {
      ...config.resolve.alias,
      'react/jsx-runtime': require.resolve('react/jsx-runtime'),
    };

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      stream: false,
      path: false,
    };

    return config;
  },

  // Nonaktifkan fitur yang mungkin bermasalah
  experimental: {
    optimizePackageImports: [], // Kosongkan array
  },
};

export default nextConfig;