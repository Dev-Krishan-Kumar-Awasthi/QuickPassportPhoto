import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack config
  turbopack: {},
  // Add headers for WebAssembly multi-threading support (cross-origin isolation)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
        ],
      },
    ];
  },
  // Webpack shims to fix fflate/jspdf Node.js resolution issues during SSR
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        process: false,
        worker_threads: false,
      };
    }
    return config;
  },
};

export default nextConfig;
