import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@forkcast/domain", "@forkcast/integrations"]
};

export default nextConfig;
