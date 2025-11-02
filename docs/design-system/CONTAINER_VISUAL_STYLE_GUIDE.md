# Container Visualization Visual Style Guide

**Project**: Design System Lab - Container Visualization
**Issue**: ILI-88
**Version**: 1.0
**Last Updated**: 2025-11-01

---

## Overview

This document defines the complete visual language for the Docker container 3D visualization, including color palettes, Three.js material specifications, and lighting setup. These specifications ensure consistent "machine vibes" - an industrial, technical aesthetic that communicates precision and reliability.

---

## 1. Color Palette

### State Colors

| State | Hex Code | RGB | Description | Usage |
|-------|----------|-----|-------------|-------|
| **Building** | `#2196F3` | `33, 150, 243` | Electric blue (primary) | Pulsing edge glow during build |
| **Building Pulse** | `#64B5F6` | `100, 181, 246` | Light electric blue | Pulse animation peak |
| **Ready/Idle** | `#90CAF9` | `144, 202, 249` | Soft blue | Static state after build completes |
| **Running** | `#4CAF50` | `76, 175, 80` | Success green | Active container edge glow |
| **Running Accent** | `#66BB6A` | `102, 187, 106` | Light green | Highlights, secondary running indicators |
| **Error/Failed** | `#F44336` | `244, 67, 54` | Alert red | Failed build, error states |

### Structural Colors

| Element | Hex Code | RGB | Description | Usage |
|---------|----------|-----|-------------|-------|
| **Wireframe Primary** | `#37474F` | `55, 71, 79` | Blue-grey 800 | Main container wireframe edges |
| **Wireframe Dotted** | `#546E7A` | `84, 110, 122` | Blue-grey 600 | Inactive/ghost lines |
| **Wall Surface** | `#263238` | `38, 50, 56` | Blue-grey 900 | Opaque container walls |
| **Wall Highlight** | `#455A64` | `69, 90, 100` | Blue-grey 700 | Wall edge highlights |
| **Background** | `#121212` | `18, 18, 18` | Near black | Scene background |
| **Background Gradient** | `#1A1A1A` | `26, 26, 26` | Dark grey | Gradient falloff |

### Image Crate Colors

| Element | Hex Code | RGB | Description | Usage |
|---------|----------|-----|-------------|-------|
| **Crate Base** | `#FFA726` | `255, 167, 38` | Amber 400 | Image crate main color |
| **Crate Glow** | `#FFB74D` | `255, 183, 77` | Amber 300 | Pulsing glow effect |
| **Crate Icon** | `#FFFFFF` | `255, 255, 255` | White | Docker logo/icon on crate |

### UI Accent Colors

| Element | Hex Code | RGB | Description | Usage |
|---------|----------|-----|-------------|-------|
| **Label Text** | `#E0E0E0` | `224, 224, 224` | Light grey | Container name labels |
| **Measurement Lines** | `#616161` | `97, 97, 97` | Grey 700 | Dimension indicators |
| **Grid** | `#424242` | `66, 66, 66` | Grey 800 | Optional ground plane grid |

---

## 2. Three.js Material Specifications

### 2.1 Wireframe Materials

#### Solid Wireframe (Active Edges)

```typescript
import { LineBasicMaterial } from 'three';

const activeWireframeMaterial = new LineBasicMaterial({
  color: 0x37474F,        // Blue-grey 800
  linewidth: 2,           // Note: linewidth > 1 only works with LineSegments2
  transparent: false,
  opacity: 1.0,
  fog: false,             // Ignore scene fog
  depthWrite: true,
  depthTest: true,
});
```

**Properties**:
- **color**: `0x37474F` (blue-grey)
- **linewidth**: `2` (use `Line2` from three.js examples for thick lines)
- **transparent**: `false`
- **opacity**: `1.0`

#### Dotted Wireframe (Inactive/Ghost Lines)

```typescript
import { LineDashedMaterial } from 'three';

const dottedWireframeMaterial = new LineDashedMaterial({
  color: 0x546E7A,        // Blue-grey 600
  linewidth: 1,
  scale: 1,               // Scale of the dash pattern
  dashSize: 0.3,          // Length of dash
  gapSize: 0.2,           // Length of gap
  transparent: true,
  opacity: 0.5,           // Semi-transparent for ghost effect
  fog: false,
  depthWrite: false,
});
```

**Properties**:
- **color**: `0x546E7A` (lighter blue-grey)
- **dashSize**: `0.3` units
- **gapSize**: `0.2` units
- **opacity**: `0.5` (50% transparent)
- **scale**: `1` (adjust based on scene units)

**Note**: Must call `.computeLineDistances()` on geometry before rendering.

---

### 2.2 Wall Materials

#### Opaque Container Walls

```typescript
import { MeshStandardMaterial } from 'three';

const containerWallMaterial = new MeshStandardMaterial({
  color: 0x263238,        // Blue-grey 900
  metalness: 0.7,         // High metallic for industrial feel
  roughness: 0.4,         // Slightly rough, not mirror-like
  transparent: false,
  opacity: 1.0,
  side: THREE.DoubleSide, // Visible from both sides
  flatShading: false,     // Smooth shading for panels
  envMapIntensity: 1.0,   // Environment map reflection strength
});
```

**Properties**:
- **color**: `0x263238` (dark blue-grey)
- **metalness**: `0.7` (70% metallic - industrial steel)
- **roughness**: `0.4` (40% rough - matte industrial finish)
- **side**: `DoubleSide` (visible from inside and outside)
- **Physical Material**: Uses PBR (Physically Based Rendering)

#### Edge Glow Material (State-based)

```typescript
import { MeshBasicMaterial } from 'three';

// Building state
const buildingGlowMaterial = new MeshBasicMaterial({
  color: 0x2196F3,        // Electric blue
  transparent: true,
  opacity: 0.6,
  side: THREE.FrontSide,
  depthWrite: false,
  blending: THREE.AdditiveBlending, // Additive for glow effect
});

// Running state
const runningGlowMaterial = new MeshBasicMaterial({
  color: 0x4CAF50,        // Success green
  transparent: true,
  opacity: 0.7,
  side: THREE.FrontSide,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});
```

**Animation**:
- **Building**: Pulse opacity from `0.3` to `0.8` over 1.5 seconds (sine wave)
- **Running**: Static `0.7` opacity with occasional flicker (random 0.6-0.8)

---

### 2.3 Image Crate Material

```typescript
import { MeshStandardMaterial } from 'three';

const imageCrateMaterial = new MeshStandardMaterial({
  color: 0xFFA726,        // Amber 400
  metalness: 0.3,         // Slightly metallic (painted metal/wood)
  roughness: 0.6,         // Rougher than walls
  transparent: false,
  opacity: 1.0,
  emissive: 0xFFB74D,     // Self-illumination (amber glow)
  emissiveIntensity: 0.2, // Subtle inner glow
  side: THREE.FrontSide,
});
```

**Properties**:
- **color**: `0xFFA726` (amber/orange)
- **metalness**: `0.3` (30% - painted surface)
- **roughness**: `0.6` (60% - matte finish)
- **emissive**: `0xFFB74D` (glowing accent)
- **emissiveIntensity**: `0.2` (20% - subtle)

**Icon/Logo**:
- Use `MeshBasicMaterial` with `map` texture for Docker whale logo
- White color (`0xFFFFFF`)
- Alpha transparency for logo cutout

---

### 2.4 Background Material

```typescript
import { Scene, Color } from 'three';

// Scene background
scene.background = new Color(0x121212); // Near black

// Optional: Gradient background using CSS or shader
// Radial gradient from 0x1A1A1A (center) to 0x121212 (edges)
```

**Alternative**: Use environment map or skybox for reflections on metallic surfaces.

---

## 3. Lighting Setup

### 3.1 Three-Light Configuration

```typescript
import {
  AmbientLight,
  DirectionalLight,
  PointLight,
  HemisphereLight
} from 'three';

// 1. Ambient Light (base illumination)
const ambientLight = new AmbientLight(
  0x404040,               // Neutral grey
  0.4                     // 40% intensity - subtle fill
);
scene.add(ambientLight);

// 2. Key Light (main directional)
const keyLight = new DirectionalLight(
  0xFFFFFF,               // White light
  1.0                     // 100% intensity
);
keyLight.position.set(5, 8, 5);
keyLight.castShadow = true;
keyLight.shadow.mapSize.width = 2048;
keyLight.shadow.mapSize.height = 2048;
keyLight.shadow.camera.near = 0.5;
keyLight.shadow.camera.far = 50;
scene.add(keyLight);

// 3. Rim Light (back lighting for edges)
const rimLight = new DirectionalLight(
  0x7FA1C3,               // Cool blue tint
  0.5                     // 50% intensity
);
rimLight.position.set(-5, 3, -5);
scene.add(rimLight);

// 4. Point Light (accent, state-dependent)
const accentLight = new PointLight(
  0x2196F3,               // Electric blue (changes per state)
  0.8,                    // 80% intensity
  20,                     // Distance
  2                       // Decay
);
accentLight.position.set(0, 5, 0);
scene.add(accentLight);
```

### 3.2 State-Based Lighting Adjustments

| State | Accent Light Color | Intensity | Position |
|-------|-------------------|-----------|----------|
| **Building** | `0x2196F3` (electric blue) | `0.8` (pulsing 0.5-1.0) | Above container |
| **Ready** | `0x90CAF9` (soft blue) | `0.5` (static) | Above container |
| **Running** | `0x4CAF50` (green) | `0.7` (static) | Above container |
| **Error** | `0xF44336` (red) | `0.9` (pulsing) | Above container |

### 3.3 Shadow Configuration

```typescript
// Enable shadows on renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadows

// Container walls receive shadows
containerWallMaterial.receiveShadow = true;

// Image crate casts shadows
imageCrateMesh.castShadow = true;
```

### 3.4 Lighting Diagram

```
                    Key Light (white)
                      ↓
                   (5, 8, 5)
                      |
                      |
     Rim Light ←---[Container]---→ Camera
    (-5, 3, -5)       |           (0, 5, 10)
                      |
                 Accent Light
                   (0, 5, 0)
                 State Color

                Ground Plane (optional grid)
```

**Rationale**:
- **Key Light**: Primary illumination from upper-right, creates depth
- **Rim Light**: Back-left edge highlighting, separates from background
- **Accent Light**: Dynamic state indicator, positioned above
- **Ambient**: Prevents pure black shadows, mimics environmental bounce

---

## 4. Animation Specifications

### 4.1 Building State Animation

**Pulsing Glow Effect**:
```typescript
// In render loop
const time = clock.getElapsedTime();
const pulseIntensity = 0.55 + Math.sin(time * 2.0) * 0.25; // 0.3 to 0.8

// Apply to edge glow material
buildingGlowMaterial.opacity = pulseIntensity;

// Apply to accent light
accentLight.intensity = pulseIntensity + 0.2; // 0.5 to 1.0
```

**Frequency**: 2 rad/s (approximately 0.67 Hz, ~1.5 second period)

### 4.2 Running State Animation

**Subtle Flicker**:
```typescript
// Every 100 frames (~1.67 seconds at 60fps)
if (frameCount % 100 === 0) {
  const flicker = 0.6 + Math.random() * 0.2; // 0.6 to 0.8
  runningGlowMaterial.opacity = flicker;
}
```

### 4.3 Image Crate Animation

**Floating/Bobbing Effect**:
```typescript
// Gentle vertical oscillation
const bobHeight = Math.sin(time * 0.8) * 0.1; // ±0.1 units
imageCrateMesh.position.y = baseHeight + bobHeight;

// Slow rotation
imageCrateMesh.rotation.y = time * 0.2; // 0.2 rad/s
```

---

## 5. Material Property Quick Reference

### Material Categories

| Material Type | Use Case | Key Properties |
|---------------|----------|----------------|
| **LineBasicMaterial** | Solid wireframe edges | `linewidth: 2`, `color: 0x37474F` |
| **LineDashedMaterial** | Dotted ghost lines | `dashSize: 0.3`, `gapSize: 0.2`, `opacity: 0.5` |
| **MeshStandardMaterial** | Walls, crate surfaces | `metalness: 0.7`, `roughness: 0.4` (walls) |
| **MeshBasicMaterial** | Glowing edges, icons | `blending: AdditiveBlending`, unlit |
| **PointsMaterial** | Particle effects (optional) | `size: 0.05`, `transparent: true` |

### PBR Material Guidelines

**Industrial Metal (Container Walls)**:
- Metalness: `0.6-0.8` (highly metallic)
- Roughness: `0.3-0.5` (matte industrial)
- Color: Dark blue-grey palette

**Painted Surface (Image Crate)**:
- Metalness: `0.2-0.4` (low metallic)
- Roughness: `0.5-0.7` (more diffuse)
- Emissive: Add glow for emphasis

**Glass/Transparent (Future Use)**:
- Metalness: `0.0` (non-metallic)
- Roughness: `0.1` (very smooth)
- Transmission: `1.0` (full transparency)

---

## 6. Reference Images & Mood Board

### Machine Vibes - Visual References

**Industrial Aesthetic**:
- Docker container imagery (shipping containers, industrial ports)
- Server racks with blue indicator LEDs
- CNC machines with precision edge lighting
- Technical diagrams with clean wireframes
- Cyberpunk infrastructure (Tron-like edge glows)

**Color Mood**:
- **Cool Palette**: Blues, teals, dark greys (trustworthy, technical)
- **Warm Accents**: Amber crate (approachable, cargo/package)
- **Status Indicators**: Green = active, blue = building, red = error

**Material Inspiration**:
- Brushed aluminum (MacBook finish)
- Industrial steel panels (shipping containers)
- LED edge lighting (modern architecture)
- Technical blueprints (wireframe aesthetic)

### Example Visual Breakdown

```
╔════════════════════════════════════════╗
║  Container Wireframe (#37474F)         ║
║  ┌─────────────────────┐               ║
║  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │               ║
║  │ ▓ Wall (#263238)  ▓ │               ║
║  │ ▓  ┌────────┐     ▓ │               ║
║  │ ▓  │ Crate  │     ▓ │ ← Building   ║
║  │ ▓  │ #FFA726│     ▓ │   Glow       ║
║  │ ▓  └────────┘     ▓ │   (#2196F3)  ║
║  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │               ║
║  └─────────────────────┘               ║
║         │                               ║
║    Background                          ║
║    (#121212)                           ║
╚════════════════════════════════════════╝
```

---

## 7. Implementation Checklist

### For Developers

- [ ] Import all hex colors as constants in `src/lib/three-materials.ts`
- [ ] Create reusable material functions (e.g., `createWireframeMaterial(state)`)
- [ ] Set up three-light system in main scene
- [ ] Implement state-based color switching for accent light
- [ ] Add pulsing animation for building state (clock + sine wave)
- [ ] Configure shadow maps on renderer
- [ ] Test material appearance under different lighting conditions
- [ ] Verify color accuracy against hex codes using browser color picker
- [ ] Add Storybook stories for each material configuration
- [ ] Document any deviations from this spec with reasoning

### Testing Scenarios

1. **Color Accuracy**: Use browser DevTools to sample colors from rendered canvas
2. **Lighting Consistency**: View scene from multiple camera angles
3. **Performance**: Monitor FPS with multiple containers (target: 60fps)
4. **State Transitions**: Animate between building → ready → running states
5. **Material Rendering**: Test on different displays (HDR, standard)

---

## 8. Design Rationale

### Why These Colors?

**Building Blue (`#2196F3`)**:
- Matches Docker brand blue (trust, reliability)
- High visibility against dark background
- Indicates active process (building)

**Running Green (`#4CAF50`)**:
- Universal "success" color
- Clearly distinct from blue (avoid confusion)
- Material Design standard green

**Amber Crate (`#FFA726`)**:
- Warm contrast to cool palette
- Suggests "cargo" or "package"
- Attention-grabbing for important element

**Dark Background (`#121212`)**:
- Reduces eye strain (dark mode)
- Makes edge glows highly visible
- Professional, technical aesthetic
- Matches modern dev tools (VS Code, terminals)

### Why These Materials?

**MeshStandardMaterial for Walls**:
- PBR (Physically Based Rendering) = realistic lighting
- Metalness + roughness = industrial feel
- Performs well with multiple light sources
- Industry standard for quality 3D rendering

**LineDashedMaterial for Ghost Lines**:
- Clearly indicates inactive/secondary structure
- Reduces visual clutter
- Traditional CAD/blueprint aesthetic

**Additive Blending for Glows**:
- Creates authentic "LED edge lighting" effect
- Doesn't obscure underlying geometry
- Matches real-world illuminated edges

---

## 9. File Export & Integration

### Color Constants File

```typescript
// src/lib/container-colors.ts

export const CONTAINER_COLORS = {
  // State colors
  BUILDING: 0x2196F3,
  BUILDING_PULSE: 0x64B5F6,
  READY: 0x90CAF9,
  RUNNING: 0x4CAF50,
  RUNNING_ACCENT: 0x66BB6A,
  ERROR: 0xF44336,

  // Structural colors
  WIREFRAME_PRIMARY: 0x37474F,
  WIREFRAME_DOTTED: 0x546E7A,
  WALL_SURFACE: 0x263238,
  WALL_HIGHLIGHT: 0x455A64,

  // Background
  BACKGROUND: 0x121212,
  BACKGROUND_GRADIENT: 0x1A1A1A,

  // Image crate
  CRATE_BASE: 0xFFA726,
  CRATE_GLOW: 0xFFB74D,
  CRATE_ICON: 0xFFFFFF,

  // UI accents
  LABEL_TEXT: 0xE0E0E0,
  MEASUREMENT_LINES: 0x616161,
  GRID: 0x424242,
} as const;

export type ContainerState = 'building' | 'ready' | 'running' | 'error';

export function getStateColor(state: ContainerState): number {
  switch (state) {
    case 'building': return CONTAINER_COLORS.BUILDING;
    case 'ready': return CONTAINER_COLORS.READY;
    case 'running': return CONTAINER_COLORS.RUNNING;
    case 'error': return CONTAINER_COLORS.ERROR;
  }
}
```

### Material Factory File

```typescript
// src/lib/container-materials.ts

import * as THREE from 'three';
import { CONTAINER_COLORS } from './container-colors';

export function createContainerWallMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: CONTAINER_COLORS.WALL_SURFACE,
    metalness: 0.7,
    roughness: 0.4,
    side: THREE.DoubleSide,
  });
}

export function createWireframeMaterial(): THREE.LineBasicMaterial {
  return new THREE.LineBasicMaterial({
    color: CONTAINER_COLORS.WIREFRAME_PRIMARY,
    linewidth: 2,
  });
}

export function createGlowMaterial(state: 'building' | 'running'): THREE.MeshBasicMaterial {
  const color = state === 'building'
    ? CONTAINER_COLORS.BUILDING
    : CONTAINER_COLORS.RUNNING;

  return new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}

// ... additional factory functions
```

---

## 10. Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-11-01 | Initial visual style guide creation | Design Team |

---

## Appendix A: Hex to Three.js Conversion

Three.js uses hexadecimal color format without the `#` prefix:

| CSS Hex | Three.js Hex | Usage |
|---------|--------------|-------|
| `#2196F3` | `0x2196F3` | Building blue |
| `#4CAF50` | `0x4CAF50` | Running green |
| `#FFA726` | `0xFFA726` | Crate amber |
| `#263238` | `0x263238` | Wall surface |
| `#121212` | `0x121212` | Background |

**Conversion**: Remove `#`, add `0x` prefix.

---

## Appendix B: Lighting Intensity Reference

| Light Type | Intensity Range | Typical Use |
|------------|----------------|-------------|
| AmbientLight | 0.2 - 0.5 | Base fill, prevent pure black shadows |
| DirectionalLight | 0.8 - 1.5 | Key light, sun simulation |
| PointLight | 0.5 - 1.0 | Accents, state indicators |
| SpotLight | 0.8 - 1.2 | Focused highlights (optional) |
| HemisphereLight | 0.3 - 0.6 | Sky/ground ambient (alternative) |

**Note**: Intensities are relative. Adjust based on scene scale and material properties.

---

## Appendix C: Performance Considerations

### Material Performance Impact

| Material | Performance Cost | Notes |
|----------|-----------------|-------|
| MeshBasicMaterial | Very Low | Unlit, fastest |
| MeshStandardMaterial | Medium | PBR, requires lights |
| MeshPhysicalMaterial | High | Advanced PBR, use sparingly |
| LineDashedMaterial | Low-Medium | Requires `computeLineDistances()` |
| Custom Shaders | Variable | Depends on complexity |

### Optimization Tips

1. **Instancing**: Use `InstancedMesh` for multiple containers
2. **Geometry Pooling**: Reuse `BoxGeometry` instances
3. **Texture Atlasing**: Combine crate textures into single atlas
4. **LOD (Level of Detail)**: Switch to simpler materials when zoomed out
5. **Frustum Culling**: Let Three.js automatically hide off-screen objects

**Target Performance**: 60fps with 10-20 containers on modern hardware (2020+)

---

## Contact

For questions about this style guide or design decisions:
- **Linear Issue**: [ILI-88](https://linear.app/iliketobuild/issue/ILI-88)
- **Repository**: design-system-lab
- **Branch**: `chadbercea/ili-88-designer-define-visual-style-and-materials`

---

**End of Visual Style Guide**
