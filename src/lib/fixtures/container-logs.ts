import { LogEntry } from '@/types/docker';

/**
 * Mock container logs for demonstration purposes
 *
 * TODO: Replace with real Docker Desktop API
 * Real API: window.dockerDesktopAPI.containers.logs(containerId)
 * Real API returns a stream of log entries
 *
 * These fixtures simulate typical application logs during startup
 * and runtime operations.
 */

export const MOCK_LOGS: LogEntry[] = [
  {
    id: 'log-001',
    timestamp: new Date('2025-11-05T10:00:00Z'),
    level: 'info',
    message: 'Container starting...',
    source: 'docker',
  },
  {
    id: 'log-002',
    timestamp: new Date('2025-11-05T10:00:01Z'),
    level: 'info',
    message: 'Initializing application environment',
    source: 'app',
  },
  {
    id: 'log-003',
    timestamp: new Date('2025-11-05T10:00:02Z'),
    level: 'info',
    message: 'Loading configuration from /etc/config.json',
    source: 'app',
  },
  {
    id: 'log-004',
    timestamp: new Date('2025-11-05T10:00:03Z'),
    level: 'debug',
    message: 'Database connection pool initialized (max: 10)',
    source: 'database',
  },
  {
    id: 'log-005',
    timestamp: new Date('2025-11-05T10:00:04Z'),
    level: 'info',
    message: 'Connected to database at postgres://db:5432/myapp',
    source: 'database',
  },
  {
    id: 'log-006',
    timestamp: new Date('2025-11-05T10:00:05Z'),
    level: 'info',
    message: 'Starting HTTP server on port 3000',
    source: 'server',
  },
  {
    id: 'log-007',
    timestamp: new Date('2025-11-05T10:00:06Z'),
    level: 'info',
    message: '✓ Server ready at http://localhost:3000',
    source: 'server',
  },
  {
    id: 'log-008',
    timestamp: new Date('2025-11-05T10:00:10Z'),
    level: 'info',
    message: 'GET /health 200 - 2ms',
    source: 'server',
  },
  {
    id: 'log-009',
    timestamp: new Date('2025-11-05T10:00:15Z'),
    level: 'info',
    message: 'GET /api/users 200 - 45ms',
    source: 'server',
  },
  {
    id: 'log-010',
    timestamp: new Date('2025-11-05T10:00:20Z'),
    level: 'warn',
    message: 'Rate limit approaching: 85/100 requests in last minute',
    source: 'middleware',
  },
  {
    id: 'log-011',
    timestamp: new Date('2025-11-05T10:00:25Z'),
    level: 'error',
    message: 'POST /api/data 500 - Database query timeout',
    source: 'server',
  },
  {
    id: 'log-012',
    timestamp: new Date('2025-11-05T10:00:26Z'),
    level: 'warn',
    message: 'Retrying failed database operation (attempt 1/3)',
    source: 'database',
  },
  {
    id: 'log-013',
    timestamp: new Date('2025-11-05T10:00:27Z'),
    level: 'info',
    message: 'POST /api/data 200 - 120ms (retry successful)',
    source: 'server',
  },
];

/**
 * Generate a new log entry with current timestamp
 */
export function generateMockLog(
  level: 'info' | 'warn' | 'error' | 'debug',
  message: string,
  source: string = 'app'
): LogEntry {
  return {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    level,
    message,
    source,
  };
}

/**
 * Simulate streaming logs with realistic messages
 */
export function* streamingLogGenerator(): Generator<LogEntry> {
  const messages = [
    { level: 'info' as const, msg: 'Processing incoming request...', source: 'server' },
    { level: 'debug' as const, msg: 'Cache miss for key: user_123', source: 'cache' },
    { level: 'info' as const, msg: 'Database query executed in 23ms', source: 'database' },
    { level: 'info' as const, msg: 'Response sent successfully', source: 'server' },
    { level: 'warn' as const, msg: 'Slow query detected (>100ms)', source: 'monitor' },
    { level: 'error' as const, msg: 'Connection timeout to external service', source: 'api' },
    { level: 'info' as const, msg: 'Request completed in 156ms', source: 'server' },
  ];

  let index = 0;
  while (true) {
    const { level, msg, source } = messages[index % messages.length];
    yield generateMockLog(level, msg, source);
    index++;
  }
}

/**
 * Get logs for a specific log level
 */
export function getLogsByLevel(level: 'info' | 'warn' | 'error' | 'debug'): LogEntry[] {
  return MOCK_LOGS.filter(log => log.level === level);
}

/**
 * Get logs for a specific source
 */
export function getLogsBySource(source: string): LogEntry[] {
  return MOCK_LOGS.filter(log => log.source === source);
}

/**
 * Error scenario logs
 */
export const ERROR_SCENARIO_LOGS: LogEntry[] = [
  {
    id: 'err-001',
    timestamp: new Date(),
    level: 'error',
    message: 'FATAL: Port 3000 is already in use',
    source: 'docker',
  },
  {
    id: 'err-002',
    timestamp: new Date(),
    level: 'error',
    message: 'Cannot bind to address: Address already in use',
    source: 'docker',
  },
  {
    id: 'err-003',
    timestamp: new Date(),
    level: 'error',
    message: 'Container exited with code 1',
    source: 'docker',
  },
];
