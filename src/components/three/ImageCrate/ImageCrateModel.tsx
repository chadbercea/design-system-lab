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

import React, { useMemo, useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useImageCrateAnimation } from './useImageCrateAnimation';
import type { ImageCrateProps } from './types';

export const ImageCrateModel: React.FC<ImageCrateProps> = ({
  state = 'idle',
  onAnimationComplete,
  scale = 1,
  showLogo = true,
  color = '#808080', // Gray
  enableGlow = false,
  imageName = 'nginx:latest',
  showLoadingText = false,
}) => {
  const groupRef = useImageCrateAnimation(state, onAnimationComplete);
  const wireframeRef = useRef<THREE.LineSegments>(null);
  const [logoTexture, setLogoTexture] = useState<THREE.Texture | null>(null);

  // Show loading text during entering and docking states
  const shouldShowText = showLoadingText && (state === 'entering' || state === 'docking');

  // Load Docker logo texture from SVG via canvas
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, 512, 512);
        // Draw the image centered
        const size = 400;
        const offset = (512 - size) / 2;
        ctx.drawImage(img, offset, offset, size, size);

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        setLogoTexture(texture);
      }
    };
    img.src = '/docker-logo.svg';
  }, []);

  // Create main crate material - Gray
  const crateMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: 0x808080, // Gray - always visible
    });
  }, []);

  // Create logo material using the loaded texture
  const logoMaterial = useMemo(() => {
    if (!logoTexture) {
      return new THREE.MeshBasicMaterial({
        color: '#404040',
      });
    }
    return new THREE.MeshBasicMaterial({
      map: logoTexture,
      transparent: true,
    });
  }, [logoTexture]);

  // Create edge material for rounded corners - Dark gray
  const edgeMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: 0x404040,
    });
  }, []);

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

  // White solid wireframe material for crate
  const wireframeMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: 0xFFFFFF,
      linewidth: 3,
      transparent: false,
      opacity: 1.0,
      depthTest: false,
      depthWrite: false,
    });
  }, []);

  return (
    <group ref={groupRef} scale={scale}>
      {/* Main crate body - Rounded rectangular prism (50% of container interior) */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.0, 2.5, 4.0]} />
        <primitive object={crateMaterial} attach="material" />
      </mesh>

      {/* Rounded corner edges - Front-left vertical */}
      <mesh position={[-1.5, 0, 2.0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 2.5, 8]} />
        <primitive object={edgeMaterial} attach="material" />
      </mesh>

      {/* Rounded corner edges - Front-right vertical */}
      <mesh position={[1.5, 0, 2.0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 2.5, 8]} />
        <primitive object={edgeMaterial} attach="material" />
      </mesh>

      {/* Rounded corner edges - Back-left vertical */}
      <mesh position={[-1.5, 0, -2.0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 2.5, 8]} />
        <primitive object={edgeMaterial} attach="material" />
      </mesh>

      {/* Rounded corner edges - Back-right vertical */}
      <mesh position={[1.5, 0, -2.0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 2.5, 8]} />
        <primitive object={edgeMaterial} attach="material" />
      </mesh>

      {/* Docker logo on front face */}
      {showLogo && logoTexture && (
        <mesh position={[0, 0, 2.01]}>
          <planeGeometry args={[2.0, 2.0]} />
          <primitive object={logoMaterial} attach="material" />
        </mesh>
      )}

      {/* Panel lines (subtle recessed lines) */}
      <lineSegments position={[0, 0, 0.41]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(0.7, 0.5)]} />
        <lineBasicMaterial color="#808080" opacity={0.3} transparent />
      </lineSegments>

      {/* Optional glow effect */}
      {enableGlow && glowMaterial && (
        <mesh scale={[1.05, 1.05, 1.05]}>
          <boxGeometry args={[1.3, 0.8, 0.8]} />
          <primitive object={glowMaterial} attach="material" />
        </mesh>
      )}

      {/* Edge highlight wireframe - WHITE DASHED */}
      <lineSegments ref={wireframeRef}>
        <edgesGeometry args={[new THREE.BoxGeometry(3.0, 2.5, 4.0)]} />
        <primitive object={wireframeMaterial} attach="material" />
      </lineSegments>

      {/* Loading text overlay */}
      {shouldShowText && (
        <Html
          position={[0, 1.2, 0]}
          center
          distanceFactor={8}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              padding: '14px 28px',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              fontFamily: '"Fira Code", "Courier New", monospace',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            }}
          >
            Loading image: {imageName}
          </div>
        </Html>
      )}
    </group>
  );
};
