'use client';

import { useAppState } from '@/lib/app-state-context';
import { ChevronLeft, ChevronRight, Pin } from 'lucide-react';

/**
 * DrawerToggle Component
 *
 * A 64-80px wide vertical edge button that:
 * - Shows on the right side of the screen
 * - Can be clicked to toggle the drawer open/closed
 * - Has icons indicating drawer state
 * - Can optionally be pinned open (future enhancement)
 */

export function DrawerToggle() {
  const { panelOpen, setPanelOpen } = useAppState();

  return (
    <button
      onClick={() => setPanelOpen(!panelOpen)}
      className={`
        fixed right-0 top-1/2 -translate-y-1/2 z-40
        w-16 h-32
        bg-zinc-800/90 hover:bg-zinc-700/90
        border-l border-t border-b border-zinc-700
        rounded-l-lg
        flex flex-col items-center justify-center gap-2
        transition-all duration-200
        ${panelOpen ? 'translate-x-0' : 'translate-x-0'}
      `}
      aria-label={panelOpen ? 'Close drawer' : 'Open drawer'}
    >
      {/* Icon */}
      <div className="text-zinc-400">
        {panelOpen ? (
          <ChevronRight className="w-5 h-5" />
        ) : (
          <ChevronLeft className="w-5 h-5" />
        )}
      </div>

      {/* Label */}
      <div className="text-[10px] text-zinc-500 font-medium writing-mode-vertical">
        {panelOpen ? 'CLOSE' : 'PANEL'}
      </div>
    </button>
  );
}
