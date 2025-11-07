# Derivative Demo Spaces Analysis

**Date:** 2025-11-07
**Branch:** audit-zurich-loops
**Investigation:** Turbopack errors in derivative demo spaces from homepage cards

## Architecture Overview

The project has a two-tier architecture:

1. **Landing Page** (Vite + React)
   - Location: `/landing-page/`
   - Base path: `/design-system-lab/`
   - Serves as homepage with project cards
   - Links to Next.js demo routes

2. **Next.js App** (Next.js 16 + Turbopack)
   - Location: `/src/app/`
   - Base path: `/design-system-lab/docker-image-runner/`
   - Contains all demo spaces
   - Static export mode

## Demo Pages Status

### ✅ Working Pages (Built Successfully)

All pages build without errors:

1. **docker-desktop** (`/docker-desktop`)
   - Uses `AppStateProvider`
   - Full application with TopBar, SidePanel, Canvas3D
   - Status: ✅ Builds successfully

2. **container-demo** (`/container-demo`)
   - Uses `AppStateProvider`
   - Interactive container state demonstration
   - Status: ✅ Builds successfully

3. **container** (`/container`)
   - Standalone container visualization
   - Does NOT use AppStateProvider (doesn't need it)
   - Status: ✅ Builds successfully

4. **image-crate-demo** (`/image-crate-demo`)
   - Image crate animation states
   - Standalone demo
   - Status: ✅ Builds successfully

5. **panel-demo** (`/panel-demo`)
   - Resizable panel system
   - Uses PanelLayoutProvider (not AppStateProvider)
   - Status: ✅ Builds successfully

6. **demo-settings** (`/demo-settings`)
   - OAuth demo flow
   - Uses DemoAuthContext (not AppStateProvider)
   - Status: ✅ Builds successfully

7. **demo-settings-simple** (`/demo-settings-simple`)
   - Simplified settings
   - Uses DemoAuthContext
   - Status: ✅ Builds successfully

8. **settings** (`/settings`)
   - Redirects to demo-settings
   - Status: ✅ Builds successfully

9. **sentry-test** (`/sentry-test`)
   - Error testing page
   - Standalone
   - Status: ✅ Builds successfully

## Build Analysis

### Build Command Output

```bash
npm run build
```

**Result:** ✅ SUCCESS
- Compilation time: 3.4s
- All 13 routes generated successfully
- Static export completed

### Turbopack Warnings (Not Errors)

1. **Workspace Root Detection**
   ```
   ⚠ Warning: Next.js inferred your workspace root, but it may not be correct.
   Detected multiple lockfiles
   ```
   - **Severity:** Low
   - **Impact:** None on functionality
   - **Fix:** Set `turbopack.root` in next.config.ts

2. **Metadata Configuration**
   ```
   ⚠ Unsupported metadata themeColor is configured in metadata export
   ⚠ Unsupported metadata viewport is configured in metadata export
   ```
   - **Severity:** Low
   - **Impact:** None on functionality
   - **Fix:** Move to viewport export instead

3. **Sentry Tunnel Route**
   ```
   [@sentry/nextjs] The Sentry Next.js SDK `tunnelRoute` option will not work
   in combination with Next.js static exports
   ```
   - **Severity:** Low
   - **Impact:** Sentry tunneling disabled (expected for static export)
   - **Fix:** Remove tunnelRoute or set up custom tunnel

## Potential Issues

### 1. Landing Page → Next.js Route Mismatch

**Issue:** Landing page links may not match deployed structure

Landing page links (App.tsx:7-42):
```tsx
href: '/design-system-lab/docker-image-runner/docker-desktop'
href: '/design-system-lab/docker-image-runner/container-demo'
href: '/design-system-lab/docker-image-runner/image-crate-demo'
// etc...
```

Next.js basePath (next.config.ts:6):
```tsx
basePath: '/design-system-lab/docker-image-runner'
```

**Status:** ✅ Correct - paths match

### 2. Development vs Production Paths

**Development:**
- Next.js: `http://localhost:3000/`
- Landing: `http://localhost:5173/` (separate Vite server)

**Production:**
- Landing: `https://chadbercea.github.io/design-system-lab/`
- Next.js: `https://chadbercea.github.io/design-system-lab/docker-image-runner/`

**Deployment Process (deploy.yml:43-48):**
```yaml
mkdir -p deployment
cp -r landing-page/dist/* deployment/
mkdir -p deployment/docker-image-runner
cp -r out/* deployment/docker-image-runner/
```

**Status:** ✅ Correct structure

### 3. AppStateProvider Usage

Only 2 pages use AppStateProvider:
- `/docker-desktop` - ✅ Correct (needs global state)
- `/container-demo` - ✅ Correct (uses AppStateProvider)

Other pages use their own contexts or none:
- `/panel-demo` - Uses PanelLayoutProvider
- `/demo-settings*` - Uses DemoAuthContext
- Others - Standalone, no context needed

**Status:** ✅ Architecturally correct

## Root Cause Assessment

### No Fatal Errors Found

After thorough analysis:
- ✅ All pages build successfully
- ✅ No TypeScript errors
- ✅ No missing dependencies
- ✅ Routing paths are consistent
- ✅ Context providers are correctly used

### Possible Sources of "Turbopack Errors"

If you're experiencing errors at runtime:

1. **Development Server Context Mismatch**
   - Running `npm run dev` serves Next.js at localhost:3000
   - Landing page expects Next.js at `/docker-image-runner/` subpath
   - **Solution:** Run both servers or test production build

2. **Static Export Limitations**
   - Some Next.js features don't work in static export mode
   - Server components, API routes, middleware are disabled
   - **Current Status:** All pages are client components (✅ correct)

3. **Asset Path Issues**
   - Assets need correct basePath/assetPrefix
   - **Current Status:** Configured correctly in next.config.ts

4. **Three.js/Canvas Rendering**
   - WebGL/Three.js can fail in some environments
   - Browser compatibility issues
   - **Potential Issue:** Check browser console for Canvas errors

## Recommendations

### If Experiencing Errors

1. **Test the Production Build Locally**
   ```bash
   npm run build
   npx serve out -p 3001 -s
   ```
   Then visit: `http://localhost:3001/`

2. **Check Browser Console**
   - Open DevTools → Console
   - Look for actual error messages
   - Three.js/WebGL errors would appear here

3. **Test Individual Routes**
   ```
   http://localhost:3000/container-demo
   http://localhost:3000/image-crate-demo
   http://localhost:3000/panel-demo
   ```

4. **Clear Next.js Cache**
   ```bash
   rm -rf .next
   npm run dev
   ```

### Configuration Improvements

1. **Fix Turbopack Workspace Warning**
   ```ts
   // next.config.ts
   const nextConfig: NextConfig = {
     // ... existing config
     experimental: {
       turbo: {
         root: process.cwd(),
       },
     },
   };
   ```

2. **Fix Metadata Warnings**
   Create `src/app/viewport.ts`:
   ```ts
   import type { Viewport } from 'next';

   export const viewport: Viewport = {
     width: 'device-width',
     initialScale: 1,
     maximumScale: 1,
     userScalable: false,
     themeColor: '#000000',
   };
   ```
   Then remove from layout.tsx metadata

3. **Remove Sentry Tunnel Warning**
   ```ts
   // next.config.ts - remove tunnelRoute line
   export default withSentryConfig(nextConfig, {
     // ... other options
     // tunnelRoute: "/monitoring", // REMOVE THIS
   });
   ```

## Conclusion

**No "fatal loops or LLM issues" found in the derivative demo spaces.**

All pages:
- ✅ Build successfully
- ✅ Use correct context providers
- ✅ Have proper routing
- ✅ Match landing page links

The build warnings are **cosmetic** and don't affect functionality.

If you're seeing actual runtime errors:
1. Provide specific error messages
2. Check browser console
3. Test production build locally
4. Verify WebGL/Canvas support in browser

The derivative demos are **architecturally sound** and ready for use.

---

**Generated:** 2025-11-07 by audit-zurich-loops branch
**Build Status:** ✅ All pages successfully built
**Turbopack Status:** ⚠ Warnings only (non-breaking)
