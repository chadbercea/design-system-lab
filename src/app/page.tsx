'use client';

import { useState } from 'react';
import { AppStateProvider, useAppState } from '@/lib/app-state-context';
import { TopBar } from '@/components/TopBar';
import { BottomBar } from '@/components/BottomBar';
import { BottomBarTrigger } from '@/components/BottomBarTrigger';
import { Canvas3D } from '@/components/Canvas3D';
import { SidePanel } from '@/components/SidePanel';
import { LeftPanel } from '@/components/LeftPanel';
import { EmptyState } from '@/components/EmptyState';
import { MetricsOverlay } from '@/components/MetricsOverlay';
import { ContainerActionsBar } from '@/components/ContainerActionsBar';

function AppContent() {
  const { selectedImage, containerStatus } = useAppState();
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  return (
    <>
      {/* Single-view application layout */}
      <div className="flex h-screen flex-col bg-zinc-950">
        {/* TopBar - persistent, 30px */}
        <TopBar onTerminalToggle={() => setIsTerminalOpen(!isTerminalOpen)} />

        {/* Main content area */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* Canvas3D or EmptyState - full width to render behind panels */}
          <div className="flex flex-1">
            {selectedImage ? (
              <Canvas3D />
            ) : (
              <EmptyState />
            )}
          </div>

          {/* Metrics overlay - shows when container is running */}
          <MetricsOverlay show={containerStatus === 'running'} />
        </div>
      </div>

      {/* LeftPanel - fixed left side (always visible) */}
      <LeftPanel />

      {/* SidePanel - fixed right side (always visible) */}
      <SidePanel />

      {/* Container Actions Bar - centered, 20px above terminal */}
      <ContainerActionsBar isTerminalOpen={isTerminalOpen} />

      {/* Bottom bar trigger - always visible, opens terminal */}
      {!isTerminalOpen && (
        <BottomBarTrigger onClick={() => setIsTerminalOpen(true)} />
      )}

      {/* Terminal Drawer - fixed bottom (toggleable) */}
      <BottomBar isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
    </>
  );
}

export default function Home() {
  return (
    <AppStateProvider>
      <AppContent />
    </AppStateProvider>
  );
}
