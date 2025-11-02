/**
 * Type definitions for the ImageCrate component
 *
 * Represents a Docker image as a 3D crate that flies into a container
 * @see /docs/IMAGE_CRATE_DESIGN_SPEC.md
 */

export type AnimationState =
  | 'idle'
  | 'entering'
  | 'docking'
  | 'settled'
  | 'exiting'
  | 'floating';

export interface ImageCrateProps {
  /** Animation state */
  state?: AnimationState;

  /** Called when animation completes */
  onAnimationComplete?: (state: AnimationState) => void;

  /** Size scale factor (default: 1) */
  scale?: number;

  /** Enable idle floating animation */
  enableFloating?: boolean;

  /** Show Docker logo on front face */
  showLogo?: boolean;

  /** Custom color override (hex string) */
  color?: string;

  /** Enable subtle glow effect */
  enableGlow?: boolean;

  /** Image name to display (e.g., "nginx:latest") */
  imageName?: string;

  /** Show loading text overlay during entering/docking */
  showLoadingText?: boolean;
}

export interface CratePosition {
  x: number;
  y: number;
  z: number;
}

export interface AnimationConfig {
  duration: number;
  easing: (t: number) => number;
  startPosition: CratePosition;
  endPosition: CratePosition;
}
