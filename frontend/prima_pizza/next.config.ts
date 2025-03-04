import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Skips type checking during build
  },
  eslint: {
    ignoreDuringBuilds: true, // Skips ESLint checks during build
  },
};

export default nextConfig;
