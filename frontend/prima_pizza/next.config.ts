import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during build
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during build
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
      {
        source: '/api/v1/auth/:path*',
        destination: 'https://prima-pizza-backend-west.azurewebsites.net/api/v1/auth/:path*',
      },
      {
        source: '/api/v1/toppings/:path*',
        destination: 'https://prima-pizza-backend-west.azurewebsites.net/api/v1/toppings/:path*',
      },
      {
        source: '/api/v1/pizzas/:path*',
        destination: 'https://prima-pizza-backend-west.azurewebsites.net/api/v1/pizzas/:path*',
      },
    ];
  },
};

export default nextConfig;
