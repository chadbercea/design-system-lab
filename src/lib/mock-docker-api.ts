/**
 * Mock Docker API
 *
 * This file simulates Docker Desktop API calls for prototype purposes.
 * All functions are clearly marked with TODO comments for real integration.
 *
 * IMPORTANT: Do NOT use this in production. This is prototype code only.
 */

import { DockerImage, ContainerStatus, ContainerConfig, LogEntry, ContainerStats } from '@/types/docker';
import { MOCK_IMAGES, SAMPLE_IMAGE } from './fixtures/docker-images';
import { MOCK_LOGS, ERROR_SCENARIO_LOGS, generateMockLog } from './fixtures/container-logs';
import { generateMockStats, generateBuildingStats, generateIdleStats } from './fixtures/container-stats';

// Simulate realistic API delays
const API_DELAY_MIN = 100;
const API_DELAY_MAX = 500;
const BUILD_DELAY_MIN = 15000; // 15 seconds
const BUILD_DELAY_MAX = 30000; // 30 seconds

function randomDelay(min: number = API_DELAY_MIN, max: number = API_DELAY_MAX): Promise<void> {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Fetch user's Docker Hub images
 *
 * TODO: Replace with Docker Desktop API call
 * Real API: window.dockerDesktopAPI.images.list()
 * Expected response: Array<DockerImage>
 * Error handling: Network errors, authentication failures
 */
export async function fetchImages(): Promise<DockerImage[]> {
  await randomDelay();

  // Simulate occasional network error (5% chance)
  if (Math.random() < 0.05) {
    throw new Error('Failed to fetch images: Network error');
  }

  return [...MOCK_IMAGES, SAMPLE_IMAGE];
}

/**
 * Run a container from selected image
 *
 * TODO: Replace with Docker Desktop API call
 * Real API: window.dockerDesktopAPI.containers.run(image, config)
 * Expected response: { containerId: string, state: ContainerStatus }
 * Error handling: Port conflicts, image not found, resource limits
 */
export async function runContainer(
  image: DockerImage,
  config?: ContainerConfig
): Promise<{ containerId: string; status: ContainerStatus }> {
  await randomDelay();

  // Simulate port conflict error (10% chance)
  if (config?.ports && Math.random() < 0.1) {
    throw new Error(`Port ${config.ports[0].hostPort} is already in use`);
  }

  const containerId = `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Simulate building state
  return {
    containerId,
    status: 'building',
  };
}

/**
 * Stop a running container
 *
 * TODO: Replace with Docker Desktop API call
 * Real API: window.dockerDesktopAPI.containers.stop(containerId)
 * Expected response: void
 * Error handling: Container not found, already ready
 */
export async function stopContainer(containerId: string): Promise<void> {
  await randomDelay();

  // Simulate container not found error (5% chance)
  if (Math.random() < 0.05) {
    throw new Error(`Container ${containerId} not found`);
  }

  // Success - no return value
}

/**
 * Get container logs
 *
 * TODO: Replace with Docker Desktop API call
 * Real API: window.dockerDesktopAPI.containers.logs(containerId)
 * Expected response: Array<LogEntry> or Stream<LogEntry>
 * Error handling: Container not found, permission denied
 */
export async function getContainerLogs(containerId: string): Promise<LogEntry[]> {
  await randomDelay();

  // Simulate container not found error (5% chance)
  if (Math.random() < 0.05) {
    throw new Error(`Container ${containerId} not found`);
  }

  return MOCK_LOGS;
}

/**
 * Get container stats (CPU, memory, network)
 *
 * TODO: Replace with Docker Desktop API call
 * Real API: window.dockerDesktopAPI.containers.stats(containerId)
 * Expected response: ContainerStats or Stream<ContainerStats>
 * Error handling: Container not found, not running
 */
export async function getContainerStats(containerId: string): Promise<ContainerStats> {
  await randomDelay(50, 200); // Faster for real-time updates

  // Simulate container not running error (5% chance)
  if (Math.random() < 0.05) {
    throw new Error(`Container ${containerId} is not running`);
  }

  return generateMockStats();
}

/**
 * Simulate container lifecycle: building -> running
 * This is a mock helper to demonstrate state transitions
 *
 * TODO: Remove this - real API will emit state change events
 * Real API: window.dockerDesktopAPI.containers.subscribe(containerId, callback)
 */
export async function simulateContainerStartup(
  containerId: string,
  onStatusChange: (status: ContainerStatus) => void
): Promise<void> {
  // Building phase (15-30 seconds)
  onStatusChange('building');
  const buildTime = Math.random() * (BUILD_DELAY_MAX - BUILD_DELAY_MIN) + BUILD_DELAY_MIN;
  await new Promise(resolve => setTimeout(resolve, buildTime));

  // Simulate build failure (10% chance)
  if (Math.random() < 0.1) {
    onStatusChange('error');
    return;
  }

  // Running phase
  onStatusChange('running');
}

/**
 * Check if a port is available
 *
 * TODO: Replace with Docker Desktop API call
 * Real API: window.dockerDesktopAPI.ports.check(port)
 * Expected response: boolean
 */
export async function checkPortAvailable(port: number): Promise<boolean> {
  await randomDelay(50, 150);

  // Common ports are more likely to be in use
  const commonPorts = [3000, 8080, 80, 443, 5432, 3306, 27017, 6379];
  if (commonPorts.includes(port)) {
    return Math.random() > 0.3; // 30% chance of conflict
  }

  return Math.random() > 0.05; // 5% chance of conflict otherwise
}

/**
 * Get container inspect details
 *
 * TODO: Replace with Docker Desktop API call
 * Real API: window.dockerDesktopAPI.containers.inspect(containerId)
 * Expected response: Detailed container information
 */
export async function inspectContainer(containerId: string): Promise<{
  id: string;
  name: string;
  image: string;
  status: ContainerStatus;
  config: ContainerConfig;
  created: Date;
}> {
  await randomDelay();

  return {
    id: containerId,
    name: `container-${containerId.split('-')[1]}`,
    image: 'nginx:latest',
    status: 'running',
    config: {
      ports: [{ containerPort: 80, hostPort: 8080 }],
      environment: { NODE_ENV: 'development' },
      volumes: [],
    },
    created: new Date(),
  };
}

/**
 * Error scenario: Simulate port conflict
 * Returns logs that indicate port is already in use
 */
export function getPortConflictLogs(): LogEntry[] {
  return ERROR_SCENARIO_LOGS;
}

/**
 * Mock WebSocket/Stream for real-time log updates
 * This simulates streaming logs as they would come from Docker
 *
 * TODO: Replace with Docker Desktop API stream
 * Real API: window.dockerDesktopAPI.containers.logsStream(containerId)
 */
export function createLogStream(
  containerId: string,
  onLog: (log: LogEntry) => void
): () => void {
  const messages = [
    'Processing request...',
    'Database query executed',
    'Cache updated',
    'Response sent',
    'Metrics recorded',
  ];

  let index = 0;
  const interval = setInterval(() => {
    const message = messages[index % messages.length];
    const level = Math.random() > 0.9 ? 'warn' : 'info';
    onLog(generateMockLog(level as 'info' | 'warn', message, 'app'));
    index++;
  }, 2000); // New log every 2 seconds

  // Return cleanup function
  return () => clearInterval(interval);
}

/**
 * Mock WebSocket/Stream for real-time stats updates
 * This simulates streaming stats as they would come from Docker
 *
 * TODO: Replace with Docker Desktop API stream
 * Real API: window.dockerDesktopAPI.containers.statsStream(containerId)
 */
export function createStatsStream(
  containerId: string,
  status: ContainerStatus,
  onStats: (stats: ContainerStats) => void
): () => void {
  const interval = setInterval(() => {
    let stats: ContainerStats;
    switch (status) {
      case 'building':
        stats = generateBuildingStats();
        break;
      case 'ready':
      case 'error':
        stats = generateIdleStats();
        break;
      default:
        stats = generateMockStats();
    }
    onStats(stats);
  }, 2000); // Update every 2 seconds

  // Return cleanup function
  return () => clearInterval(interval);
}
