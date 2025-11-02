'use client';

import { useRef, useMemo } from 'react';
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
}

export function Container3D({ state = 'ready' }: Container3DProps) {
  const containerRef = useRef<THREE.Group>(null);
  const crateRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.LineSegments>(null);
  const glowMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);

  // Create materials using the factory functions
  const wallMaterial = useMemo(() => createContainerWallMaterial(), []);
  const solidWireframeMaterial = useMemo(() => createWireframeMaterial(), []);
  const dottedWireframeMaterial = useMemo(() => {
    const material = createDottedWireframeMaterial();
    return material;
  }, []);
  const crateMaterial = useMemo(() => createImageCrateMaterial(), []);

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
  });

  return (
    <group ref={containerRef}>
      {/* Container walls */}
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[6, 5, 8]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>

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
