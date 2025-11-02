'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { createContainerWallMaterial, createWireframeMaterial } from '@/lib/container-materials';

/**
 * Shipping container proportions (roughly 1:1:2.5 ratio)
 * Standard shipping container: 2.4m x 2.4m x 6m
 * Scaled for good visualization
 */
const CONTAINER_DIMENSIONS = {
  width: 2.4,
  height: 2.4,
  depth: 6.0,
} as const;

export interface ContainerProps {
  /**
   * Position of the container in 3D space
   */
  position?: [number, number, number];
  /**
   * Rotation of the container in radians
   */
  rotation?: [number, number, number];
  /**
   * Whether to show the wireframe edges
   */
  showEdges?: boolean;
}

/**
 * Static 3D shipping container with visible edges
 *
 * Features:
 * - BoxGeometry for container body (2.4m x 2.4m x 6m proportions)
 * - EdgesGeometry for wireframe edges
 * - LineBasicMaterial for solid edges
 * - Industrial metal material for walls
 *
 * @see /docs/design-system/CONTAINER_VISUAL_STYLE_GUIDE.md
 */
export function Container({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  showEdges = true,
}: ContainerProps) {
  // Create container geometry (box for walls)
  const boxGeometry = useMemo(() => {
    return new THREE.BoxGeometry(
      CONTAINER_DIMENSIONS.width,
      CONTAINER_DIMENSIONS.height,
      CONTAINER_DIMENSIONS.depth
    );
  }, []);

  // Create edges geometry from box
  const edgesGeometry = useMemo(() => {
    return new THREE.EdgesGeometry(boxGeometry);
  }, [boxGeometry]);

  // Create materials
  const wallMaterial = useMemo(() => {
    return createContainerWallMaterial();
  }, []);

  const edgeMaterial = useMemo(() => {
    return createWireframeMaterial();
  }, []);

  return (
    <group position={position} rotation={rotation}>
      {/* Container walls */}
      <mesh geometry={boxGeometry} material={wallMaterial}>
        {/* Mesh renders the solid container walls */}
      </mesh>

      {/* Container edges */}
      {showEdges && (
        <lineSegments geometry={edgesGeometry} material={edgeMaterial}>
          {/* LineSegments renders the wireframe edges */}
        </lineSegments>
      )}
    </group>
  );
}

/**
 * Get the dimensions of the container for camera positioning
 */
export function getContainerDimensions() {
  return CONTAINER_DIMENSIONS;
}
