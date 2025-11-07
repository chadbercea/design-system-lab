'use client';

import { useState, useEffect } from 'react';
import { useAppState } from '@/lib/app-state-context';
import { Badge } from '@/components/ui/badge';
import { createStatsStream } from '@/lib/mock-docker-api';
import { ContainerStats } from '@/types/docker';
import { DemoLimitsModal } from '@/components/DemoLimitsModal';

interface TopBarProps {
  onTerminalToggle?: () => void;
}

export function TopBar({ onTerminalToggle }: TopBarProps) {
  const { selectedImage, containerStatus, config } = useAppState();
  const [stats, setStats] = useState<ContainerStats | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showDemoLimits, setShowDemoLimits] = useState(false);

  // Stream real-time stats when container is running
  useEffect(() => {
    if (containerStatus === 'running' || containerStatus === 'building') {
      const cleanup = createStatsStream('mock-container-id', containerStatus, setStats);
      return cleanup;
    } else {
      setStats(null);
    }
  }, [containerStatus]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    if (activeMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeMenu]);

  const toggleMenu = (menu: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleDemoLimitClick = () => {
    setActiveMenu(null);
    setShowDemoLimits(true);
  };

  const cpuPercent = stats?.cpuPercent || 0;
  const memoryUsageMB = stats ? Math.round(stats.memoryUsage / (1024 * 1024)) : 0;
  const memoryLimitMB = stats ? Math.round(stats.memoryLimit / (1024 * 1024)) : 1024;
  const memoryPercent = stats ? (stats.memoryUsage / stats.memoryLimit) * 100 : 0;

  // Get localhost URL from config or use default
  const defaultPort = 6001;
  const port = config?.ports?.[0]?.hostPort || defaultPort;
  const localhostUrl = `localhost:${port}`;

  // Status colors and text
  const getStatusConfig = () => {
    switch (containerStatus) {
      case 'building':
        return {
          color: 'bg-zinc-500',
          text: 'Building',
          textColor: 'text-zinc-400',
        };
      case 'running':
        return {
          color: 'bg-zinc-300',
          text: 'Running',
          textColor: 'text-zinc-300',
        };
      case 'error':
        return {
          color: 'bg-zinc-600',
          text: 'Error',
          textColor: 'text-zinc-400',
        };
      case 'ready':
      default:
        return {
          color: 'bg-zinc-400',
          text: 'Ready',
          textColor: 'text-zinc-400',
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="flex h-[30px] w-full items-center justify-between border-b border-zinc-700 bg-black px-4 relative">
      {/* Left: Docker logo/branding + menu bar */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <img
            src="/design-system-lab/docker-image-runner/docker-logo.svg"
            alt="Docker"
            className="h-4 w-4"
          />
          <span className="text-xs font-semibold text-zinc-100">Docker Desktop</span>
        </div>

        {/* Menu Bar */}
        <div className="flex items-center gap-1">
          {/* File Menu */}
          <div className="relative">
            <button
              onClick={(e) => toggleMenu('file', e)}
              className="px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800 rounded"
            >
              File
            </button>
            {activeMenu === 'file' && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-black border border-zinc-700 rounded shadow-lg z-50">
                <button
                  onClick={handleDemoLimitClick}
                  className="w-full px-3 py-2 text-xs text-left text-zinc-300 hover:bg-zinc-800"
                >
                  New Container
                </button>
                <button
                  onClick={handleDemoLimitClick}
                  className="w-full px-3 py-2 text-xs text-left text-zinc-300 hover:bg-zinc-800"
                >
                  Import Image
                </button>
                <div className="border-t border-zinc-800 my-1" />
                <button
                  onClick={handleDemoLimitClick}
                  className="w-full px-3 py-2 text-xs text-left text-zinc-300 hover:bg-zinc-800"
                >
                  Settings
                </button>
              </div>
            )}
          </div>

          {/* View Menu */}
          <div className="relative">
            <button
              onClick={(e) => toggleMenu('view', e)}
              className="px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800 rounded"
            >
              View
            </button>
            {activeMenu === 'view' && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-black border border-zinc-700 rounded shadow-lg z-50">
                <button
                  onClick={() => {
                    onTerminalToggle?.();
                    setActiveMenu(null);
                  }}
                  className="w-full px-3 py-2 text-xs text-left text-zinc-300 hover:bg-zinc-800"
                >
                  Toggle Terminal
                </button>
                <button
                  onClick={handleDemoLimitClick}
                  className="w-full px-3 py-2 text-xs text-left text-zinc-300 hover:bg-zinc-800"
                >
                  Container Logs
                </button>
                <button
                  onClick={handleDemoLimitClick}
                  className="w-full px-3 py-2 text-xs text-left text-zinc-300 hover:bg-zinc-800"
                >
                  Performance Stats
                </button>
              </div>
            )}
          </div>

          {/* Help Menu */}
          <div className="relative">
            <button
              onClick={(e) => toggleMenu('help', e)}
              className="px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800 rounded"
            >
              Help
            </button>
            {activeMenu === 'help' && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-black border border-zinc-700 rounded shadow-lg z-50">
                <button
                  onClick={handleDemoLimitClick}
                  className="w-full px-3 py-2 text-xs text-left text-zinc-300 hover:bg-zinc-800"
                >
                  Documentation
                </button>
                <button
                  onClick={handleDemoLimitClick}
                  className="w-full px-3 py-2 text-xs text-left text-zinc-300 hover:bg-zinc-800"
                >
                  Keyboard Shortcuts
                </button>
                <div className="border-t border-zinc-800 my-1" />
                <button
                  onClick={handleDemoLimitClick}
                  className="w-full px-3 py-2 text-xs text-left text-zinc-300 hover:bg-zinc-800"
                >
                  About Docker Desktop
                </button>
              </div>
            )}
          </div>
        </div>

        {selectedImage && (
          <div className="flex items-center gap-2 ml-4">
            <span className="text-xs font-medium text-zinc-300">
              {selectedImage.name}
            </span>
            <Badge variant="outline" className="bg-zinc-800 text-zinc-400 border-zinc-700 text-xs py-0 h-4">
              {selectedImage.tag}
            </Badge>
          </div>
        )}
      </div>

      {/* Right: Status, localhost URL, and stats from BottomBar */}
      <div className="flex items-center gap-4">
        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <div className={`h-1.5 w-1.5 rounded-full ${statusConfig.color} animate-pulse`} />
          <span className={`text-xs font-medium ${statusConfig.textColor}`}>
            {statusConfig.text}
          </span>
        </div>

        {/* Localhost URL */}
        <div className="flex items-center">
          {containerStatus === 'running' ? (
            <a
              href={`http://${localhostUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-400 hover:text-zinc-300 hover:underline transition-colors"
            >
              {localhostUrl}
            </a>
          ) : (
            <span className="text-xs text-zinc-600">{localhostUrl}</span>
          )}
        </div>

        {/* Live stats */}
        <div className="flex items-center gap-3">
          {containerStatus === 'running' ? (
            <>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-zinc-500">CPU:</span>
                <span className="text-xs font-medium text-zinc-300">
                  {cpuPercent.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-zinc-500">Memory:</span>
                <span className="text-xs font-medium text-zinc-300">
                  {memoryUsageMB}MB / {memoryLimitMB}MB
                </span>
                <span className="text-xs text-zinc-500">
                  ({memoryPercent.toFixed(0)}%)
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-zinc-600">
                No stats available
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Demo Limits Modal */}
      <DemoLimitsModal
        isOpen={showDemoLimits}
        onClose={() => setShowDemoLimits(false)}
      />
    </div>
  );
}
