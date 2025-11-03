# Panel System Implementation (ILI-122)

This document describes the implementation of the panel layout system where the Three.js center stage always stays 100vh x 100vw while panels overlay or split around it.

## Overview

The panel system ensures that the 3D container (center stage) is never squished or resized by panels opening. Instead, panels overlay or split around the center stage intelligently.

## Architecture

### Core Components

#### 1. Panel Component (`/src/components/ui/panel.tsx`)

The base panel component with CVA (Class Variance Authority) variants for different positions and states.

**Features:**
- Four positions: `top`, `left`, `right`, `bottom`
- Smooth transitions with `duration-300 ease-in-out`
- Overlay mode with shadow effects
- Width/height props for flexible sizing
- Pin support for persistent positioning
- Sub-components: `PanelHeader`, `PanelTitle`, `PanelContent`, `PanelFooter`

**Usage:**
```tsx
<Panel position="left" open={true} width={320}>
  <PanelHeader>
    <PanelTitle>Inspector</PanelTitle>
  </PanelHeader>
  <PanelContent>
    {/* Content */}
  </PanelContent>
</Panel>
```

#### 2. PanelLayout Component (`/src/components/layout/PanelLayout.tsx`)

The main layout orchestrator that manages the panel system state and positioning.

**Components:**
- `PanelLayoutProvider` - Context provider for panel state
- `PanelLayout` - Main layout container
- `CenterStage` - Wrapper for Three.js with camera aspect support
- `usePanelLayout` - Hook to access panel state

**State Management:**
```tsx
const {
  leftPanelOpen,
  rightDrawerOpen,
  rightDrawerPinned,
  topHistogramOpen,
  bottomTerminalOpen,
  toggleLeftPanel,
  toggleRightDrawer,
  toggleRightDrawerPin,
  // ... more state and methods
} = usePanelLayout();
```

#### 3. Histogram Component (`/src/components/ui/histogram.tsx`)

Top bar histogram for displaying metrics and visualizations.

**Features:**
- Responsive bar chart visualization
- Metric display components
- Auto-generated sample data
- Color customization
- Height configuration

**Usage:**
```tsx
<Histogram height={80} barColor="bg-blue-500" />
<MetricDisplay label="CPU" value="45" unit="%" trend="up" />
```

#### 4. Terminal Component (`/src/components/ui/terminal.tsx`)

Bottom terminal panel with command input and output.

**Features:**
- Line-by-line output with type coloring
- Command history with arrow key navigation
- Auto-scroll support
- Timestamp display option
- Type support: `info`, `error`, `warning`, `success`, `command`

**Usage:**
```tsx
<Terminal
  lines={terminalLines}
  onCommand={(cmd) => handleCommand(cmd)}
  autoScroll
/>
```

#### 5. ContainerScene Updates (`/src/components/three/ContainerScene.tsx`)

Enhanced to support dynamic camera aspect ratio changes.

**New Features:**
- `cameraAspect` prop for manual aspect control
- `onCameraReady` callback for camera access
- `CameraAspectUpdater` internal component
- No zoom change when aspect changes (maintains FOV)

## Layout Behavior

### Center Stage (100vh x 100vw)
- Always maintains full viewport dimensions
- Never squished by panel operations
- Z-index: 10

### Top Histogram (80px height)
- Responsive to left/right panel positions
- Adjusts width based on open side panels
- Z-index: 40

### Left Panel (Overlay mode)
- Overlays when open (Figma-style)
- Does not push content
- Default width: 320px
- Z-index: 30

### Right Drawer (Overlay/Pin modes)
- Overlays when open (unpinned)
- When pinned: reshapes Three.js camera aspect ratio
- Maintains zoom level (no FOV change)
- Default width: 400px
- Z-index: 30

### Bottom Terminal (Split mode)
- Splits view horizontally
- Width constrained by open side drawers
- Does not overlay center stage
- Default height: 300px
- Z-index: 40

## Implementation Details

### CSS Strategy
- **Grid/Absolute positioning** for panel placement
- **Tailwind CSS** for styling
- **CVA** for component variants
- **Transitions** for smooth animations
- **z-index layering** for proper stacking

### Performance Optimizations
- React.useMemo for computed values
- React.useCallback for stable functions
- Minimal re-renders with context optimization
- Efficient transition handling (CSS-based)

### Camera Aspect Ratio Handling

When the right drawer is pinned:
```tsx
// Calculate effective viewport width
const effectiveWidth = window.innerWidth - rightDrawerWidth;
const aspect = effectiveWidth / window.innerHeight;

// Update camera aspect (maintains zoom)
camera.aspect = aspect;
camera.updateProjectionMatrix();
```

## Demo Page

The complete implementation is demonstrated at `/panel-demo`:

**URL:** `http://localhost:3002/panel-demo`

**Features:**
- Toggle controls for all panels
- Pin/unpin right drawer
- Auto-cycling container states
- Sample terminal output
- Live metrics histogram
- Responsive panel content

## File Structure

```
src/
├── components/
│   ├── layout/
│   │   └── PanelLayout.tsx        # Main layout orchestrator
│   ├── ui/
│   │   ├── panel.tsx              # Base panel component
│   │   ├── histogram.tsx          # Histogram visualization
│   │   └── terminal.tsx           # Terminal component
│   └── three/
│       └── ContainerScene.tsx     # Enhanced with camera aspect
└── app/
    └── panel-demo/
        └── page.tsx               # Complete demo page
```

## Acceptance Criteria Checklist

- ✅ Three.js stage always 100vh x 100vw
- ✅ Top histogram responsive to panel positions
- ✅ Left panel overlays (doesn't push content)
- ✅ Right drawer overlays (doesn't push content)
- ✅ Bottom terminal splits horizontally
- ✅ Terminal width constrained by open side drawers
- ✅ Pinned right drawer: reshapes camera (maintains zoom)
- ✅ Smooth transitions when panels open/close

## Usage Example

```tsx
import {
  PanelLayoutProvider,
  PanelLayout,
  usePanelLayout,
} from "@/components/layout/PanelLayout";
import { Panel, PanelHeader, PanelTitle, PanelContent } from "@/components/ui/panel";
import { ContainerScene } from "@/components/three/ContainerScene";

export default function MyPage() {
  return (
    <PanelLayoutProvider>
      <PanelLayout
        centerSlot={<ContainerScene state="ready" />}
        leftSlot={
          <Panel position="left" open={true} width={320}>
            <PanelHeader>
              <PanelTitle>Left Panel</PanelTitle>
            </PanelHeader>
            <PanelContent>Content here</PanelContent>
          </Panel>
        }
      />
    </PanelLayoutProvider>
  );
}
```

## Customization

### Panel Widths/Heights
```tsx
<PanelLayoutProvider
  defaultLeftPanelOpen={false}
  defaultRightDrawerOpen={false}
>
  {/* Use setLeftPanelWidth(), setRightDrawerWidth() from context */}
</PanelLayoutProvider>
```

### Styling
All components support className overrides:
```tsx
<Panel className="bg-custom border-custom">
<Histogram className="custom-histogram" barColor="bg-purple-500">
<Terminal className="custom-terminal">
```

## Browser Compatibility

- Modern browsers with CSS Grid support
- CSS custom properties (oklch color space)
- React 19.2.0+
- Next.js 16.0.1+

## Performance Notes

- Smooth 60fps transitions
- No layout thrashing during animations
- Efficient React context updates
- GPU-accelerated CSS transforms
- Minimal JavaScript execution in animation loop

## Future Enhancements

Potential improvements:
- Resizable panels with drag handles
- Panel state persistence (localStorage)
- Keyboard shortcuts for panel toggling
- Multiple panel configurations (presets)
- Panel snapping and docking
- Custom panel positions and sizes

## Related Files

- Linear Issue: [ILI-122](https://linear.app/iliketobuild/issue/ILI-122)
- PRD: [User Experience Interface](https://www.notion.so/User-Experience-Interface-2a070f3a83ae815ebf63e605b50a69f1)
- Branch: `chadbercea/ili-122-build-panel-system-layout-center-stage-never-squishes`
