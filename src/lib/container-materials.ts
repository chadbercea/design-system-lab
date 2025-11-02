/**
 * Container Visualization Material Factory
 *
 * Factory functions for creating Three.js materials used in the container visualization.
 * All materials follow the specifications in the visual style guide.
 *
 * @see /docs/design-system/CONTAINER_VISUAL_STYLE_GUIDE.md
 */

import * as THREE from 'three';
import { CONTAINER_COLORS, type ContainerState, getStateColor } from './container-colors';

/**
 * Material configuration options
 */
export interface MaterialConfig {
  transparent?: boolean;
  opacity?: number;
  side?: THREE.Side;
}

/**
 * Create material for container walls (opaque, industrial metal)
 *
 * Properties:
 * - Metalness: 0.7 (70% metallic - industrial steel)
 * - Roughness: 0.4 (40% rough - matte industrial finish)
 * - Color: Dark blue-grey (#263238)
 *
 * @param config - Optional material configuration overrides
 * @returns MeshStandardMaterial configured for container walls
 */
export function createContainerWallMaterial(
  config?: MaterialConfig
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: CONTAINER_COLORS.WALL_SURFACE,
    metalness: 0.7,
    roughness: 0.4,
    transparent: config?.transparent ?? false,
    opacity: config?.opacity ?? 1.0,
    side: config?.side ?? THREE.DoubleSide,
    flatShading: false,
    envMapIntensity: 1.0,
  });
}

/**
 * Create material for solid wireframe edges
 *
 * Properties:
 * - Color: Blue-grey (#37474F)
 * - Linewidth: 2 (note: requires Line2 for thick lines)
 *
 * @returns LineBasicMaterial configured for solid wireframe
 */
export function createWireframeMaterial(): THREE.LineBasicMaterial {
  return new THREE.LineBasicMaterial({
    color: CONTAINER_COLORS.WALL_HIGHLIGHT, // Using brighter color for visibility on dark walls
    linewidth: 2,
    transparent: false,
    opacity: 1.0,
    fog: false,
    depthWrite: false,
    depthTest: false,
  });
}

/**
 * Create material for dotted/dashed wireframe (inactive/ghost lines)
 *
 * Properties:
 * - Color: Light blue-grey (#546E7A)
 * - Dash size: 0.3 units
 * - Gap size: 0.2 units
 * - Opacity: 0.5 (50% transparent)
 *
 * Note: Must call geometry.computeLineDistances() before rendering
 *
 * @returns LineDashedMaterial configured for dotted wireframe
 */
export function createDottedWireframeMaterial(): THREE.LineDashedMaterial {
  return new THREE.LineDashedMaterial({
    color: CONTAINER_COLORS.WALL_HIGHLIGHT, // Using brighter color for visibility on dark walls
    linewidth: 1,
    scale: 1,
    dashSize: 0.3,
    gapSize: 0.2,
    transparent: true,
    opacity: 0.7, // Increased from 0.5 for better visibility
    fog: false,
    depthWrite: false,
    depthTest: false,
  });
}

/**
 * Create material for edge glow effect (state-dependent)
 *
 * Properties:
 * - Color: Varies by state (building=blue, running=green)
 * - Blending: Additive (creates glow effect)
 * - Opacity: 0.6 default (animated for building state)
 *
 * @param state - Container state determining glow color
 * @param opacity - Optional opacity override (0.0-1.0)
 * @returns MeshBasicMaterial configured for glowing edges
 */
export function createGlowMaterial(
  state: 'building' | 'running' | 'error',
  opacity = 0.6
): THREE.MeshBasicMaterial {
  let color: number;
  switch (state) {
    case 'building':
      color = CONTAINER_COLORS.BUILDING;
      break;
    case 'running':
      color = CONTAINER_COLORS.RUNNING;
      opacity = 0.7; // Running state uses higher base opacity
      break;
    case 'error':
      color = CONTAINER_COLORS.ERROR;
      opacity = 0.8;
      break;
  }

  return new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    side: THREE.FrontSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

/**
 * Create material for image crate (cargo box containing Docker image)
 *
 * Properties:
 * - Color: Amber (#FFA726)
 * - Metalness: 0.3 (30% - painted surface)
 * - Roughness: 0.6 (60% - matte finish)
 * - Emissive: Amber glow (#FFB74D)
 * - Emissive intensity: 0.2 (20% - subtle inner glow)
 *
 * @returns MeshStandardMaterial configured for image crate
 */
export function createImageCrateMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: CONTAINER_COLORS.CRATE_BASE,
    metalness: 0.3,
    roughness: 0.6,
    transparent: false,
    opacity: 1.0,
    emissive: CONTAINER_COLORS.CRATE_GLOW,
    emissiveIntensity: 0.2,
    side: THREE.FrontSide,
  });
}

/**
 * Create material for Docker-branded image crate (new design from ILI-89)
 *
 * Properties:
 * - Color: Docker blue (#0db7ed)
 * - Metalness: 0.1 (10% - low metalness for painted surface)
 * - Roughness: 0.4 (40% - matte finish as specified)
 * - Gradient effect from Docker blue to lighter shade
 *
 * @see /docs/IMAGE_CRATE_DESIGN_SPEC.md - Section 3 (Final Specifications)
 * @returns MeshStandardMaterial configured for Docker image crate
 */
export function createDockerImageCrateMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: CONTAINER_COLORS.DOCKER_BLUE,
    metalness: 0.1,
    roughness: 0.4,
    transparent: false,
    opacity: 1.0,
    side: THREE.FrontSide,
    flatShading: false,
  });
}

/**
 * Create material for Docker logo/icon on crate
 *
 * Properties:
 * - Color: White (#FFFFFF)
 * - Unlit (MeshBasicMaterial)
 * - Supports texture mapping for logo
 *
 * @param texture - Optional texture for logo (e.g., Docker whale)
 * @returns MeshBasicMaterial configured for icon/logo
 */
export function createCrateIconMaterial(
  texture?: THREE.Texture
): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({
    color: CONTAINER_COLORS.CRATE_ICON,
    transparent: texture ? true : false,
    opacity: 1.0,
    map: texture ?? null,
    side: THREE.FrontSide,
  });
}

/**
 * Create material for UI labels and text
 *
 * Properties:
 * - Color: Light grey (#E0E0E0)
 * - Unlit (always visible)
 *
 * @returns MeshBasicMaterial configured for text/labels
 */
export function createLabelMaterial(): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({
    color: CONTAINER_COLORS.LABEL_TEXT,
    transparent: false,
    opacity: 1.0,
    side: THREE.DoubleSide,
  });
}

/**
 * Create material for measurement/dimension lines
 *
 * Properties:
 * - Color: Grey (#616161)
 * - Thin lines (linewidth: 1)
 *
 * @returns LineBasicMaterial configured for measurement lines
 */
export function createMeasurementLineMaterial(): THREE.LineBasicMaterial {
  return new THREE.LineBasicMaterial({
    color: CONTAINER_COLORS.MEASUREMENT_LINES,
    linewidth: 1,
    transparent: true,
    opacity: 0.7,
  });
}

/**
 * Create material for ground plane grid (optional)
 *
 * Properties:
 * - Color: Dark grey (#424242)
 * - Semi-transparent
 *
 * @returns LineBasicMaterial configured for grid
 */
export function createGridMaterial(): THREE.LineBasicMaterial {
  return new THREE.LineBasicMaterial({
    color: CONTAINER_COLORS.GRID,
    transparent: true,
    opacity: 0.3,
  });
}

/**
 * Material preset collection for easy access
 */
export const MaterialPresets = {
  /**
   * Get all materials needed for a container in a specific state
   */
  forContainer: (state: ContainerState) => ({
    wall: createContainerWallMaterial(),
    wireframe: createWireframeMaterial(),
    glow:
      state === 'building' || state === 'running' || state === 'error'
        ? createGlowMaterial(state)
        : null,
  }),

  /**
   * Get all materials needed for an image crate
   */
  forImageCrate: () => ({
    crate: createImageCrateMaterial(),
    icon: createCrateIconMaterial(),
  }),

  /**
   * Get all UI/helper materials
   */
  forUI: () => ({
    label: createLabelMaterial(),
    measurement: createMeasurementLineMaterial(),
    grid: createGridMaterial(),
  }),
} as const;

/**
 * Dispose of a material and clean up resources
 *
 * @param material - Material to dispose
 */
export function disposeMaterial(material: THREE.Material): void {
  if ('map' in material && material.map && typeof material.map === 'object' && 'dispose' in material.map && typeof material.map.dispose === 'function') {
    (material.map.dispose as () => void)();
  }
  material.dispose();
}

/**
 * Update glow material opacity for animation
 * Used in render loop for pulsing effects
 *
 * @param material - Glow material to update
 * @param opacity - New opacity value (0.0-1.0)
 */
export function updateGlowOpacity(
  material: THREE.MeshBasicMaterial,
  opacity: number
): void {
  material.opacity = Math.max(0, Math.min(1, opacity));
  material.needsUpdate = true;
}

/**
 * Clone a material with optional property overrides
 *
 * @param material - Material to clone
 * @param overrides - Property overrides
 * @returns Cloned material with overrides applied
 */
export function cloneMaterial<T extends THREE.Material>(
  material: T,
  overrides?: Partial<T>
): T {
  const cloned = material.clone() as T;
  if (overrides) {
    Object.assign(cloned, overrides);
  }
  return cloned;
}
