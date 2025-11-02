/**
 * Image Crate Demo Page
 *
 * Interactive demo for testing the Docker image crate component (ILI-95)
 * Shows all animation states and customization options.
 */

'use client';

import { useState } from 'react';
import { ImageCrate } from '@/components/three/ImageCrate';
import type { AnimationState } from '@/components/three/ImageCrate';

export default function ImageCrateDemoPage() {
  const [state, setState] = useState<AnimationState>('settled');
  const [showLogo, setShowLogo] = useState(true);
  const [enableGlow, setEnableGlow] = useState(false);
  const [scale, setScale] = useState(1);
  const [color, setColor] = useState('#0db7ed');
  const [showLoadingText, setShowLoadingText] = useState(true);
  const [imageName, setImageName] = useState('nginx:latest');

  return (
    <main className="w-screen h-screen bg-gray-900 flex flex-col">
      {/* Header with controls */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <h1 className="text-2xl font-bold text-white mb-2">
          Docker Image Crate Demo
        </h1>
        <p className="text-gray-400 text-sm mb-4">
          ILI-95: Interactive 3D visualization of Docker image crate geometry
        </p>

        <div className="flex flex-col gap-4">
          {/* Animation Controls */}
          <div className="flex gap-2 items-center flex-wrap">
            <span className="text-gray-300 text-sm font-semibold w-32">Animation:</span>
            <button
              onClick={() => setState('entering')}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                state === 'entering'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Enter
            </button>
            <button
              onClick={() => setState('docking')}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                state === 'docking'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Dock
            </button>
            <button
              onClick={() => setState('settled')}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                state === 'settled'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Settle
            </button>
            <button
              onClick={() => setState('floating')}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                state === 'floating'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Float
            </button>
            <button
              onClick={() => setState('exiting')}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                state === 'exiting'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Exit
            </button>
            <button
              onClick={() => setState('idle')}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                state === 'idle'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Hide
            </button>
          </div>

          {/* Visual Options */}
          <div className="flex gap-4 items-center flex-wrap">
            <span className="text-gray-300 text-sm font-semibold w-32">Options:</span>
            <label className="flex items-center gap-2 text-gray-300 text-sm">
              <input
                type="checkbox"
                checked={showLogo}
                onChange={(e) => setShowLogo(e.target.checked)}
                className="w-4 h-4"
              />
              Show Docker Logo
            </label>
            <label className="flex items-center gap-2 text-gray-300 text-sm">
              <input
                type="checkbox"
                checked={enableGlow}
                onChange={(e) => setEnableGlow(e.target.checked)}
                className="w-4 h-4"
              />
              Enable Glow
            </label>
            <label className="flex items-center gap-2 text-gray-300 text-sm">
              <input
                type="checkbox"
                checked={showLoadingText}
                onChange={(e) => setShowLoadingText(e.target.checked)}
                className="w-4 h-4"
              />
              Show Loading Text
            </label>
          </div>

          {/* Image Name Control */}
          <div className="flex gap-4 items-center flex-wrap">
            <span className="text-gray-300 text-sm font-semibold w-32">Image Name:</span>
            <input
              type="text"
              value={imageName}
              onChange={(e) => setImageName(e.target.value)}
              className="px-3 py-1 rounded bg-gray-700 text-gray-300 border border-gray-600"
              placeholder="nginx:latest"
            />
          </div>

          {/* Scale Control */}
          <div className="flex gap-4 items-center flex-wrap">
            <span className="text-gray-300 text-sm font-semibold w-32">Scale:</span>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-48"
            />
            <span className="text-gray-400 text-sm">{scale.toFixed(1)}x</span>
          </div>

          {/* Color Control */}
          <div className="flex gap-4 items-center flex-wrap">
            <span className="text-gray-300 text-sm font-semibold w-32">Color:</span>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-16 h-8 rounded cursor-pointer"
            />
            <button
              onClick={() => setColor('#0db7ed')}
              className="px-3 py-1 rounded text-xs bg-gray-700 text-gray-300 hover:bg-gray-600"
            >
              Reset to Docker Blue
            </button>
            <span className="text-gray-400 text-sm font-mono">{color}</span>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-400 border-t border-gray-700 pt-3">
          <p className="font-semibold text-gray-300 mb-1">💡 Controls:</p>
          <ul className="ml-4 space-y-1">
            <li>• Drag to rotate the crate</li>
            <li>• Scroll to zoom in/out</li>
            <li>• Try different animations to see transitions</li>
          </ul>
          <p className="mt-2">
            <strong>Current State:</strong> <span className="text-blue-400">{state}</span>
          </p>
        </div>
      </div>

      {/* 3D Scene */}
      <div className="flex-1 relative">
        <ImageCrate
          state={state}
          onAnimationComplete={(newState) => {
            console.log('Animation completed:', state, '→', newState);
            // Auto-transition: entering → docking → settled
            if (newState === 'docking') {
              setState('docking');
            } else if (newState === 'settled') {
              setState('settled');
            }
          }}
          showLogo={showLogo}
          enableGlow={enableGlow}
          scale={scale}
          color={color}
          imageName={imageName}
          showLoadingText={showLoadingText}
          enableFloating={state === 'floating'}
          showControls={true}
        />
      </div>
    </main>
  );
}
