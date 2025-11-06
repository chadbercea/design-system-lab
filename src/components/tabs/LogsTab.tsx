'use client';

import { useEffect, useRef } from 'react';
import { useAppState } from '@/lib/app-state-context';
import { useMockLogs } from '@/hooks/useMockLogs';
import { Badge } from '@/components/ui/badge';

export function LogsTab() {
  const { containerStatus, selectedImage } = useAppState();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Use mock logs hook (from ILI-146)
  const { logs, isStreaming } = useMockLogs({
    containerId: selectedImage?.id || 'mock-container',
    enabled: containerStatus === 'running' || containerStatus === 'building',
    maxLogs: 1000,
  });

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  // Show empty state if not running
  if (containerStatus !== 'running' && containerStatus !== 'building' && containerStatus !== 'error') {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <div className="text-center text-zinc-500">
          <p className="text-xs">No logs available</p>
          <p className="mt-1 text-[10px]">Start container to see logs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Logs header with status */}
      <div className="flex items-center justify-between border-b border-black bg-zinc-900 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-zinc-400">
            {logs.length} {logs.length === 1 ? 'entry' : 'entries'}
          </span>
          {isStreaming && (
            <Badge variant="outline" className="h-4 border-zinc-700 bg-zinc-900/20 text-zinc-400 text-[9px] px-1">
              <span className="mr-1 animate-pulse">●</span>
              Live
            </Badge>
          )}
        </div>
      </div>

      {/* Logs content - scrollable */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-black px-3 py-2 font-mono text-[10px]"
      >
        {logs.length === 0 ? (
          <div className="text-zinc-600 text-[10px]">Waiting for logs...</div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="mb-1 flex gap-2">
              {/* Timestamp */}
              <span className="flex-shrink-0 text-zinc-600">
                {new Date(log.timestamp).toLocaleTimeString('en-US', {
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>

              {/* Level badge */}
              <span
                className={`flex-shrink-0 font-semibold uppercase ${
                  log.level === 'error'
                    ? 'text-red-400'
                    : log.level === 'warn'
                    ? 'text-yellow-400'
                    : log.level === 'info'
                    ? 'text-zinc-400'
                    : 'text-zinc-500'
                }`}
              >
                {log.level.substring(0, 3)}
              </span>

              {/* Message */}
              <span
                className={`flex-1 break-words ${
                  log.level === 'error'
                    ? 'text-red-300'
                    : log.level === 'warn'
                    ? 'text-yellow-300'
                    : 'text-zinc-300'
                }`}
              >
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
