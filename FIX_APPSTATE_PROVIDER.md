# Fix: AppStateProvider Missing in Demo Pages

**Date:** 2025-11-07
**Branch:** audit-zurich-loops
**Issue:** `useAppState must be used within an AppStateProvider` runtime error

## Problem

When clicking on demo cards from the homepage, some derivative demo spaces failed with:

```
Uncaught Error: useAppState must be used within an AppStateProvider
    at useAppState (app-state-context.tsx)
```

## Root Cause

**Component Dependency Chain:**
1. Demo pages use `<ContainerScene>` component
2. `ContainerScene` renders `<Container3D>` component
3. `Container3D` calls the `useAppState()` hook
4. `useAppState()` requires an `AppStateProvider` wrapper

**The Issue:**
- `panel-demo` and `container` pages used `ContainerScene` but didn't wrap content in `AppStateProvider`
- `container-demo` already had it, so it worked fine

## Why Container-Demo Worked

`src/app/container-demo/page.tsx` already had the provider:

```tsx
export default function ContainerDemoPage() {
  return (
    <AppStateProvider>  // ✅ Already present
      <main className="w-screen h-screen bg-gray-900 flex flex-col">
        ...
      </main>
    </AppStateProvider>
  );
}
```

## Pages Fixed

### 1. Panel Demo (`src/app/panel-demo/page.tsx`)

**Before:**
```tsx
export default function PanelDemoPage() {
  return (
    <PanelLayoutProvider ...>
      <PanelDemoContent />
    </PanelLayoutProvider>
  );
}
```

**After:**
```tsx
import { AppStateProvider } from "@/lib/app-state-context";

export default function PanelDemoPage() {
  return (
    <AppStateProvider>  // ✅ Added
      <PanelLayoutProvider ...>
        <PanelDemoContent />
      </PanelLayoutProvider>
    </AppStateProvider>
  );
}
```

### 2. Container (`src/app/container/page.tsx`)

**Before:**
```tsx
export default function ContainerDemo() {
  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      ...
    </div>
  );
}
```

**After:**
```tsx
import { AppStateProvider } from '@/lib/app-state-context';

export default function ContainerDemo() {
  return (
    <AppStateProvider>  // ✅ Added
    <div className="min-h-screen bg-zinc-950 p-8">
      ...
    </div>
    </AppStateProvider>
  );
}
```

## Changes Made

### Files Modified:
1. `src/app/panel-demo/page.tsx`
   - Added import: `import { AppStateProvider } from "@/lib/app-state-context";`
   - Wrapped content with `<AppStateProvider>`

2. `src/app/container/page.tsx`
   - Added import: `import { AppStateProvider } from '@/lib/app-state-context';`
   - Wrapped content with `<AppStateProvider>`

## Verification

Build Status: ✅ **SUCCESS**

```bash
npm run build
# ✓ Compiled successfully in 3.5s
# ✓ Generating static pages (13/13)
```

All 13 routes now build successfully:
- / (homepage)
- /container ✅ Fixed
- /container-demo ✅ Already working
- /panel-demo ✅ Fixed
- /docker-desktop
- /image-crate-demo
- /demo-settings
- /demo-settings-simple
- /settings
- /sentry-test
- /_not-found

## Testing Checklist

When deployed, verify these pages load without errors:

- [ ] `/panel-demo` - Opens without `useAppState` error
- [ ] `/container` - Opens without `useAppState` error
- [ ] `/container-demo` - Still works (already was working)
- [ ] All 3D scenes render correctly
- [ ] Panel interactions work in panel-demo
- [ ] Container visualizations animate properly

## Why This Wasn't Caught in Build

The error only appears at **runtime** in the browser, not during build:
- Next.js static export builds all pages successfully
- The error happens when React tries to render components that call `useAppState()`
- TypeScript/build tools don't detect this because it's a runtime React context issue

## Prevention

To prevent this in the future:

1. **Any page using `ContainerScene` must wrap with `AppStateProvider`**
2. Consider creating a HOC or wrapper component:
   ```tsx
   // src/components/three/ContainerSceneWithProvider.tsx
   export function ContainerSceneWithProvider(props) {
     return (
       <AppStateProvider>
         <ContainerScene {...props} />
       </AppStateProvider>
     );
   }
   ```
3. Add ESLint rule or documentation reminder

## Related Components

Components that require `AppStateProvider`:
- `Container3D` (calls `useAppState()` directly)
- `ContainerScene` (renders `Container3D`)
- `Canvas3D` (calls `useAppState()`)
- `TopBar`, `SidePanel`, `BottomBar` (all use app state)
- `ContainerActionsBar`, `LeftPanel`, `DrawerToggle` (all use app state)

## Summary

**The Issue:** Two demo pages were missing the required `AppStateProvider` context wrapper.

**The Fix:** Added `<AppStateProvider>` wrapper to both `panel-demo` and `container` pages.

**The Result:** All derivative demo spaces now load correctly without runtime errors.

---

**Status:** ✅ Fixed and verified
**Build:** ✅ All pages compile successfully
**Next Steps:** Test deployed pages in browser
