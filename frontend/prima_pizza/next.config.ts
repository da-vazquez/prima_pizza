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

  async headers() {
    
    return nodeEnv === "LOCAL" ? [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "false" },
          { key: "Access-Control-Allow-Origin", value: "http://localhost:3000" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
        ]
      }
    ] : [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "false" },
          { key: "Access-Control-Allow-Origin", value: "https://white-forest-0d702341e.6.azurestaticapps.net" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
        ]
      }
    ];
  }
};

export default nextConfig;
