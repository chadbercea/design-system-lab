'use client';

import { useAppState } from '@/lib/app-state-context';
import { Badge } from '@/components/ui/badge';

export function BottomBar() {
  const { containerStatus, config } = useAppState();

  // Mock stats for now (will be replaced with real data later)
  const cpuPercent = 23.5;
  const memoryUsageMB = 256;
  const memoryLimitMB = 1024;
  const memoryPercent = (memoryUsageMB / memoryLimitMB) * 100;

  // Get localhost URL from config or use default
  const defaultPort = 6001;
  const port = config?.ports?.[0]?.hostPort || defaultPort;
  const localhostUrl = `localhost:${port}`;

  // Status colors and text
  const getStatusConfig = () => {
    switch (containerStatus) {
      case 'building':
        return {
          color: 'bg-blue-500',
          text: 'Building',
          textColor: 'text-blue-400',
        };
      case 'running':
        return {
          color: 'bg-green-500',
          text: 'Running',
          textColor: 'text-green-400',
        };
      case 'error':
        return {
          color: 'bg-red-500',
          text: 'Error',
          textColor: 'text-red-400',
        };
      case 'stopped':
      default:
        return {
          color: 'bg-zinc-500',
          text: 'Stopped',
          textColor: 'text-zinc-400',
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="flex h-[40px] w-full items-center justify-between border-t border-zinc-800 bg-zinc-900 px-4">
      {/* Left: Status indicator */}
      <div className="flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${statusConfig.color} animate-pulse`} />
        <span className={`text-sm font-medium ${statusConfig.textColor}`}>
          {statusConfig.text}
        </span>
      </div>

      {/* Center: Localhost URL (clickable) */}
      <div className="flex items-center">
        {containerStatus === 'running' ? (
          <a
            href={`http://${localhostUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors"
          >
            {localhostUrl}
          </a>
        ) : (
          <span className="text-sm text-zinc-600">{localhostUrl}</span>
        )}
      </div>

      {/* Right: Live stats */}
      <div className="flex items-center gap-4">
        {containerStatus === 'running' ? (
          <>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-zinc-500">CPU:</span>
              <span className="text-xs font-medium text-zinc-300">
                {cpuPercent.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-zinc-500">Memory:</span>
              <span className="text-xs font-medium text-zinc-300">
                {memoryUsageMB}MB / {memoryLimitMB}MB
              </span>
              <span className="text-xs text-zinc-500">
                ({memoryPercent.toFixed(0)}%)
              </span>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-zinc-600">
              No stats available
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
