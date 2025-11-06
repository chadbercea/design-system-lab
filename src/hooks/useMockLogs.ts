'use client';

import { useState, useEffect } from 'react';
import { LogEntry } from '@/types/docker';
import { createLogStream } from '@/lib/mock-docker-api';

/**
 * Hook to simulate streaming logs from a container
 *
 * TODO: Replace with real Docker Desktop API stream
 * Real API: useDockerLogs(containerId) or similar
 *
 * This hook demonstrates real-time log streaming behavior
 * that matches what the real Docker API would provide.
 */

export interface UseMockLogsOptions {
  containerId: string | null;
  enabled?: boolean;
  maxLogs?: number; // Limit number of logs kept in memory
}

export function useMockLogs({
  containerId,
  enabled = true,
  maxLogs = 1000,
}: UseMockLogsOptions) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!containerId || !enabled) {
      setIsStreaming(false);
      return;
    }

    setIsStreaming(true);
    setError(null);

    // Simulate API delay before starting stream
    const startDelay = setTimeout(() => {
      try {
        const cleanup = createLogStream(containerId, (newLog) => {
          setLogs((prevLogs) => {
            const updated = [...prevLogs, newLog];
            // Limit logs in memory
            if (updated.length > maxLogs) {
              return updated.slice(updated.length - maxLogs);
            }
            return updated;
          });
        });

        // Cleanup on unmount or when dependencies change
        return () => {
          cleanup();
          setIsStreaming(false);
        };
      } catch (err) {
        setError(err as Error);
        setIsStreaming(false);
      }
    }, 300);

    return () => clearTimeout(startDelay);
  }, [containerId, enabled, maxLogs]);

  const clearLogs = () => {
    setLogs([]);
  };

  const filterLogs = (level?: 'info' | 'warn' | 'error' | 'debug') => {
    if (!level) return logs;
    return logs.filter((log) => log.level === level);
  };

  return {
    logs,
    isStreaming,
    error,
    clearLogs,
    filterLogs,
  };
}
