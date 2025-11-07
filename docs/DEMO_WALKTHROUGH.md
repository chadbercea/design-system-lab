# Panel System Demo Walkthrough

## 🎬 Interactive Demo Guide

### Access the Demo
```
npm run dev
Open: http://localhost:3002/panel-demo
```

---

## 🎮 Control Panel (Top Center)

The control panel is your command center for the demo:

```
┌─────────────────────────────────────────────────────────┐
│ ● Demo Controls  │  Toggle panels to see behavior       │
├─────────────────────────────────────────────────────────┤
│ [← Inspector] [↑ Metrics] [Properties →] [📍 Pin] [↓ Terminal] │
└─────────────────────────────────────────────────────────┘
```

### Button States
- **Normal:** Gray outline
- **Active:** Blue glow with shadow
- **Pinned:** Purple glow (right drawer only)

---

## 📐 Layout Zones

```
┌────────────────────────────────────────────────────────────┐
│                    TOP HISTOGRAM (80px)                     │
│                   Responsive to sides                       │
├───────────┬────────────────────────────────┬───────────────┤
│           │                                │               │
│   LEFT    │       CENTER STAGE             │    RIGHT      │
│  PANEL    │     (100vw × 100vh)            │   DRAWER      │
│  320px    │    Three.js Viewport           │    400px      │
│ (Overlay) │    Never Squished              │ (Overlay/Pin) │
│           │                                │               │
│           │                                │               │
├───────────┴────────────────────────────────┴───────────────┤
│              BOTTOM TERMINAL (300px)                        │
│            Splits - Constrained by sides                    │
└────────────────────────────────────────────────────────────┘
```

---

## 🔄 Demo Sequences

### Sequence 1: Basic Panel Toggling

**Step 1:** All Closed
```
✓ Center stage fills entire viewport
✓ 3D container visible at 100vw × 100vh
✓ Controls visible at top
```

**Step 2:** Open Inspector (Left Panel)
```
Click: ← Inspector
✓ Slides in from left (300ms animation)
✓ Overlays on top of center stage
✓ Center stage viewport unchanged
✓ Shows: Container details, live CPU/memory metrics
```

**Step 3:** Open Metrics (Top Histogram)
```
Click: ↑ Metrics
✓ Slides down from top
✓ Width: Full viewport initially
✓ Updates: Adjusts width when side panels open
✓ Shows: Bar chart + 3 metric cards
```

**Step 4:** Open Properties (Right Drawer)
```
Click: Properties →
✓ Slides in from right
✓ Overlays on center stage
✓ Pin button appears in controls
✓ Shows: Environment variables, volumes, networks
```

**Step 5:** Open Terminal (Bottom)
```
Click: ↓ Terminal
✓ Slides up from bottom
✓ Splits viewport horizontally
✓ Width constrained by open side panels
✓ Shows: Command input + output history
```

---

### Sequence 2: Pin/Unpin Demo (Key Feature!)

**Starting State:** Right drawer closed

**Step 1:** Open Right Drawer
```
Click: Properties →
Result: Drawer overlays (default behavior)
Info Box Shows: "Overlay Mode"
```

**Step 2:** Pin Right Drawer
```
Click: 📍 Pin
Result:
  ✓ Button changes to "📌 Pinned"
  ✓ Button gets purple glow
  ✓ Info box shows: "Pinned (Camera Reshaped)"
  ✓ Camera aspect ratio updates
  ✓ Viewport still 100vw × 100vh
  ✓ Camera FOV unchanged (no zoom)
```

**Step 3:** Unpin Right Drawer
```
Click: 📌 Pinned
Result:
  ✓ Returns to overlay mode
  ✓ Camera aspect resets
  ✓ Button returns to "📍 Pin"
```

---

### Sequence 3: Responsive Width Demo

**Purpose:** Show how top histogram and bottom terminal adapt to side panels

**Step 1:** Open Top Histogram
```
Width: 100vw (full viewport)
```

**Step 2:** Open Left Panel
```
Top Histogram: Left edge shifts right 320px
Bottom edge: Still at 0px (no bottom terminal yet)
Width: ~calc(100vw - 320px)
```

**Step 3:** Open & Pin Right Drawer
```
Top Histogram: Right edge shifts left 400px
Width: ~calc(100vw - 320px - 400px)
```

**Step 4:** Open Bottom Terminal
```
Terminal Width: Same as histogram
Terminal left: 320px (left panel offset)
Terminal right: 400px (right drawer offset)
Shows: Width is constrained by side panels
```

---

## 🎨 Visual Indicators

### Info Overlay (Top Left)

Shows current state:
```
┌─────────────────────────────────┐
│ ● Center Stage Demo             │
├─────────────────────────────────┤
│ Three.js viewport always stays  │
│ 100vw × 100vh.                  │
│ Panels never squish container.  │
├─────────────────────────────────┤
│ Container State: [building]     │
│ Right Drawer: [Overlay Mode]    │
│ Camera Aspect: 1.920            │
├─────────────────────────────────┤
│ MVP Demo - Docker Desktop       │
└─────────────────────────────────┘
```

**Color Codes:**
- Green pulsing dot = Demo active
- Blue badges = Active state
- Purple badges = Pinned state
- Gray badges = Inactive

---

## 📊 Live Data Simulations

### CPU/Memory (Left Panel)
```
Updates: Every 2 seconds
Range: CPU 30-70%, Memory 30-50%
Visual: Animated progress bars
Colors: Blue gradient (CPU), Green gradient (Memory)
```

### Container States (Center)
```
Cycle: building → ready → running → error
Duration: 8 seconds per state
Visual: 3D container changes color/animation
Badge: Shows current state
```

### Histogram (Top Bar)
```
Generation: On page load
Bars: 50 random values
Animation: Opacity and height based on value
Metrics: CPU 45%, Memory 680MB, Network 12.5MB/s
```

---

## 🎯 Key Behaviors to Highlight

### 1. Center Stage Never Squishes ⭐
```
Test: Open all panels
Expected: 3D viewport still 100vw × 100vh
Visual proof: Info box always shows "100vw × 100vh"
```

### 2. Overlay vs Split
```
Left Panel: Overlay (doesn't push)
Right Drawer: Overlay (unpinned) or reshapes camera (pinned)
Top Histogram: Fixed position (responsive width)
Bottom Terminal: Split (pushes content up)
```

### 3. Smooth Transitions
```
All panels: 300ms ease-in-out
Type: CSS transform (GPU accelerated)
No jarring: Animations are intentional
```

### 4. Panel Interdependence
```
Top histogram width → affected by left/right panels
Bottom terminal width → affected by left/right panels
Right drawer pin → affects camera aspect only
```

---

## 💬 Presentation Scripts

### Script 1: The Pitch (30 seconds)
```
"This is our vision for Docker Desktop's spatial interface.
The 3D container is the hero - watch what happens when I
open these panels. [Toggle panels]. See? The viewport never
gets squished. Panels are smart - they know where to position
themselves. This is what Docker Desktop could feel like."
```

### Script 2: The Pin Feature (1 minute)
```
"Let me show you something cool. When I open the right drawer,
it overlays on top. [Open drawer]. But sometimes you want to
keep it open while working. Watch what happens when I pin it.
[Click pin]. The camera reshapes to give you a better view,
but the viewport itself? Still 100vw by 100vh. The zoom level
stays exactly the same - only the aspect ratio changes. This
lets you work with properties while seeing the full container."
```

### Script 3: The Responsive Width (45 seconds)
```
"Notice the top metrics bar? [Point]. Watch what happens as I
open the side panels. [Open left, then right]. See how it
adjusts? Same thing with the terminal at the bottom. [Open
terminal]. The panels are aware of each other. Everything
adapts automatically. No manual resizing needed."
```

---

## 🎓 Common Questions & Answers

**Q: Is this real Docker data?**
A: No, this is an MVP demo with mock data. Real integration happens next.

**Q: Can you resize the panels?**
A: Not in this demo - it's a fixed-size prototype. That's phase 2.

**Q: Does the terminal actually execute commands?**
A: It has a functional input with history, but doesn't execute yet.

**Q: Why does the container state keep changing?**
A: Auto-cycling for demo purposes. Real implementation will show actual state.

**Q: What happens on smaller screens?**
A: This demo is desktop-only. Responsive design is out of scope for MVP.

**Q: Can you have multiple containers?**
A: This demo shows one container. Multi-container view is future work.

---

## 🚀 Power User Tips

### Quick Toggle Pattern
```
1. Open all panels rapidly
2. Watch them cascade into position
3. Shows smooth animation handling
```

### Pin/Unpin Rapidly
```
1. Open right drawer
2. Pin/unpin several times
3. Shows camera aspect updates smoothly
```

### Resource Monitor
```
1. Open left panel
2. Watch CPU/Memory bars
3. Shows ~2 second update cycle
```

### Container State Cycle
```
1. Wait for 8-second cycle
2. Watch colors change
3. Shows: building (orange) → ready (white) → running (green) → error (red)
```

---

## 📸 Screenshot Checklist

Capture these key moments for documentation:

- [ ] **All closed** - Center stage full size
- [ ] **Inspector only** - Show left overlay
- [ ] **Metrics only** - Show top bar
- [ ] **Properties unpinned** - Show right overlay
- [ ] **Properties pinned** - Purple glow + indicator
- [ ] **All open unpinned** - Show overlay behavior
- [ ] **All open pinned** - Show constrained layout
- [ ] **Terminal only** - Show horizontal split
- [ ] **CPU/Memory live update** - Mid-animation
- [ ] **Container state cycle** - Each of 4 states

---

## ✅ Demo Success Checklist

Before presenting, verify:

- [ ] Dev server running on port 3002
- [ ] Browser window maximized for best effect
- [ ] All panels close/open smoothly
- [ ] Pin button appears when right drawer opens
- [ ] CPU/Memory bars animate every 2 seconds
- [ ] Container state cycles every 8 seconds
- [ ] No console errors in browser DevTools
- [ ] Info overlay shows correct state
- [ ] Control buttons highlight when active

---

## 🎊 Closing Remarks

This demo shows a **concept**, not a final product. The goal is to:

1. ✨ **Inspire** stakeholders with the vision
2. 🎯 **Align** teams on the layout approach
3. 🔧 **Inform** technical planning
4. 💬 **Generate** feedback and discussion

Next steps involve working with Docker engineers to integrate real data and functionality.

---

**Happy Demoing! 🚀**
