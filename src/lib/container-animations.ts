/**
 * Container Animation Utilities
 *
 * Helper functions for animating container state transitions and behaviors.
 * Supports all 5 container states: idle, building, running, error, stopped.
 *
 * @see ILI-144 for specifications
 */

/**
 * Animation timing constants (in milliseconds)
 */
export const ANIMATION_TIMING = {
  STATE_TRANSITION: 500,      // State change transition duration
  DOOR_OPEN_CLOSE: 2500,      // Door animation duration (2-3 seconds)
  BUILDING_MIN: 15000,        // Minimum building time (15s)
  BUILDING_MAX: 30000,        // Maximum building time (30s)
  TERMINAL_CHAR_DELAY: 50,    // Character-by-character delay (50ms)
  ERROR_PULSE: 1000,          // Error pulsing cycle (1 second)
} as const;

/**
 * Running state rotation speed (RPM to radians per second)
 * 5-8 RPM = slow, continuous auto-orbit
 */
export const RUNNING_ROTATION_SPEED = {
  MIN: (5 * 2 * Math.PI) / 60,  // 5 RPM
  MAX: (8 * 2 * Math.PI) / 60,  // 8 RPM
  DEFAULT: (6 * 2 * Math.PI) / 60,  // 6 RPM
} as const;

/**
 * Easing functions for smooth animations
 */
export const EASING = {
  // Smooth ease-in-out for state transitions
  easeInOut: (t: number): number => {
    return t < 0.5
      ? 2 * t * t
      : -1 + (4 - 2 * t) * t;
  },

  // Ease out for door movements
  easeOut: (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  },

  // Bounce for error state door spring
  easeBounce: (t: number): number => {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },
} as const;

/**
 * Calculate door rotation angle based on state
 *
 * @param state - Container state
 * @param progress - Animation progress (0-1)
 * @returns Door rotation angle in radians
 */
export function getDoorRotation(
  state: 'idle' | 'building' | 'running' | 'error' | 'stopped',
  progress: number = 1
): number {
  const DOOR_OPEN_ANGLE = Math.PI * 0.5; // 90 degrees
  const DOOR_CLOSED_ANGLE = 0;

  switch (state) {
    case 'idle':
    case 'error':
      // Doors open
      return DOOR_OPEN_ANGLE * EASING.easeOut(progress);

    case 'building':
      // Doors closing (reverse progress)
      return DOOR_OPEN_ANGLE * (1 - EASING.easeOut(progress));

    case 'running':
    case 'stopped':
      // Doors closed
      return DOOR_CLOSED_ANGLE;
  }
}

/**
 * Calculate container opacity based on state
 *
 * @param state - Container state
 * @param progress - Animation progress (0-1)
 * @returns Opacity value (0-1)
 */
export function getContainerOpacity(
  state: 'idle' | 'building' | 'running' | 'error' | 'stopped',
  progress: number = 1
): number {
  switch (state) {
    case 'idle':
      return 0.3; // 30% opacity wireframe

    case 'building':
      // Transition from 30% to 100% over building time
      return 0.3 + (0.7 * progress);

    case 'running':
    case 'error':
      return 1.0; // Full opacity

    case 'stopped':
      return 0.5; // 50% opacity
  }
}

/**
 * Calculate error state pulsing opacity
 *
 * @param time - Elapsed time in seconds
 * @returns Pulsing opacity value
 */
export function getErrorPulseOpacity(time: number): number {
  // Pulse between 0.7 and 1.0
  return 0.85 + Math.sin(time * Math.PI * 2) * 0.15;
}

/**
 * Get terminal text lines for building state
 *
 * @returns Array of terminal text lines
 */
export function getTerminalTextLines(): string[] {
  return [
    'Pulling image...',
    'Layer 1/5 complete',
    'Layer 2/5 complete',
    'Layer 3/5 complete',
    'Layer 4/5 complete',
    'Layer 5/5 complete',
    'Starting container...',
    'Container ready',
  ];
}

/**
 * Calculate visible characters for terminal text animation
 *
 * @param elapsedTime - Time since animation started (ms)
 * @param totalChars - Total number of characters
 * @returns Number of visible characters
 */
export function getVisibleCharCount(
  elapsedTime: number,
  totalChars: number
): number {
  const charsPerMs = 1 / ANIMATION_TIMING.TERMINAL_CHAR_DELAY;
  const visibleChars = Math.floor(elapsedTime * charsPerMs);
  return Math.min(visibleChars, totalChars);
}

/**
 * Calculate rotation for running state auto-orbit
 *
 * @param deltaTime - Time since last frame (seconds)
 * @param currentRotation - Current Y rotation (radians)
 * @returns New Y rotation (radians)
 */
export function getRunningRotation(
  deltaTime: number,
  currentRotation: number
): number {
  return currentRotation + (RUNNING_ROTATION_SPEED.DEFAULT * deltaTime);
}

/**
 * Calculate idle state gentle float offset
 *
 * @param time - Elapsed time in seconds
 * @returns Vertical offset in world units
 */
export function getIdleFloatOffset(time: number): number {
  // Slow sine wave for gentle floating
  return Math.sin(time * 0.5) * 0.1; // ±0.1 units
}

/**
 * Interpolate between two values with easing
 *
 * @param from - Start value
 * @param to - End value
 * @param progress - Progress (0-1)
 * @param easingFn - Easing function to use
 * @returns Interpolated value
 */
export function lerp(
  from: number,
  to: number,
  progress: number,
  easingFn: (t: number) => number = EASING.easeInOut
): number {
  const t = easingFn(Math.max(0, Math.min(1, progress)));
  return from + (to - from) * t;
}

/**
 * Get random building duration within specified range
 *
 * @returns Building duration in milliseconds
 */
export function getRandomBuildingDuration(): number {
  return ANIMATION_TIMING.BUILDING_MIN +
    Math.random() * (ANIMATION_TIMING.BUILDING_MAX - ANIMATION_TIMING.BUILDING_MIN);
}
