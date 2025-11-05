'use client';

import { useState, useEffect } from 'react';
import { AppStateProvider, useAppState } from '@/lib/app-state-context';
import { TopBar } from '@/components/TopBar';
import { BottomBar } from '@/components/BottomBar';
import { ImageSelectorModal } from '@/components/ImageSelectorModal';
import { Canvas3D } from '@/components/Canvas3D';
import { Button } from '@/components/ui/button';

function AppContent() {
  const { selectedImage } = useAppState();
  const [showImageSelector, setShowImageSelector] = useState(false);

  // Show image selector on first launch if no image is selected
  useEffect(() => {
    if (!selectedImage) {
      setShowImageSelector(true);
    }
  }, [selectedImage]);

  return (
    <>
      {/* Single-view application layout */}
      <div className="flex h-screen flex-col bg-zinc-950">
        {/* TopBar - persistent, 60px */}
        <TopBar />

        {/* Main content area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Canvas3D - center, maintains 100vh × 100vw */}
          <div className="flex flex-1">
            <Canvas3D />
          </div>

          {/* SidePanel - right (conditional, handled in future ticket) */}
          {/* Will be added in a separate ticket */}
        </div>

        {/* BottomBar - persistent, 40px */}
        <BottomBar />
      </div>

      {/* ImageSelectorModal - overlay modal */}
      <ImageSelectorModal
        open={showImageSelector}
        onOpenChange={setShowImageSelector}
      />
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
