/**
 * Integration Example: Docker Events in Next.js
 * Shows how to integrate real Docker events with the container visualization
 * Part of spike for ILI-93
 */

// ============================================================================
// TYPES
// ============================================================================

export interface DockerEvent {
  Type: 'container' | 'image' | 'network' | 'volume';
  Action: string;
  time: number;
  timeNano: number;
  id: string;
  Actor: {
    ID: string;
    Attributes: {
      name?: string;
      image?: string;
      exitCode?: string;
      [key: string]: string | undefined;
    };
  };
}

export interface ContainerAnimation {
  type: 'appear' | 'activate' | 'deactivate' | 'disappear' | 'error';
  containerId: string;
  containerName: string;
  image: string;
  timestamp: number;
}

// ============================================================================
// API ROUTE: /api/docker/events (Next.js App Router)
// ============================================================================

/**
 * Example Next.js API route for streaming Docker events
 * File: src/app/api/docker/events/route.ts
 */
export async function GET(request: Request) {
  // This would be a real implementation in the app
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // In real implementation, connect to Docker daemon here
      // For demo purposes, this shows the structure

      try {
        // Example: Mock event for demonstration
        const mockEvent: DockerEvent = {
          Type: 'container',
          Action: 'start',
          time: Math.floor(Date.now() / 1000),
          timeNano: Date.now() * 1000000,
          id: 'abc123',
          Actor: {
            ID: 'abc123',
            Attributes: {
              name: 'web-server',
              image: 'nginx:latest'
            }
          }
        };

        // Send event as Server-Sent Event
        const data = `data: ${JSON.stringify(mockEvent)}\n\n`;
        controller.enqueue(encoder.encode(data));

        // Keep connection alive
        const interval = setInterval(() => {
          controller.enqueue(encoder.encode(': heartbeat\n\n'));
        }, 30000);

        // Cleanup on disconnect
        request.signal.addEventListener('abort', () => {
          clearInterval(interval);
          controller.close();
        });

      } catch (error) {
        controller.error(error);
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

// ============================================================================
// CLIENT HOOK: useDockerEvents
// ============================================================================

/**
 * React hook for consuming Docker events
 * File: src/hooks/useDockerEvents.ts
 */
export function useDockerEvents() {
  const [events, setEvents] = React.useState<DockerEvent[]>([]);
  const [connected, setConnected] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let eventSource: EventSource | null = null;

    try {
      // Connect to event stream
      eventSource = new EventSource('/api/docker/events');

      eventSource.onopen = () => {
        setConnected(true);
        setError(null);
      };

      eventSource.onmessage = (event) => {
        try {
          const dockerEvent: DockerEvent = JSON.parse(event.data);
          setEvents((prev) => [...prev, dockerEvent].slice(-100)); // Keep last 100
        } catch (err) {
          console.error('Failed to parse event:', err);
        }
      };

      eventSource.onerror = () => {
        setConnected(false);
        setError('Connection lost. Retrying...');
      };

    } catch (err) {
      setError('Failed to connect to event stream');
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  return { events, connected, error };
}

// ============================================================================
// EVENT TRANSFORMER: Docker Event → Animation Event
// ============================================================================

/**
 * Transforms Docker events into animation triggers
 */
export function transformEventToAnimation(event: DockerEvent): ContainerAnimation | null {
  // Only handle container events
  if (event.Type !== 'container') {
    return null;
  }

  // Map Docker actions to animation types
  const actionMap: Record<string, ContainerAnimation['type']> = {
    create: 'appear',
    start: 'activate',
    stop: 'deactivate',
    die: 'error',
    kill: 'error',
    destroy: 'disappear',
  };

  const animationType = actionMap[event.Action];
  if (!animationType) {
    return null;
  }

  return {
    type: animationType,
    containerId: event.id,
    containerName: event.Actor.Attributes.name || 'unknown',
    image: event.Actor.Attributes.image || 'unknown',
    timestamp: event.time * 1000, // Convert to milliseconds
  };
}

// ============================================================================
// COMPONENT: Docker Event Visualizer
// ============================================================================

/**
 * Example React component that visualizes Docker events
 * File: src/components/DockerEventVisualizer.tsx
 */
import React from 'react';

export function DockerEventVisualizer() {
  const { events, connected, error } = useDockerEvents();
  const [animations, setAnimations] = React.useState<ContainerAnimation[]>([]);

  // Transform Docker events to animations
  React.useEffect(() => {
    const latestEvent = events[events.length - 1];
    if (!latestEvent) return;

    const animation = transformEventToAnimation(latestEvent);
    if (animation) {
      setAnimations((prev) => [...prev, animation]);

      // Here you would trigger your actual animation system
      triggerAnimation(animation);
    }
  }, [events]);

  return (
    <div className="docker-visualizer">
      <div className="status">
        {connected ? (
          <span className="connected">🟢 Connected</span>
        ) : (
          <span className="disconnected">🔴 Disconnected</span>
        )}
        {error && <span className="error">{error}</span>}
      </div>

      <div className="events-list">
        <h3>Recent Events ({events.length})</h3>
        {events.slice(-10).reverse().map((event, idx) => (
          <div key={idx} className="event-item">
            <span className="event-type">{event.Type}</span>
            <span className="event-action">{event.Action}</span>
            <span className="event-name">
              {event.Actor.Attributes.name || event.id.substring(0, 12)}
            </span>
          </div>
        ))}
      </div>

      <div className="animations-preview">
        <h3>Triggered Animations ({animations.length})</h3>
        {animations.slice(-5).reverse().map((anim, idx) => (
          <div key={idx} className="animation-item">
            <span className={`animation-type ${anim.type}`}>
              {anim.type}
            </span>
            <span className="container-name">{anim.containerName}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// ANIMATION SYSTEM INTEGRATION
// ============================================================================

/**
 * Triggers the actual animation based on event
 * This would integrate with your existing animation system
 */
function triggerAnimation(animation: ContainerAnimation) {
  console.log('Triggering animation:', animation);

  // Example integration with Framer Motion or GSAP
  // const element = document.querySelector(`[data-container-id="${animation.containerId}"]`);
  // if (element) {
  //   switch (animation.type) {
  //     case 'appear':
  //       // Fade in animation
  //       break;
  //     case 'activate':
  //       // Pulse/glow animation
  //       break;
  //     case 'deactivate':
  //       // Dim animation
  //       break;
  //     case 'disappear':
  //       // Fade out animation
  //       break;
  //     case 'error':
  //       // Shake/red flash animation
  //       break;
  //   }
  // }
}

// ============================================================================
// MOCK DATA FALLBACK
// ============================================================================

/**
 * Mock event sequence for development/demo without Docker
 */
export const MOCK_EVENT_SEQUENCE: DockerEvent[] = [
  {
    Type: 'container',
    Action: 'create',
    time: Date.now() / 1000,
    timeNano: Date.now() * 1000000,
    id: 'mock-001',
    Actor: {
      ID: 'mock-001',
      Attributes: {
        name: 'web-server',
        image: 'nginx:alpine'
      }
    }
  },
  {
    Type: 'container',
    Action: 'start',
    time: Date.now() / 1000 + 1,
    timeNano: (Date.now() + 1000) * 1000000,
    id: 'mock-001',
    Actor: {
      ID: 'mock-001',
      Attributes: {
        name: 'web-server',
        image: 'nginx:alpine'
      }
    }
  },
  {
    Type: 'container',
    Action: 'create',
    time: Date.now() / 1000 + 2,
    timeNano: (Date.now() + 2000) * 1000000,
    id: 'mock-002',
    Actor: {
      ID: 'mock-002',
      Attributes: {
        name: 'api-server',
        image: 'node:18-alpine'
      }
    }
  },
  {
    Type: 'container',
    Action: 'start',
    time: Date.now() / 1000 + 3,
    timeNano: (Date.now() + 3000) * 1000000,
    id: 'mock-002',
    Actor: {
      ID: 'mock-002',
      Attributes: {
        name: 'api-server',
        image: 'node:18-alpine'
      }
    }
  },
  // Add more events as needed...
];

/**
 * Hook for development mode with mock events
 */
export function useMockDockerEvents() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const replay = () => {
    setCurrentIndex(0);
    setIsPlaying(true);
  };

  React.useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (currentIndex < MOCK_EVENT_SEQUENCE.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setIsPlaying(false);
      }
    }, 1000); // 1 second between events

    return () => clearTimeout(timer);
  }, [currentIndex, isPlaying]);

  return {
    events: MOCK_EVENT_SEQUENCE.slice(0, currentIndex + 1),
    isPlaying,
    replay,
    progress: currentIndex / MOCK_EVENT_SEQUENCE.length
  };
}

// ============================================================================
// USAGE EXAMPLE
// ============================================================================

/**
 * Main page component showing how to use both real and mock events
 * File: src/app/page.tsx
 */
export function ContainerVisualizationPage() {
  const [useRealEvents, setUseRealEvents] = React.useState(false);
  const realEvents = useDockerEvents();
  const mockEvents = useMockDockerEvents();

  const events = useRealEvents ? realEvents.events : mockEvents.events;

  return (
    <div>
      <div className="controls">
        <button onClick={() => setUseRealEvents(!useRealEvents)}>
          {useRealEvents ? 'Use Mock Events' : 'Use Real Docker Events'}
        </button>
        {!useRealEvents && (
          <button onClick={mockEvents.replay}>
            Replay Animation
          </button>
        )}
      </div>

      <DockerEventVisualizer />
    </div>
  );
}
