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
 * ResizeHandler - Ensures camera stays centered on resize
 */
function ResizeHandler() {
  const { camera, gl } = useThree();

  useEffect(() => {
    const handleResize = () => {
      if ('aspect' in camera) {
        camera.aspect = gl.domElement.width / gl.domElement.height;
        camera.updateProjectionMatrix();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [camera, gl]);

  return null;
}

/**
 * CameraController - Choreographs camera position for building sequence
 *
 * Camera positions for each phase:
 * - default: Free roam, no constraints (ready state)
 * - buildStart: 45° angle off left door to see crate entering
 * - doorsClosing: Front view of doors to see them closing
 * - terminal: Hold front view to see terminal text on left door
 * - runningRotate: 45° angle off right side for running state
 */
function CameraController({ cameraPhase, containerStatus }: { cameraPhase: string; containerStatus: string }) {
  const controlsRef = useRef<OrbitControlsType | null>(null);
  const { camera } = useThree();
  const { setUserInteracting } = useAppState();
  const prevPhaseRef = useRef<string>(cameraPhase);
  const isAnimatingRef = useRef(false);
  const animStartTimeRef = useRef<number | null>(null);
  const startPositionRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const targetPositionRef = useRef<THREE.Vector3>(new THREE.Vector3());

  const animDuration = 1.2; // 1.2 second camera movements

  // Define camera positions for each choreography phase
  const getCameraPosition = (phase: string): THREE.Vector3 => {
    switch (phase) {
      case 'buildStart':
        // 45° angle off left door - looking at left side/front
        return new THREE.Vector3(-8, 6, 10);
      case 'doorsClosing':
      case 'terminal':
        // Front view of doors - centered
        return new THREE.Vector3(0, 6, 14);
      case 'runningRotate':
        // 45° angle off right side
        return new THREE.Vector3(8, 6, 10);
      case 'default':
      default:
        // Default starting position
        return new THREE.Vector3(8, 6, 12);
    }
  };

  // Detect user interaction in ready state
  useEffect(() => {
    if (!controlsRef.current) return;

    const handleStart = () => {
      if (containerStatus === 'ready') {
        setUserInteracting(true);
      }
    };

    const handleEnd = () => {
      if (containerStatus === 'ready') {
        setUserInteracting(false);
      }
    };

    const controls = controlsRef.current;
    controls.addEventListener('start', handleStart);
    controls.addEventListener('end', handleEnd);

    return () => {
      controls.removeEventListener('start', handleStart);
      controls.removeEventListener('end', handleEnd);
    };
  }, [containerStatus, setUserInteracting]);

  useFrame(() => {
    // Detect phase change
    if (cameraPhase !== prevPhaseRef.current) {
      // Phase changed - start camera animation
      isAnimatingRef.current = true;
      animStartTimeRef.current = Date.now();
      startPositionRef.current.copy(camera.position);
      targetPositionRef.current.copy(getCameraPosition(cameraPhase));
      prevPhaseRef.current = cameraPhase;
    }

    // Animate camera to target position
    if (isAnimatingRef.current && animStartTimeRef.current !== null) {
      const elapsed = (Date.now() - animStartTimeRef.current) / 1000;
      const progress = Math.min(elapsed / animDuration, 1.0);

      // Ease in-out cubic for smooth acceleration and deceleration
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      // Interpolate camera position
      camera.position.lerpVectors(startPositionRef.current, targetPositionRef.current, eased);

      // Update controls
      if (controlsRef.current) {
        controlsRef.current.update();
      }

      // Complete animation
      if (progress >= 1.0) {
        isAnimatingRef.current = false;
        animStartTimeRef.current = null;
        camera.position.copy(targetPositionRef.current);
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
  const { containerStatus, cameraPhase } = useAppState();

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
          camera={{
            position: [8, 6, 12],
            fov: 50,
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

          {/* Resize handler to keep camera centered */}
          <ResizeHandler />

          {/* Camera controls with choreographed movements for building sequence */}
          <CameraController cameraPhase={cameraPhase} containerStatus={containerStatus} />
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
