/**
 * Container Visualization Lighting Setup
 *
 * Factory functions for creating lighting configurations used in the container visualization.
 * Implements a three-light setup with state-dependent accent lighting.
 *
 * @see /docs/design-system/CONTAINER_VISUAL_STYLE_GUIDE.md
 */

import * as THREE from 'three';
import { CONTAINER_COLORS, type ContainerState, getStateColor } from './container-colors';

/**
 * Lighting configuration options
 */
export interface LightingConfig {
  /**
   * Enable shadow casting (performance impact)
   * @default true
   */
  enableShadows?: boolean;

  /**
   * Shadow map resolution
   * @default 2048
   */
  shadowMapSize?: number;

  /**
   * Initial container state for accent light color
   * @default 'ready'
   */
  initialState?: ContainerState;
}

/**
 * Container for all scene lights
 */
export interface SceneLights {
  ambient: THREE.AmbientLight;
  key: THREE.DirectionalLight;
  rim: THREE.DirectionalLight;
  accent: THREE.PointLight;
}

/**
 * Create complete three-light setup for container scene
 *
 * Lighting setup:
 * 1. Ambient Light: Base illumination (40% intensity)
 * 2. Key Light: Main directional light from upper-right (100% intensity)
 * 3. Rim Light: Back-left edge lighting with cool blue tint (50% intensity)
 * 4. Accent Light: State-dependent point light from above (80% intensity)
 *
 * @param config - Optional lighting configuration
 * @returns Object containing all scene lights
 */
export function createSceneLighting(config?: LightingConfig): SceneLights {
  const {
    enableShadows = true,
    shadowMapSize = 2048,
    initialState = 'ready',
  } = config ?? {};

  // 1. Ambient Light - base illumination
  const ambientLight = new THREE.AmbientLight(
    0x404040, // Neutral grey
    0.4 // 40% intensity - subtle fill
  );

  // 2. Key Light - main directional light
  const keyLight = new THREE.DirectionalLight(
    0xffffff, // White light
    1.0 // 100% intensity
  );
  keyLight.position.set(5, 8, 5);

  if (enableShadows) {
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = shadowMapSize;
    keyLight.shadow.mapSize.height = shadowMapSize;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 50;
    keyLight.shadow.camera.left = -10;
    keyLight.shadow.camera.right = 10;
    keyLight.shadow.camera.top = 10;
    keyLight.shadow.camera.bottom = -10;
  }

  // 3. Rim Light - back lighting for edges
  const rimLight = new THREE.DirectionalLight(
    0x7fa1c3, // Cool blue tint
    0.5 // 50% intensity
  );
  rimLight.position.set(-5, 3, -5);

  // 4. Accent Light - state-dependent point light
  const accentLight = new THREE.PointLight(
    getStateColor(initialState),
    0.8, // 80% intensity (will be animated)
    20, // Distance
    2 // Decay
  );
  accentLight.position.set(0, 5, 0);

  return {
    ambient: ambientLight,
    key: keyLight,
    rim: rimLight,
    accent: accentLight,
  };
}

/**
 * Add all lights to a scene
 *
 * @param scene - Three.js scene
 * @param lights - Scene lights to add
 */
export function addLightsToScene(scene: THREE.Scene, lights: SceneLights): void {
  scene.add(lights.ambient);
  scene.add(lights.key);
  scene.add(lights.rim);
  scene.add(lights.accent);
}

/**
 * Update accent light for container state change
 *
 * @param accentLight - Point light to update
 * @param state - New container state
 */
export function updateAccentLightForState(
  accentLight: THREE.PointLight,
  state: ContainerState
): void {
  accentLight.color.setHex(getStateColor(state));

  // Adjust intensity based on state
  switch (state) {
    case 'building':
      accentLight.intensity = 0.8; // Will pulse 0.5-1.0
      break;
    case 'ready':
      accentLight.intensity = 0.5;
      break;
    case 'running':
      accentLight.intensity = 0.7;
      break;
    case 'error':
      accentLight.intensity = 0.9; // Brighter for errors
      break;
  }
}

/**
 * Animate accent light intensity for building state (pulsing effect)
 *
 * @param accentLight - Point light to animate
 * @param time - Elapsed time in seconds
 */
export function animateBuildingLight(
  accentLight: THREE.PointLight,
  time: number
): void {
  // Pulse from 0.5 to 1.0
  const pulseIntensity = 0.75 + Math.sin(time * 2.0) * 0.25;
  accentLight.intensity = pulseIntensity;
}

/**
 * Animate accent light for running state (subtle flicker)
 *
 * @param accentLight - Point light to animate
 * @param frameCount - Current frame count
 */
export function animateRunningLight(
  accentLight: THREE.PointLight,
  frameCount: number
): void {
  // Flicker every 100 frames (~1.67 seconds at 60fps)
  if (frameCount % 100 === 0) {
    const flicker = 0.6 + Math.random() * 0.2; // 0.6 to 0.8
    accentLight.intensity = flicker;
  }
}

/**
 * Configure renderer shadow settings
 *
 * @param renderer - Three.js WebGL renderer
 * @param config - Optional shadow configuration
 */
export function configureShadows(
  renderer: THREE.WebGLRenderer,
  config?: {
    enabled?: boolean;
    type?: THREE.ShadowMapType;
  }
): void {
  const { enabled = true, type = THREE.PCFSoftShadowMap } = config ?? {};

  renderer.shadowMap.enabled = enabled;
  if (enabled) {
    renderer.shadowMap.type = type;
  }
}

/**
 * Create helper visualizations for lights (debug mode)
 *
 * @param lights - Scene lights
 * @returns Array of light helpers
 */
export function createLightHelpers(lights: SceneLights): THREE.Object3D[] {
  const helpers: THREE.Object3D[] = [];

  // Directional light helpers
  const keyHelper = new THREE.DirectionalLightHelper(lights.key, 1);
  const rimHelper = new THREE.DirectionalLightHelper(lights.rim, 1);

  // Point light helper
  const accentHelper = new THREE.PointLightHelper(lights.accent, 0.5);

  helpers.push(keyHelper, rimHelper, accentHelper);
  return helpers;
}

/**
 * Create lighting preset for specific mood
 */
export const LightingPresets = {
  /**
   * Standard three-light setup (default)
   */
  standard: (config?: LightingConfig) => createSceneLighting(config),

  /**
   * High-key lighting (brighter, less contrast)
   */
  highKey: (config?: LightingConfig): SceneLights => {
    const lights = createSceneLighting(config);
    lights.ambient.intensity = 0.6; // Brighter ambient
    lights.key.intensity = 0.8; // Softer key
    lights.rim.intensity = 0.4; // Softer rim
    return lights;
  },

  /**
   * Low-key lighting (darker, more dramatic)
   */
  lowKey: (config?: LightingConfig): SceneLights => {
    const lights = createSceneLighting(config);
    lights.ambient.intensity = 0.2; // Darker ambient
    lights.key.intensity = 1.2; // Harder key
    lights.rim.intensity = 0.6; // Stronger rim
    return lights;
  },

  /**
   * Dramatic lighting (high contrast, strong shadows)
   */
  dramatic: (config?: LightingConfig): SceneLights => {
    const lights = createSceneLighting(config);
    lights.ambient.intensity = 0.1; // Minimal ambient
    lights.key.intensity = 1.5; // Very bright key
    lights.rim.intensity = 0.8; // Strong rim
    lights.accent.intensity = 1.0; // Bright accent
    return lights;
  },
} as const;

/**
 * Lighting state manager for easy updates
 */
export class LightingManager {
  private lights: SceneLights;
  private currentState: ContainerState = 'ready';
  private frameCount = 0;

  constructor(lights: SceneLights) {
    this.lights = lights;
  }

  /**
   * Update lighting for new container state
   */
  setState(state: ContainerState): void {
    if (this.currentState !== state) {
      this.currentState = state;
      updateAccentLightForState(this.lights.accent, state);
    }
  }

  /**
   * Update lighting in render loop
   * @param time - Elapsed time in seconds
   */
  update(time: number): void {
    this.frameCount++;

    switch (this.currentState) {
      case 'building':
        animateBuildingLight(this.lights.accent, time);
        break;
      case 'running':
        animateRunningLight(this.lights.accent, this.frameCount);
        break;
      // 'ready' and 'error' states have static lighting
    }
  }

  /**
   * Get current container state
   */
  getState(): ContainerState {
    return this.currentState;
  }

  /**
   * Get scene lights
   */
  getLights(): SceneLights {
    return this.lights;
  }

  /**
   * Reset frame counter (call on state change if needed)
   */
  resetFrameCount(): void {
    this.frameCount = 0;
  }
}

/**
 * Calculate optimal light position based on camera
 *
 * @param camera - Scene camera
 * @param offset - Position offset from camera
 * @returns Calculated light position
 */
export function calculateLightPosition(
  camera: THREE.Camera,
  offset: THREE.Vector3
): THREE.Vector3 {
  const position = camera.position.clone();
  position.add(offset);
  return position;
}

/**
 * Create environment lighting (hemisphere light alternative)
 *
 * @returns Hemisphere light for outdoor/sky lighting
 */
export function createEnvironmentLight(): THREE.HemisphereLight {
  return new THREE.HemisphereLight(
    0x87ceeb, // Sky color (sky blue)
    0x444444, // Ground color (dark grey)
    0.5 // Intensity
  );
}
