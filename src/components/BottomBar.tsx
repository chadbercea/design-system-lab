'use client';

import { useState, useEffect, useRef } from 'react';
import { useAppState } from '@/lib/app-state-context';

interface BottomBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BottomBar({ isOpen, onClose }: BottomBarProps) {
  const { containerStatus } = useAppState();
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new lines are added
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLines]);

  // Simulate terminal output based on container status
  useEffect(() => {
    if (containerStatus === 'building') {
      const lines = [
        '$ docker build -t my-app:latest .',
        'Sending build context to Docker daemon...',
        'Step 1/5 : FROM node:18-alpine',
        'Step 2/5 : WORKDIR /app',
        'Step 3/5 : COPY package*.json ./',
        'Step 4/5 : RUN npm install',
        'Step 5/5 : CMD ["npm", "start"]',
      ];

      let index = 0;
      setTerminalLines([lines[0]]);

      const interval = setInterval(() => {
        index++;
        if (index < lines.length) {
          setTerminalLines(prev => [...prev, lines[index]]);
        } else {
          clearInterval(interval);
        }
      }, 500);

      return () => clearInterval(interval);
    } else if (containerStatus === 'running') {
      setTerminalLines(prev => [
        ...prev,
        'Successfully built container',
        '$ docker run -p 6001:80 my-app:latest',
        'Server listening on port 80',
        'Container running at localhost:6001',
      ]);
    } else if (containerStatus === 'ready') {
      setTerminalLines(['$ Waiting for command...']);
    }
  }, [containerStatus]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-[300px] flex-col border-t border-zinc-700 bg-black/80 backdrop-blur-sm shadow-2xl animate-in slide-in-from-bottom duration-300">
      {/* Terminal header */}
      <div className="flex h-[30px] items-center justify-between border-b border-zinc-800 px-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-400">Terminal</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTerminalLines([])}
            className="text-xs text-zinc-500 hover:text-zinc-300"
          >
            Clear
          </button>
          <button
            onClick={onClose}
            className="text-xs text-zinc-500 hover:text-zinc-300"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Terminal output */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs">
        {terminalLines.length === 0 ? (
          <div className="text-zinc-600">$ Ready</div>
        ) : (
          <>
            {terminalLines.map((line, index) => (
              <div key={index} className="text-zinc-300 mb-1">
                {line}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </>
        )}
      </div>
    </div>
  );
}
