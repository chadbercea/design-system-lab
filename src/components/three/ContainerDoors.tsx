import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CONTAINER_COLORS } from '@/lib/container-colors'
import type { ContainerState } from '@/lib/container-colors'

interface ContainerDoorsProps {
  state: 'open' | 'closing' | 'closed'
  containerState?: ContainerState
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

  // Canvas texture for terminal text
  const terminalTextureRef = useRef<THREE.CanvasTexture | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Create canvas texture for terminal text
  useEffect(() => {
    if (terminalLines.length === 0) return

    // Create canvas with aspect ratio matching door (2.5 : 4.2)
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas')
      // Match door aspect ratio: width 2.5, height 4.2
      canvasRef.current.width = 800
      canvasRef.current.height = 1344 // 800 * (4.2 / 2.5)
    }

    // Create texture on first render
    if (!terminalTextureRef.current && canvasRef.current) {
      terminalTextureRef.current = new THREE.CanvasTexture(canvasRef.current)
    }
  }, [terminalLines])

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

  // Door materials - black in building/error (with animated opacity in building), dark navy in running
  const doorMaterial = useMemo(
    () => {
      let color: number = CONTAINER_COLORS.WALL_SURFACE;
      let opacity = 1.0;

      if (containerState === 'building') {
        color = 0x000000 as number; // Black for building state
        opacity = buildingDoorOpacity;
      } else if (containerState === 'error') {
        color = 0x000000 as number; // Black for error state
        opacity = 1.0; // Doors filled black in error state
      } else if (containerState === 'running') {
        color = 0x000000 as number; // BLACK to match walls
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
        color: 0x000000, // Black
      }),
    []
  )

  const hingeOutlineMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: 0xFFFFFF, // White outline
        linewidth: 2,
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

    // Update terminal texture every frame when there are lines to display
    if (terminalLines.length > 0) {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!canvas || !ctx) return

      // Clear and redraw
      ctx.fillStyle = 'rgba(0, 0, 0, 0.95)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#00FF00'
      ctx.font = '28px Monaco, Courier New, monospace'
      ctx.textBaseline = 'top'

      const lineHeight = 45
      const startY = 40

      terminalLines.forEach((line, index) => {
        let displayLine = line
        // Only animate dots if the full "Starting..." line is complete
        if (line === 'Starting...' || line.startsWith('Starting...')) {
          const dotCount = (Math.floor(Date.now() / 500) % 4)
          displayLine = 'Starting' + '.'.repeat(dotCount)
        }
        ctx.fillText(displayLine, 40, startY + index * lineHeight)
      })

      if (terminalTextureRef.current) {
        terminalTextureRef.current.needsUpdate = true
      }
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
          <group key={`left-hinge-${i}`} position={[0, -DOOR.height / 2 + (i + 0.5) * (DOOR.height / 3), DOOR.depth / 2 + 0.05]}>
            <mesh>
              <cylinderGeometry args={[0.08, 0.08, 0.3, 8]} />
              <primitive object={hingeMataterial} attach="material" />
            </mesh>
            <lineSegments>
              <edgesGeometry args={[new THREE.CylinderGeometry(0.08, 0.08, 0.3, 8)]} />
              <primitive object={hingeOutlineMaterial} attach="material" />
            </lineSegments>
          </group>
        ))}

        {/* Terminal text on left door surface - canvas texture */}
        {containerState === 'building' && terminalLines.length > 0 && terminalTextureRef.current && (
          <mesh position={[DOOR.width / 2, 0, DOOR.depth / 2 + 0.01]}>
            <planeGeometry args={[DOOR.width - 0.4, DOOR.height - 0.6]} />
            <meshBasicMaterial map={terminalTextureRef.current} transparent side={THREE.DoubleSide} />
          </mesh>
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
          <group key={`right-hinge-${i}`} position={[0, -DOOR.height / 2 + (i + 0.5) * (DOOR.height / 3), DOOR.depth / 2 + 0.05]}>
            <mesh>
              <cylinderGeometry args={[0.08, 0.08, 0.3, 8]} />
              <primitive object={hingeMataterial} attach="material" />
            </mesh>
            <lineSegments>
              <edgesGeometry args={[new THREE.CylinderGeometry(0.08, 0.08, 0.3, 8)]} />
              <primitive object={hingeOutlineMaterial} attach="material" />
            </lineSegments>
          </group>
        ))}
      </group>

      {/* Locking bars (vertical bars on doors when closed) */}
      {state === 'closed' && (
        <>
          <group position={[leftHingeX + DOOR.width, CONTAINER.CENTER_Y, DOOR.zPosition + DOOR.depth / 2 + 0.05]}>
            <mesh>
              <cylinderGeometry args={[0.06, 0.06, DOOR.height * 0.6, 8]} />
              <primitive object={hingeMataterial} attach="material" />
            </mesh>
            <lineSegments>
              <edgesGeometry args={[new THREE.CylinderGeometry(0.06, 0.06, DOOR.height * 0.6, 8)]} />
              <primitive object={hingeOutlineMaterial} attach="material" />
            </lineSegments>
          </group>
          <group position={[rightHingeX - DOOR.width, CONTAINER.CENTER_Y, DOOR.zPosition + DOOR.depth / 2 + 0.05]}>
            <mesh>
              <cylinderGeometry args={[0.06, 0.06, DOOR.height * 0.6, 8]} />
              <primitive object={hingeMataterial} attach="material" />
            </mesh>
            <lineSegments>
              <edgesGeometry args={[new THREE.CylinderGeometry(0.06, 0.06, DOOR.height * 0.6, 8)]} />
              <primitive object={hingeOutlineMaterial} attach="material" />
            </lineSegments>
          </group>
        </>
      )}
    </group>
  )
}
