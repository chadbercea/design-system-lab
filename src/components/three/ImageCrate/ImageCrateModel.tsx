/**
 * ImageCrateModel component
 *
 * Renders the 3D geometry for a Docker image crate.
 *
 * Design Specifications (from IMAGE_CRATE_DESIGN_SPEC.md):
 * - Shape: Rounded rectangular prism (golden ratio: 1.618:1:1)
 * - Dimensions: 1.3 x 0.8 x 0.8 units (adjusted for container scale)
 * - Material: Docker blue gradient (#0db7ed to #4dc9f0)
 * - Logo: Docker whale on front face (60% of face area)
 * - Edge treatment: Rounded corners (radius: 0.04 units)
 * - Optional: Subtle glow effect
 *
 * @see /docs/IMAGE_CRATE_DESIGN_SPEC.md - Exploration D (Section 3)
 */

'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useImageCrateAnimation } from './useImageCrateAnimation';
import type { ImageCrateProps } from './types';

export const ImageCrateModel: React.FC<ImageCrateProps> = ({
  state = 'idle',
  onAnimationComplete,
  scale = 1,
  showLogo = true,
  color = '#0db7ed', // Docker blue
  enableGlow = false,
}) => {
  const groupRef = useImageCrateAnimation(state, onAnimationComplete);

  // Create main crate material with gradient effect
  const crateMaterial = useMemo(() => {
    const baseColor = new THREE.Color(color);

    return new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: 0.4, // Matte finish as specified
      metalness: 0.1, // Low metalness for painted surface
      flatShading: false,
    });
  }, [color]);

  // Create logo material (Docker whale on front face)
  const logoMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#ffffff', // White logo
      roughness: 0.3,
      metalness: 0.2,
      emissive: '#ffffff',
      emissiveIntensity: 0.1,
    });
  }, []);

  // Create edge material for rounded corners
  const edgeMaterial = useMemo(() => {
    const baseColor = new THREE.Color(color);
    const darkerColor = baseColor.clone().multiplyScalar(0.8); // Slightly darker for edges

    return new THREE.MeshStandardMaterial({
      color: darkerColor,
      roughness: 0.4,
      metalness: 0.1,
    });
  }, [color]);

  // Glow effect material (optional)
  const glowMaterial = useMemo(() => {
    if (!enableGlow) return null;

    const glowColor = new THREE.Color(color).multiplyScalar(1.5);

    return new THREE.MeshBasicMaterial({
      color: glowColor,
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide,
    });
  }, [enableGlow, color]);

  return (
    <group ref={groupRef} scale={scale}>
      {/* Main crate body - Rounded rectangular prism (golden ratio) */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.3, 0.8, 0.8]} />
        <primitive object={crateMaterial} attach="material" />
      </mesh>

      {/* Rounded corner edges - Front-left vertical */}
      <mesh position={[-0.65, 0, 0.4]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
        <primitive object={edgeMaterial} attach="material" />
      </mesh>

      {/* Rounded corner edges - Front-right vertical */}
      <mesh position={[0.65, 0, 0.4]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
        <primitive object={edgeMaterial} attach="material" />
      </mesh>

      {/* Rounded corner edges - Back-left vertical */}
      <mesh position={[-0.65, 0, -0.4]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
        <primitive object={edgeMaterial} attach="material" />
      </mesh>

      {/* Rounded corner edges - Back-right vertical */}
      <mesh position={[0.65, 0, -0.4]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
        <primitive object={edgeMaterial} attach="material" />
      </mesh>

      {/* Docker logo on front face (simplified whale shape) */}
      {showLogo && (
        <group position={[0, 0, 0.41]}>
          {/* Logo background plane */}
          <mesh castShadow>
            <planeGeometry args={[0.65, 0.48]} />
            <meshStandardMaterial color="#0995ba" roughness={0.5} metalness={0.1} />
          </mesh>

          {/* Simplified Docker whale - body */}
          <mesh position={[0, -0.05, 0.01]}>
            <boxGeometry args={[0.4, 0.15, 0.01]} />
            <primitive object={logoMaterial} attach="material" />
          </mesh>

          {/* Docker whale - head */}
          <mesh position={[0.15, 0.0, 0.01]}>
            <boxGeometry args={[0.15, 0.12, 0.01]} />
            <primitive object={logoMaterial} attach="material" />
          </mesh>

          {/* Docker whale - containers on back (3 small boxes) */}
          <mesh position={[-0.15, 0.08, 0.01]}>
            <boxGeometry args={[0.08, 0.08, 0.01]} />
            <primitive object={logoMaterial} attach="material" />
          </mesh>
          <mesh position={[-0.05, 0.08, 0.01]}>
            <boxGeometry args={[0.08, 0.08, 0.01]} />
            <primitive object={logoMaterial} attach="material" />
          </mesh>
          <mesh position={[0.05, 0.08, 0.01]}>
            <boxGeometry args={[0.08, 0.08, 0.01]} />
            <primitive object={logoMaterial} attach="material" />
          </mesh>

          {/* Wave underneath */}
          <mesh position={[0, -0.18, 0.01]}>
            <planeGeometry args={[0.5, 0.05]} />
            <primitive object={logoMaterial} attach="material" />
          </mesh>
        </group>
      )}

      {/* Panel lines (subtle recessed lines) */}
      <lineSegments position={[0, 0, 0.41]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(0.7, 0.5)]} />
        <lineBasicMaterial color="#0995ba" opacity={0.3} transparent />
      </lineSegments>

      {/* Optional glow effect */}
      {enableGlow && glowMaterial && (
        <mesh scale={[1.05, 1.05, 1.05]}>
          <boxGeometry args={[1.3, 0.8, 0.8]} />
          <primitive object={glowMaterial} attach="material" />
        </mesh>
      )}

      {/* Edge highlight wireframe */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(1.3, 0.8, 0.8)]} />
        <lineBasicMaterial color="#4dc9f0" opacity={0.4} transparent />
      </lineSegments>
    </group>
  );
};
