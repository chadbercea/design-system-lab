'use client';

import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createContainerWallMaterial, createWireframeMaterial, createDockerImageCrateMaterial } from '@/lib/container-materials';
import type { ContainerState } from '@/lib/container-colors';
import { ImageCrateModel } from './ImageCrate';

interface Container3DProps {
  state?: ContainerState;
}

export function Container3D({ state = 'ready' }: Container3DProps) {
  const containerRef = useRef<THREE.Group>(null);
  const [crateState, setCrateState] = useState<'idle' | 'entering' | 'settled' | 'floating'>('floating');

  // Create materials using the factory functions
  const wallMaterial = useMemo(() => createContainerWallMaterial(), []);
  const wireframeMaterial = useMemo(() => createWireframeMaterial(), []);

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

      {/* New Docker image crate (ILI-95) */}
      <ImageCrateModel
        state={crateState}
        showLogo={true}
        enableGlow={state === 'running'}
        enableFloating={crateState === 'floating'}
        scale={1}
        onAnimationComplete={(newState) => {
          console.log('Crate animation complete:', newState);
          if (newState === 'settled') {
            setCrateState('floating');
          }
        }}
      />

      {/* Ground plane for reference */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} metalness={0.2} />
      </mesh>
    </group>
  );
}
