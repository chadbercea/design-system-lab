import { ContainerStats } from '@/types/docker';

/**
 * Mock container stats for demonstration purposes
 *
 * TODO: Replace with real Docker Desktop API
 * Real API: window.dockerDesktopAPI.containers.stats(containerId)
 * Real API returns a stream of stats updated every 1-2 seconds
 *
 * These fixtures simulate realistic container resource usage
 * with natural variations over time.
 */

/**
 * Generate realistic mock container stats
 * Stats vary naturally to simulate real container behavior
 */
export function generateMockStats(): ContainerStats {
  const baseMemory = 256 * 1024 * 1024; // 256 MB base
  const memoryVariation = (Math.random() - 0.5) * 0.2; // ±10%
  const memoryUsage = Math.floor(baseMemory * (1 + memoryVariation));

  const baseCpu = 15; // 15% base
  const cpuVariation = (Math.random() - 0.5) * 30; // ±15%
  const cpuPercent = Math.max(0, Math.min(100, baseCpu + cpuVariation));

  return {
    cpuPercent: Math.round(cpuPercent * 10) / 10, // Round to 1 decimal
    memoryUsage,
    memoryLimit: 1024 * 1024 * 1024, // 1 GB limit
    networkRx: Math.floor(Math.random() * 100000) + 50000, // 50-150 KB
    networkTx: Math.floor(Math.random() * 50000) + 10000, // 10-60 KB
  };
}

/**
 * Generate stats for a building/starting container
 * Higher CPU, lower memory initially
 */
export function generateBuildingStats(): ContainerStats {
  return {
    cpuPercent: Math.round((40 + Math.random() * 30) * 10) / 10, // 40-70%
    memoryUsage: Math.floor((128 + Math.random() * 64) * 1024 * 1024), // 128-192 MB
    memoryLimit: 1024 * 1024 * 1024,
    networkRx: Math.floor(Math.random() * 500000) + 200000, // High during pull
    networkTx: Math.floor(Math.random() * 100000) + 50000,
  };
}

/**
 * Generate stats for an idle/stopped container
 * Minimal resource usage
 */
export function generateIdleStats(): ContainerStats {
  return {
    cpuPercent: 0,
    memoryUsage: 0,
    memoryLimit: 1024 * 1024 * 1024,
    networkRx: 0,
    networkTx: 0,
  };
}

/**
 * Generate stats for a container under heavy load
 * High CPU and memory
 */
export function generateHeavyLoadStats(): ContainerStats {
  return {
    cpuPercent: Math.round((75 + Math.random() * 20) * 10) / 10, // 75-95%
    memoryUsage: Math.floor((700 + Math.random() * 200) * 1024 * 1024), // 700-900 MB
    memoryLimit: 1024 * 1024 * 1024,
    networkRx: Math.floor(Math.random() * 1000000) + 500000, // High throughput
    networkTx: Math.floor(Math.random() * 800000) + 400000,
  };
}

/**
 * Generate a time series of stats for visualization
 * Useful for histogram/chart components
 */
export function generateStatsTimeSeries(
  duration: number = 60, // seconds
  interval: number = 2 // sample every 2 seconds
): Array<{ timestamp: Date; stats: ContainerStats }> {
  const series: Array<{ timestamp: Date; stats: ContainerStats }> = [];
  const now = Date.now();
  const samples = Math.floor(duration / interval);

  for (let i = 0; i < samples; i++) {
    const timestamp = new Date(now - (samples - i) * interval * 1000);

    // Simulate varying load over time
    const timeProgress = i / samples;
    let stats: ContainerStats;

    if (timeProgress < 0.2) {
      // Starting phase - high CPU
      stats = generateBuildingStats();
    } else if (timeProgress > 0.8) {
      // Heavy load phase
      stats = generateHeavyLoadStats();
    } else {
      // Normal operation
      stats = generateMockStats();
    }

    series.push({ timestamp, stats });
  }

  return series;
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${Math.round(size * 10) / 10} ${units[unitIndex]}`;
}

/**
 * Format memory usage as percentage
 */
export function formatMemoryPercent(usage: number, limit: number): string {
  const percent = (usage / limit) * 100;
  return `${Math.round(percent * 10) / 10}%`;
}

/**
 * Sample baseline stats for different container states
 */
export const BASELINE_STATS = {
  idle: generateIdleStats(),
  normal: generateMockStats(),
  building: generateBuildingStats(),
  heavyLoad: generateHeavyLoadStats(),
};
