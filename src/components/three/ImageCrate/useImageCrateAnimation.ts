/**
 * Animation hook for ImageCrate component
 *
 * Handles all animation states for the Docker image crate:
 * - entering: Flies into container with arc trajectory
 * - settled: Rests in container
 * - floating: Subtle hover animation
 * - exiting: Flies out of container
 *
 * @see /docs/IMAGE_CRATE_DESIGN_SPEC.md - Animation Specifications (Section 4)
 */

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import type { AnimationState, CratePosition } from './types';

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
        const duration = 1.5;
        const progress = Math.min(elapsedTime / duration, 1);

        // Arc trajectory (specified in design: 200 units away, 100 units up)
        // Adjusted for the existing container scale
        const arcProgress = easeInOutCubic(progress);
        const startPos: CratePosition = { x: 3, y: 2, z: -4 };
        const endPos: CratePosition = { x: 0, y: 1.5, z: 0 };

        group.position.x = startPos.x + (endPos.x - startPos.x) * arcProgress;
        group.position.y = startPos.y + (endPos.y - startPos.y) * arcProgress +
                          Math.sin(arcProgress * Math.PI) * 0.5; // Arc effect
        group.position.z = startPos.z + (endPos.z - startPos.z) * arcProgress;

        // Gentle rotation during flight (15° as specified)
        group.rotation.y = (1 - arcProgress) * (Math.PI / 12);

        // Bounce at end (scale: 1.0 → 1.05 → 1.0)
        if (progress > 0.8) {
          const bounceProgress = (progress - 0.8) / 0.2;
          const bounce = easeOutBounce(bounceProgress);
          group.scale.setScalar(0.95 + bounce * 0.1);
        }

        if (progress >= 1 && onAnimationComplete) {
          onAnimationComplete('settled');
        }
        break;
      }

      case 'settled': {
        // Idle position in container
        group.position.set(0, 1.5, 0);
        group.rotation.y = 0;
        group.scale.setScalar(1);
        break;
      }

      case 'floating': {
        // Subtle floating animation (±2 units on Y-axis, 4s cycle)
        const floatSpeed = 0.5; // Complete cycle every 4 seconds
        const floatAmount = 0.05;
        group.position.y = 1.5 + Math.sin(elapsedTime * floatSpeed * Math.PI * 2) * floatAmount;
        group.position.x = 0;
        group.position.z = 0;
        group.rotation.y = 0;
        group.scale.setScalar(1);
        break;
      }

      case 'exiting': {
        const duration = 1.0;
        const progress = Math.min(elapsedTime / duration, 1);

        const exitProgress = easeInOutCubic(progress);
        const startPos: CratePosition = { x: 0, y: 1.5, z: 0 };
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
