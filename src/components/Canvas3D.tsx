'use client';

import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useAppState } from '@/lib/app-state-context';
import { Container3D } from './three/Container3D';
import type { OrbitControls as OrbitControlsType } from 'three-stdlib';
import * as THREE from 'three';

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

/**
 * CameraController - Smoothly resets camera position on state transitions
 * Animates camera back to default position: [8, 6, 12] before each state change
 */
function CameraController({ containerState }: { containerState: string }) {
  const controlsRef = useRef<OrbitControlsType | null>(null);
  const { camera } = useThree();
  const prevStateRef = useRef<string>(containerState);
  const isResettingRef = useRef(false);
  const resetStartTimeRef = useRef<number | null>(null);
  const startPositionRef = useRef<THREE.Vector3>(new THREE.Vector3());

  // Default camera position
  const defaultPosition = new THREE.Vector3(8, 6, 12);
  const resetDuration = 0.8; // 800ms smooth animation

  useFrame(() => {
    // Detect state transition
    if (containerState !== prevStateRef.current) {
      // State changed - start camera reset
      isResettingRef.current = true;
      resetStartTimeRef.current = Date.now();
      startPositionRef.current.copy(camera.position);
      prevStateRef.current = containerState;
    }

    // Animate camera reset
    if (isResettingRef.current && resetStartTimeRef.current !== null) {
      const elapsed = (Date.now() - resetStartTimeRef.current) / 1000;
      const progress = Math.min(elapsed / resetDuration, 1.0);

      // Ease out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);

      // Interpolate camera position
      camera.position.lerpVectors(startPositionRef.current, defaultPosition, eased);

      // Update controls target smoothly
      if (controlsRef.current) {
        controlsRef.current.update();
      }

      // Complete reset
      if (progress >= 1.0) {
        isResettingRef.current = false;
        resetStartTimeRef.current = null;
        camera.position.copy(defaultPosition);
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      rotateSpeed={0.8}
      zoomSpeed={0.8}
      enablePan={false}
      minDistance={5}
      maxDistance={30}
      minPolarAngle={0}
      maxPolarAngle={Math.PI / 2}
      target={[0, 2.5, 0]}
    />
  );
}

export function Canvas3D() {
  const { containerStatus } = useAppState();

  // Map app ContainerStatus to Container3D ContainerState
  // PoC has 4 states: 'ready' | 'building' | 'running' | 'error'
  // No mapping needed - ContainerStatus matches Container3D states exactly
  const containerState = containerStatus;

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

          {/* Camera controls with smooth reset on state transitions */}
          <CameraController containerState={containerState} />
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
