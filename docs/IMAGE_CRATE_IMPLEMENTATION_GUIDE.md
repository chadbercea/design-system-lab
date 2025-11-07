# Docker Image Crate Implementation Guide

**Related:** IMAGE_CRATE_DESIGN_SPEC.md
**Status:** Technical Implementation Guide
**For Developers**

---

## Quick Start

### 1. Install Dependencies

```bash
npm install three @react-three/fiber @react-three/drei
npm install --save-dev @types/three
```

### 2. Create Directory Structure

```bash
mkdir -p src/components/3d/ImageCrate
mkdir -p public/models
mkdir -p public/textures
```

### 3. Add Assets
- Place `image-crate.glb` in `/public/models/`
- Place `docker-whale-logo.png` in `/public/textures/`

---

## Component Architecture

### Core Components

```typescript
// src/components/3d/ImageCrate/index.ts
export { ImageCrate } from './ImageCrate';
export { ImageCrateScene } from './ImageCrateScene';
export type { ImageCrateProps, AnimationState } from './types';
```

---

## Implementation

### 1. Types Definition

```typescript
// src/components/3d/ImageCrate/types.ts

export type AnimationState =
  | 'idle'
  | 'entering'
  | 'settled'
  | 'exiting'
  | 'floating';

export interface ImageCrateProps {
  /** Animation state */
  state?: AnimationState;

  /** Called when animation completes */
  onAnimationComplete?: (state: AnimationState) => void;

  /** Size scale factor */
  scale?: number;

  /** Enable idle floating animation */
  enableFloating?: boolean;

  /** Show Docker logo */
  showLogo?: boolean;

  /** Custom color override */
  color?: string;

  /** Enable glow effect */
  enableGlow?: boolean;
}

export interface CratePosition {
  x: number;
  y: number;
  z: number;
}

export interface AnimationConfig {
  duration: number;
  easing: (t: number) => number;
  startPosition: CratePosition;
  endPosition: CratePosition;
}
```

---

### 2. Animation Hook

```typescript
// src/components/3d/ImageCrate/useImageCrateAnimation.ts

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import type { AnimationState, AnimationConfig, CratePosition } from './types';

// Easing functions
const easeInOutCubic = (t: number): number => {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

const easeOutBounce = (t: number): number => {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (t < 1 / d1) {
    return n1 * t * t;
  } else if (t < 2 / d1) {
    return n1 * (t -= 1.5 / d1) * t + 0.75;
  } else if (t < 2.5 / d1) {
    return n1 * (t -= 2.25 / d1) * t + 0.9375;
  } else {
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  }
};

export const useImageCrateAnimation = (
  state: AnimationState,
  onAnimationComplete?: (state: AnimationState) => void
) => {
  const groupRef = useRef<Group>(null);
  const animationProgress = useRef(0);
  const animationStartTime = useRef(0);
  const previousState = useRef<AnimationState>(state);

  // Reset animation when state changes
  useEffect(() => {
    if (state !== previousState.current) {
      animationProgress.current = 0;
      animationStartTime.current = Date.now();
      previousState.current = state;
    }
  }, [state]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const group = groupRef.current;
    const elapsedTime = (Date.now() - animationStartTime.current) / 1000;

    switch (state) {
      case 'entering': {
        const duration = 1.5;
        const progress = Math.min(elapsedTime / duration, 1);

        // Arc trajectory
        const arcProgress = easeInOutCubic(progress);
        const startPos: CratePosition = { x: 3, y: 2, z: -4 };
        const endPos: CratePosition = { x: 0, y: 0, z: 0 };

        group.position.x = startPos.x + (endPos.x - startPos.x) * arcProgress;
        group.position.y = startPos.y + (endPos.y - startPos.y) * arcProgress +
                          Math.sin(arcProgress * Math.PI) * 0.5; // Arc effect
        group.position.z = startPos.z + (endPos.z - startPos.z) * arcProgress;

        // Gentle rotation during flight
        group.rotation.y = (1 - arcProgress) * (Math.PI / 12); // 15 degrees

        // Bounce at end
        if (progress > 0.8) {
          const bounceProgress = (progress - 0.8) / 0.2;
          const bounce = easeOutBounce(bounceProgress);
          group.scale.setScalar(0.95 + bounce * 0.05);
        }

        if (progress >= 1 && onAnimationComplete) {
          onAnimationComplete('settled');
        }
        break;
      }

      case 'settled': {
        // Idle position
        group.position.set(0, 0, 0);
        group.rotation.y = 0;
        group.scale.setScalar(1);
        break;
      }

      case 'floating': {
        // Subtle floating animation
        const floatSpeed = 0.5;
        const floatAmount = 0.05;
        group.position.y = Math.sin(elapsedTime * floatSpeed) * floatAmount;
        break;
      }

      case 'exiting': {
        const duration = 1.0;
        const progress = Math.min(elapsedTime / duration, 1);

        const exitProgress = easeInOutCubic(progress);
        const startPos: CratePosition = { x: 0, y: 0, z: 0 };
        const endPos: CratePosition = { x: -3, y: 2, z: -4 };

        group.position.x = startPos.x + (endPos.x - startPos.x) * exitProgress;
        group.position.y = startPos.y + (endPos.y - startPos.y) * exitProgress;
        group.position.z = startPos.z + (endPos.z - startPos.z) * exitProgress;

        // Increase rotation during exit
        group.rotation.y = exitProgress * (Math.PI / 4); // 45 degrees

        // Fade out handled by material opacity

        if (progress >= 1 && onAnimationComplete) {
          onAnimationComplete('idle');
        }
        break;
      }

      default:
        break;
    }
  });

  return groupRef;
};
```

---

### 3. Main Component

```typescript
// src/components/3d/ImageCrate/ImageCrate.tsx

'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { ImageCrateModel } from './ImageCrateModel';
import type { ImageCrateProps } from './types';

export const ImageCrate: React.FC<ImageCrateProps> = ({
  state = 'idle',
  onAnimationComplete,
  scale = 1,
  enableFloating = false,
  showLogo = true,
  color = '#0db7ed',
  enableGlow = false,
}) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px' }}>
      <Canvas
        camera={{ position: [3, 2, 5], fov: 50 }}
        shadows
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <pointLight position={[-5, 5, -5]} intensity={0.5} />

          {/* Environment */}
          <Environment preset="warehouse" />

          {/* Crate Model */}
          <ImageCrateModel
            state={state}
            onAnimationComplete={onAnimationComplete}
            scale={scale}
            enableFloating={enableFloating}
            showLogo={showLogo}
            color={color}
            enableGlow={enableGlow}
          />

          {/* Ground Shadow */}
          <ContactShadows
            position={[0, -1, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={4}
          />

          {/* Controls for interactive demo */}
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={2}
            maxDistance={10}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
```

---

### 4. Model Component

```typescript
// src/components/3d/ImageCrate/ImageCrateModel.tsx

'use client';

import React, { useRef, useMemo } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useImageCrateAnimation } from './useImageCrateAnimation';
import type { ImageCrateProps } from './types';

export const ImageCrateModel: React.FC<ImageCrateProps> = ({
  state = 'idle',
  onAnimationComplete,
  scale = 1,
  showLogo = true,
  color = '#0db7ed',
  enableGlow = false,
}) => {
  const groupRef = useImageCrateAnimation(state, onAnimationComplete);

  // Load 3D model (fallback to box if not available)
  const { nodes, materials } = useGLTF('/models/image-crate.glb', true) as any;

  // Load logo texture
  const logoTexture = useTexture('/textures/docker-whale-logo.png');

  // Create materials
  const crateMaterial = useMemo(() => {
    const baseColor = new THREE.Color(color);
    const lightColor = baseColor.clone().multiplyScalar(1.3);

    return new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: 0.4,
      metalness: 0.1,
      // Gradient effect could be achieved with texture or vertex colors
    });
  }, [color]);

  const logoMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: logoTexture,
      transparent: true,
      opacity: 0.9,
      roughness: 0.3,
      metalness: 0.2,
    });
  }, [logoTexture]);

  // Glow effect material
  const glowMaterial = useMemo(() => {
    if (!enableGlow) return null;

    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(color).multiplyScalar(1.5),
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide,
    });
  }, [enableGlow, color]);

  return (
    <group ref={groupRef} scale={scale}>
      {/* Main crate body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.3, 0.8, 0.8]} />
        <primitive object={crateMaterial} />
      </mesh>

      {/* Rounded edges */}
      <mesh position={[0.65, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
        <primitive object={crateMaterial} />
      </mesh>

      {/* Docker logo on front face */}
      {showLogo && (
        <mesh position={[0, 0, 0.41]} castShadow>
          <planeGeometry args={[0.8, 0.6]} />
          <primitive object={logoMaterial} />
        </mesh>
      )}

      {/* Glow effect */}
      {enableGlow && glowMaterial && (
        <mesh scale={[1.05, 1.05, 1.05]}>
          <boxGeometry args={[1.3, 0.8, 0.8]} />
          <primitive object={glowMaterial} />
        </mesh>
      )}
    </group>
  );
};

// Preload the model
useGLTF.preload('/models/image-crate.glb');
```

---

### 5. Storybook Stories

```typescript
// src/components/3d/ImageCrate/ImageCrate.stories.tsx

import type { Meta, StoryObj } from '@storybook/react';
import { ImageCrate } from './ImageCrate';
import { useState } from 'react';

const meta: Meta<typeof ImageCrate> = {
  title: '3D/ImageCrate',
  component: ImageCrate,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ImageCrate>;

export const Idle: Story = {
  args: {
    state: 'idle',
    showLogo: true,
    enableGlow: false,
  },
};

export const Entering: Story = {
  args: {
    state: 'entering',
    showLogo: true,
    enableGlow: false,
  },
};

export const Settled: Story = {
  args: {
    state: 'settled',
    showLogo: true,
    enableGlow: false,
  },
};

export const Floating: Story = {
  args: {
    state: 'floating',
    enableFloating: true,
    showLogo: true,
    enableGlow: true,
  },
};

export const WithGlow: Story = {
  args: {
    state: 'settled',
    showLogo: true,
    enableGlow: true,
  },
};

export const CustomColor: Story = {
  args: {
    state: 'settled',
    showLogo: true,
    color: '#ff6b6b',
  },
};

export const Interactive: Story = {
  render: () => {
    const [state, setState] = useState<'idle' | 'entering' | 'settled' | 'exiting'>('idle');

    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1rem', background: '#f0f0f0' }}>
          <button onClick={() => setState('entering')}>Play Enter Animation</button>
          <button onClick={() => setState('settled')} style={{ marginLeft: '0.5rem' }}>
            Settle
          </button>
          <button onClick={() => setState('exiting')} style={{ marginLeft: '0.5rem' }}>
            Play Exit Animation
          </button>
        </div>
        <div style={{ flex: 1 }}>
          <ImageCrate
            state={state}
            onAnimationComplete={(newState) => {
              console.log('Animation completed:', newState);
              setState(newState as any);
            }}
            showLogo={true}
            enableGlow={true}
          />
        </div>
      </div>
    );
  },
};
```

---

## 6. MUI Integration Wrapper

```typescript
// src/mui-sandbox/components/ImageCrateShowcase.tsx

import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { ImageCrate } from '@/components/3d/ImageCrate';
import type { ImageCrateProps } from '@/components/3d/ImageCrate/types';

interface ImageCrateShowcaseProps extends ImageCrateProps {
  title?: string;
  description?: string;
}

export const ImageCrateShowcase: React.FC<ImageCrateShowcaseProps> = ({
  title = 'Docker Image',
  description = 'Visual representation of a Docker image',
  ...crateProps
}) => {
  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {description}
        </Typography>

        <Box sx={{ height: 400, mt: 2 }}>
          <ImageCrate {...crateProps} />
        </Box>
      </CardContent>
    </Card>
  );
};
```

---

## 7. Usage Examples

### Basic Usage

```typescript
import { ImageCrate } from '@/components/3d/ImageCrate';

export default function Page() {
  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ImageCrate
        state="entering"
        showLogo={true}
        onAnimationComplete={(state) => {
          console.log('Animation completed:', state);
        }}
      />
    </div>
  );
}
```

### With State Management

```typescript
'use client';

import { useState } from 'react';
import { ImageCrate } from '@/components/3d/ImageCrate';
import type { AnimationState } from '@/components/3d/ImageCrate/types';

export default function ContainerVisualization() {
  const [crateState, setCrateState] = useState<AnimationState>('idle');

  const handleImageLoad = () => {
    setCrateState('entering');
  };

  const handleAnimationComplete = (state: AnimationState) => {
    if (state === 'settled') {
      setCrateState('floating');
    }
  };

  return (
    <div>
      <button onClick={handleImageLoad}>Load Image</button>
      <ImageCrate
        state={crateState}
        onAnimationComplete={handleAnimationComplete}
        enableFloating={crateState === 'floating'}
        enableGlow={true}
      />
    </div>
  );
}
```

---

## 8. Performance Optimization

### Lazy Loading

```typescript
import dynamic from 'next/dynamic';

const ImageCrate = dynamic(
  () => import('@/components/3d/ImageCrate').then((mod) => mod.ImageCrate),
  {
    ssr: false,
    loading: () => <div>Loading 3D visualization...</div>,
  }
);
```

### Memoization

```typescript
import { memo } from 'react';

export const ImageCrateModel = memo<ImageCrateProps>(({ ... }) => {
  // Component implementation
});
```

### Asset Optimization
- Compress GLB files with gltf-pipeline
- Use Draco compression for geometry
- Optimize textures to power-of-2 dimensions
- Use WebP format for textures where possible

---

## 9. Testing

### Unit Tests

```typescript
// src/components/3d/ImageCrate/__tests__/ImageCrate.test.tsx

import { render } from '@testing-library/react';
import { ImageCrate } from '../ImageCrate';

describe('ImageCrate', () => {
  it('renders without crashing', () => {
    const { container } = render(<ImageCrate state="idle" />);
    expect(container).toBeInTheDocument();
  });

  it('calls onAnimationComplete when animation finishes', async () => {
    const onComplete = jest.fn();
    render(
      <ImageCrate state="entering" onAnimationComplete={onComplete} />
    );

    // Wait for animation duration
    await new Promise(resolve => setTimeout(resolve, 1600));

    expect(onComplete).toHaveBeenCalledWith('settled');
  });
});
```

---

## 10. Troubleshooting

### Common Issues

**Issue:** Model doesn't load
- Check GLB file path is correct
- Verify file is in `/public/models/` directory
- Check browser console for 404 errors

**Issue:** Animation stutters
- Reduce polygon count in 3D model
- Disable shadows temporarily
- Check frame rate in browser DevTools

**Issue:** Logo doesn't appear
- Verify PNG file has transparency
- Check texture path
- Ensure `showLogo={true}` prop is set

**Issue:** Colors look wrong
- Verify color format (hex string)
- Check lighting setup
- Adjust material roughness/metalness

---

## 11. Next Steps

1. Create placeholder 3D model in Blender
2. Test basic integration in Storybook
3. Refine animation timings based on feel
4. Add sound effects (optional)
5. Integrate with container visualization
6. Performance testing on various devices
7. Accessibility considerations (reduced motion)

---

## Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [Drei Helpers](https://github.com/pmndrs/drei)
- [GLTF Optimization](https://github.com/AnalyticalGraphicsInc/gltf-pipeline)
- [Docker Brand Guidelines](https://www.docker.com/company/newsroom/media-resources/)

---

**Status:** Ready for implementation
**Estimated Development Time:** 6-8 hours
**Dependencies:** Three.js ecosystem fully defined
