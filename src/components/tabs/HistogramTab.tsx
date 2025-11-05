'use client';

import { useAppState } from '@/lib/app-state-context';
import { useMockHistogram } from '@/hooks/useMockHistogram';
import { Badge } from '@/components/ui/badge';

export function HistogramTab() {
  const { containerStatus, selectedImage } = useAppState();

  // Use mock histogram hook (from ILI-146)
  const { events, isActive, stats } = useMockHistogram({
    containerId: selectedImage?.id || 'mock-container',
    enabled: containerStatus === 'running',
    maxEvents: 500,
    interval: 3000,
  });

  // Show empty state if not running
  if (containerStatus !== 'running') {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="text-center text-zinc-500">
          <p className="text-sm">No telemetry data</p>
          <p className="mt-1 text-xs">Start the container to see metrics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Histogram header with stats */}
      <div className="border-b border-zinc-800 bg-zinc-900 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-400">
              {events.length} {events.length === 1 ? 'event' : 'events'}
            </span>
            {isActive && (
              <Badge variant="outline" className="h-5 border-blue-700 bg-blue-900/20 text-blue-400">
                <span className="mr-1 animate-pulse">●</span>
                Active
              </Badge>
            )}
          </div>
        </div>

        {/* Stats summary */}
        {stats.total > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 rounded bg-zinc-800 px-2 py-1 text-xs">
              <span className="text-zinc-400">Total:</span>
              <span className="text-zinc-300">{stats.total}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded bg-zinc-800 px-2 py-1 text-xs">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-zinc-400">Success:</span>
              <span className="text-zinc-300">{stats.success}</span>
            </div>
            {stats.error > 0 && (
              <div className="flex items-center gap-1.5 rounded bg-zinc-800 px-2 py-1 text-xs">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-zinc-400">Error:</span>
                <span className="text-zinc-300">{stats.error}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 rounded bg-zinc-800 px-2 py-1 text-xs">
              <span className="text-zinc-400">Avg:</span>
              <span className="text-zinc-300">{stats.avgDuration}ms</span>
            </div>
          </div>
        )}
      </div>

      {/* Events list - scrollable */}
      <div className="flex-1 overflow-y-auto bg-zinc-950 px-6 py-4">
        {events.length === 0 ? (
          <div className="text-center text-zinc-600">Collecting telemetry data...</div>
        ) : (
          <div className="space-y-2">
            {events.slice().reverse().map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3 rounded border border-zinc-800 bg-zinc-900 p-3"
              >
                {/* Type indicator */}
                <div
                  className={`mt-0.5 h-2 w-2 flex-shrink-0 rounded-full ${
                    event.type === 'http'
                      ? 'bg-blue-500'
                      : event.type === 'db'
                      ? 'bg-green-500'
                      : event.type === 'cache'
                      ? 'bg-purple-500'
                      : 'bg-zinc-500'
                  }`}
                />

                {/* Event details */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium capitalize text-zinc-300">
                      {event.type}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {new Date(event.timestamp).toLocaleTimeString('en-US', {
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </span>
                  </div>

                  {event.duration !== undefined && (
                    <div className="text-xs text-zinc-400">
                      Duration: {event.duration}ms
                      <span
                        className={`ml-2 ${
                          event.status === 'success' ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {event.status}
                      </span>
                    </div>
                  )}

                  {event.metadata && Object.keys(event.metadata).length > 0 && (
                    <div className="mt-1 space-y-0.5">
                      {Object.entries(event.metadata).map(([key, value]) => (
                        <div key={key} className="text-xs text-zinc-500">
                          <span className="text-zinc-400">{key}:</span>{' '}
                          {String(value)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
