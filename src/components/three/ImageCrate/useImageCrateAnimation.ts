/**
 * Animation hook for ImageCrate component
 *
 * Handles all animation states for the Docker image crate:
 * - entering: Flies into scene from off-screen with arc trajectory
 * - docking: Enters through container opening and docks inside with satisfying "thunk"
 * - settled: Rests inside container
 * - floating: Subtle hover animation inside container
 * - exiting: Flies out of container
 *
 * @see /docs/IMAGE_CRATE_DESIGN_SPEC.md - Animation Specifications (Section 4)
 */

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import type { AnimationState, CratePosition } from './types';

// Container dimensions (from Container3D.tsx)
const CONTAINER = {
  WIDTH: 6,    // x-axis
  HEIGHT: 5,   // y-axis
  DEPTH: 8,    // z-axis
  CENTER_Y: 2.5,
  ENTRANCE_Z: 4, // Front opening (z + depth/2)
};

// Easing function: Smooth ease-in-out cubic
const easeInOutCubic = (t: number): number => {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

// Easing function: Bounce effect for landing
const easeOutBounce = (t: number): number => {
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
};

export const useImageCrateAnimation = (
  state: AnimationState,
  onAnimationComplete?: (state: AnimationState) => void
) => {
  const groupRef = useRef<Group>(null);
  const animationStartTime = useRef(0);
  const previousState = useRef<AnimationState>(state);

  // Reset animation when state changes
  useEffect(() => {
    if (state !== previousState.current) {
      animationStartTime.current = Date.now();
      previousState.current = state;
    }
  }, [state]);

  useFrame(() => {
    if (!groupRef.current) return;

    const group = groupRef.current;
    const elapsedTime = (Date.now() - animationStartTime.current) / 1000;

    switch (state) {
      case 'entering': {
        // Phase 1: Fly in from off-screen with dramatic arc (3 seconds - 2x faster)
        const duration = 3.0;
        const progress = Math.min(elapsedTime / duration, 1);
        const arcProgress = easeInOutCubic(progress);

        // Start position: off-screen left, high up for dramatic entrance
        const startPos: CratePosition = { x: -12, y: 8, z: 8 };
        // End position: in front of container entrance, aligned with center
        const endPos: CratePosition = { x: 0, y: CONTAINER.CENTER_Y, z: CONTAINER.ENTRANCE_Z + 2 };

        // Arc trajectory with higher peak for visual drama
        group.position.x = startPos.x + (endPos.x - startPos.x) * arcProgress;
        group.position.y = startPos.y + (endPos.y - startPos.y) * arcProgress +
                          Math.sin(arcProgress * Math.PI) * 1.5; // Higher arc
        group.position.z = startPos.z + (endPos.z - startPos.z) * arcProgress;

        // Rotation during flight for visual interest (spin around Y-axis)
        group.rotation.y = (1 - arcProgress) * Math.PI * 0.5; // 90° rotation
        group.rotation.z = Math.sin(arcProgress * Math.PI * 2) * 0.1; // Slight wobble

        group.scale.setScalar(1);

        if (progress >= 1 && onAnimationComplete) {
          onAnimationComplete('docking');
        }
        break;
      }

      case 'docking': {
        // Phase 2: Enter through container opening and dock inside - smooth entry
        const duration = 2.0;
        const progress = Math.min(elapsedTime / duration, 1);

        // Smooth ease-in-out - no bounce
        const eased = easeInOutCubic(progress);

        // Start: in front of container entrance (beyond door position)
        const startPos: CratePosition = { x: 0, y: CONTAINER.CENTER_Y, z: CONTAINER.ENTRANCE_Z + 2 };
        // End: centered inside container - at x:0, y:center, z:0 (true center)
        const endPos: CratePosition = { x: 0, y: CONTAINER.CENTER_Y, z: 0 };

        group.position.x = startPos.x + (endPos.x - startPos.x) * eased;
        group.position.y = startPos.y + (endPos.y - startPos.y) * eased;
        group.position.z = startPos.z + (endPos.z - startPos.z) * eased;

        // Straighten out rotation as it enters
        group.rotation.y = 0;
        group.rotation.z = 0;

        // No bounce - smooth entry
        group.scale.setScalar(1);

        if (progress >= 1 && onAnimationComplete) {
          onAnimationComplete('settled');
        }
        break;
      }

      case 'settled': {
        // Final position: centered inside container
        group.position.set(0, CONTAINER.CENTER_Y, 0);
        group.rotation.y = 0;
        group.rotation.z = 0;
        group.scale.setScalar(1);
        break;
      }

      case 'floating': {
        // Subtle floating animation inside container
        const floatSpeed = 0.5; // Complete cycle every 4 seconds
        const floatAmount = 0.08;
        group.position.y = CONTAINER.CENTER_Y + Math.sin(elapsedTime * floatSpeed * Math.PI * 2) * floatAmount;
        group.position.x = 0;
        group.position.z = 0; // Centered inside container
        group.rotation.y = Math.sin(elapsedTime * 0.3) * 0.05; // Gentle rotation
        group.rotation.z = 0;
        group.scale.setScalar(1);
        break;
      }

      case 'exiting': {
        const duration = 1.0;
        const progress = Math.min(elapsedTime / duration, 1);

        const exitProgress = easeInOutCubic(progress);
        const startPos: CratePosition = { x: 0, y: 2.5, z: 4.5 };
        const endPos: CratePosition = { x: -3, y: 3, z: -4 };

        group.position.x = startPos.x + (endPos.x - startPos.x) * exitProgress;
        group.position.y = startPos.y + (endPos.y - startPos.y) * exitProgress;
        group.position.z = startPos.z + (endPos.z - startPos.z) * exitProgress;

        // Increase rotation during exit (45° as specified)
        group.rotation.y = exitProgress * (Math.PI / 4);

        // Scale out
        group.scale.setScalar(1 - exitProgress * 0.2);

        if (progress >= 1 && onAnimationComplete) {
          onAnimationComplete('idle');
        }
        break;
      }

      case 'idle':
      default:
        // Hidden/off-screen
        group.position.set(10, 10, 10);
        group.scale.setScalar(0);
        break;
    }
  });

  return groupRef;
};
