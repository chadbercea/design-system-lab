'use client';

import { useState, useEffect, useCallback } from 'react';
import { ContainerStatus } from '@/types/docker';
import { simulateContainerStartup } from '@/lib/mock-docker-api';

/**
 * Hook to simulate container lifecycle events
 *
 * TODO: Replace with real Docker Desktop API events
 * Real API: window.dockerDesktopAPI.containers.subscribe(containerId, callback)
 *
 * This hook demonstrates container state transitions:
 * stopped -> building -> running
 * running -> stopped
 * building -> error
 */

export interface ContainerEvent {
  id: string;
  timestamp: Date;
  status: ContainerStatus;
  message?: string;
}

export interface UseMockEventsOptions {
  containerId: string | null;
  initialStatus?: ContainerStatus;
}

export function useMockEvents({
  containerId,
  initialStatus = 'stopped',
}: UseMockEventsOptions) {
  const [status, setStatus] = useState<ContainerStatus>(initialStatus);
  const [events, setEvents] = useState<ContainerEvent[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Add a new event to history
  const addEvent = useCallback((newStatus: ContainerStatus, message?: string) => {
    const event: ContainerEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      status: newStatus,
      message,
    };
    setEvents((prev) => [...prev, event]);
    setStatus(newStatus);
  }, []);

  // Start container (simulate building -> running)
  const startContainer = useCallback(async () => {
    if (!containerId || isTransitioning) return;

    setIsTransitioning(true);
    addEvent('building', 'Starting container...');

    try {
      await simulateContainerStartup(containerId, (newStatus) => {
        switch (newStatus) {
          case 'building':
            addEvent('building', 'Pulling image layers...');
            break;
          case 'running':
            addEvent('running', 'Container started successfully');
            setIsTransitioning(false);
            break;
          case 'error':
            addEvent('error', 'Failed to start container');
            setIsTransitioning(false);
            break;
        }
      });
    } catch (error) {
      addEvent('error', `Error: ${(error as Error).message}`);
      setIsTransitioning(false);
    }
  }, [containerId, isTransitioning, addEvent]);

  // Stop container
  const stopContainer = useCallback(() => {
    if (!containerId || isTransitioning) return;

    setIsTransitioning(true);
    addEvent('stopped', 'Stopping container...');

    // Simulate stop delay
    setTimeout(() => {
      addEvent('stopped', 'Container stopped');
      setIsTransitioning(false);
    }, 1500);
  }, [containerId, isTransitioning, addEvent]);

  // Restart container
  const restartContainer = useCallback(async () => {
    if (!containerId || isTransitioning) return;

    // Stop then start
    stopContainer();
    setTimeout(() => {
      startContainer();
    }, 2000);
  }, [containerId, isTransitioning, stopContainer, startContainer]);

  // Simulate error scenario
  const simulateError = useCallback(() => {
    addEvent('error', 'Simulated error: Port conflict detected');
  }, [addEvent]);

  const clearEvents = () => {
    setEvents([]);
  };

  return {
    status,
    events,
    isTransitioning,
    startContainer,
    stopContainer,
    restartContainer,
    simulateError,
    clearEvents,
  };
}
