# Container State System - Milestone Documentation

## Overview
This document describes the interactive 3D Docker container visualization system that demonstrates various container lifecycle states through animated transitions and visual feedback.

## Architecture

### Core Components

#### 1. ContainerScene (`src/components/three/ContainerScene.tsx`)
- **Purpose**: Root R3F Canvas wrapper with lighting and camera setup
- **Key Features**:
  - Black background (`#000000`) for clean presentation
  - State-dependent camera positioning
  - Three-point lighting system (ambient, directional key, directional rim)
  - State-specific accent lighting (orange for building, green for running, red for error)
  - OrbitControls with configured constraints (zoom, rotation limits)
  - Double-click to reset camera view

#### 2. Container3D (`src/components/three/Container3D.tsx`)
- **Purpose**: Main container logic and state management
- **Key Features**:
  - State machine driving visual transitions
  - Per-state wall rendering (building uses planes, running uses box geometry)
  - Wireframe animation system (dotted to solid transition)
  - Terminal text animation (character-by-character typing)
  - Door and crate orchestration
  - Color interpolation for running state fade
  - Container rotation for error state presentation

#### 3. ContainerDoors (`src/components/three/ContainerDoors.tsx`)
- **Purpose**: Door geometry, rotation, and terminal text rendering
- **Key Features**:
  - Door rotation animations (open/closed states)
  - Canvas-based terminal text rendering with Monaco font
  - Per-state door materials (transparent, black, blue)
  - DoubleSide rendering for visibility during rotation
  - Terminal positioned on outer door face (`z = DOOR.depth / 2 + 0.01`)

#### 4. ImageCrateModel (`src/components/three/ImageCrate.tsx`)
- **Purpose**: Animated Docker image crate visualization
- **States**: `entering`, `floating`, `docking`, `docked`
- **Features**: Smooth position/rotation animations, Docker logo display

---

## State Behaviors

### 1. Ready State
**Visual Appearance:**
- Transparent container with solid blue wireframe edges
- Doors fully open (90° rotation)
- No crate visible
- Static container (no rotation)

**Use Case:** Initial idle state, waiting for user action

---

### 2. Building State
**Visual Appearance:**
- Container walls fade in as black planes (back → left → right → top → bottom)
- Wireframe transitions from dotted to solid lines
- Doors close during wall fade-in
- Terminal text appears on left door with character-by-character typing animation
- "Building container..." text floats above container
- Image crate enters from below, floats, docks at bottom

**Animation Sequence:**
1. **Wall Fade-In** (0-2s): Black planes appear sequentially with eased opacity
2. **Door Close** (0-2s): Doors rotate from -90° to 0° (synchronized with walls)
3. **Wireframe Transition** (0-2s): Gap size animates from 0.8 to 0 (dotted → solid)
4. **Terminal Text** (after doors close): Types 7 lines at 30 chars/second
   - Canvas redraws every frame when terminal lines exist
   - "Starting..." line has animated dots (cycles every 500ms)
5. **Crate Animation**: Enters → Floats → Docks at container bottom

**Technical Details:**
- Wall opacity uses ease-out cubic easing
- Canvas texture: 800×1344px (matches door 2.5:4.2 aspect ratio)
- Terminal font: 28px Monaco/Courier New, green (#00FF00) on black
- Door material: Black with animated opacity (0 → 0.95)

---

### 3. Running State
**Visual Appearance:**
- Container auto-rotates slowly (continuous)
- Walls fade COLOR from black to Docker blue (`#1d63ed`) over 2 seconds
- Doors closed and blue
- Crate floating at bottom
- Smooth rotation with full opacity

**Animation Details:**
- **Rotation Speed**: `elapsed * 0.1` radians (very slow, continuous)
- **Color Fade**: Linear RGB interpolation with ease-out cubic easing
  - From: `#000000` (black)
  - To: `#1d63ed` (Docker blue)
  - Duration: 2 seconds
- **Opacity**: Remains at 1.0 throughout (no transparency animation)

**Technical Implementation:**
```typescript
// Color interpolation per-frame
const blackR = 0, blackG = 0, blackB = 0;
const blueR = 0x1d, blueG = 0x63, blueB = 0xed;
const r = Math.round(blackR + (blueR - blackR) * eased);
const g = Math.round(blackG + (blueG - blackG) * eased);
const b = Math.round(blackB + (blueB - blackB) * eased);
wallMaterial.color.setHex((r << 16) | (g << 8) | b);
```

---

### 4. Error State
**Visual Appearance:**
- Container rotates 45° to show door side angle
- Doors open with solid black fill (opacity: 1.0)
- Black walls visible
- Crate floating at bottom
- OrbitControls remain functional (container rotates, not camera)

**Animation Details:**
- **Container Rotation**: 0° → 45° over 1.5 seconds (ease in-out cubic)
- **Door State**: Open with black material (`color: 0x000000, opacity: 1.0`)
- **Camera**: Remains user-controlled via OrbitControls

**Key Design Decision:**
The container rotates (not the camera) to preserve OrbitControls functionality. This allows users to orbit, zoom, and inspect the error state freely.

---

## Technical Implementation Details

### Canvas Texture Rendering (Terminal Text)
Located in `ContainerDoors.tsx` lines 149-179:

```typescript
// Redraw canvas every frame when terminal lines exist
if (terminalLines.length > 0) {
  const canvas = canvasRef.current;
  const ctx = canvas?.getContext('2d');

  // Clear previous frame
  ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Render terminal text
  ctx.fillStyle = '#00FF00';
  ctx.font = '28px Monaco, Courier New, monospace';
  terminalLines.forEach((line, index) => {
    ctx.fillText(line, 40, startY + index * lineHeight);
  });

  // Mark texture for update
  terminalTextureRef.current.needsUpdate = true;
}
```

**Critical Fix:** Canvas updates every frame (not just when "Starting..." appears), enabling smooth character-by-character typing.

### Character Typing Animation
Located in `Container3D.tsx` lines 254-315:

```typescript
// Calculate characters to display based on elapsed time
const charsPerSecond = 30;
const targetCharCount = Math.floor(elapsed * charsPerSecond);

// Build visible lines by consuming character budget
let charsRemaining = targetCharCount;
const visibleLines: string[] = [];

for (const line of allLines) {
  if (charsRemaining >= line.length) {
    visibleLines.push(line);
    charsRemaining -= line.length;
  } else if (charsRemaining > 0) {
    visibleLines.push(line.substring(0, charsRemaining));
    charsRemaining = 0;
  }
}

// Update state only when content changes
if (visibleLines.some((line, idx) => line !== terminalLines[idx])) {
  setTerminalLines(visibleLines);
}
```

### Door Material System
Located in `ContainerDoors.tsx` lines 105-126:

```typescript
const doorMaterial = useMemo(() => {
  let color = CONTAINER_COLORS.WALL_SURFACE;
  let opacity = 1.0;

  if (containerState === 'building') {
    color = 0x000000;
    opacity = buildingDoorOpacity; // Animated 0 → 0.95
  } else if (containerState === 'error') {
    color = 0x000000;
    opacity = 1.0; // Solid black fill
  } else if (containerState === 'running') {
    color = 0x1d63ed; // Docker blue
  } else if (state === 'open' || containerState === 'ready') {
    opacity = 0.0; // Transparent
  }

  return new THREE.MeshBasicMaterial({
    color,
    side: THREE.DoubleSide, // Critical for rotation visibility
    transparent: true,
    opacity,
  });
}, [state, containerState, buildingDoorOpacity]);
```

---

## Extension Points

### Adding New States
1. **Define State Type**: Add to `ContainerState` in `src/lib/container-colors.ts`
2. **Add State Logic**: Implement in `Container3D.tsx` useFrame hook
3. **Configure Materials**: Update door/wall material logic in respective components
4. **Add Lighting**: Optionally add accent light color in `ContainerScene.tsx`

### Customizing Animations
- **Timing**: Adjust duration constants in useEffect state initialization
- **Easing**: Modify easing functions in useFrame (currently ease-out/ease-in-out cubic)
- **Colors**: Update color constants in `src/lib/container-colors.ts`

### Terminal Text Customization
- **Content**: Modify `allLines` array in `Container3D.tsx` line 268
- **Speed**: Adjust `charsPerSecond` constant (line 265)
- **Styling**: Update canvas context properties in `ContainerDoors.tsx` line 163

### Camera Behavior
- **Positioning**: Modify camera.position in `ContainerScene.tsx` line 41
- **Constraints**: Adjust OrbitControls props (lines 86-90)
- **Reset Behavior**: Customize handleDoubleClick (line 25)

---

## Known Issues & Solutions

### Issue: Terminal Disappeared After Doors Closed
**Cause:** Terminal positioned on outer face (+Z) which rotates to face away from camera when doors close.

**Solution:** Use `THREE.DoubleSide` material rendering to show terminal on both sides of plane during rotation.

**Code Location:** `ContainerDoors.tsx` line 270

---

### Issue: Terminal Text Loading in Blocks
**Cause:** Canvas only updated when "Starting..." line appeared, not on every character change.

**Solution:** Update canvas every frame when `terminalLines.length > 0` (removed conditional check for "Starting...").

**Code Location:** `ContainerDoors.tsx` line 150

---

### Issue: Error State Broke OrbitControls
**Cause:** Camera position was being overridden in useFrame, preventing user interaction.

**Solution:** Rotate the container instead of moving the camera. This preserves OrbitControls while showing the desired view angle.

**Code Location:** `Container3D.tsx` line 361

---

## File Reference

### Primary Files
- `src/components/three/ContainerScene.tsx` - Canvas wrapper, lighting, controls
- `src/components/three/Container3D.tsx` - Main state machine, animations
- `src/components/three/ContainerDoors.tsx` - Door geometry, terminal rendering
- `src/components/three/ImageCrate.tsx` - Crate animations
- `src/lib/container-colors.ts` - Color constants and state types
- `src/app/container-demo/page.tsx` - Demo page with state controls

### Documentation
- `docs/CONTAINER_STATE_SYSTEM.md` - This file

---

## Performance Considerations

- **Canvas Updates**: Terminal canvas redraws every frame during typing (throttle if needed)
- **Material Updates**: `needsUpdate` flag set on every property change
- **useFrame**: All animations run at 60fps via R3F useFrame hook
- **Geometry**: Uses efficient BoxGeometry for running state, planes for building/error states

---

## Future Enhancement Ideas

1. **Loading Progress**: Add percentage-based progress bar during building
2. **Multiple Containers**: Support side-by-side container comparison
3. **Log Streaming**: Real-time log output instead of static terminal text
4. **Network Visualization**: Show container networking with animated connections
5. **Volume Mounts**: Visualize mounted volumes as connected objects
6. **Health Checks**: Pulsing indicators for container health status
7. **Resource Usage**: Real-time CPU/memory visualization
8. **Container Interactions**: Click containers to exec into terminal

---

## Testing Recommendations

1. **State Transitions**: Test all state combinations (ready→building→running→error)
2. **Animation Timing**: Verify smooth transitions without jarring jumps
3. **Terminal Text**: Confirm character-by-character typing at correct speed
4. **OrbitControls**: Verify mouse controls work in all states
5. **Camera Reset**: Test double-click reset in various orientations
6. **Performance**: Monitor FPS during building state animations

---

## Credits

**Implementation Period:** November 2025
**Technologies:** React Three Fiber, Three.js, TypeScript, Next.js
**Key Techniques:** Canvas textures, ease functions, state machines, useFrame animations
