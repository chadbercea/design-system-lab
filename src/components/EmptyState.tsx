'use client';

import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Container3D } from './three/Container3D';
import { Button } from '@/components/ui/button';
import type { Group } from 'three';

/**
 * RotatingContainer - Auto-rotates the container slowly
 */
function RotatingContainer() {
  const groupRef = useRef<Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Slow continuous rotation on Y axis (0.1 rad/sec)
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Container3D state="ready" />
    </group>
  );
}

/**
 * ResizeHandler - Keeps camera centered on resize
 */
function ResizeHandler() {
  const { camera, gl } = useThree();

  useEffect(() => {
    const handleResize = () => {
      camera.aspect = gl.domElement.width / gl.domElement.height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [camera, gl]);

  return null;
}

export function EmptyState() {
  const [showWelcome, setShowWelcome] = useState(true);

  const handleGotIt = () => {
    setShowWelcome(false);
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center bg-black">
      {/* 3D Container Background - blurred when welcome shown, clear when dismissed */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{
          opacity: showWelcome ? 0.5 : 1,
          filter: showWelcome ? 'blur(4px)' : 'none'
        }}
      >
        <Suspense fallback={null}>
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
            {/* Resize handler for responsive centering */}
            <ResizeHandler />

            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight
              position={[10, 15, 10]}
              intensity={0.8}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />

            {/* Rotating Container - centered at [0, 2.5, 0] */}
            <RotatingContainer />

            {/* OrbitControls to look at container center */}
            <OrbitControls
              target={[0, 2.5, 0]}
              enableRotate={false}
              enableZoom={false}
              enablePan={false}
            />
          </Canvas>
        </Suspense>
      </div>

      {/* Content - layered on top, fade out when dismissed */}
      {showWelcome && (
        <div className="relative z-10 flex flex-col items-center gap-8 px-8 text-center animate-in fade-in duration-500">
          {/* Docker logo - WHITE */}
          <img
            src="/docker-logo.svg"
            alt="Docker"
            className="h-24 w-24"
          />

          {/* Title */}
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-semibold text-white">
              Get Started
            </h1>
            <p className="text-base text-zinc-500 max-w-md leading-relaxed">
              Follow these steps to run your container
            </p>
          </div>

          {/* Workflow Steps */}
          <div className="flex flex-col gap-4 mt-4">
            {/* Step 1 */}
            <div className="flex items-start gap-4 text-left">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-700 text-white font-semibold text-sm flex-shrink-0">
                1
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-white">
                  Select an image
                </h3>
                <p className="text-xs text-zinc-600">
                  Choose from the left panel or use the sample image
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4 text-left">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-700 text-white font-semibold text-sm flex-shrink-0">
                2
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-white">
                  Click Run
                </h3>
                <p className="text-xs text-zinc-600">
                  Start the container and watch the build process
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4 text-left">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-700 text-white font-semibold text-sm flex-shrink-0">
                3
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-white">
                  Monitor your container
                </h3>
                <p className="text-xs text-zinc-600">
                  View logs, metrics, and actions in the right panel
                </p>
              </div>
            </div>
          </div>

          {/* Arrow pointer and Got it button */}
          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-zinc-500">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Start by selecting an image</span>
            </div>
            <Button
              onClick={handleGotIt}
              className="bg-zinc-700 hover:bg-zinc-600 text-white px-6 py-2"
            >
              Got it
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
