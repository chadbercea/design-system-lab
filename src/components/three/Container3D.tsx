'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import type { ContainerState } from '@/lib/container-colors';
import { CONTAINER_COLORS, getBuildingPulseOpacity } from '@/lib/container-colors';
import { ImageCrateModel } from './ImageCrate/ImageCrateModel';
import { ContainerDoors } from './ContainerDoors';

interface Container3DProps {
  state?: ContainerState;
}

export function Container3D({ state = 'ready' }: Container3DProps) {
  const containerRef = useRef<THREE.Group>(null);
  const wireframeRef = useRef<THREE.LineSegments>(null);
  const glowMeshRef = useRef<THREE.Mesh>(null);

  const [crateState, setCrateState] = useState<'idle' | 'entering' | 'docking' | 'settled' | 'floating'>(
    state === 'building' ? 'entering' : 'floating'
  );

  const [usesDottedMaterial, setUsesDottedMaterial] = useState(state === 'building');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionStart, setTransitionStart] = useState<number | null>(null);
  const [hasTransitioned, setHasTransitioned] = useState(false);
  const [doorState, setDoorState] = useState<'open' | 'closing' | 'closed'>(
    state === 'building' ? 'open' : state === 'error' ? 'open' : 'closed'
  );
  const [idleAnimationStart, setIdleAnimationStart] = useState<number | null>(null);

  // Wall fade animation for building state
  const [wallFadeStart, setWallFadeStart] = useState<number | null>(null);
  const [wallOpacities, setWallOpacities] = useState({
    back: 0,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    doors: 0,
  });
  const [doorCloseTriggered, setDoorCloseTriggered] = useState(false);

  // Camera rotation state for building sequence
  const [cameraRotationStart, setCameraRotationStart] = useState<number | null>(null);
  const [cameraRotationComplete, setCameraRotationComplete] = useState(false);

  // Terminal text animation state
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [terminalStart, setTerminalStart] = useState<number | null>(null);
  const [terminalCharCount, setTerminalCharCount] = useState(0);

  // Running state animation
  const [runningFadeStart, setRunningFadeStart] = useState<number | null>(null);

  // Error state animation
  const [errorCameraStart, setErrorCameraStart] = useState<number | null>(null);

  // Wall material - invisible in building/ready, dark navy in running, white in error
  const wallMaterial = useMemo(() => {
    let color: number = CONTAINER_COLORS.WALL_SURFACE;
    if (state === 'running') {
      color = 0x1a2845 as number; // Dark navy blue
    }

    return new THREE.MeshBasicMaterial({
      color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: (state === 'building' || state === 'ready') ? 0.0 : 1.0,
      depthWrite: false,
      colorWrite: state !== 'building' && state !== 'ready',
    });
  }, [state]);

  // Create solid wireframe material - WHITE for all states
  const solidWireframeMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: 0xFFFFFF,
      linewidth: 3,
      transparent: false,
      opacity: 1.0,
      depthTest: true,
      depthWrite: true,
    });
  }, []);

  // Create dotted wireframe material - MUST use LineDashedMaterial for dashes
  const dottedWireframeMaterial = useMemo(() => {
    const mat = new THREE.LineDashedMaterial({
      color: 0xFFFFFF,
      linewidth: 3,
      scale: 1,
      dashSize: 0.75,
      gapSize: 0.75,
      transparent: false,
      opacity: 1.0,
      depthTest: true,
      depthWrite: true,
    });
    return mat;
  }, []);

  // Red wireframe material for error state
  const redWireframeMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: 0xff0000, // Red
      linewidth: 3,
      transparent: false,
      opacity: 1.0,
      depthTest: true,
      depthWrite: true,
    });
  }, []);

  // Current wireframe material - red for error, white dashed for building, white solid for others
  const currentWireframeMaterial = state === 'error' ? redWireframeMaterial : (usesDottedMaterial ? dottedWireframeMaterial : solidWireframeMaterial);

  // Building state glow material
  const glowMaterial = useMemo(() => {
    if (state !== 'building') return null;
    return new THREE.MeshBasicMaterial({
      color: CONTAINER_COLORS.BUILDING,
      transparent: true,
      opacity: 0.6,
      side: THREE.BackSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [state]);

  // Compute line distances for dashed material - must be called every frame
  useFrame(() => {
    if (wireframeRef.current && usesDottedMaterial) {
      wireframeRef.current.computeLineDistances();
    }
  });

  // Reset state when switching to building
  useEffect(() => {
    if (state === 'building') {
      setHasTransitioned(false);
      setIsTransitioning(false);
      setUsesDottedMaterial(true);
      setCrateState('entering');
      setDoorState('open');
      setIdleAnimationStart(null);
      setWallFadeStart(null);
      setWallOpacities({
        back: 0,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        doors: 0,
      });
      setDoorCloseTriggered(false);
      setTerminalLines([]);
      setTerminalStart(null);
      setCameraRotationStart(null);
      setCameraRotationComplete(false);
      dottedWireframeMaterial.opacity = 0.7;
      solidWireframeMaterial.opacity = 1.0;
      solidWireframeMaterial.transparent = false;
    } else if (state === 'ready') {
      // Ready state: same as building but doors closed
      setUsesDottedMaterial(true);
      setCrateState('idle');
      setDoorState('closed');
      setIdleAnimationStart(null);
      dottedWireframeMaterial.opacity = 1.0;
    } else if (state === 'running') {
      // Running state: fade from black to blue, auto rotate
      setUsesDottedMaterial(false);
      setCrateState('floating');
      setDoorState('closed');
      setIdleAnimationStart(null);
      setRunningFadeStart(Date.now());
    } else if (state === 'error') {
      // Error state: camera rotates to door side, doors open with black fill
      setUsesDottedMaterial(false);
      setCrateState('floating');
      setDoorState('open');
      setIdleAnimationStart(null);
      setErrorCameraStart(Date.now());
    } else {
      setUsesDottedMaterial(false);
      setCrateState('floating');
      setDoorState('closed');
      setIdleAnimationStart(null);
    }
  }, [state, dottedWireframeMaterial, solidWireframeMaterial]);

  // Animation loop
  useFrame((frameState) => {
    const elapsed = frameState.clock.elapsedTime;

    // Building state animations
    if (state === 'building') {
      // No container rotation in building state - camera should handle positioning

      // Marching ants
      if (wireframeRef.current && usesDottedMaterial) {
        const material = wireframeRef.current.material as THREE.LineDashedMaterial;
        if ('dashOffset' in material) {
          (material as any).dashOffset = -elapsed * 0.5;
        }
      }

      // Sequential wall fade-in animation
      if (wallFadeStart !== null) {
        const elapsed = (Date.now() - wallFadeStart) / 1000;
        const fadeDuration = 0.6; // Each wall fades in over 0.6 seconds
        const delayBetween = 0.2; // 0.2 second delay between each wall

        // Back wall (starts immediately)
        const backProgress = Math.min(Math.max((elapsed - 0) / fadeDuration, 0), 1);
        // Left wall (starts after back + delay)
        const leftProgress = Math.min(Math.max((elapsed - (fadeDuration + delayBetween)) / fadeDuration, 0), 1);
        // Right wall (starts after left + delay)
        const rightProgress = Math.min(Math.max((elapsed - (fadeDuration + delayBetween) * 2) / fadeDuration, 0), 1);
        // Top wall (starts after right + delay)
        const topProgress = Math.min(Math.max((elapsed - (fadeDuration + delayBetween) * 3) / fadeDuration, 0), 1);
        // Bottom wall (starts after top + delay)
        const bottomProgress = Math.min(Math.max((elapsed - (fadeDuration + delayBetween) * 4) / fadeDuration, 0), 1);
        // Doors (starts after bottom + delay)
        const doorsProgress = Math.min(Math.max((elapsed - (fadeDuration + delayBetween) * 5) / fadeDuration, 0), 1);

        setWallOpacities({
          back: backProgress,
          left: leftProgress,
          right: rightProgress,
          top: topProgress,
          bottom: bottomProgress,
          doors: doorsProgress,
        });

        // After doors are fully visible, start door closing (once)
        if (doorsProgress >= 1 && !isTransitioning && !doorCloseTriggered) {
          setDoorState('closing');
          setIsTransitioning(true);
          setTransitionStart(Date.now());
          setDoorCloseTriggered(true);
        }
      }

      // No camera rotation during building - keep container front-facing so user can see terminal text on doors

      // Terminal text animation - types characters sequentially
      if (terminalStart !== null) {
        const elapsed = (Date.now() - terminalStart) / 1000;
        const charsPerSecond = 30; // Character typing speed

        const allLines = [
          'Loading Dockerfile...',
          'Step 1/5: FROM nginx:alpine',
          'Step 2/5: COPY . /usr/share/nginx/html',
          'Step 3/5: EXPOSE 80',
          'Step 4/5: CMD ["nginx", "-g", "daemon off;"]',
          'Step 5/5: Successfully built container',
          'Starting...'
        ];

        // Calculate total characters needed
        const totalChars = allLines.reduce((sum, line) => sum + line.length, 0);
        const targetCharCount = Math.min(Math.floor(elapsed * charsPerSecond), totalChars);

        // Build visible lines by character count
        let charsRemaining = targetCharCount;
        const visibleLines: string[] = [];

        for (const line of allLines) {
          if (charsRemaining <= 0) break;

          if (charsRemaining >= line.length) {
            visibleLines.push(line);
            charsRemaining -= line.length;
          } else {
            visibleLines.push(line.substring(0, charsRemaining));
            charsRemaining = 0;
          }
        }

        // Always update if content changed (check entire array)
        const contentChanged = visibleLines.length !== terminalLines.length ||
          visibleLines.some((line, idx) => line !== terminalLines[idx]);

        if (contentChanged) {
          setTerminalLines(visibleLines);
        }
      }

      // No idle animations after choreography completes
    } else if (state === 'running') {
      // Running state: slow auto-rotation
      if (containerRef.current) {
        containerRef.current.rotation.y = elapsed * 0.1; // Slow rotation
        containerRef.current.scale.setScalar(1.0);
      }

      // Fade COLOR from black to blue
      if (runningFadeStart !== null) {
        const fadeElapsed = (Date.now() - runningFadeStart) / 1000;
        const fadeDuration = 2.0; // 2 seconds fade
        const fadeProgress = Math.min(fadeElapsed / fadeDuration, 1.0);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - fadeProgress, 3);

        // Interpolate color from black (0x000000) to dark navy (0x1a2845)
        const blackR = 0, blackG = 0, blackB = 0;
        const blueR = 0x1a, blueG = 0x28, blueB = 0x45;

        const r = Math.round(blackR + (blueR - blackR) * eased);
        const g = Math.round(blackG + (blueG - blackG) * eased);
        const b = Math.round(blackB + (blueB - blackB) * eased);

        wallMaterial.color.setHex((r << 16) | (g << 8) | b);
        wallMaterial.opacity = 1.0; // Keep fully opaque
        wallMaterial.needsUpdate = true;
      }
    } else if (state === 'error') {
      // Error state: rotate container to show door side
      if (containerRef.current && errorCameraStart !== null) {
        const cameraElapsed = (Date.now() - errorCameraStart) / 1000;
        const cameraDuration = 1.5; // 1.5 seconds
        const cameraProgress = Math.min(cameraElapsed / cameraDuration, 1.0);

        // Ease in-out cubic
        const eased = cameraProgress < 0.5
          ? 4 * cameraProgress * cameraProgress * cameraProgress
          : 1 - Math.pow(-2 * cameraProgress + 2, 3) / 2;

        // Rotate container 45 degrees to show doors from side angle
        const targetAngle = Math.PI / 4; // 45 degrees
        containerRef.current.rotation.y = targetAngle * eased;
        containerRef.current.scale.setScalar(1.0);
      }
    } else {
      if (containerRef.current) {
        containerRef.current.rotation.y = 0;
        containerRef.current.scale.setScalar(1.0); // Reset scale when not in building state
      }
    }

    // Handle wireframe transition - gaps fill in, walls become opaque
    if (isTransitioning && transitionStart !== null) {
      const elapsed = (Date.now() - transitionStart) / 1000;
      const progress = Math.min(elapsed / 1.0, 1.0);

      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      // Animate gap size from 0.8 to 0 (gaps close)
      dottedWireframeMaterial.gapSize = 0.8 * (1 - eased);
      dottedWireframeMaterial.needsUpdate = true;

      // Animate wall opacity from 0 to 1
      wallMaterial.opacity = eased;
      wallMaterial.needsUpdate = true;

      if (progress >= 0.5 && usesDottedMaterial) {
        setUsesDottedMaterial(false);
      }

      if (progress >= 1.0) {
        setIsTransitioning(false);
        wallMaterial.opacity = 1.0;
        wallMaterial.needsUpdate = true;
      }
    }
  });

  return (
    <group ref={containerRef}>
      {/* Container box - render in running state, hide front face in error state */}
      {state === 'running' && (
        <mesh position={[0, 2.5, 0]}>
          <boxGeometry args={[6, 5, 8]} />
          <primitive object={wallMaterial} attach="material" />
        </mesh>
      )}
      {state === 'building' && (
        <>
          {/* Back wall - fades in first */}
          <mesh position={[0, 2.5, -4]} renderOrder={1}>
            <planeGeometry args={[6, 5]} />
            <meshBasicMaterial color={0x000000} transparent opacity={wallOpacities.back} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          {/* Left wall */}
          <mesh position={[-3, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} renderOrder={1}>
            <planeGeometry args={[8, 5]} />
            <meshBasicMaterial color={0x000000} transparent opacity={wallOpacities.left} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          {/* Right wall */}
          <mesh position={[3, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]} renderOrder={1}>
            <planeGeometry args={[8, 5]} />
            <meshBasicMaterial color={0x000000} transparent opacity={wallOpacities.right} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          {/* Top wall */}
          <mesh position={[0, 5, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={1}>
            <planeGeometry args={[6, 8]} />
            <meshBasicMaterial color={0x000000} transparent opacity={wallOpacities.top} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          {/* Bottom wall */}
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} renderOrder={1}>
            <planeGeometry args={[6, 8]} />
            <meshBasicMaterial color={0x000000} transparent opacity={wallOpacities.bottom} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
        </>
      )}
      {state === 'error' && (
        <>
          {/* Back wall */}
          <mesh position={[0, 2.5, -4]} renderOrder={1}>
            <planeGeometry args={[6, 5]} />
            <meshBasicMaterial color={0x000000} transparent opacity={1.0} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          {/* Left wall */}
          <mesh position={[-3, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} renderOrder={1}>
            <planeGeometry args={[8, 5]} />
            <meshBasicMaterial color={0x000000} transparent opacity={1.0} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          {/* Right wall */}
          <mesh position={[3, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]} renderOrder={1}>
            <planeGeometry args={[8, 5]} />
            <meshBasicMaterial color={0x000000} transparent opacity={1.0} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          {/* Top wall */}
          <mesh position={[0, 5, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={1}>
            <planeGeometry args={[6, 8]} />
            <meshBasicMaterial color={0x000000} transparent opacity={1.0} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          {/* Bottom wall */}
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} renderOrder={1}>
            <planeGeometry args={[6, 8]} />
            <meshBasicMaterial color={0x000000} transparent opacity={1.0} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
        </>
      )}

      {/* Wireframe edges - force re-render when material changes */}
      <lineSegments
        key={usesDottedMaterial ? 'dotted' : 'solid'}
        ref={wireframeRef}
        position={[0, 2.5, 0]}
        renderOrder={999}
      >
        <edgesGeometry args={[new THREE.BoxGeometry(6, 5, 8)]} />
        <primitive object={currentWireframeMaterial} attach="material" />
      </lineSegments>

      {/* No glow effect in building state */}

      {/* Container doors */}
      <ContainerDoors
        state={doorState}
        containerState={state}
        wireframeMaterial={currentWireframeMaterial}
        buildingDoorOpacity={wallOpacities.doors}
        terminalLines={terminalLines}
        onAnimationComplete={() => {
          setDoorState('closed');
          // Start terminal text when doors finish closing
          if (state === 'building' && terminalStart === null) {
            setTerminalStart(Date.now());
          }
        }}
      />

      {/* Image crate - visible in building and error states */}
      {(state === 'building' || state === 'error') && (
        <ImageCrateModel
          state={crateState}
          showLogo={true}
          scale={1.0}
          imageName="nginx:latest"
          showLoadingText={true}
          onAnimationComplete={(newState) => {
            // Handle animation state transitions
            if (newState === 'docking') {
              // After entering completes, start docking
              setCrateState('docking');
            } else if (newState === 'settled' && usesDottedMaterial && !hasTransitioned) {
              // After docking completes and settles, start wall fade-in, then door closing
              setWallFadeStart(Date.now());
              setHasTransitioned(true);
              setCrateState('floating');
            }
          }}
        />
      )}

      {/* Building text */}
      {state === 'building' && (
        <Html position={[0, 7, 0]} center distanceFactor={10}>
          <div style={{
            background: 'rgba(33, 150, 243, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(33, 150, 243, 0.4)',
            borderRadius: '8px',
            padding: '12px 24px',
            color: '#64B5F6',
            fontSize: '18px',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}>
            Building container...
          </div>
        </Html>
      )}

      {/* Ground plane - hidden */}
    </group>
  );
}
