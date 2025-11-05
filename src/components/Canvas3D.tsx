'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useAppState } from '@/lib/app-state-context';
import { Container3D } from './three/Container3D';

/**
 * Canvas3D Component
 *
 * Main 3D canvas that wraps the Container3D visualization.
 * Integrates with app state to drive visual changes.
 *
 * Features:
 * - Maintains 100vh × 100vw viewport (never squished by panels)
 * - Connects container visualization to app state
 * - Handles 60fps rendering performance
 * - Uses React Three Fiber for declarative 3D
 */

function FallbackLoader() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-zinc-500">Loading 3D visualization...</div>
    </div>
  );
}

export function Canvas3D() {
  const { containerStatus } = useAppState();

  // Map app ContainerStatus to Container3D ContainerState
  // ContainerStatus: 'building' | 'running' | 'stopped' | 'error'
  // ContainerState: 'building' | 'ready' | 'running' | 'error'
  const mapStatusToState = (status: string): 'building' | 'ready' | 'running' | 'error' | 'idle' | 'stopped' => {
    switch (status) {
      case 'building':
        return 'building';
      case 'running':
        return 'running';
      case 'error':
        return 'error';
      case 'stopped':
        return 'stopped';
      default:
        return 'idle';
    }
  };

  const containerState = mapStatusToState(containerStatus);

  return (
    <div className="relative h-full w-full bg-black">
      <Suspense fallback={<FallbackLoader />}>
        <Canvas
          shadows
          className="h-full w-full"
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
          }}
        >
          {/* Camera */}
          <PerspectiveCamera
            makeDefault
            position={[8, 6, 12]}
            fov={50}
          />

          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 15, 10]}
            intensity={0.8}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />

          {/* Container 3D visualization */}
          <Container3D state={containerState} />

          {/* Controls - only enable rotation for idle/stopped states */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={containerState === 'idle' || containerState === 'stopped'}
            minDistance={10}
            maxDistance={30}
            maxPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </Suspense>

      {/* State indicator overlay (debugging) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-4 left-4 rounded bg-black/50 px-3 py-1 text-xs text-white">
          State: {containerState}
        </div>
      )}
    </div>
  );
}
