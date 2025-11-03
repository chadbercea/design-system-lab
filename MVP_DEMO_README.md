# MVP Demo: Panel System Layout (ILI-122)

## 🎯 Purpose

This is an **MVP demonstration** of the panel layout system concept for Docker Desktop integration. This demo is designed to:

1. **Visualize** the panel system architecture
2. **Demonstrate** key behaviors (overlay, split, pin)
3. **Prototype** the user experience
4. **Communicate** the vision to stakeholders

**Note:** This is a design prototype with mock data. Real Docker Desktop integration will be handled by the Docker team.

---

## 🚀 Quick Start

### Run the Demo

```bash
npm install
npm run dev
```

Then visit: **http://localhost:3002/panel-demo**

---

## 🎨 Demo Features

### Interactive Controls (Top Center)

The demo includes prominent controls to toggle all panels:

- **← Inspector** - Left panel with container details
- **↑ Metrics** - Top histogram bar
- **Properties →** - Right drawer with env vars
- **📍 Pin** - Pin/unpin right drawer (camera reshape demo)
- **↓ Terminal** - Bottom terminal panel

### Key Behaviors Demonstrated

#### ✅ Center Stage Never Squishes
- Three.js viewport always stays **100vw × 100vh**
- Panels overlay or split around it
- Visual indicator in top-left shows this

#### ✅ Left Panel - Overlay Mode
- Slides in from left (Figma-style)
- Does NOT push the center stage
- Shows mock container details with **live updating metrics**

#### ✅ Right Drawer - Pin/Overlay Modes
- **Unpinned:** Overlays on top of center stage
- **Pinned:** Reshapes Three.js camera aspect ratio
  - Camera FOV stays the same (no zoom)
  - Effective viewport width changes
  - Visual feedback shows "Pinned (Camera Reshaped)"

#### ✅ Top Histogram
- Responsive to left/right panel positions
- Width adjusts automatically
- Shows mock metrics with live updates

#### ✅ Bottom Terminal
- Splits viewport horizontally
- Width constrained by open side panels
- Functional command input with history

#### ✅ Smooth Transitions
- All panels animate with 300ms ease-in-out
- No jarring movements
- GPU-accelerated transforms

---

## 📦 Mock Data & Simulations

### Container Details (Left Panel)
```
Name: webapp-prod
Image: node:20-alpine
Status: Running ● (green indicator)
Uptime: 2h 34m 12s
ID: a8c4f2e9b1d3
```

### Live Simulations
- **CPU Usage:** Randomly fluctuates 30-70% every 2 seconds
- **Memory Usage:** Randomly fluctuates 30-50% every 2 seconds
- **Container State:** Auto-cycles through building → ready → running → error every 8 seconds
- **Histogram:** Generates 50 random bars on load

### Port Mappings
```
3000/tcp → localhost:3000
5432/tcp → localhost:5432
6379/tcp → localhost:6379
```

---

## 🏗️ Architecture Overview

### Component Structure

```
PanelDemoPage
├── PanelLayoutProvider (context)
│   └── PanelLayout (orchestrator)
│       ├── centerSlot: ContainerScene (Three.js)
│       ├── topSlot: Histogram panel
│       ├── leftSlot: Inspector panel
│       ├── rightSlot: Properties drawer
│       └── bottomSlot: Terminal panel
└── PanelControls (demo UI)
```

### State Management

```typescript
usePanelLayout() returns:
  - leftPanelOpen: boolean
  - rightDrawerOpen: boolean
  - rightDrawerPinned: boolean  // ⭐ Key feature
  - topHistogramOpen: boolean
  - bottomTerminalOpen: boolean
  - toggle functions for each panel
  - width/height setters
```

### Camera Aspect Logic

```typescript
// When right drawer is pinned:
const effectiveWidth = window.innerWidth - rightDrawerWidth;
const aspect = effectiveWidth / window.innerHeight;
camera.aspect = aspect;
camera.updateProjectionMatrix();
// ✅ FOV stays the same = no zoom change
```

---

## 🎭 What This Demo Shows

### For Product Managers
- ✅ **User Experience:** Panels don't interfere with the 3D viewport
- ✅ **Flexibility:** Multiple panel configurations possible
- ✅ **Polish:** Smooth animations and visual feedback

### For Designers
- ✅ **Layout System:** Clear z-index layering
- ✅ **Responsive:** Panels adapt to each other
- ✅ **Visual Language:** Consistent with Docker branding potential

### For Engineers (Docker Team)
- ✅ **Technical Feasibility:** All behaviors are implementable
- ✅ **Performance:** CSS-based animations, no layout thrashing
- ✅ **Integration Points:** Clear component boundaries
- ✅ **Camera Control:** Proper Three.js aspect ratio handling

---

## 🔧 Customization Points

### Panel Dimensions
```tsx
// Default values (can be changed via context)
leftPanelWidth: 320px
rightDrawerWidth: 400px
topHistogramHeight: 80px
bottomTerminalHeight: 300px
```

### Mock Data
Edit `/src/app/panel-demo/page.tsx`:
- `LeftPanelContent()` - Container details, metrics
- `RightDrawerContent()` - Environment variables, volumes
- `TopHistogramContent()` - Metrics display
- `BottomTerminalContent()` - Terminal output

### Styling
All components use Tailwind CSS:
- Colors: `zinc-*` scale for dark theme
- Accents: `blue-500`, `green-500`, `purple-500`
- Transitions: `duration-300 ease-in-out`

---

## 📸 Screenshot Guide

### Demo States to Capture

1. **All Closed** - Show center stage at full size
2. **Inspector Open** - Left panel overlay
3. **All Panels Open (Unpinned)** - Show overlay behavior
4. **Right Drawer Pinned** - Show camera reshape indicator
5. **Terminal Open** - Show horizontal split

### Key Visual Elements

- Green pulsing dot = "Center Stage Demo" indicator
- Blue glow on active panel buttons
- Purple glow when drawer is pinned
- Mock data labels: "Mock Data" badges in panels
- "MVP Demo" footer text in info overlay

---

## 🚫 What This Demo Does NOT Include

This is an MVP prototype, so it intentionally excludes:

- ❌ Real Docker API integration
- ❌ Live container data fetching
- ❌ Authentication/permissions
- ❌ Persistent panel state (localStorage)
- ❌ Resizable panels (drag handles)
- ❌ Keyboard shortcuts
- ❌ Panel presets/configurations
- ❌ Error handling/retry logic
- ❌ Production-grade performance optimizations

**These will be handled during production implementation with the Docker team.**

---

## 📋 Next Steps (For Docker Integration)

### Phase 1: API Integration
- Replace mock data with Docker Desktop API calls
- Real container stats (CPU, memory, network)
- Live log streaming to terminal
- Port mapping from actual containers

### Phase 2: Interactivity
- Make buttons functional (restart, stop, etc.)
- Terminal commands execute in container
- Inspector shows real container layers
- Properties panel edits env vars

### Phase 3: Enhancement
- Add panel resize handles
- Implement panel state persistence
- Add keyboard shortcuts (Cmd+B for panels)
- Multiple container views

### Phase 4: Polish
- Performance profiling with 100+ containers
- Accessibility audit (ARIA, keyboard nav)
- Dark/light theme support
- Animation timing refinements

---

## 🎥 Demo Presentation Tips

### For Stakeholder Demos

1. **Start with all panels closed** - Show the 3D container in full glory
2. **Open Inspector** - "See how it overlays without affecting the viewport"
3. **Open Metrics** - "Top bar adapts to side panels automatically"
4. **Open Right Drawer** - "Notice it overlays first"
5. **Click Pin** - "Now watch the camera reshape - viewport stays 100vh x 100vw but camera adjusts"
6. **Open Terminal** - "Bottom panel splits horizontally, constrained by side panels"
7. **Point out live metrics** - "CPU and memory update every 2 seconds to simulate real data"
8. **Show container state cycle** - Wait 8 seconds to see states change

### Key Talking Points

> "The 3D container is the hero. It never gets squished."

> "Panels are smart - they know how to position themselves around each other."

> "When you pin the right drawer, the camera reshapes but the zoom stays the same."

> "All transitions are smooth and intentional - no jarring movements."

> "This is what Docker Desktop could feel like with a spatial interface."

---

## 📁 File Locations

### Core Demo Files
- `/src/app/panel-demo/page.tsx` - Main demo page ⭐
- `/src/components/layout/PanelLayout.tsx` - Layout system
- `/src/components/ui/panel.tsx` - Panel component
- `/src/components/ui/histogram.tsx` - Metrics visualization
- `/src/components/ui/terminal.tsx` - Terminal component

### Documentation
- `/MVP_DEMO_README.md` - This file
- `/PANEL_SYSTEM_IMPLEMENTATION.md` - Technical details

---

## 🐛 Known Demo Limitations

1. **Mock data resets on refresh** - No persistence
2. **Histogram data is random** - Not real metrics
3. **Terminal commands don't execute** - Just echoes input
4. **Container state cycling** - Auto-cycles for demo purposes
5. **No responsive breakpoints** - Desktop only

These are intentional for the MVP demo scope.

---

## 💡 Feedback & Questions

This demo is designed to spark conversation. When presenting:

- Encourage stakeholders to interact with controls
- Ask: "What panel configurations would be most useful?"
- Discuss: "Should panels be resizable?"
- Consider: "What other data would you want to see?"

---

## 🎉 Success Criteria

This demo is successful if it:

- ✅ Clearly shows the "center stage never squishes" behavior
- ✅ Demonstrates smooth panel transitions
- ✅ Illustrates the pin/unpin camera reshape concept
- ✅ Generates excitement about the spatial interface vision
- ✅ Provides a foundation for technical planning with Docker engineers

---

**Built with:** React 19, Next.js 16, Three.js, Tailwind CSS, React Three Fiber

**Status:** MVP Demo Ready ✨

**Intended Audience:** Product Managers, Designers, Docker Engineering Team, Stakeholders
