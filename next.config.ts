import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The /cv route reads the uploaded PDF from disk, so ship it with the function.
  outputFileTracingIncludes: {
    "/cv": ["./content/cv/**"],
  },
};

export default nextConfig;
