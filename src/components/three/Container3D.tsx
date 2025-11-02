'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import type { ContainerState } from '@/lib/container-colors';
import { CONTAINER_COLORS, getBuildingPulseOpacity } from '@/lib/container-colors';
import { ImageCrateModel } from './ImageCrate/ImageCrateModel';

interface Container3DProps {
  state?: ContainerState;
}

export function Container3D({ state = 'ready' }: Container3DProps) {
  const containerRef = useRef<THREE.Group>(null);
  const wireframeRef = useRef<THREE.LineSegments>(null);
  const glowMeshRef = useRef<THREE.Mesh>(null);

  const [crateState, setCrateState] = useState<'idle' | 'entering' | 'docking' | 'settled' | 'floating'>(
    state === 'building' ? 'entering' : 'floating'
  );

  const [usesDottedMaterial, setUsesDottedMaterial] = useState(state === 'building');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionStart, setTransitionStart] = useState<number | null>(null);
  const [hasTransitioned, setHasTransitioned] = useState(false);

  // Create opaque dark blue-grey wall material (using MeshBasicMaterial so it doesn't need lights)
  const wallMaterial = useMemo(() =>
    new THREE.MeshBasicMaterial({
      color: CONTAINER_COLORS.WALL_SURFACE,
      side: THREE.DoubleSide,
    }), []
  );

  // Create bright solid wireframe material (using brighter color for visibility)
  const solidWireframeMaterial = useMemo(() =>
    new THREE.LineBasicMaterial({
      color: 0x90CAF9, // Much brighter blue for visibility
      linewidth: 3,
      transparent: false,
      opacity: 1.0,
      depthTest: false,
      depthWrite: false,
    }), []
  );

  // Create dotted wireframe material
  const dottedWireframeMaterial = useMemo(() =>
    new THREE.LineDashedMaterial({
      color: 0x90CAF9, // Same bright blue
      linewidth: 2,
      scale: 1,
      dashSize: 0.3,
      gapSize: 0.2,
      transparent: true,
      opacity: 0.7,
      depthTest: false,
      depthWrite: false,
    }), []
  );

  // Current wireframe material
  const currentWireframeMaterial = usesDottedMaterial ? dottedWireframeMaterial : solidWireframeMaterial;

  // Building state glow material
  const glowMaterial = useMemo(() => {
    if (state !== 'building') return null;
    return new THREE.MeshBasicMaterial({
      color: CONTAINER_COLORS.BUILDING,
      transparent: true,
      opacity: 0.6,
      side: THREE.BackSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [state]);

  // Compute line distances for dashed material
  useEffect(() => {
    if (wireframeRef.current && usesDottedMaterial) {
      const geom = wireframeRef.current.geometry;
      if (geom instanceof THREE.BufferGeometry && 'computeLineDistances' in geom) {
        (geom as any).computeLineDistances();
      }
    }
  }, [usesDottedMaterial]);

  // Reset state when switching to building
  useEffect(() => {
    if (state === 'building') {
      setHasTransitioned(false);
      setIsTransitioning(false);
      setUsesDottedMaterial(true);
      setCrateState('entering');
      dottedWireframeMaterial.opacity = 0.7;
      solidWireframeMaterial.opacity = 1.0;
      solidWireframeMaterial.transparent = false;
    } else {
      setUsesDottedMaterial(false);
      setCrateState('floating');
    }
  }, [state, dottedWireframeMaterial, solidWireframeMaterial]);

  // Animation loop
  useFrame((frameState) => {
    const elapsed = frameState.clock.elapsedTime;

    // Building state animations
    if (state === 'building') {
      // Rotation
      if (containerRef.current) {
        containerRef.current.rotation.y = elapsed * 0.2;
      }

      // Pulsing glow
      if (glowMeshRef.current && glowMeshRef.current.material instanceof THREE.MeshBasicMaterial) {
        glowMeshRef.current.material.opacity = getBuildingPulseOpacity(elapsed);
      }

      // Marching ants
      if (wireframeRef.current && usesDottedMaterial) {
        const material = wireframeRef.current.material as THREE.LineDashedMaterial;
        if ('dashOffset' in material) {
          (material as any).dashOffset = -elapsed * 0.5;
        }
      }
    } else {
      if (containerRef.current) {
        containerRef.current.rotation.y = 0;
      }
    }

    // Handle wireframe transition
    if (isTransitioning && transitionStart !== null) {
      const elapsed = (Date.now() - transitionStart) / 1000;
      const progress = Math.min(elapsed / 1.0, 1.0);

      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      dottedWireframeMaterial.opacity = 0.7 * (1 - eased);
      solidWireframeMaterial.opacity = eased;
      solidWireframeMaterial.transparent = progress < 1.0;

      dottedWireframeMaterial.needsUpdate = true;
      solidWireframeMaterial.needsUpdate = true;

      if (progress >= 0.5 && usesDottedMaterial) {
        setUsesDottedMaterial(false);
      }

      if (progress >= 1.0) {
        setIsTransitioning(false);
        solidWireframeMaterial.opacity = 1.0;
        solidWireframeMaterial.transparent = false;
        solidWireframeMaterial.needsUpdate = true;
      }
    }
  });

  return (
    <group ref={containerRef}>
      {/* Container box (single mesh with DoubleSide) */}
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[6, 5, 8]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>

      {/* Wireframe edges */}
      <lineSegments
        ref={wireframeRef}
        position={[0, 2.5, 0]}
        renderOrder={999}
      >
        <edgesGeometry args={[new THREE.BoxGeometry(6, 5, 8)]} />
        <primitive object={currentWireframeMaterial} attach="material" />
      </lineSegments>

      {/* Building state glow */}
      {state === 'building' && glowMaterial && (
        <mesh ref={glowMeshRef} position={[0, 2.5, 0]} scale={[1.02, 1.02, 1.02]}>
          <boxGeometry args={[6, 5, 8]} />
          <primitive object={glowMaterial} attach="material" />
        </mesh>
      )}

      {/* Image crate - only visible in building state */}
      {state === 'building' && (
        <ImageCrateModel
          state={crateState}
          showLogo={true}
          scale={1.5}
          imageName="nginx:latest"
          showLoadingText={true}
          onAnimationComplete={(newState) => {
            // Handle animation state transitions
            if (newState === 'docking') {
              // After entering completes, start docking
              setCrateState('docking');
            } else if (newState === 'settled' && usesDottedMaterial && !hasTransitioned) {
              // After docking completes and settles, transition wireframe
              setIsTransitioning(true);
              setTransitionStart(Date.now());
              setHasTransitioned(true);
              setCrateState('floating');
            }
          }}
        />
      )}

      {/* Building text */}
      {state === 'building' && (
        <Html position={[0, 7, 0]} center distanceFactor={10}>
          <div style={{
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
          }}>
            Building container...
          </div>
        </Html>
      )}

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} metalness={0.2} />
      </mesh>
    </group>
  );
}
