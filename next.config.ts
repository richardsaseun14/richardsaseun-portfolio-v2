import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/labs", destination: "/work", permanent: true },
      { source: "/labs/:slug", destination: "/work/:slug", permanent: true },
      { source: "/changelog", destination: "/about", permanent: true },
    ];
  },
};

export default nextConfig;
