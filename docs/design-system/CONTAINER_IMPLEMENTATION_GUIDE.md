# Container Visualization Implementation Guide

**Companion to**: [CONTAINER_VISUAL_STYLE_GUIDE.md](./CONTAINER_VISUAL_STYLE_GUIDE.md)

This guide provides practical examples for implementing the container visualization using the defined visual style.

---

## Quick Start

### 1. Basic Scene Setup

```typescript
import * as THREE from 'three';
import { createSceneLighting, addLightsToScene } from '@/lib/container-lighting';
import { CONTAINER_COLORS } from '@/lib/container-colors';

// Create scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(CONTAINER_COLORS.BACKGROUND);

// Create and add lighting
const lights = createSceneLighting({
  enableShadows: true,
  initialState: 'building',
});
addLightsToScene(scene, lights);

// Create camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, 10);

// Create renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
```

---

## 2. Creating a Container

### Basic Container with Walls

```typescript
import { MaterialPresets } from '@/lib/container-materials';

function createContainer(state: 'building' | 'ready' | 'running' | 'error') {
  const materials = MaterialPresets.forContainer(state);
  const group = new THREE.Group();

  // Container dimensions
  const width = 4;
  const height = 3;
  const depth = 6;

  // Create walls
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const walls = new THREE.Mesh(geometry, materials.wall);
  walls.receiveShadow = true;
  group.add(walls);

  // Create wireframe edges
  const edges = new THREE.EdgesGeometry(geometry);
  const wireframe = new THREE.LineSegments(edges, materials.wireframe);
  group.add(wireframe);

  // Add glow effect (if applicable)
  if (materials.glow) {
    const glowGeometry = new THREE.BoxGeometry(
      width + 0.05,
      height + 0.05,
      depth + 0.05
    );
    const glow = new THREE.Mesh(glowGeometry, materials.glow);
    group.add(glow);
  }

  return group;
}

// Usage
const container = createContainer('building');
scene.add(container);
```

---

## 3. Adding an Image Crate

```typescript
import { MaterialPresets } from '@/lib/container-materials';
import { CONTAINER_COLORS } from '@/lib/container-colors';

function createImageCrate() {
  const materials = MaterialPresets.forImageCrate();
  const group = new THREE.Group();

  // Crate dimensions (smaller than container)
  const size = 1.5;
  const crateGeometry = new THREE.BoxGeometry(size, size, size);
  const crate = new THREE.Mesh(crateGeometry, materials.crate);
  crate.castShadow = true;
  group.add(crate);

  // Add glow outline
  const glowGeometry = new THREE.BoxGeometry(size + 0.05, size + 0.05, size + 0.05);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: CONTAINER_COLORS.CRATE_GLOW,
    transparent: true,
    opacity: 0.3,
    side: THREE.BackSide,
  });
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  group.add(glow);

  return group;
}

// Usage
const crate = createImageCrate();
crate.position.set(0, 0, 0); // Position inside container
scene.add(crate);
```

---

## 4. State Management & Animations

### Using LightingManager

```typescript
import { LightingManager } from '@/lib/container-lighting';
import { getBuildingPulseOpacity } from '@/lib/container-colors';

// Create lighting manager
const lightingManager = new LightingManager(lights);

// Set initial state
lightingManager.setState('building');

// In render loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime();

  // Update lighting based on state
  lightingManager.update(elapsedTime);

  // If building state, also animate glow material
  if (lightingManager.getState() === 'building' && glowMaterial) {
    const opacity = getBuildingPulseOpacity(elapsedTime);
    glowMaterial.opacity = opacity;
  }

  renderer.render(scene, camera);
}

animate();
```

### Changing Container State

```typescript
// State transition example
function transitionContainerState(
  container: THREE.Group,
  newState: 'building' | 'ready' | 'running' | 'error'
) {
  // Update lighting
  lightingManager.setState(newState);

  // Update container materials
  const materials = MaterialPresets.forContainer(newState);

  // Find and update glow mesh
  const glowMesh = container.children.find(
    (child) => child.userData.type === 'glow'
  ) as THREE.Mesh;

  if (glowMesh && materials.glow) {
    glowMesh.material = materials.glow;
  } else if (!glowMesh && materials.glow) {
    // Add glow if transitioning to building/running
    const glowGeometry = new THREE.BoxGeometry(4.05, 3.05, 6.05);
    const glow = new THREE.Mesh(glowGeometry, materials.glow);
    glow.userData.type = 'glow';
    container.add(glow);
  } else if (glowMesh && !materials.glow) {
    // Remove glow if transitioning to ready
    container.remove(glowMesh);
  }
}

// Usage
transitionContainerState(container, 'running');
```

---

## 5. React Three Fiber Implementation

### Container Component

```typescript
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MaterialPresets } from '@/lib/container-materials';
import { getBuildingPulseOpacity } from '@/lib/container-colors';

interface ContainerProps {
  state: 'building' | 'ready' | 'running' | 'error';
  width?: number;
  height?: number;
  depth?: number;
}

export function Container({
  state,
  width = 4,
  height = 3,
  depth = 6,
}: ContainerProps) {
  const glowRef = useRef<THREE.MeshBasicMaterial>(null);

  // Create materials based on state
  const materials = useMemo(() => MaterialPresets.forContainer(state), [state]);

  // Animate glow opacity for building state
  useFrame(({ clock }) => {
    if (state === 'building' && glowRef.current) {
      const opacity = getBuildingPulseOpacity(clock.getElapsedTime());
      glowRef.current.opacity = opacity;
    }
  });

  return (
    <group>
      {/* Walls */}
      <mesh material={materials.wall} receiveShadow>
        <boxGeometry args={[width, height, depth]} />
      </mesh>

      {/* Wireframe */}
      <lineSegments material={materials.wireframe}>
        <edgesGeometry
          attach="geometry"
          args={[new THREE.BoxGeometry(width, height, depth)]}
        />
      </lineSegments>

      {/* Glow (building/running states) */}
      {materials.glow && (
        <mesh material={materials.glow}>
          <boxGeometry args={[width + 0.05, height + 0.05, depth + 0.05]} />
          {/* Attach ref to material for animation */}
          <primitive
            object={materials.glow}
            ref={glowRef}
            attach="material"
          />
        </mesh>
      )}
    </group>
  );
}
```

### Scene Setup with R3F

```typescript
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useState } from 'react';
import { CONTAINER_COLORS } from '@/lib/container-colors';

export function ContainerScene() {
  const [state, setState] = useState<'building' | 'ready' | 'running' | 'error'>('building');

  return (
    <>
      {/* State controls */}
      <div className="controls">
        <button onClick={() => setState('building')}>Building</button>
        <button onClick={() => setState('ready')}>Ready</button>
        <button onClick={() => setState('running')}>Running</button>
        <button onClick={() => setState('error')}>Error</button>
      </div>

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 5, 10], fov: 75 }}
        style={{ background: `#${CONTAINER_COLORS.BACKGROUND.toString(16)}` }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} color={0x404040} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.0}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-5, 3, -5]} intensity={0.5} color={0x7fa1c3} />
        <pointLight
          position={[0, 5, 0]}
          intensity={0.8}
          distance={20}
          decay={2}
        />

        {/* Container */}
        <Container state={state} />

        {/* Image Crate */}
        <ImageCrate position={[0, 0, 0]} />

        {/* Camera controls */}
        <OrbitControls />

        {/* Ground plane (optional) */}
        <gridHelper args={[20, 20, 0x424242, 0x424242]} />
      </Canvas>
    </>
  );
}
```

---

## 6. Animation Patterns

### Pulsing Glow (Building State)

```typescript
// Manual animation in vanilla Three.js
function animateBuildingGlow(material: THREE.MeshBasicMaterial, time: number) {
  const opacity = 0.55 + Math.sin(time * 2.0) * 0.25;
  material.opacity = opacity;
  material.needsUpdate = true;
}

// In render loop
function animate() {
  requestAnimationFrame(animate);

  if (containerState === 'building') {
    animateBuildingGlow(glowMaterial, clock.getElapsedTime());
  }

  renderer.render(scene, camera);
}
```

### Floating Crate

```typescript
function animateCrateFloat(crate: THREE.Group, time: number) {
  const baseY = 0;
  const bobHeight = Math.sin(time * 0.8) * 0.1;
  crate.position.y = baseY + bobHeight;

  // Add slow rotation
  crate.rotation.y = time * 0.2;
}

// In render loop
animateCrateFloat(imageCrate, clock.getElapsedTime());
```

### State Transition with Tween

```typescript
import { Tween, Easing } from '@tweenjs/tween.js';

function transitionGlowColor(
  material: THREE.MeshBasicMaterial,
  fromColor: number,
  toColor: number,
  duration = 1000
) {
  const from = { r: 0, g: 0, b: 0 };
  const to = { r: 0, g: 0, b: 0 };

  // Extract RGB from hex
  from.r = (fromColor >> 16) & 255;
  from.g = (fromColor >> 8) & 255;
  from.b = fromColor & 255;

  to.r = (toColor >> 16) & 255;
  to.g = (toColor >> 8) & 255;
  to.b = toColor & 255;

  new Tween(from)
    .to(to, duration)
    .easing(Easing.Quadratic.InOut)
    .onUpdate(() => {
      material.color.setRGB(from.r / 255, from.g / 255, from.b / 255);
    })
    .start();
}

// Usage: transition from building (blue) to running (green)
transitionGlowColor(glowMaterial, CONTAINER_COLORS.BUILDING, CONTAINER_COLORS.RUNNING);
```

---

## 7. Performance Optimization

### Material Instancing

```typescript
import { createContainerWallMaterial, createWireframeMaterial } from '@/lib/container-materials';

// Create materials once
const sharedWallMaterial = createContainerWallMaterial();
const sharedWireframeMaterial = createWireframeMaterial();

// Reuse for multiple containers
function createOptimizedContainer() {
  const geometry = new THREE.BoxGeometry(4, 3, 6);

  const walls = new THREE.Mesh(geometry, sharedWallMaterial);
  const edges = new THREE.EdgesGeometry(geometry);
  const wireframe = new THREE.LineSegments(edges, sharedWireframeMaterial);

  const group = new THREE.Group();
  group.add(walls, wireframe);

  return group;
}
```

### Geometry Pooling

```typescript
// Create geometry once
const containerGeometry = new THREE.BoxGeometry(4, 3, 6);
const crateGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);

// Reuse for all instances
const container1 = new THREE.Mesh(containerGeometry, wallMaterial);
const container2 = new THREE.Mesh(containerGeometry, wallMaterial);
```

### Conditional Rendering

```typescript
// Only render glow for building/running states
function shouldRenderGlow(state: ContainerState): boolean {
  return state === 'building' || state === 'running';
}

// Conditionally add/remove from scene
if (shouldRenderGlow(newState)) {
  scene.add(glowMesh);
} else {
  scene.remove(glowMesh);
}
```

---

## 8. Testing & Validation

### Color Accuracy Test

```typescript
import { CONTAINER_COLORS, toHexString } from '@/lib/container-colors';

// Verify colors match spec
console.log('Building Blue:', toHexString(CONTAINER_COLORS.BUILDING)); // #2196F3
console.log('Running Green:', toHexString(CONTAINER_COLORS.RUNNING)); // #4CAF50
```

### Material Property Validation

```typescript
import { createContainerWallMaterial } from '@/lib/container-materials';

const material = createContainerWallMaterial();

// Check material properties
console.assert(material.metalness === 0.7, 'Metalness should be 0.7');
console.assert(material.roughness === 0.4, 'Roughness should be 0.4');
console.assert(material.color.getHex() === 0x263238, 'Color should be #263238');
```

### Visual Regression Testing

```typescript
// Capture screenshot for comparison
async function captureScreenshot(renderer: THREE.WebGLRenderer): Promise<string> {
  return renderer.domElement.toDataURL('image/png');
}

// Compare against reference image
const screenshot = await captureScreenshot(renderer);
// Use image comparison library to validate against reference
```

---

## 9. Storybook Integration

### Container Story

```typescript
// Container.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Canvas } from '@react-three/fiber';
import { Container } from '@/components/three/Container';

const meta: Meta<typeof Container> = {
  title: 'Three/Container',
  component: Container,
  decorators: [
    (Story) => (
      <Canvas camera={{ position: [0, 5, 10] }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={1.0} />
        <Story />
      </Canvas>
    ),
  ],
  argTypes: {
    state: {
      control: 'select',
      options: ['building', 'ready', 'running', 'error'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Building: Story = {
  args: {
    state: 'building',
  },
};

export const Ready: Story = {
  args: {
    state: 'ready',
  },
};

export const Running: Story = {
  args: {
    state: 'running',
  },
};

export const Error: Story = {
  args: {
    state: 'error',
  },
};
```

---

## 10. Common Patterns

### Scene Initialization Checklist

```typescript
// 1. Create scene with background
const scene = new THREE.Scene();
scene.background = new THREE.Color(CONTAINER_COLORS.BACKGROUND);

// 2. Add lighting
const lights = createSceneLighting();
addLightsToScene(scene, lights);

// 3. Configure renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// 4. Create camera
const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
camera.position.set(0, 5, 10);

// 5. Add controls (optional)
const controls = new OrbitControls(camera, renderer.domElement);

// 6. Add objects
const container = createContainer('building');
scene.add(container);

// 7. Start render loop
animate();
```

### Cleanup Pattern

```typescript
import { disposeMaterial } from '@/lib/container-materials';

function cleanupScene(scene: THREE.Scene) {
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.geometry.dispose();

      if (Array.isArray(object.material)) {
        object.material.forEach(disposeMaterial);
      } else {
        disposeMaterial(object.material);
      }
    }
  });
}

// Call on unmount/cleanup
cleanupScene(scene);
```

---

## 11. Troubleshooting

### Issue: Linewidth not working

**Problem**: `linewidth` greater than 1 doesn't render.

**Solution**: Use `Line2` from `three/examples/jsm/lines/Line2.js`:

```typescript
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';

const material = new LineMaterial({
  color: CONTAINER_COLORS.WIREFRAME_PRIMARY,
  linewidth: 2, // This will work with Line2
});
```

### Issue: Dashed lines not showing

**Problem**: `LineDashedMaterial` appears solid.

**Solution**: Call `computeLineDistances()` on geometry:

```typescript
const geometry = new THREE.EdgesGeometry(boxGeometry);
const line = new THREE.LineSegments(geometry, dashedMaterial);
line.computeLineDistances(); // Required!
```

### Issue: Shadows not appearing

**Problem**: Shadows are enabled but not visible.

**Solution**: Check all shadow settings:

```typescript
// Renderer
renderer.shadowMap.enabled = true;

// Light
light.castShadow = true;

// Casting object
mesh.castShadow = true;

// Receiving object
mesh.receiveShadow = true;
```

---

## 12. Further Reading

- [Three.js Material Documentation](https://threejs.org/docs/#api/en/materials/Material)
- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber)
- [Visual Style Guide](./CONTAINER_VISUAL_STYLE_GUIDE.md)
- [ILI-90: React Three Fiber Spike](../examples/ili-90-three-fiber-spike.md)

---

**Last Updated**: 2025-11-01
