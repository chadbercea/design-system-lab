// Helper to get asset paths with basePath
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function getAssetPath(path: string): string {
  return `${basePath}${path}`;
}

export const ASSETS = {
  dockerLogo: getAssetPath('/docker-logo.svg'),
  manifest: getAssetPath('/manifest.json'),
  favicon16: getAssetPath('/favicon-16x16.png'),
  favicon32: getAssetPath('/favicon-32x32.png'),
  appleTouch: getAssetPath('/apple-touch-icon.png'),
} as const;
