'use client';

import { useAppState } from '@/lib/app-state-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function TopBar() {
  const { selectedImage, containerStatus, setPanelOpen, activeTab, setActiveTab } = useAppState();

  // Handle action button clicks
  const handleLogsClick = () => {
    setActiveTab('logs');
    setPanelOpen(true);
  };

  const handleSettingsClick = () => {
    setActiveTab('actions');
    setPanelOpen(true);
  };

  const handleStatusToggle = () => {
    // This will be implemented when container control is added
    console.log('Toggle container status');
  };

  return (
    <div className="flex h-[60px] w-full items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4">
      {/* Left: Docker logo/branding */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <svg
            className="h-6 w-6 text-blue-500"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338 0-.676.03-1.01.09-.377-2.18-1.99-3.44-2.058-3.49l-.276-.19-.183.275c-.297.446-.505.98-.602 1.545-.166.959-.014 1.925.45 2.735a3.9 3.9 0 01-1.313.469l-13.77.003c-.407 0-.74.334-.74.741-.022.95.11 1.897.397 2.8.346 1.09.955 2.064 1.764 2.82.935.878 2.407 1.653 4.095 1.653.685.006 1.368-.067 2.04-.22 1.146-.26 2.243-.7 3.24-1.3 1.674-1.006 3.055-2.43 4.01-4.123.88.02 2.79.04 3.77-1.89.015-.036.04-.072.06-.108l.105-.18-.152-.096z" />
          </svg>
          <span className="text-sm font-semibold text-zinc-100">Docker Desktop</span>
        </div>
      </div>

      {/* Center: Container name + image tag */}
      <div className="flex items-center gap-2">
        {selectedImage ? (
          <>
            <span className="text-sm font-medium text-zinc-300">
              {selectedImage.name}
            </span>
            <Badge variant="outline" className="bg-zinc-800 text-zinc-400 border-zinc-700">
              {selectedImage.tag}
            </Badge>
          </>
        ) : (
          <span className="text-sm text-zinc-500">No image selected</span>
        )}
      </div>

      {/* Right: Action buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogsClick}
          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700"
        >
          Logs ▼
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSettingsClick}
          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700"
        >
          ⚙️ Settings
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleStatusToggle}
          className={`border-zinc-700 ${
            containerStatus === 'running'
              ? 'bg-green-900/20 text-green-400 hover:bg-green-900/30'
              : containerStatus === 'error'
              ? 'bg-red-900/20 text-red-400 hover:bg-red-900/30'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          <span className={`mr-1 ${
            containerStatus === 'running'
              ? 'text-green-400'
              : containerStatus === 'error'
              ? 'text-red-400'
              : 'text-zinc-500'
          }`}>
            •
          </span>
          {containerStatus === 'running' ? 'Stop' : 'Run'}
        </Button>
      </div>
    </div>
  );
}
