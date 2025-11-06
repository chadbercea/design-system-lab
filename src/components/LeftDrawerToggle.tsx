'use client';

import { useAppState } from '@/lib/app-state-context';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * LeftDrawerToggle Component
 *
 * A 64-80px wide vertical edge button that:
 * - Shows on the left side of the screen
 * - Can be clicked to toggle the left drawer open/closed
 * - Has icons indicating drawer state
 * - Mirrors the right DrawerToggle design
 */

export function LeftDrawerToggle() {
  const { leftPanelOpen, setLeftPanelOpen } = useAppState();

  return (
    <button
      onClick={() => setLeftPanelOpen(!leftPanelOpen)}
      className={`
        fixed left-0 top-1/2 -translate-y-1/2 z-40
        w-16 h-32
        bg-zinc-800/90 hover:bg-zinc-700/90
        border-r border-t border-b border-zinc-700
        rounded-r-lg
        flex flex-col items-center justify-center gap-2
        transition-all duration-200
      `}
      aria-label={leftPanelOpen ? 'Close drawer' : 'Open drawer'}
    >
      {/* Icon */}
      <div className="text-zinc-400">
        {leftPanelOpen ? (
          <ChevronLeft className="w-5 h-5" />
        ) : (
          <ChevronRight className="w-5 h-5" />
        )}
      </div>

      {/* Label */}
      <div className="text-[10px] text-zinc-500 font-medium writing-mode-vertical">
        {leftPanelOpen ? 'CLOSE' : 'IMAGES'}
      </div>
    </button>
  );
}
