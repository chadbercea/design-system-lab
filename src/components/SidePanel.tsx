'use client';

import { useEffect, useRef } from 'react';
import { useAppState } from '@/lib/app-state-context';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { LogsTab } from '@/components/tabs/LogsTab';
import { HistogramTab } from '@/components/tabs/HistogramTab';
import { PortsTab } from '@/components/tabs/PortsTab';
import { ActionsTab } from '@/components/tabs/ActionsTab';

export function SidePanel() {
  const { panelOpen, setPanelOpen, activeTab, setActiveTab, containerStatus } = useAppState();
  const previousStatusRef = useRef<string>(containerStatus);

  // Auto-open on error state (ILI-145 requirement)
  useEffect(() => {
    // Only auto-open if status changed TO error (not just when it remains error)
    if (containerStatus === 'error' && previousStatusRef.current !== 'error') {
      setActiveTab('logs');
      setPanelOpen(true);
    }
    previousStatusRef.current = containerStatus;
  }, [containerStatus, setActiveTab, setPanelOpen]);

  return (
    <Sheet open={panelOpen} onOpenChange={setPanelOpen}>
      <SheetContent
        side="right"
        className="w-[450px] sm:w-[500px] bg-zinc-900 border-l border-zinc-800 p-0 flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b border-zinc-800 flex-shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-zinc-100">Container Details</SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPanelOpen(false)}
              className="h-6 w-6 rounded-full hover:bg-zinc-800"
            >
              <X className="h-4 w-4 text-zinc-400" />
            </Button>
          </div>
        </SheetHeader>

        {/* Tabs - fills remaining space */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'logs' | 'histogram' | 'ports' | 'actions')}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <TabsList className="w-full justify-start rounded-none border-b border-zinc-800 bg-zinc-900 px-6">
            <TabsTrigger
              value="logs"
              className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100"
            >
              Logs
            </TabsTrigger>
            <TabsTrigger
              value="histogram"
              className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100"
            >
              Histogram
            </TabsTrigger>
            <TabsTrigger
              value="ports"
              className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100"
            >
              Ports
            </TabsTrigger>
            <TabsTrigger
              value="actions"
              className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100"
            >
              Actions
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
            <TabsContent value="actions" className="h-full m-0">
              <ActionsTab />
            </TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
