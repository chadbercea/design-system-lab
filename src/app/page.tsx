'use client';

import { useState } from 'react';
import { AppStateProvider, useAppState } from '@/lib/app-state-context';
import { TopBar } from '@/components/TopBar';
import { BottomBar } from '@/components/BottomBar';
import { ImageSelectorModal } from '@/components/ImageSelectorModal';
import { Canvas3D } from '@/components/Canvas3D';
import { SidePanel } from '@/components/SidePanel';
import { EmptyState } from '@/components/EmptyState';
import { DrawerToggle } from '@/components/DrawerToggle';

function AppContent() {
  const { selectedImage } = useAppState();
  const [showImageSelector, setShowImageSelector] = useState(false);

  return (
    <>
      {/* Single-view application layout */}
      <div className="flex h-screen flex-col bg-zinc-950">
        {/* TopBar - persistent, 60px */}
        <TopBar />

        {/* Main content area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Canvas3D or EmptyState */}
          <div className="flex flex-1">
            {selectedImage ? (
              <Canvas3D />
            ) : (
              <EmptyState onSelectImage={() => setShowImageSelector(true)} />
            )}
          </div>
        </div>

        {/* BottomBar - persistent, 40px */}
        <BottomBar />
      </div>

      {/* ImageSelectorModal - overlay modal */}
      <ImageSelectorModal
        open={showImageSelector}
        onOpenChange={setShowImageSelector}
      />

      {/* DrawerToggle - right edge button */}
      {selectedImage && <DrawerToggle />}

      {/* SidePanel - right overlay */}
      <SidePanel />
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
