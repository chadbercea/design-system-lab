'use client';

import { useState, useEffect } from 'react';
import { AppStateProvider, useAppState } from '@/lib/app-state-context';
import { TopBar } from '@/components/TopBar';
import { BottomBar } from '@/components/BottomBar';
import { ImageSelectorModal } from '@/components/ImageSelectorModal';
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
          {/* Canvas3D - center (placeholder for now) */}
          <div className="flex flex-1 items-center justify-center">
            {selectedImage ? (
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-64 w-64 items-center justify-center rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-900/50">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-16 w-16 text-zinc-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                    </svg>
                    <p className="mt-2 text-sm text-zinc-500">
                      Canvas3D Placeholder
                    </p>
                    <p className="mt-1 text-xs text-zinc-600">
                      3D visualization will appear here
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-zinc-400">
                    Selected: {selectedImage.name}:{selectedImage.tag}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowImageSelector(true)}
                    className="mt-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700"
                  >
                    Change Image
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-zinc-500">No image selected</p>
                <Button
                  onClick={() => setShowImageSelector(true)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Select Image
                </Button>
              </div>
            )}
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
