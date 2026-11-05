import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // The /cv route reads the uploaded PDF from disk, so ship it with the function.
  outputFileTracingIncludes: {
    "/cv": ["./content/cv/**"],
    "/work/*": ["./content/case-studies/**"],
  },
};

export default createMDX({
  options: { remarkPlugins: ["remark-frontmatter"] },
})(nextConfig);
