import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CONTAINER_COLORS } from '@/lib/container-colors'

interface ContainerDoorsProps {
  state: 'open' | 'closing' | 'closed'
  onAnimationComplete?: () => void
}

// Container dimensions (matching Container3D.tsx)
const CONTAINER = {
  width: 6,
  height: 5,
  depth: 8,
  CENTER_Y: 2.5,
}

// Door specifications
const DOOR = {
  width: 2.9, // Each door is slightly less than half container width for realistic gap
  height: 4.8, // Slightly less than container height
  depth: 0.15, // Door thickness
  gap: 0.1, // Gap between doors when closed
  zPosition: 4, // At the front of the container (ENTRANCE_Z)
}

// Animation timing
const ANIMATION = {
  duration: 2.0, // 2 seconds total
  settleTime: 0.15, // Additional time for subtle bounce at end
}

/**
 * Easing function for door closing - feels weighted
 * Slow start, accelerate, decelerate at end
 */
const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/**
 * Subtle bounce effect at the end of closing
 */
const settleEffect = (t: number): number => {
  if (t >= 1.0) {
    const excess = t - 1.0
    const settleProgress = excess / ANIMATION.settleTime
    if (settleProgress < 1.0) {
      // Small overshoot then settle
      return 1.0 + Math.sin(settleProgress * Math.PI * 2) * 0.02 * (1 - settleProgress)
    }
  }
  return t >= 1.0 ? 1.0 : t
}

export function ContainerDoors({ state, onAnimationComplete }: ContainerDoorsProps) {
  const leftDoorRef = useRef<THREE.Group>(null)
  const rightDoorRef = useRef<THREE.Group>(null)
  const animationStartRef = useRef<number | null>(null)
  const hasCompletedRef = useRef(false)

  // Reset animation when state changes to closing
  React.useEffect(() => {
    if (state === 'closing') {
      animationStartRef.current = Date.now()
      hasCompletedRef.current = false
    } else if (state === 'open') {
      animationStartRef.current = null
      hasCompletedRef.current = false
    }
  }, [state])

  // Door materials
  const doorMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: CONTAINER_COLORS.WALL_SURFACE,
        metalness: 0.8,
        roughness: 0.3,
        side: THREE.DoubleSide,
      }),
    []
  )

  const hingeMataterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: CONTAINER_COLORS.WALL_HIGHLIGHT,
        metalness: 0.9,
        roughness: 0.2,
      }),
    []
  )

  const edgeMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: CONTAINER_COLORS.WIREFRAME_PRIMARY,
        linewidth: 2,
      }),
    []
  )

  // Animation loop
  useFrame(() => {
    if (state === 'closing' && animationStartRef.current && leftDoorRef.current && rightDoorRef.current) {
      const elapsed = (Date.now() - animationStartRef.current) / 1000
      const totalDuration = ANIMATION.duration + ANIMATION.settleTime
      const progress = Math.min(elapsed / ANIMATION.duration, 1.0)
      const settledProgress = settleEffect(elapsed / ANIMATION.duration)

      // Apply easing
      const easedProgress = easeInOutCubic(settledProgress)

      // Left door rotates from 90° (open, parallel to container front) to 0° (closed)
      // Hinge is on the left edge
      const leftRotation = Math.PI / 2 * (1 - easedProgress)
      leftDoorRef.current.rotation.y = leftRotation

      // Right door rotates from -90° (open) to 0° (closed)
      // Hinge is on the right edge
      const rightRotation = -Math.PI / 2 * (1 - easedProgress)
      rightDoorRef.current.rotation.y = rightRotation

      // Check if animation is complete
      if (elapsed >= totalDuration && !hasCompletedRef.current) {
        hasCompletedRef.current = true
        if (onAnimationComplete) {
          onAnimationComplete()
        }
      }
    } else if (state === 'open' && leftDoorRef.current && rightDoorRef.current) {
      // Doors fully open (parallel to container front)
      leftDoorRef.current.rotation.y = Math.PI / 2
      rightDoorRef.current.rotation.y = -Math.PI / 2
    } else if (state === 'closed' && leftDoorRef.current && rightDoorRef.current) {
      // Doors fully closed
      leftDoorRef.current.rotation.y = 0
      rightDoorRef.current.rotation.y = 0
    }
  })

  // Calculate hinge positions
  const leftHingeX = -CONTAINER.width / 2 + DOOR.gap / 2
  const rightHingeX = CONTAINER.width / 2 - DOOR.gap / 2

  return (
    <group>
      {/* Left Door */}
      <group
        ref={leftDoorRef}
        position={[leftHingeX, CONTAINER.CENTER_Y, DOOR.zPosition]}
      >
        {/* Door panel - pivot is at left edge (hinge) */}
        <mesh position={[DOOR.width / 2, 0, 0]}>
          <boxGeometry args={[DOOR.width, DOOR.height, DOOR.depth]} />
          <primitive object={doorMaterial} attach="material" />
        </mesh>

        {/* Door edges */}
        <lineSegments position={[DOOR.width / 2, 0, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(DOOR.width, DOOR.height, DOOR.depth)]} />
          <primitive object={edgeMaterial} attach="material" />
        </lineSegments>

        {/* Hinges */}
        {[0, 1, 2].map((i) => (
          <mesh
            key={`left-hinge-${i}`}
            position={[0, -DOOR.height / 2 + (i + 0.5) * (DOOR.height / 3), DOOR.depth / 2 + 0.05]}
          >
            <cylinderGeometry args={[0.08, 0.08, 0.3, 8]} />
            <primitive object={hingeMataterial} attach="material" />
          </mesh>
        ))}
      </group>

      {/* Right Door */}
      <group
        ref={rightDoorRef}
        position={[rightHingeX, CONTAINER.CENTER_Y, DOOR.zPosition]}
      >
        {/* Door panel - pivot is at right edge (hinge) */}
        <mesh position={[-DOOR.width / 2, 0, 0]}>
          <boxGeometry args={[DOOR.width, DOOR.height, DOOR.depth]} />
          <primitive object={doorMaterial} attach="material" />
        </mesh>

        {/* Door edges */}
        <lineSegments position={[-DOOR.width / 2, 0, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(DOOR.width, DOOR.height, DOOR.depth)]} />
          <primitive object={edgeMaterial} attach="material" />
        </lineSegments>

        {/* Hinges */}
        {[0, 1, 2].map((i) => (
          <mesh
            key={`right-hinge-${i}`}
            position={[0, -DOOR.height / 2 + (i + 0.5) * (DOOR.height / 3), DOOR.depth / 2 + 0.05]}
          >
            <cylinderGeometry args={[0.08, 0.08, 0.3, 8]} />
            <primitive object={hingeMataterial} attach="material" />
          </mesh>
        ))}
      </group>

      {/* Locking bars (vertical bars on doors when closed) */}
      {state === 'closed' && (
        <>
          <mesh position={[leftHingeX + DOOR.width, CONTAINER.CENTER_Y, DOOR.zPosition + DOOR.depth / 2 + 0.05]}>
            <cylinderGeometry args={[0.06, 0.06, DOOR.height * 0.6, 8]} />
            <primitive object={hingeMataterial} attach="material" />
          </mesh>
          <mesh position={[rightHingeX - DOOR.width, CONTAINER.CENTER_Y, DOOR.zPosition + DOOR.depth / 2 + 0.05]}>
            <cylinderGeometry args={[0.06, 0.06, DOOR.height * 0.6, 8]} />
            <primitive object={hingeMataterial} attach="material" />
          </mesh>
        </>
      )}
    </group>
  )
}
