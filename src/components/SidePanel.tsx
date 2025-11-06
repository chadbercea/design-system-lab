'use client';

import { useEffect, useRef } from 'react';
import { useAppState } from '@/lib/app-state-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogsTab } from '@/components/tabs/LogsTab';
import { HistogramTab } from '@/components/tabs/HistogramTab';
import { PortsTab } from '@/components/tabs/PortsTab';

export function SidePanel() {
  const { activeTab, setActiveTab, containerStatus } = useAppState();
  const previousStatusRef = useRef<string>(containerStatus);

  // Auto-switch to logs on error state (ILI-145 requirement)
  useEffect(() => {
    // Only auto-switch if status changed TO error (not just when it remains error)
    if (containerStatus === 'error' && previousStatusRef.current !== 'error') {
      setActiveTab('logs');
    }
    previousStatusRef.current = containerStatus;
  }, [containerStatus, setActiveTab]);

  return (
    <div className="fixed right-5 top-[80px] bottom-[60px] w-[253px] bg-black/80 backdrop-blur-sm border border-black flex flex-col z-30">
      {/* Header */}
      <div className="px-4 py-3 border-b border-black flex-shrink-0">
        <h2 className="text-sm font-semibold text-zinc-100">Container Details</h2>
      </div>

      {/* Tabs - fills remaining space */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as 'logs' | 'histogram' | 'ports')}
        className="flex flex-col flex-1 overflow-hidden"
      >
        <TabsList className="w-full justify-start rounded-none border-b border-black bg-black px-1 gap-0.5">
          <TabsTrigger
            value="logs"
            className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 text-xs px-2 flex-1"
          >
            Logs
          </TabsTrigger>
          <TabsTrigger
            value="histogram"
            className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 text-xs px-1.5 flex-1"
          >
            Activity
          </TabsTrigger>
          <TabsTrigger
            value="ports"
            className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 text-xs px-2 flex-1"
          >
            Ports
          </TabsTrigger>
        </TabsList>

        {/* Tab content - scrollable */}
        <div className="flex-1 overflow-hidden">
          <TabsContent value="logs" className="h-full m-0">
            <LogsTab />
          </TabsContent>
          <TabsContent value="histogram" className="h-full m-0">
            <HistogramTab />
          </TabsContent>
          <TabsContent value="ports" className="h-full m-0">
            <PortsTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
