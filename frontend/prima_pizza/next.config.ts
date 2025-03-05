import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Skips type checking during build
  },
  eslint: {
    ignoreDuringBuilds: true, // Skips ESLint checks during build
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "prima-pizza-i0apt531l-davazquezs-projects.vercel.app" }],
        permanent: true,
        destination: "https://prima-pizza-i0apt531l-davazquezs-projects.vercel.app/:path*",
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "prima-pizza-i0apt531l-davazquezs-projects.vercel.app" }],
        permanent: true,
        destination: "https://prima-pizza-i0apt531l-davazquezs-projects.vercel.app/:path*",
      },
    ];
  },
};

export default nextConfig;
