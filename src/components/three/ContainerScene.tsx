'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Container, getContainerDimensions } from './Container';
import { CONTAINER_COLORS } from '@/lib/container-colors';

export interface ContainerSceneProps {
  /**
   * Canvas width (CSS value)
   */
  width?: string | number;
  /**
   * Canvas height (CSS value)
   */
  height?: string | number;
  /**
   * Whether to show orbit controls for interaction
   */
  showControls?: boolean;
}

/**
 * Complete Three.js scene with container, camera, and lighting
 *
 * Features:
 * - Camera positioned at 30° elevation for good viewing angle
 * - Three-light setup (ambient + directional + rim)
 * - OrbitControls for interactive camera movement
 * - Dark background matching design system
 *
 * @see /docs/design-system/CONTAINER_VISUAL_STYLE_GUIDE.md
 */
export function ContainerScene({
  width = '100%',
  height = '600px',
  showControls = true,
}: ContainerSceneProps) {
  const dimensions = getContainerDimensions();

  // Calculate camera position for 30° elevation
  // Distance should show the full container comfortably
  const cameraDistance = Math.max(dimensions.width, dimensions.height, dimensions.depth) * 2.5;
  const elevationAngle = (30 * Math.PI) / 180; // 30° in radians

  const cameraPosition: [number, number, number] = [
    cameraDistance * Math.cos(elevationAngle),
    cameraDistance * Math.sin(elevationAngle),
    cameraDistance * Math.cos(elevationAngle),
  ];

  return (
    <div style={{ width, height }}>
      <Canvas
        camera={{
          position: cameraPosition,
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
        style={{
          background: `#${CONTAINER_COLORS.BACKGROUND.toString(16).padStart(6, '0')}`,
        }}
      >
        {/* Ambient light - base illumination (40% intensity) */}
        <ambientLight intensity={0.4} color={0x404040} />

        {/* Key light - main directional light from upper-right (100% intensity) */}
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.0}
          color={0xffffff}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />

        {/* Rim light - back lighting for edges (50% intensity) */}
        <directionalLight position={[-5, 3, -5]} intensity={0.5} color={0x7fa1c3} />

        {/* Accent light - point light from above (80% intensity) */}
        <pointLight position={[0, 5, 0]} intensity={0.8} color={CONTAINER_COLORS.READY} distance={20} decay={2} />

        {/* Container with edges */}
        <Container position={[0, 0, 0]} showEdges={true} />

        {/* Interactive camera controls */}
        {showControls && (
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            rotateSpeed={0.5}
            zoomSpeed={0.8}
            minDistance={5}
            maxDistance={50}
            target={[0, 0, 0]}
          />
        )}
      </Canvas>
    </div>
  );
}
