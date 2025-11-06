'use client';

import { ChevronUp } from 'lucide-react';

interface BottomBarTriggerProps {
  onClick: () => void;
}

export function BottomBarTrigger({ onClick }: BottomBarTriggerProps) {
  return (
    <div
      onClick={onClick}
      className="fixed bottom-0 left-0 right-0 h-[30px] bg-black border-t border-zinc-700 flex items-center justify-between px-4 cursor-pointer hover:bg-zinc-900 transition-colors z-40"
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-zinc-400">Terminal</span>
        <span className="text-xs text-zinc-600">Click to open</span>
      </div>
      <div className="flex items-center gap-2">
        <ChevronUp className="h-3 w-3 text-zinc-600" />
      </div>
    </div>
  );
}
