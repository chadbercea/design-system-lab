'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import {
  createContainerWallMaterial,
  createWireframeMaterial,
  createDottedWireframeMaterial,
  createImageCrateMaterial
} from '@/lib/container-materials';
import type { ContainerState } from '@/lib/container-colors';
import { CONTAINER_COLORS, getBuildingPulseOpacity } from '@/lib/container-colors';

interface Container3DProps {
  state?: ContainerState;
  /** Enable wall materialization animation (opacity 0 → 1) */
  materializeWalls?: boolean;
  /** Duration of the materialization animation in seconds (default: 10s) */
  materializationDuration?: number;
}

export function Container3D({
  state = 'ready',
  materializeWalls = false,
  materializationDuration = 10.0
}: Container3DProps) {
  const containerRef = useRef<THREE.Group>(null);
  const crateRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.LineSegments>(null);
  const glowMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);

  // Animation state
  const [wallOpacity, setWallOpacity] = useState(materializeWalls ? 0 : 1);
  const [animationStartTime, setAnimationStartTime] = useState<number | null>(null);

  // Create materials using the factory functions
  // Wall materials start transparent if materialization is enabled
  const wallMaterial = useMemo(() =>
    createContainerWallMaterial({
      transparent: materializeWalls,
      opacity: materializeWalls ? 0 : 1
    }),
    [materializeWalls]
  );

  const solidWireframeMaterial = useMemo(() => createWireframeMaterial(), []);
  const dottedWireframeMaterial = useMemo(() => createDottedWireframeMaterial(), []);
  const crateMaterial = useMemo(() => createImageCrateMaterial(), []);

  // Load Docker logo texture for side panel
  const dockerLogoTexture = useMemo(() => {
    try {
      const loader = new THREE.TextureLoader();
      // For now, create a simple texture using canvas
      // In production, this would load an actual Docker logo image
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Create a simple Docker-blue background with "DOCKER" text
        ctx.fillStyle = '#2496ED';
        ctx.fillRect(0, 0, 512, 512);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 72px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('DOCKER', 256, 256);
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    } catch (error) {
      console.warn('Failed to create Docker logo texture:', error);
      return null;
    }
  }, []);

  // Material for the side panel with Docker logo
  const logoMaterial = useMemo(() => {
    const material = createContainerWallMaterial({
      transparent: materializeWalls,
      opacity: materializeWalls ? 0 : 1
    });
    if (dockerLogoTexture) {
      material.map = dockerLogoTexture;
      material.needsUpdate = true;
    }
    return material;
  }, [dockerLogoTexture, materializeWalls]);

  // Create glow material for building state
  const glowMaterial = useMemo(() => {
    if (state === 'building') {
      const material = new THREE.MeshBasicMaterial({
        color: CONTAINER_COLORS.BUILDING,
        transparent: true,
        opacity: 0.6,
        side: THREE.FrontSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      glowMaterialRef.current = material;
      return material;
    }
    return null;
  }, [state]);

  // Choose wireframe material based on state
  const wireframeMaterial = state === 'building' ? dottedWireframeMaterial : solidWireframeMaterial;

  // Start animation when materializeWalls becomes true
  useEffect(() => {
    if (materializeWalls && animationStartTime === null) {
      setAnimationStartTime(Date.now());
    }
  }, [materializeWalls, animationStartTime]);

  // Animation loop
  useFrame((frameState) => {
    const elapsed = frameState.clock.elapsedTime;

    // Animate the crate (subtle floating effect)
    if (crateRef.current) {
      crateRef.current.position.y = Math.sin(elapsed * 0.5) * 0.1;
    }

    // Building state animations
    if (state === 'building') {
      // Slow rotation of container
      if (containerRef.current) {
        containerRef.current.rotation.y = elapsed * 0.2; // Slow rotation
      }

      // Pulsing glow effect
      if (glowMaterialRef.current) {
        glowMaterialRef.current.opacity = getBuildingPulseOpacity(elapsed);
      }

      // Animate dash offset for "marching ants" effect
      if (wireframeRef.current && wireframeRef.current.material instanceof THREE.LineDashedMaterial) {
        wireframeRef.current.material.dashOffset = -elapsed * 0.5; // Marching animation
      }
    } else {
      // Reset rotation for non-building states
      if (containerRef.current) {
        containerRef.current.rotation.y = 0;
      }
    }

    // Animate wall opacity if materialization is enabled
    if (materializeWalls && animationStartTime !== null) {
      const materialElapsed = (Date.now() - animationStartTime) / 1000; // Convert to seconds
      const progress = Math.min(materialElapsed / materializationDuration, 1.0);

      // Ease-in-out cubic easing for smooth transition
      const easedProgress = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const newOpacity = easedProgress;

      if (newOpacity !== wallOpacity) {
        setWallOpacity(newOpacity);
        wallMaterial.opacity = newOpacity;
        wallMaterial.needsUpdate = true;
        logoMaterial.opacity = newOpacity;
        logoMaterial.needsUpdate = true;
      }
    }
  });

  return (
    <group ref={containerRef}>
      {/* Container walls - rendered as individual panels to support different materials */}
      <group position={[0, 2.5, 0]}>
        {/* Front wall (facing +Z) - with Docker logo */}
        <mesh position={[0, 0, 4]}>
          <planeGeometry args={[6, 5]} />
          <primitive object={logoMaterial} attach="material" />
        </mesh>

        {/* Back wall (facing -Z) */}
        <mesh position={[0, 0, -4]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[6, 5]} />
          <primitive object={wallMaterial} attach="material" />
        </mesh>

        {/* Left wall (facing -X) */}
        <mesh position={[-3, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[8, 5]} />
          <primitive object={wallMaterial} attach="material" />
        </mesh>

        {/* Right wall (facing +X) */}
        <mesh position={[3, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[8, 5]} />
          <primitive object={wallMaterial} attach="material" />
        </mesh>

        {/* Top wall */}
        <mesh position={[0, 2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[6, 8]} />
          <primitive object={wallMaterial} attach="material" />
        </mesh>

        {/* Bottom wall */}
        <mesh position={[0, -2.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[6, 8]} />
          <primitive object={wallMaterial} attach="material" />
        </mesh>
      </group>

      {/* Container wireframe edges */}
      <lineSegments
        ref={wireframeRef}
        position={[0, 2.5, 0]}
        onUpdate={(self) => {
          // Compute line distances for dashed material
          if (self.geometry) {
            self.geometry.computeBoundingSphere();
            // @ts-ignore - computeLineDistances exists on BufferGeometry
            self.geometry.computeLineDistances();
          }
        }}
      >
        <edgesGeometry args={[new THREE.BoxGeometry(6, 5, 8)]} />
        <primitive object={wireframeMaterial} attach="material" />
      </lineSegments>

      {/* Glow layer for building state */}
      {state === 'building' && glowMaterial && (
        <mesh position={[0, 2.5, 0]}>
          <boxGeometry args={[6.1, 5.1, 8.1]} />
          <primitive object={glowMaterial} attach="material" />
        </mesh>
      )}

      {/* Image crate inside container */}
      <mesh ref={crateRef} position={[0, 1.5, 0]}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <primitive object={crateMaterial} attach="material" />
      </mesh>

      {/* Crate wireframe */}
      <lineSegments position={[0, 1.5, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(1.5, 1.5, 1.5)]} />
        <lineBasicMaterial color="#f59e0b" opacity={0.6} transparent />
      </lineSegments>

      {/* Building state text overlay */}
      {state === 'building' && (
        <Html
          position={[0, 7, 0]}
          center
          distanceFactor={10}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              background: 'rgba(33, 150, 243, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(33, 150, 243, 0.4)',
              borderRadius: '8px',
              padding: '12px 24px',
              color: '#64B5F6',
              fontSize: '18px',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              textAlign: 'center',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          >
            Building container...
          </div>
        </Html>
      )}

      {/* Ground plane for reference */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} metalness={0.2} />
      </mesh>
    </group>
  );
}
