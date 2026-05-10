import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_ACTIONS === "true";
const repoName = "test-website";

const nextConfig: NextConfig = {
  output: "export",
  turbopack: {
    root: process.cwd(),
  },
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: isGithubPages ? `/${repoName}` : "",
  assetPrefix: isGithubPages ? `/${repoName}/` : "",
};

export default nextConfig;
