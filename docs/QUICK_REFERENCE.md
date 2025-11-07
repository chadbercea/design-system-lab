# Container Visualization - Quick Reference Card

**1-Page Developer Cheat Sheet**

---

## Color Constants

```typescript
import { CONTAINER_COLORS } from '@/lib/container-colors';

// State Colors
CONTAINER_COLORS.BUILDING        // 0x2196F3 - Electric blue
CONTAINER_COLORS.READY           // 0x90CAF9 - Soft blue
CONTAINER_COLORS.RUNNING         // 0x4CAF50 - Success green
CONTAINER_COLORS.ERROR           // 0xF44336 - Alert red

// Structure Colors
CONTAINER_COLORS.WIREFRAME_PRIMARY   // 0x37474F - Blue-grey edges
CONTAINER_COLORS.WALL_SURFACE        // 0x263238 - Dark walls
CONTAINER_COLORS.CRATE_BASE          // 0xFFA726 - Amber crate
CONTAINER_COLORS.BACKGROUND          // 0x121212 - Near black
```

---

## Material Presets

```typescript
import { MaterialPresets } from '@/lib/container-materials';

// Get all materials for a container
const materials = MaterialPresets.forContainer('building');
// Returns: { wall, wireframe, glow }

// Get materials for image crate
const crateMaterials = MaterialPresets.forImageCrate();
// Returns: { crate, icon }

// Get UI materials
const uiMaterials = MaterialPresets.forUI();
// Returns: { label, measurement, grid }
```

---

## Material Properties

| Material | Metalness | Roughness | Opacity | Blending |
|----------|-----------|-----------|---------|----------|
| **Container Wall** | 0.7 | 0.4 | 1.0 | Normal |
| **Image Crate** | 0.3 | 0.6 | 1.0 | Normal |
| **Glow (Building)** | N/A | N/A | 0.6 (pulse) | Additive |
| **Glow (Running)** | N/A | N/A | 0.7 | Additive |
| **Wireframe** | N/A | N/A | 1.0 | Normal |
| **Dotted Line** | N/A | N/A | 0.5 | Normal |

---

## Lighting Setup

```typescript
import { createSceneLighting, addLightsToScene } from '@/lib/container-lighting';

const lights = createSceneLighting({
  enableShadows: true,
  initialState: 'building',
});
addLightsToScene(scene, lights);
```

**Light Positions:**
- **Ambient**: Global (0.4 intensity)
- **Key**: (5, 8, 5) - White, intensity 1.0
- **Rim**: (-5, 3, -5) - Cool blue, intensity 0.5
- **Accent**: (0, 5, 0) - State color, intensity 0.8

---

## State-Based Intensities

| State | Accent Light Intensity | Glow Opacity |
|-------|------------------------|--------------|
| **Building** | 0.8 (pulse 0.5-1.0) | 0.6 (pulse 0.3-0.8) |
| **Ready** | 0.5 (static) | None |
| **Running** | 0.7 (static) | 0.7 (static) |
| **Error** | 0.9 (pulse) | 0.8 (pulse) |

---

## Animation Functions

```typescript
import { getBuildingPulseOpacity } from '@/lib/container-colors';

// Building state pulse
const opacity = getBuildingPulseOpacity(time); // Returns 0.3-0.8

// Crate float animation
const bobHeight = Math.sin(time * 0.8) * 0.1; // ±0.1 units
crate.position.y = baseY + bobHeight;

// Crate rotation
crate.rotation.y = time * 0.2; // 0.2 rad/s
```

---

## Lighting Manager

```typescript
import { LightingManager } from '@/lib/container-lighting';

const manager = new LightingManager(lights);

// Set state
manager.setState('building');

// Update in render loop
manager.update(time);
```

---

## Common Dimensions

| Element | Width | Height | Depth |
|---------|-------|--------|-------|
| **Container** | 4 | 3 | 6 |
| **Image Crate** | 1.5 | 1.5 | 1.5 |
| **Glow Offset** | +0.05 | +0.05 | +0.05 |

---

## React Three Fiber Example

```tsx
import { MaterialPresets } from '@/lib/container-materials';

function Container({ state }: { state: ContainerState }) {
  const materials = MaterialPresets.forContainer(state);

  return (
    <group>
      <mesh material={materials.wall}>
        <boxGeometry args={[4, 3, 6]} />
      </mesh>
      <lineSegments material={materials.wireframe}>
        <edgesGeometry args={[new BoxGeometry(4, 3, 6)]} />
      </lineSegments>
      {materials.glow && (
        <mesh material={materials.glow}>
          <boxGeometry args={[4.05, 3.05, 6.05]} />
        </mesh>
      )}
    </group>
  );
}
```

---

## Shadow Configuration

```typescript
// Renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Light
keyLight.castShadow = true;
keyLight.shadow.mapSize.width = 2048;
keyLight.shadow.mapSize.height = 2048;

// Object
mesh.castShadow = true;    // For crate
mesh.receiveShadow = true; // For walls
```

---

## Performance Tips

1. **Reuse Materials**: Create once, use for all instances
2. **Reuse Geometries**: Share BoxGeometry between meshes
3. **Conditional Glow**: Only render for building/running states
4. **Use InstancedMesh**: For multiple identical containers
5. **Target**: 60fps with 10-20 containers

---

## State Transition Pattern

```typescript
function changeState(newState: ContainerState) {
  // 1. Update lighting
  lightingManager.setState(newState);

  // 2. Update materials
  const materials = MaterialPresets.forContainer(newState);

  // 3. Update glow mesh
  if (materials.glow) {
    glowMesh.material = materials.glow;
  }
}
```

---

## Import Paths

```typescript
// Colors
import { CONTAINER_COLORS, getStateColor } from '@/lib/container-colors';

// Materials
import {
  MaterialPresets,
  createContainerWallMaterial,
  createGlowMaterial,
} from '@/lib/container-materials';

// Lighting
import {
  createSceneLighting,
  addLightsToScene,
  LightingManager,
} from '@/lib/container-lighting';
```

---

## Troubleshooting Checklist

- [ ] Called `computeLineDistances()` for dashed lines?
- [ ] Enabled shadows on renderer, light, and meshes?
- [ ] Set `scene.background` to `CONTAINER_COLORS.BACKGROUND`?
- [ ] Using `DoubleSide` for walls visible from inside?
- [ ] Using `AdditiveBlending` for glow materials?
- [ ] Updating material `needsUpdate` after property changes?
- [ ] Disposing materials on cleanup?

---

## Documentation Links

- **Style Guide**: [CONTAINER_VISUAL_STYLE_GUIDE.md](./CONTAINER_VISUAL_STYLE_GUIDE.md)
- **Implementation Guide**: [CONTAINER_IMPLEMENTATION_GUIDE.md](./CONTAINER_IMPLEMENTATION_GUIDE.md)
- **Linear Issue**: [ILI-88](https://linear.app/iliketobuild/issue/ILI-88)

---

**Version**: 1.0 | **Last Updated**: 2025-11-01
