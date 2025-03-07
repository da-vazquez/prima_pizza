import type { NextConfig } from "next";

const nodeEnv = process.env.NEXT_PUBLIC_NODE_ENV;
let baseURL;

if (nodeEnv === "PROD") {
  baseURL = process.env.NEXT_PUBLIC_PRIMA_PIZZA_BASE_URL_PROD;
} else if (nodeEnv === "DEV") {
  baseURL = process.env.NEXT_PUBLIC_PRIMA_PIZZA_BASE_URL_PROD;
}
else {
  baseURL = process.env.NEXT_PUBLIC_PRIMA_PIZZA_BASE_URL_LOCAL;
}

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during build 
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during build
  },
  images: {
    domains: ['prima-pizza-backend-west.azurewebsites.net'],
    unoptimized: true, 
  },
  output: nodeEnv === "LOCAL" ? undefined : 'export',
};

export default nextConfig;
