'use client';

import { useState } from 'react';
import { useAppState } from '@/lib/app-state-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, CheckCircle2, XCircle, Clock } from 'lucide-react';

export function PortsTab() {
  const { config, containerStatus } = useAppState();
  const [copiedPort, setCopiedPort] = useState<string | null>(null);

  const handleCopyPort = (port: string) => {
    navigator.clipboard.writeText(port);
    setCopiedPort(port);
    setTimeout(() => setCopiedPort(null), 2000);
  };

  // Show empty state if no ports configured
  if (!config || !config.ports || config.ports.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <div className="text-center text-zinc-500">
          <p className="text-xs">No exposed ports</p>
          <p className="mt-1 text-[10px]">Configure port mappings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Ports header */}
      <div className="border-b border-black bg-zinc-900 px-3 py-2">
        <span className="text-[10px] font-medium text-zinc-400">
          {config.ports.length} {config.ports.length === 1 ? 'port' : 'ports'}
        </span>
      </div>

      {/* Ports list - scrollable */}
      <div className="flex-1 overflow-y-auto bg-zinc-950 px-3 py-2">
        <div className="space-y-2">
          {config.ports.map((portMapping, index) => {
            const localUrl = `http://localhost:${portMapping.hostPort}`;
            const isRunning = containerStatus === 'running';

            return (
              <div
                key={`${portMapping.hostPort}-${portMapping.containerPort}-${index}`}
                className="rounded border border-black bg-zinc-900 p-2"
              >
                {/* Port mapping header */}
                <div className="mb-2 flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="font-mono text-[10px] text-zinc-300 truncate">
                      {portMapping.containerPort}/{portMapping.protocol || 'tcp'}
                    </span>
                    <span className="text-zinc-600 text-[10px]">→</span>
                    <span className="font-mono text-[10px] font-medium text-zinc-400 truncate">
                      :{portMapping.hostPort}
                    </span>
                  </div>

                  {/* Status badge */}
                  <Badge
                    variant="outline"
                    className={`h-4 flex-shrink-0 text-[9px] px-1 ${
                      portMapping.status === 'working'
                        ? 'border-zinc-700 bg-zinc-900/20 text-zinc-400'
                        : portMapping.status === 'failed'
                        ? 'border-red-700 bg-red-900/20 text-red-400'
                        : 'border-zinc-700 bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {portMapping.status === 'working' && <CheckCircle2 className="mr-0.5 h-2 w-2" />}
                    {portMapping.status === 'failed' && <XCircle className="mr-0.5 h-2 w-2" />}
                    {portMapping.status === 'pending' && <Clock className="mr-0.5 h-2 w-2" />}
                    {portMapping.status || 'pending'}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyPort(localUrl)}
                    disabled={!isRunning}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700 h-6 text-[10px] px-2"
                  >
                    {copiedPort === localUrl ? (
                      <>
                        <CheckCircle2 className="mr-1 h-2 w-2 text-zinc-400" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-1 h-2 w-2" />
                        Copy
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(localUrl, '_blank')}
                    disabled={!isRunning || (portMapping.status !== 'working' && portMapping.status !== undefined)}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700 h-6 text-[10px] px-2"
                  >
                    <ExternalLink className="mr-1 h-2 w-2" />
                    Open
                  </Button>
                </div>

                {/* Error message if port mapping failed */}
                {portMapping.status === 'failed' && (
                  <div className="mt-2 rounded bg-red-900/20 p-1.5 text-[9px] text-red-400 leading-tight">
                    Port {portMapping.hostPort} already in use
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
