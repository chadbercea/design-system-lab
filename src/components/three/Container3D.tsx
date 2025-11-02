'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { createContainerWallMaterial, createWireframeMaterial, createImageCrateMaterial } from '@/lib/container-materials';
import type { ContainerState } from '@/lib/container-colors';

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

  // Animation state
  const [wallOpacity, setWallOpacity] = useState(materializeWalls ? 0 : 1);
  const [animationStartTime, setAnimationStartTime] = useState<number | null>(null);

  // Create materials using the factory functions
  // Wall materials start transparent if materialization is enabled
  const wallMaterial = useMemo(() =>
    createContainerWallMaterial({
      transparent: true,
      opacity: materializeWalls ? 0 : 1
    }),
    [materializeWalls]
  );

  const wireframeMaterial = useMemo(() => {
    const material = createWireframeMaterial();
    // Ensure wireframe renders on top of transparent/opaque surfaces
    material.depthTest = true;
    material.depthWrite = false;
    return material;
  }, []);
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
      transparent: true,
      opacity: materializeWalls ? 0 : 1
    });
    if (dockerLogoTexture) {
      material.map = dockerLogoTexture;
      material.needsUpdate = true;
    }
    return material;
  }, [dockerLogoTexture, materializeWalls]);

  // Start animation when materializeWalls becomes true
  useEffect(() => {
    if (materializeWalls && animationStartTime === null) {
      setAnimationStartTime(Date.now());
    }
  }, [materializeWalls, animationStartTime]);

  // Animate the crate (subtle floating effect) and wall materialization
  useFrame((state) => {
    if (crateRef.current) {
      crateRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }

    // Animate wall opacity if materialization is enabled
    if (materializeWalls && animationStartTime !== null) {
      const elapsed = (Date.now() - animationStartTime) / 1000; // Convert to seconds
      const progress = Math.min(elapsed / materializationDuration, 1.0);

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

      {/* Container wireframe edges - rendered on top with polygon offset */}
      <lineSegments position={[0, 2.5, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(6, 5, 8), 1]} />
        <lineBasicMaterial
          color="#37474F"
          linewidth={2}
          transparent={false}
          depthTest={true}
          depthWrite={false}
          polygonOffset={true}
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
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
