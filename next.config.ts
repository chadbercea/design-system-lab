import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/design-system-lab/docker-image-runner',
  assetPrefix: '/design-system-lab/docker-image-runner/',
  images: {
    unoptimized: true,
  },
};

export default withSentryConfig(nextConfig, {
  org: "docker-jp",
  project: "javascript-nextjs",

  silent: !process.env.CI,

  widenClientFileUpload: true,

  reactComponentAnnotation: {
    enabled: true,
  },

  tunnelRoute: "/monitoring",

  disableLogger: true,

  automaticVercelMonitors: true,
});
