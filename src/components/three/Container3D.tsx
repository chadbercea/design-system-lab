'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import type { ContainerState } from '@/lib/container-colors';
import { CONTAINER_COLORS, getBuildingPulseOpacity } from '@/lib/container-colors';
import { ImageCrateModel } from './ImageCrate/ImageCrateModel';
import { ContainerDoors } from './ContainerDoors';
import { useAppState } from '@/lib/app-state-context';

interface Container3DProps {
  state?: ContainerState;
}

export function Container3D({ state = 'ready' }: Container3DProps) {
  const { setCameraPhase } = useAppState();
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

  // Container rotation to running state - smooth rotation to expose right wall
  const [containerRotationStart, setContainerRotationStart] = useState<number | null>(null);
  const [containerRotationComplete, setContainerRotationComplete] = useState(false);
  const [targetRotation, setTargetRotation] = useState(0);

  // Terminal text animation state
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [terminalStart, setTerminalStart] = useState<number | null>(null);
  const [terminalCharCount, setTerminalCharCount] = useState(0);

  // Shipping label text animation state (right wall)
  const [shippingLabelLines, setShippingLabelLines] = useState<string[]>([]);
  const [shippingLabelStart, setShippingLabelStart] = useState<number | null>(null);

  // Canvas texture for shipping label
  const shippingLabelTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const shippingLabelCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Running state animation
  const [runningFadeStart, setRunningFadeStart] = useState<number | null>(null);

  // Error state animation
  const [errorCameraStart, setErrorCameraStart] = useState<number | null>(null);

  // Wall material - invisible in building/ready, BLACK in running, white in error
  const wallMaterial = useMemo(() => {
    let color: number = CONTAINER_COLORS.WALL_SURFACE;
    if (state === 'running') {
      color = 0x000000 as number; // Black - stay black, no fade to blue
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

  // Create canvas texture for shipping label
  useEffect(() => {
    if (state !== 'running') return;

    // Create canvas for right wall (height 5, width 6)
    if (!shippingLabelCanvasRef.current) {
      shippingLabelCanvasRef.current = document.createElement('canvas');
      shippingLabelCanvasRef.current.width = 1200;
      shippingLabelCanvasRef.current.height = 1000; // Match wall aspect ratio
    }

    // Create texture on first render
    if (!shippingLabelTextureRef.current && shippingLabelCanvasRef.current) {
      shippingLabelTextureRef.current = new THREE.CanvasTexture(shippingLabelCanvasRef.current);
    }
  }, [state]);

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
      setShippingLabelLines([]);
      setShippingLabelStart(null);
      setCameraRotationStart(null);
      setCameraRotationComplete(false);
      setContainerRotationStart(null);
      setContainerRotationComplete(false);
      setTargetRotation(0);
      dottedWireframeMaterial.opacity = 0.7;
      solidWireframeMaterial.opacity = 1.0;
      solidWireframeMaterial.transparent = false;
      // Camera: Move to 45° off left door to see crate entering
      setCameraPhase('buildStart');
    } else if (state === 'ready') {
      // Ready state: same as building but doors closed
      setUsesDottedMaterial(true);
      setCrateState('idle');
      setDoorState('closed');
      setIdleAnimationStart(null);
      dottedWireframeMaterial.opacity = 1.0;
      // Camera: Return to default free roam
      setCameraPhase('default');
    } else if (state === 'running') {
      // Running state: fade from black to blue, start container rotation
      setUsesDottedMaterial(false);
      setCrateState('floating');
      setDoorState('closed');
      setIdleAnimationStart(null);
      setRunningFadeStart(Date.now());
      // Start container rotation animation to expose right wall
      setContainerRotationStart(Date.now());
      setContainerRotationComplete(false);
      // Target rotation: -45° (Math.PI / 4) to expose right wall
      setTargetRotation(-Math.PI / 4);
      // Camera will move after rotation completes
    } else if (state === 'error') {
      // Error state: camera rotates to door side, doors open with black fill
      setUsesDottedMaterial(false);
      setCrateState('floating');
      setDoorState('open');
      setIdleAnimationStart(null);
      setErrorCameraStart(Date.now());
      // Camera: Error state uses default
      setCameraPhase('default');
    } else {
      setUsesDottedMaterial(false);
      setCrateState('floating');
      setDoorState('closed');
      setIdleAnimationStart(null);
      setCameraPhase('default');
    }
  }, [state, dottedWireframeMaterial, solidWireframeMaterial, setCameraPhase]);

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
        const fadeDuration = 0.3; // Each wall fades in over 0.3 seconds (2x faster)
        const delayBetween = 0.1; // 0.1 second delay between each wall (2x faster)

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
          // Camera: Move to front view of doors to watch them close
          setCameraPhase('doorsClosing');
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
      // Running state: smooth rotation to expose right wall, then STOP at 45°
      if (containerRef.current) {
        // Smooth rotation from front (0°) to right wall exposed (-45°)
        if (containerRotationStart !== null && !containerRotationComplete) {
          const rotationElapsed = (Date.now() - containerRotationStart) / 1000;
          const rotationDuration = 1.5; // 1.5 second smooth rotation
          const rotationProgress = Math.min(rotationElapsed / rotationDuration, 1.0);

          // Ease out cubic for smooth deceleration
          const eased = 1 - Math.pow(1 - rotationProgress, 3);

          // Interpolate from 0 to targetRotation (-π/4)
          const startRotation = 0;
          containerRef.current.rotation.y = startRotation + (targetRotation - startRotation) * eased;

          // Mark rotation complete and trigger camera move + shipping label
          if (rotationProgress >= 1.0) {
            setContainerRotationComplete(true);
            // Lock rotation at target angle
            containerRef.current.rotation.y = targetRotation;
            // Now move camera to right 45° angle
            setCameraPhase('runningRotate');
            // Start shipping label text animation
            if (shippingLabelStart === null) {
              setShippingLabelStart(Date.now());
            }
          }
        }
        // After rotation complete, HOLD at 45° (no continuous rotation)
        else if (containerRotationComplete) {
          containerRef.current.rotation.y = targetRotation;
        }

        containerRef.current.scale.setScalar(1.0);
      }

      // Keep walls BLACK - no color fade
      wallMaterial.color.setHex(0x000000);
      wallMaterial.opacity = 1.0;
      wallMaterial.needsUpdate = true;

      // Shipping label text animation on right wall
      if (shippingLabelStart !== null) {
        const elapsed = (Date.now() - shippingLabelStart) / 1000;
        const charsPerSecond = 30; // Same speed as terminal

        // Structure: title + label/value pairs matching Figma design
        const title = 'nginx : latest';
        const labelValuePairs = [
          { label: 'Status:', value: 'Running' },
          { label: 'Ports:', value: '80:8080/tcp' },
          { label: 'Network:', value: 'bridge' },
          { label: 'Created:', value: '2025-11-05' },
          { label: 'Platform:', value: 'linux/amd64' },
        ];

        // Calculate typing animation progress
        const totalChars = title.length + labelValuePairs.reduce((sum, pair) =>
          sum + pair.label.length + pair.value.length, 0);
        const targetCharCount = Math.min(Math.floor(elapsed * charsPerSecond), totalChars);

        // Determine what should be visible
        let charsRemaining = targetCharCount;
        let visibleTitle = '';
        const visiblePairs: Array<{label: string; value: string}> = [];

        // Title first
        if (charsRemaining > 0) {
          visibleTitle = title.substring(0, Math.min(charsRemaining, title.length));
          charsRemaining -= visibleTitle.length;
        }

        // Then label/value pairs
        for (const pair of labelValuePairs) {
          if (charsRemaining <= 0) break;

          let visibleLabel = '';
          let visibleValue = '';

          // Show label first
          if (charsRemaining > 0) {
            visibleLabel = pair.label.substring(0, Math.min(charsRemaining, pair.label.length));
            charsRemaining -= visibleLabel.length;
          }

          // Then show value
          if (charsRemaining > 0 && visibleLabel.length === pair.label.length) {
            visibleValue = pair.value.substring(0, Math.min(charsRemaining, pair.value.length));
            charsRemaining -= visibleValue.length;
          }

          if (visibleLabel.length > 0) {
            visiblePairs.push({ label: visibleLabel, value: visibleValue });
          }
        }

        // Update canvas texture
        const canvas = shippingLabelCanvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
          // Clear canvas
          ctx.fillStyle = 'rgba(0, 0, 0, 0)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Draw title - large size, aligned to upper left
          if (visibleTitle.length > 0) {
            ctx.fillStyle = '#b3b3b3'; // Gray per Figma
            ctx.font = 'bold 120px Inter, Arial, sans-serif';
            ctx.textBaseline = 'top';
            ctx.fillText(visibleTitle, 50, 50);
          }

          // Draw label/value pairs - large size to fill green box
          if (visiblePairs.length > 0) {
            ctx.fillStyle = '#b3b3b3';
            ctx.font = '60px Inter, Arial, sans-serif';

            const startY = 230; // Below title
            const lineHeight = 90; // Proportional spacing
            const labelX = 50;
            const valueX = 450; // Offset for value column

            visiblePairs.forEach((pair, index) => {
              const y = startY + index * lineHeight;
              ctx.fillText(pair.label, labelX, y);
              if (pair.value.length > 0) {
                ctx.fillText(pair.value, valueX, y);
              }
            });
          }

          if (shippingLabelTextureRef.current) {
            shippingLabelTextureRef.current.needsUpdate = true;
          }
        }
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
            // Camera: Hold front view to watch terminal text on left door
            setCameraPhase('terminal');
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

      {/* Shipping label on right wall - canvas texture applied to wall surface */}
      {state === 'running' && shippingLabelStart !== null && shippingLabelTextureRef.current && (
        <mesh position={[3.01, 3.5, 2]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[4, 3]} />
          <meshBasicMaterial map={shippingLabelTextureRef.current} transparent side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Ground plane - hidden */}
    </group>
  );
}
