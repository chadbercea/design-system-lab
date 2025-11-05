// Docker-related types for the application

export interface DockerImage {
  id: string;
  name: string;
  tag: string;
  repository: string;
  size?: number;
  created?: Date;
}

export type ContainerStatus =
  | 'building'
  | 'running'
  | 'stopped'
  | 'error';

export interface ContainerConfig {
  ports: PortMapping[];
  environment: Record<string, string>;
  volumes: VolumeMapping[];
}

export interface PortMapping {
  containerPort: number;
  hostPort: number;
  protocol?: 'tcp' | 'udp';
  status?: 'working' | 'failed' | 'pending';
}

export interface VolumeMapping {
  hostPath: string;
  containerPath: string;
  readOnly?: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  source?: string;
}

export interface HistogramEvent {
  id: string;
  timestamp: Date;
  type: 'http' | 'db' | 'cache' | 'custom';
  duration: number;
  status: 'success' | 'error';
  metadata?: Record<string, unknown>;
}

export interface ContainerStats {
  cpuPercent: number;
  memoryUsage: number;
  memoryLimit: number;
  networkRx: number;
  networkTx: number;
}
