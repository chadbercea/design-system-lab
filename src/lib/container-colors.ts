/**
 * Container Visualization Color Palette
 *
 * Defines all colors used in the 3D container visualization.
 * Colors are specified in Three.js hexadecimal format (0xRRGGBB).
 *
 * @see /docs/design-system/CONTAINER_VISUAL_STYLE_GUIDE.md
 */

export const CONTAINER_COLORS = {
  // State colors - Monochrome black/white only
  IDLE: 0xFFFFFF,               // White wireframe
  BUILDING_START: 0xFFFFFF,     // White (no color)
  BUILDING_END: 0xFFFFFF,       // White (no color)
  RUNNING: 0x000000,            // Black solid (running state)
  ERROR: 0xFFFFFF,              // White (error state - no red)
  STOPPED: 0x808080,            // Gray (stopped state)

  // Legacy state colors (converted to grayscale)
  BUILDING: 0xFFFFFF,           // White (building)
  BUILDING_PULSE: 0xFFFFFF,     // White (no pulse color)
  READY: 0xFFFFFF,              // White (idle state)
  RUNNING_ACCENT: 0xFFFFFF,     // White (no green)

  // Structural colors - black and white only
  WIREFRAME_PRIMARY: 0xFFFFFF,  // White (main edges)
  WIREFRAME_DOTTED: 0x808080,   // Gray (inactive lines)
  WALL_SURFACE: 0xFFFFFF,       // White (opaque walls)
  WALL_HIGHLIGHT: 0xFFFFFF,     // White (wall highlights)

  // Background
  BACKGROUND: 0x000000,         // Pure black
  BACKGROUND_GRADIENT: 0x000000, // Pure black

  // Image crate - grayscale
  CRATE_BASE: 0x808080,         // Gray (main color)
  CRATE_GLOW: 0xC0C0C0,         // Light gray (glow)
  CRATE_ICON: 0xFFFFFF,         // White (Docker logo)

  // Docker image crate - grayscale
  DOCKER_BLUE: 0x808080,        // Gray
  DOCKER_BLUE_LIGHT: 0xC0C0C0,  // Light gray
  DOCKER_BLUE_DARK: 0x606060,   // Dark gray
  DOCKER_NAVY: 0x404040,        // Darker gray

  // UI accents - black and white
  LABEL_TEXT: 0xFFFFFF,         // White (labels)
  MEASUREMENT_LINES: 0x808080,  // Gray (dimensions)
  GRID: 0x404040,               // Dark gray (ground plane)
} as const;

/**
 * Container state types - Updated for ILI-144
 *
 * idle: Wireframe appearance, white lines, slow float, doors open
 * building: Blue wireframe → solid, doors closing, terminal text
 * running: Dark blue solid, auto-orbit, terminal text visible
 * error: Doors spring open, red wireframe, pulsing glow
 * stopped: Semi-transparent 50%, gray, no movement
 */
export type ContainerState = 'idle' | 'building' | 'running' | 'error' | 'stopped' | 'ready';

/**
 * Get the primary color for a given container state
 *
 * @param state - The container state
 * @returns Three.js hex color code
 */
export function getStateColor(state: ContainerState): number {
  switch (state) {
    case 'idle':
      return CONTAINER_COLORS.IDLE;
    case 'building':
      return CONTAINER_COLORS.BUILDING_START;
    case 'running':
      return CONTAINER_COLORS.RUNNING;
    case 'error':
      return CONTAINER_COLORS.ERROR;
    case 'stopped':
      return CONTAINER_COLORS.STOPPED;
    case 'ready':
      return CONTAINER_COLORS.READY;
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
    case 'idle':
      return CONTAINER_COLORS.IDLE;
    case 'building':
      return CONTAINER_COLORS.BUILDING_PULSE;
    case 'running':
      return CONTAINER_COLORS.RUNNING_ACCENT;
    case 'error':
      return CONTAINER_COLORS.ERROR;
    case 'stopped':
      return CONTAINER_COLORS.STOPPED;
    case 'ready':
      return CONTAINER_COLORS.READY;
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
