/**
 * Container Visualization Color Palette
 *
 * Defines all colors used in the 3D container visualization.
 * Colors are specified in Three.js hexadecimal format (0xRRGGBB).
 *
 * @see /docs/design-system/CONTAINER_VISUAL_STYLE_GUIDE.md
 */

export const CONTAINER_COLORS = {
  // State colors
  BUILDING: 0x2196F3,           // Electric blue (primary)
  BUILDING_PULSE: 0x64B5F6,     // Light electric blue (pulse peak)
  READY: 0x90CAF9,              // Soft blue (idle state)
  RUNNING: 0x4CAF50,            // Success green (active)
  RUNNING_ACCENT: 0x66BB6A,     // Light green (highlights)
  ERROR: 0xF44336,              // Alert red (failed state)

  // Structural colors
  WIREFRAME_PRIMARY: 0x37474F,  // Blue-grey 800 (main edges)
  WIREFRAME_DOTTED: 0x546E7A,   // Blue-grey 600 (inactive lines)
  WALL_SURFACE: 0x263238,       // Blue-grey 900 (opaque walls)
  WALL_HIGHLIGHT: 0x455A64,     // Blue-grey 700 (wall highlights)

  // Background
  BACKGROUND: 0x121212,         // Near black
  BACKGROUND_GRADIENT: 0x1A1A1A, // Dark grey (falloff)

  // Image crate (original amber)
  CRATE_BASE: 0xFFA726,         // Amber 400 (main color)
  CRATE_GLOW: 0xFFB74D,         // Amber 300 (pulsing glow)
  CRATE_ICON: 0xFFFFFF,         // White (Docker logo)

  // Docker image crate (Docker blue - from ILI-89 design spec)
  DOCKER_BLUE: 0x0db7ed,        // Docker blue (primary)
  DOCKER_BLUE_LIGHT: 0x4dc9f0,  // Docker blue light (gradient top)
  DOCKER_BLUE_DARK: 0x0995ba,   // Docker blue dark (logo/accents)
  DOCKER_NAVY: 0x066da5,        // Docker navy (deep accent)

  // UI accents
  LABEL_TEXT: 0xE0E0E0,         // Light grey (labels)
  MEASUREMENT_LINES: 0x616161,  // Grey 700 (dimensions)
  GRID: 0x424242,               // Grey 800 (ground plane)
} as const;

/**
 * Container state types
 */
export type ContainerState = 'building' | 'ready' | 'running' | 'error';

/**
 * Get the primary color for a given container state
 *
 * @param state - The container state
 * @returns Three.js hex color code
 */
export function getStateColor(state: ContainerState): number {
  switch (state) {
    case 'building':
      return CONTAINER_COLORS.BUILDING;
    case 'ready':
      return CONTAINER_COLORS.READY;
    case 'running':
      return CONTAINER_COLORS.RUNNING;
    case 'error':
      return CONTAINER_COLORS.ERROR;
  }
}

/**
 * Get the accent color for a given container state
 * Used for highlights and secondary elements
 *
 * @param state - The container state
 * @returns Three.js hex color code
 */
export function getStateAccentColor(state: ContainerState): number {
  switch (state) {
    case 'building':
      return CONTAINER_COLORS.BUILDING_PULSE;
    case 'ready':
      return CONTAINER_COLORS.READY;
    case 'running':
      return CONTAINER_COLORS.RUNNING_ACCENT;
    case 'error':
      return CONTAINER_COLORS.ERROR;
  }
}

/**
 * Convert Three.js hex color to CSS hex string
 *
 * @param color - Three.js hex color (e.g., 0x2196F3)
 * @returns CSS hex string (e.g., "#2196F3")
 */
export function toHexString(color: number): string {
  return `#${color.toString(16).padStart(6, '0').toUpperCase()}`;
}

/**
 * Convert Three.js hex color to RGB values
 *
 * @param color - Three.js hex color
 * @returns RGB object with r, g, b values (0-255)
 */
export function toRGB(color: number): { r: number; g: number; b: number } {
  return {
    r: (color >> 16) & 255,
    g: (color >> 8) & 255,
    b: color & 255,
  };
}

/**
 * Get opacity value for building state animation
 *
 * @param time - Elapsed time in seconds
 * @returns Opacity value (0.3 to 0.8)
 */
export function getBuildingPulseOpacity(time: number): number {
  return 0.55 + Math.sin(time * 2.0) * 0.25;
}

/**
 * Get light intensity for building state animation
 *
 * @param time - Elapsed time in seconds
 * @returns Light intensity (0.5 to 1.0)
 */
export function getBuildingPulseLightIntensity(time: number): number {
  return getBuildingPulseOpacity(time) + 0.2;
}
