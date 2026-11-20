import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Emits a self-contained server in .next/standalone, so the runtime image needs neither TypeScript nor an npm install.
  output: "standalone",
};

export default nextConfig;
