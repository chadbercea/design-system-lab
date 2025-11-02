'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createContainerWallMaterial, createWireframeMaterial, createImageCrateMaterial } from '@/lib/container-materials';
import type { ContainerState } from '@/lib/container-colors';

interface Container3DProps {
  state?: ContainerState;
}

export function Container3D({ state = 'ready' }: Container3DProps) {
  const containerRef = useRef<THREE.Group>(null);
  const crateRef = useRef<THREE.Mesh>(null);

  // Create materials using the factory functions
  const wallMaterial = useMemo(() => createContainerWallMaterial(), []);
  const wireframeMaterial = useMemo(() => createWireframeMaterial(), []);
  const crateMaterial = useMemo(() => createImageCrateMaterial(), []);

  // Animate the crate (subtle floating effect)
  useFrame((state) => {
    if (crateRef.current) {
      crateRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
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
      <lineSegments position={[0, 2.5, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(6, 5, 8)]} />
        <primitive object={wireframeMaterial} attach="material" />
      </lineSegments>

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

      {/* Ground plane for reference */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} metalness={0.2} />
      </mesh>
    </group>
  );
}
