'use client';

import { useState, useEffect } from 'react';
import { HistogramEvent } from '@/types/docker';

/**
 * Hook to simulate histogram events (HTTP requests, DB queries, etc.)
 *
 * TODO: Replace with real Docker Desktop API or telemetry stream
 * Real API: useDockerTelemetry(containerId) or similar
 *
 * This hook demonstrates real-time histogram/telemetry data
 * that would come from application instrumentation or Docker logs.
 */

export interface UseMockHistogramOptions {
  containerId: string | null;
  enabled?: boolean;
  maxEvents?: number; // Limit number of events kept in memory
  interval?: number; // How often to generate events (ms)
}

function generateRandomEvent(): HistogramEvent {
  const types: Array<'http' | 'db' | 'cache' | 'custom'> = ['http', 'db', 'cache', 'custom'];
  const type = types[Math.floor(Math.random() * types.length)];

  // Different duration ranges for different event types
  let duration: number;
  switch (type) {
    case 'http':
      duration = Math.random() * 500 + 50; // 50-550ms
      break;
    case 'db':
      duration = Math.random() * 300 + 20; // 20-320ms
      break;
    case 'cache':
      duration = Math.random() * 50 + 1; // 1-51ms
      break;
    default:
      duration = Math.random() * 200 + 10; // 10-210ms
  }

  // Occasional errors (10% chance)
  const status = Math.random() > 0.9 ? 'error' : 'success';

  return {
    id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    type,
    duration: Math.round(duration),
    status,
    metadata: {
      endpoint: type === 'http' ? `/api/${['users', 'posts', 'data'][Math.floor(Math.random() * 3)]}` : undefined,
      query: type === 'db' ? `SELECT_${Math.floor(Math.random() * 100)}` : undefined,
    },
  };
}

export function useMockHistogram({
  containerId,
  enabled = true,
  maxEvents = 500,
  interval = 3000, // New event every 3 seconds by default
}: UseMockHistogramOptions) {
  const [events, setEvents] = useState<HistogramEvent[]>([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!containerId || !enabled) {
      setIsActive(false);
      return;
    }

    setIsActive(true);

    const eventInterval = setInterval(() => {
      // Generate 1-3 events at a time (burst behavior)
      const eventCount = Math.floor(Math.random() * 3) + 1;
      const newEvents = Array.from({ length: eventCount }, generateRandomEvent);

      setEvents((prevEvents) => {
        const updated = [...prevEvents, ...newEvents];
        // Limit events in memory
        if (updated.length > maxEvents) {
          return updated.slice(updated.length - maxEvents);
        }
        return updated;
      });
    }, interval);

    return () => {
      clearInterval(eventInterval);
      setIsActive(false);
    };
  }, [containerId, enabled, maxEvents, interval]);

  const clearEvents = () => {
    setEvents([]);
  };

  const filterByType = (type: 'http' | 'db' | 'cache' | 'custom') => {
    return events.filter((evt) => evt.type === type);
  };

  const filterByStatus = (status: 'success' | 'error') => {
    return events.filter((evt) => evt.status === status);
  };

  const getStats = () => {
    if (events.length === 0) {
      return {
        total: 0,
        success: 0,
        error: 0,
        avgDuration: 0,
        maxDuration: 0,
        minDuration: 0,
      };
    }

    const successEvents = events.filter((evt) => evt.status === 'success');
    const errorEvents = events.filter((evt) => evt.status === 'error');
    const durations = events.map((evt) => evt.duration);

    return {
      total: events.length,
      success: successEvents.length,
      error: errorEvents.length,
      avgDuration: Math.round(durations.reduce((a, b) => a + b, 0) / durations.length),
      maxDuration: Math.max(...durations),
      minDuration: Math.min(...durations),
    };
  };

  return {
    events,
    isActive,
    clearEvents,
    filterByType,
    filterByStatus,
    stats: getStats(),
  };
}
