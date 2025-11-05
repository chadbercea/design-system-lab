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
      <div className="flex h-full items-center justify-center p-6">
        <div className="text-center text-zinc-500">
          <p className="text-sm">No exposed ports</p>
          <p className="mt-1 text-xs">Configure port mappings in container settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Ports header */}
      <div className="border-b border-zinc-800 bg-zinc-900 px-6 py-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-400">
            {config.ports.length} {config.ports.length === 1 ? 'port mapping' : 'port mappings'}
          </span>
        </div>
      </div>

      {/* Ports list - scrollable */}
      <div className="flex-1 overflow-y-auto bg-zinc-950 px-6 py-4">
        <div className="space-y-3">
          {config.ports.map((portMapping, index) => {
            const localUrl = `http://localhost:${portMapping.hostPort}`;
            const isRunning = containerStatus === 'running';

            return (
              <div
                key={`${portMapping.hostPort}-${portMapping.containerPort}-${index}`}
                className="rounded border border-zinc-800 bg-zinc-900 p-4"
              >
                {/* Port mapping header */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-zinc-300">
                      {portMapping.containerPort}/{portMapping.protocol || 'tcp'}
                    </span>
                    <span className="text-zinc-600">→</span>
                    <span className="font-mono text-sm font-medium text-blue-400">
                      localhost:{portMapping.hostPort}
                    </span>
                  </div>

                  {/* Status badge */}
                  <Badge
                    variant="outline"
                    className={`h-5 ${
                      portMapping.status === 'working'
                        ? 'border-green-700 bg-green-900/20 text-green-400'
                        : portMapping.status === 'failed'
                        ? 'border-red-700 bg-red-900/20 text-red-400'
                        : 'border-zinc-700 bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {portMapping.status === 'working' && <CheckCircle2 className="mr-1 h-3 w-3" />}
                    {portMapping.status === 'failed' && <XCircle className="mr-1 h-3 w-3" />}
                    {portMapping.status === 'pending' && <Clock className="mr-1 h-3 w-3" />}
                    {portMapping.status || 'pending'}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyPort(localUrl)}
                    disabled={!isRunning}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700"
                  >
                    {copiedPort === localUrl ? (
                      <>
                        <CheckCircle2 className="mr-2 h-3 w-3 text-green-400" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-3 w-3" />
                        Copy URL
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(localUrl, '_blank')}
                    disabled={!isRunning || (portMapping.status !== 'working' && portMapping.status !== undefined)}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700"
                  >
                    <ExternalLink className="mr-2 h-3 w-3" />
                    Open
                  </Button>
                </div>

                {/* Error message if port mapping failed */}
                {portMapping.status === 'failed' && (
                  <div className="mt-3 rounded bg-red-900/20 p-2 text-xs text-red-400">
                    Port {portMapping.hostPort} is already in use by another process
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
