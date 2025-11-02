# Container Visualization Design System

**Complete visual specifications and implementation guide for the 3D Docker container visualization.**

---

## Overview

This directory contains the complete design system for the container visualization feature, including color palettes, Three.js material specifications, lighting setup, and TypeScript implementation files ready for use by developers.

**Linear Issue**: [ILI-88 - Define visual style and materials](https://linear.app/iliketobuild/issue/ILI-88)

---

## Documentation Structure

### 📘 [Visual Style Guide](./CONTAINER_VISUAL_STYLE_GUIDE.md) (Primary Reference)

**Complete design specification document covering:**
- Color palette with hex codes for all states
- Three.js material properties (PBR values, blending modes)
- Lighting setup with 3-light configuration
- Animation specifications (pulsing, floating effects)
- Material reference tables
- Design rationale and mood board
- Performance considerations

**Use this document when**: You need exact specifications for colors, materials, or lighting properties.

---

### 🛠️ [Implementation Guide](./CONTAINER_IMPLEMENTATION_GUIDE.md) (Developer Guide)

**Practical examples and code patterns for:**
- Basic scene setup
- Creating containers and image crates
- State management and animations
- React Three Fiber components
- Performance optimization
- Storybook integration
- Troubleshooting common issues

**Use this document when**: You're implementing the visualization and need working code examples.

---

### ⚡ [Quick Reference](./QUICK_REFERENCE.md) (Cheat Sheet)

**One-page reference card with:**
- All color constants
- Material property tables
- Lighting configuration
- Animation formulas
- Common dimensions
- Import paths
- Troubleshooting checklist

**Use this document when**: You need to quickly look up a color, material property, or code snippet.

---

## TypeScript Implementation Files

Ready-to-use TypeScript modules in `/src/lib/`:

### 1. **`container-colors.ts`** - Color Palette

```typescript
import { CONTAINER_COLORS, getStateColor } from '@/lib/container-colors';

// Access colors
const buildingBlue = CONTAINER_COLORS.BUILDING; // 0x2196F3

// Get state-based color
const color = getStateColor('running'); // 0x4CAF50

// Utility functions
const hex = toHexString(color);        // "#4CAF50"
const rgb = toRGB(color);              // { r: 76, g: 175, b: 80 }
```

**Features**:
- All color constants as Three.js hex values
- State-based color getters
- Animation helper functions (pulse opacity)
- Color conversion utilities (hex to RGB/CSS)

---

### 2. **`container-materials.ts`** - Material Factory

```typescript
import { MaterialPresets, createContainerWallMaterial } from '@/lib/container-materials';

// Use presets (recommended)
const materials = MaterialPresets.forContainer('building');
// Returns: { wall, wireframe, glow }

// Or create individual materials
const wallMaterial = createContainerWallMaterial();
const glowMaterial = createGlowMaterial('running');
```

**Features**:
- Factory functions for all material types
- Material preset collections
- Material update utilities
- Cleanup/disposal helpers

**Available Materials**:
- Container walls (MeshStandardMaterial, PBR)
- Wireframe edges (LineBasicMaterial)
- Dotted lines (LineDashedMaterial)
- Glow effects (MeshBasicMaterial, additive blending)
- Image crate (MeshStandardMaterial with emissive)
- UI elements (labels, measurements, grid)

---

### 3. **`container-lighting.ts`** - Lighting Setup

```typescript
import { createSceneLighting, LightingManager } from '@/lib/container-lighting';

// Create lighting
const lights = createSceneLighting({
  enableShadows: true,
  initialState: 'building',
});
addLightsToScene(scene, lights);

// Use lighting manager for animations
const manager = new LightingManager(lights);
manager.setState('running');
manager.update(time); // Call in render loop
```

**Features**:
- Three-light setup (ambient, key, rim, accent)
- State-based accent light updates
- Animation helpers (pulsing, flickering)
- Lighting presets (standard, high-key, low-key, dramatic)
- LightingManager class for easy state management

---

## Design Decisions Summary

### Color Palette Philosophy

**Cool Palette (Blues/Greys)**: Technical, trustworthy, professional
- Building state: Electric blue (`#2196F3`) - Docker brand blue
- Ready state: Soft blue (`#90CAF9`) - Calm, idle
- Background: Near black (`#121212`) - Reduce eye strain, highlight glows

**Warm Accents (Amber)**: Approachable, attention-grabbing
- Image crate: Amber (`#FFA726`) - "Cargo" metaphor, warm contrast

**Status Indicators (Green/Red)**:
- Running: Success green (`#4CAF50`) - Universal positive
- Error: Alert red (`#F44336`) - Universal danger

---

### Material Philosophy

**Industrial Aesthetic ("Machine Vibes")**:
- High metalness (0.7) on walls = steel, machinery
- Moderate roughness (0.4) = matte industrial finish
- Additive blending on glows = LED edge lighting effect
- PBR materials = realistic light interaction

**Performance-First**:
- MeshStandardMaterial (not MeshPhysicalMaterial) = Good balance
- LineBasicMaterial (not custom shaders) = Fast rendering
- Conditional glow rendering = Only for building/running states

---

### Lighting Philosophy

**Three-Light Hollywood Setup**:
- **Key Light** (main): Upper-right, white, creates depth
- **Rim Light** (separation): Back-left, cool blue, separates from background
- **Accent Light** (state): Above, dynamic color, indicates status

**Why This Works**:
- Professional, time-tested technique
- Clear depth perception
- State immediately visible via accent color
- Performs well (no fancy effects needed)

---

## Usage Workflow

### For Designers

1. **Start with**: [Visual Style Guide](./CONTAINER_VISUAL_STYLE_GUIDE.md)
2. **Review**: Color palette, material mood board, reference images
3. **Validate**: Check hex codes match intended colors
4. **Communicate**: Share specific sections with developers

---

### For Developers

1. **Read**: [Quick Reference](./QUICK_REFERENCE.md) for overview
2. **Import**: TypeScript modules from `/src/lib/`
3. **Implement**: Using patterns from [Implementation Guide](./CONTAINER_IMPLEMENTATION_GUIDE.md)
4. **Validate**: Check colors/materials match [Style Guide](./CONTAINER_VISUAL_STYLE_GUIDE.md)
5. **Test**: Use Storybook to verify appearance

---

### For QA/Testing

1. **Color Accuracy**: Use browser DevTools color picker to sample rendered colors
2. **Material Properties**: Verify metalness/roughness by observing light reflections
3. **Animation Timing**: Building pulse should be ~1.5 seconds per cycle
4. **State Transitions**: Verify accent light color changes on state update
5. **Performance**: Target 60fps with 10-20 containers

---

## File Locations

### Documentation (Read-Only)
```
/Users/chadbercea/Github/design-system-lab/.conductor/miami/docs/design-system/
├── README.md                              # This file
├── CONTAINER_VISUAL_STYLE_GUIDE.md        # Complete visual spec
├── CONTAINER_IMPLEMENTATION_GUIDE.md      # Developer examples
└── QUICK_REFERENCE.md                     # One-page cheat sheet
```

### Implementation (Use in Code)
```
/Users/chadbercea/Github/design-system-lab/.conductor/miami/src/lib/
├── container-colors.ts        # Color palette & utilities
├── container-materials.ts     # Material factory functions
└── container-lighting.ts      # Lighting setup & manager
```

---

## Integration Points

### With Existing MUI Theme

The container colors complement the existing MUI theme:

| MUI Theme | Container Colors | Relationship |
|-----------|------------------|--------------|
| Primary (`#1D63ED`) | Building (`#2196F3`) | Similar blue family |
| Success (`#2e7d32`) | Running (`#4CAF50`) | Similar green family |
| Error (`#d32f2f`) | Error (`#F44336`) | Similar red family |
| Background (paper) | Background (`#121212`) | Dark mode compatible |

**Design Intent**: Container visualization feels part of the same design system as the UI.

---

### With React Three Fiber (ILI-90)

This design system builds on the ILI-90 spike:

- **ILI-90**: Proved React Three Fiber works, created BasicScene component
- **ILI-88** (this): Defines exact colors, materials, lighting to use
- **Next**: Implement complete container with these specifications

---

### With Storybook

All materials and lighting setups can be showcased in Storybook:

```typescript
// Example story
export const ContainerStates: Story = {
  render: () => (
    <Canvas>
      <Container state="building" />
      <Container state="running" position={[5, 0, 0]} />
    </Canvas>
  ),
};
```

Use Storybook's visual controls to:
- Toggle between states
- Adjust lighting intensity
- Compare material properties
- Export configurations

---

## Design System Principles

### 1. **Consistency**
All colors and materials defined in one place, reused everywhere.

### 2. **Performance**
Every choice considers rendering cost (PBR vs unlit, geometry reuse, conditional rendering).

### 3. **Maintainability**
TypeScript factory functions = Easy to update, hard to misuse.

### 4. **Developer Experience**
Clear documentation + working examples = Fast implementation.

### 5. **Visual Quality**
Professional lighting + PBR materials = Realistic, polished result.

---

## Version History

| Version | Date | Changes | Issue |
|---------|------|---------|-------|
| 1.0 | 2025-11-01 | Initial design system creation | ILI-88 |

---

## Related Issues

- **ILI-77**: MUI Installation & Theme Customization
- **ILI-81**: Customize MUI Sandbox Theme to Match Design System Tokens
- **ILI-82**: Dockerize MUI Sandbox
- **ILI-87**: Storyboard 30-Second Sequence
- **ILI-88**: Define Visual Style and Materials (this)
- **ILI-90**: React Three Fiber Developer Spike

---

## Questions or Feedback?

- **Linear Issue**: [ILI-88](https://linear.app/iliketobuild/issue/ILI-88)
- **Repository**: design-system-lab
- **Branch**: `chadbercea/ili-88-designer-define-visual-style-and-materials`

---

**Ready to implement?** Start with the [Quick Reference](./QUICK_REFERENCE.md) and [Implementation Guide](./CONTAINER_IMPLEMENTATION_GUIDE.md)!
