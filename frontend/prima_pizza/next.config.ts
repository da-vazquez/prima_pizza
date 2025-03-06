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
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${baseURL}/api/:path*`,
      },
      {
        source: '/api/v1/auth/:path*',
        destination: `${baseURL}/api/v1/auth/:path*`,
      },
      {
        source: '/api/v1/toppings/:path*',
        destination: `${baseURL}/api/v1/toppings/:path*`,
      },
      {
        source: '/api/v1/pizzas/:path*',
        destination: `${baseURL}/api/v1/pizzas/:path*`,
      },    
    ]
  },
};

export default nextConfig;
