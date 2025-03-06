import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false, // Enable type checking for production
  },
  eslint: {
    ignoreDuringBuilds: false, // Enable ESLint checks for production
  },
  images: {
    domains: ['prima-pizza-backend-west.azurewebsites.net'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://prima-pizza-backend-west.azurewebsites.net/api/:path*',
      },
    ];
  },
};

export default nextConfig;
