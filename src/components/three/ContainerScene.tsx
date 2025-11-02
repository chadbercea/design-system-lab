'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import { Container3D } from './Container3D';
import type { ContainerState } from '@/lib/container-colors';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

interface ContainerSceneProps {
  state?: ContainerState;
  className?: string;
  height?: string;
  showControls?: boolean;
}

export function ContainerScene({
  state = 'ready',
  className = '',
  height = '600px',
  showControls = true,
}: ContainerSceneProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const handleDoubleClick = () => {
    // Reset camera to front view
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div
      className={`w-full ${className}`}
      style={{ height }}
      onDoubleClick={handleDoubleClick}
    >
      <Canvas
        shadows
        camera={{
          position: [0, 5, 10],
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
      >
        {/* Ambient light - base fill */}
        <ambientLight color="#404040" intensity={0.4} />

        {/* Key light - main illumination */}
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.0}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* Rim light - edge highlight */}
        <directionalLight
          position={[-5, 3, -5]}
          intensity={0.5}
          color="#7FA1C3"
        />

        {/* Accent light - state-dependent (positioned above container) */}
        <pointLight
          position={[0, 5, 0]}
          intensity={0.8}
          color={state === 'building' ? '#f59e0b' : state === 'running' ? '#10b981' : state === 'error' ? '#ef4444' : '#ffffff'}
          distance={15}
        />

        {/* Container */}
        <Container3D state={state} />

        {/* OrbitControls with configured constraints */}
        {showControls && (
          <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.05}
            rotateSpeed={0.8}
            zoomSpeed={0.8}
            minDistance={5}
            maxDistance={30}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2}
            target={[0, 2.5, 0]}
          />
        )}
      </Canvas>
    </div>
  );
}
