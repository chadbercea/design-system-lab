/**
 * ImageCrate component
 *
 * Main wrapper component for the Docker image crate visualization.
 * Can be used standalone or integrated into container scenes.
 *
 * Usage:
 * ```tsx
 * <ImageCrate
 *   state="entering"
 *   showLogo={true}
 *   onAnimationComplete={(state) => console.log('Animation done:', state)}
 * />
 * ```
 *
 * @see /docs/IMAGE_CRATE_DESIGN_SPEC.md
 * @see /docs/IMAGE_CRATE_IMPLEMENTATION_GUIDE.md
 */

'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { ImageCrateModel } from './ImageCrateModel';
import type { ImageCrateProps } from './types';

interface ImageCrateCanvasProps extends ImageCrateProps {
  /** Show orbit controls for interaction (default: true) */
  showControls?: boolean;
  /** Camera position (default: [3, 2, 5]) */
  cameraPosition?: [number, number, number];
}

/**
 * ImageCrate with full Canvas setup (for standalone use)
 */
export const ImageCrate: React.FC<ImageCrateCanvasProps> = ({
  state = 'idle',
  onAnimationComplete,
  scale = 1,
  enableFloating = false,
  showLogo = true,
  color = '#0db7ed',
  enableGlow = false,
  showControls = true,
  cameraPosition = [3, 2, 5],
}) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px' }}>
      <Canvas
        camera={{ position: cameraPosition, fov: 50 }}
        shadows
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          {/* Lighting setup */}
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <pointLight position={[-5, 5, -5]} intensity={0.5} />
          <spotLight
            position={[0, 5, 0]}
            angle={0.5}
            penumbra={1}
            intensity={0.3}
            castShadow
          />

          {/* Environment for reflections */}
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
            position={[0, 0, 0]}
            opacity={0.4}
            scale={5}
            blur={2}
            far={4}
          />

          {/* Ground plane for reference */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[10, 10]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.8} metalness={0.2} />
          </mesh>

          {/* Interactive Controls */}
          {showControls && (
            <OrbitControls
              enableZoom={true}
              enablePan={false}
              minDistance={2}
              maxDistance={10}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};

/**
 * ImageCrate model only (for use inside existing Canvas/Scene)
 */
export { ImageCrateModel } from './ImageCrateModel';

/**
 * Export types for external use
 */
export type { ImageCrateProps, AnimationState } from './types';
