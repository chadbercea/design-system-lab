'use client';

import { useState } from 'react';
import { AppStateProvider } from '@/lib/app-state-context';
import { ContainerScene } from '@/components/three/ContainerScene';
import type { ContainerState } from '@/lib/container-colors';

export default function ContainerDemoPage() {
  const [state, setState] = useState<ContainerState>('ready');

  return (
    <AppStateProvider>
      <main className="w-screen h-screen bg-gray-900 flex flex-col">
      {/* Header with controls */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <h1 className="text-2xl font-bold text-white mb-4">Interactive Container Demo</h1>

        <div className="flex gap-4 items-center">
          <span className="text-gray-300 text-sm">Container State:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setState('ready')}
              className={`px-4 py-2 rounded transition-colors ${
                state === 'ready'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Ready
            </button>
            <button
              onClick={() => setState('building')}
              className={`px-4 py-2 rounded transition-colors ${
                state === 'building'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Building
            </button>
            <button
              onClick={() => setState('running')}
              className={`px-4 py-2 rounded transition-colors ${
                state === 'running'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Running
            </button>
            <button
              onClick={() => setState('error')}
              className={`px-4 py-2 rounded transition-colors ${
                state === 'error'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Error
            </button>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-400">
          <p>💡 <strong>Controls:</strong></p>
          <ul className="ml-4 mt-1 space-y-1">
            <li>• Drag to rotate the container</li>
            <li>• Scroll/pinch to zoom in and out</li>
            <li>• Double-click to reset to front view</li>
          </ul>
        </div>
      </div>

      {/* 3D Scene */}
      <div className="flex-1 relative">
        <ContainerScene state={state} />
      </div>
    </main>
    </AppStateProvider>
  );
}
