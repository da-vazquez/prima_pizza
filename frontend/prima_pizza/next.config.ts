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
  
  // For local development only, use API routes
  rewrites: async () => {
    if (nodeEnv === "LOCAL") {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:5005/api/:path*',
        }
      ];
    }
    return [];
  },

  // Headers for CORS - apply only when not in LOCAL mode
  async headers() {
    return nodeEnv !== "LOCAL" ? [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
        ]
      }
    ] : [];
  }
};

export default nextConfig;
