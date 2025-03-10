import type { NextConfig } from "next";

const nodeEnv = process.env.NEXT_PUBLIC_NODE_ENV || "LOCAL";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during build 
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during build
  },
  images: {
    domains: ['prima-pizza-backend-west.azurewebsites.net', 'localhost'],
    unoptimized: true, 
  },
  output: nodeEnv === "LOCAL" ? undefined : 'export',
};

export default nextConfig;
