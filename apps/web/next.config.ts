import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, "../.."),
  transpilePackages: [
    "@alpha-dfs/shared",
    "@alpha-dfs/connectors",
    "@alpha-dfs/database",
    "@alpha-dfs/observability",
    "@alpha-dfs/telemetry-export",
    "@alpha-dfs/evidence",
    "@alpha-dfs/prediction-confidence",
    "@alpha-dfs/portfolio-simulation",
    "@alpha-dfs/portfolio-intelligence",
  ],
};

export default nextConfig;
