import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import { CONTAINER_COLORS } from '@/lib/container-colors'

interface ContainerDoorsProps {
  state: 'open' | 'closing' | 'closed'
  containerState?: 'building' | 'ready' | 'running' | 'error'
  wireframeMaterial: THREE.LineBasicMaterial | THREE.LineDashedMaterial
  buildingDoorOpacity?: number
  onAnimationComplete?: () => void
  terminalLines?: string[]
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
  zPosition: 3.93, // Just inside the front wall of container (depth/2 - door.depth/2) = 4 - 0.075
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

export function ContainerDoors({ state, containerState, wireframeMaterial, buildingDoorOpacity = 0, onAnimationComplete, terminalLines = [] }: ContainerDoorsProps) {
  const leftDoorRef = useRef<THREE.Group>(null)
  const rightDoorRef = useRef<THREE.Group>(null)
  const leftDoorWireframeRef = useRef<THREE.LineSegments>(null)
  const rightDoorWireframeRef = useRef<THREE.LineSegments>(null)
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

  // Door materials - black in building/error (with animated opacity in building), docker blue in running
  const doorMaterial = useMemo(
    () => {
      let color = CONTAINER_COLORS.WALL_SURFACE;
      let opacity = 1.0;

      if (containerState === 'building') {
        color = 0x000000; // Black for building state
        opacity = buildingDoorOpacity;
      } else if (containerState === 'error') {
        color = 0x000000; // Black for error state
        opacity = 0.0; // Doors stay transparent/open in error state
      } else if (containerState === 'running') {
        color = 0x1d63ed; // Docker blue
      } else if (state === 'open' || containerState === 'ready') {
        opacity = 0.0;
      }

      return new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity,
        colorWrite: opacity > 0.01,
      });
    },
    [state, containerState, buildingDoorOpacity]
  )

  const hingeMataterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
      }),
    []
  )

  // Animation loop - includes line distance computation for dashed materials
  useFrame(() => {
    // Compute line distances every frame for dashed materials
    if (leftDoorWireframeRef.current) {
      leftDoorWireframeRef.current.computeLineDistances()
    }
    if (rightDoorWireframeRef.current) {
      rightDoorWireframeRef.current.computeLineDistances()
    }

    // Door animation
    if (state === 'closing' && animationStartRef.current && leftDoorRef.current && rightDoorRef.current) {
      const elapsed = (Date.now() - animationStartRef.current) / 1000
      const totalDuration = ANIMATION.duration + ANIMATION.settleTime
      const progress = Math.min(elapsed / ANIMATION.duration, 1.0)
      const settledProgress = settleEffect(elapsed / ANIMATION.duration)

      // Apply easing
      const easedProgress = easeInOutCubic(settledProgress)

      // Left door rotates from -90° (fully open outward) to 0° (closed)
      const leftRotation = -(Math.PI / 2) * (1 - easedProgress)
      leftDoorRef.current.rotation.y = leftRotation

      // Right door rotates from 90° (fully open outward) to 0° (closed)
      const rightRotation = (Math.PI / 2) * (1 - easedProgress)
      rightDoorRef.current.rotation.y = rightRotation

      // Fade door opacity during closing (only for running/error states)
      // In building state, opacity is controlled by buildingDoorOpacity prop
      if (doorMaterial && containerState !== 'building' && containerState !== 'ready') {
        doorMaterial.opacity = easedProgress
        doorMaterial.colorWrite = easedProgress > 0.01
        doorMaterial.needsUpdate = true
      }

      // Check if animation is complete
      if (elapsed >= totalDuration && !hasCompletedRef.current) {
        hasCompletedRef.current = true
        if (onAnimationComplete) {
          onAnimationComplete()
        }
      }
    } else if (state === 'open' && leftDoorRef.current && rightDoorRef.current) {
      // Doors fully open outward at 90°
      leftDoorRef.current.rotation.y = -Math.PI / 2
      rightDoorRef.current.rotation.y = Math.PI / 2
    } else if (state === 'closed' && leftDoorRef.current && rightDoorRef.current) {
      // Doors fully closed
      leftDoorRef.current.rotation.y = 0
      rightDoorRef.current.rotation.y = 0

      // Ensure doors are fully opaque when closed (unless in building/ready state where they should be transparent)
      if (doorMaterial && containerState !== 'building' && containerState !== 'ready') {
        doorMaterial.opacity = 1.0
        doorMaterial.colorWrite = true
        doorMaterial.needsUpdate = true
      }
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

        {/* Door edges - use container wireframe material */}
        <lineSegments ref={leftDoorWireframeRef} position={[DOOR.width / 2, 0, 0]} renderOrder={999} frustumCulled={false}>
          <edgesGeometry args={[new THREE.BoxGeometry(DOOR.width, DOOR.height, DOOR.depth)]} />
          <primitive object={wireframeMaterial} attach="material" />
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

        {/* Terminal text on left door surface - only visible when door is visible */}
        {containerState === 'building' && terminalLines.length > 0 && (
          <Html
            position={[DOOR.width / 2, 0.5, DOOR.depth / 2 + 0.01]}
            transform
            distanceFactor={2.5}
            style={{ width: '100%' }}
          >
            <div style={{
              background: 'rgba(0, 0, 0, 0.95)',
              border: '1px solid rgba(0, 255, 0, 0.5)',
              borderRadius: '2px',
              padding: '4px 6px',
              color: '#00FF00',
              fontSize: '7px',
              fontWeight: '500',
              fontFamily: 'Monaco, Courier New, monospace',
              lineHeight: '1.3',
              whiteSpace: 'pre',
              textAlign: 'left',
              pointerEvents: 'none',
              maxWidth: `${DOOR.width * 40}px`,
              boxShadow: '0 0 10px rgba(0, 255, 0, 0.3)',
            }}>
              {terminalLines.map((line, index) => (
                <div key={index}>
                  {line}
                </div>
              ))}
            </div>
          </Html>
        )}
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

        {/* Door edges - use container wireframe material */}
        <lineSegments ref={rightDoorWireframeRef} position={[-DOOR.width / 2, 0, 0]} renderOrder={999} frustumCulled={false}>
          <edgesGeometry args={[new THREE.BoxGeometry(DOOR.width, DOOR.height, DOOR.depth)]} />
          <primitive object={wireframeMaterial} attach="material" />
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
