"use client";

import * as React from "react";
import { AppStateProvider } from "@/lib/app-state-context";
import {
  PanelLayoutProvider,
  PanelLayout,
  usePanelLayout,
} from "@/components/layout/PanelLayout";
import {
  Panel,
  PanelHeader,
  PanelTitle,
  PanelContent,
  PanelFooter,
} from "@/components/ui/panel";
import { Histogram, MetricDisplay } from "@/components/ui/histogram";
import {
  Terminal,
  TerminalHeader,
  TerminalLineComponent,
} from "@/components/ui/terminal";
import { ContainerScene } from "@/components/three/ContainerScene";
import { Button } from "@/components/ui/button";
import type { ContainerState } from "@/lib/container-colors";

interface TerminalLine {
  id: string;
  text: string;
  type?: "info" | "error" | "warning" | "success" | "command";
  timestamp?: Date;
}

function PanelControls() {
  const {
    leftPanelOpen,
    rightDrawerOpen,
    rightDrawerPinned,
    topHistogramOpen,
    bottomTerminalOpen,
    toggleLeftPanel,
    toggleRightDrawer,
    toggleRightDrawerPin,
    toggleTopHistogram,
    toggleBottomTerminal,
  } = usePanelLayout();

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-700 rounded-xl px-6 py-4 shadow-2xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-sm font-bold text-zinc-50">Demo Controls</span>
          </div>
          <div className="h-4 w-px bg-zinc-700" />
          <span className="text-xs text-zinc-500">Toggle panels to see behavior</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLeftPanel}
            className={`transition-all ${leftPanelOpen ? "bg-blue-500/30 border-blue-500/50 text-blue-300 shadow-lg shadow-blue-500/20" : "hover:bg-zinc-800"}`}
          >
            <span className="mr-2">←</span>
            Inspector
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleTopHistogram}
            className={`transition-all ${topHistogramOpen ? "bg-blue-500/30 border-blue-500/50 text-blue-300 shadow-lg shadow-blue-500/20" : "hover:bg-zinc-800"}`}
          >
            <span className="mr-2">↑</span>
            Metrics
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleRightDrawer}
            className={`transition-all ${rightDrawerOpen ? "bg-blue-500/30 border-blue-500/50 text-blue-300 shadow-lg shadow-blue-500/20" : "hover:bg-zinc-800"}`}
          >
            Properties
            <span className="ml-2">→</span>
          </Button>

          {rightDrawerOpen && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleRightDrawerPin}
              className={`transition-all ${rightDrawerPinned ? "bg-purple-500/30 border-purple-500/50 text-purple-300 shadow-lg shadow-purple-500/20" : "bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30"}`}
            >
              {rightDrawerPinned ? "📌 Pinned" : "📍 Pin"}
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={toggleBottomTerminal}
            className={`transition-all ${bottomTerminalOpen ? "bg-blue-500/30 border-blue-500/50 text-blue-300 shadow-lg shadow-blue-500/20" : "hover:bg-zinc-800"}`}
          >
            <span className="mr-2">↓</span>
            Terminal
          </Button>
        </div>
      </div>
    </div>
  );
}

function CenterStageContent() {
  const [containerState, setContainerState] =
    React.useState<ContainerState>("ready");
  const [cameraAspect, setCameraAspect] = React.useState<number | undefined>(
    undefined
  );

  const { leftPanelOpen, rightDrawerOpen, rightDrawerPinned } = usePanelLayout();

  // State cycling for demo
  React.useEffect(() => {
    const states: ContainerState[] = ["ready", "building", "running", "error"];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % states.length;
      setContainerState(states[currentIndex]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Demo Info overlay */}
      <div className="absolute top-8 left-8 z-20 bg-zinc-900/95 backdrop-blur-xl border border-zinc-700 rounded-xl px-6 py-4 max-w-md shadow-2xl">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <h2 className="text-xl font-bold text-zinc-50">
            Center Stage Demo
          </h2>
        </div>
        <p className="text-sm text-zinc-300 mb-4 leading-relaxed">
          <span className="font-semibold text-blue-400">Three.js viewport</span> always stays{" "}
          <span className="font-mono text-green-400">100vw × 100vh</span>.
          <br />
          <span className="font-semibold text-yellow-400">Top & Bottom panels</span> respect side panels.
          <br />
          Side panels <span className="font-semibold">overlay</span> the 3D container.
        </p>
        <div className="space-y-2 text-xs border-t border-zinc-800 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">Container State:</span>
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-medium">
              {containerState}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">Side Panels:</span>
            <span className={`px-2 py-0.5 rounded font-medium ${
              (leftPanelOpen || rightDrawerOpen)
                ? "bg-blue-500/20 text-blue-400"
                : "bg-zinc-800 text-zinc-500"
            }`}>
              {leftPanelOpen && rightDrawerOpen ? "Both Open (Overlay)" : leftPanelOpen ? "Left Open" : rightDrawerOpen ? "Right Open" : "Closed"}
            </span>
          </div>
          {rightDrawerOpen && rightDrawerPinned && (
            <div className="flex justify-between items-center">
              <span className="text-zinc-500">Right Pinned:</span>
              <span className="px-2 py-0.5 rounded font-medium bg-purple-500/20 text-purple-400">
                Camera Reshaped
              </span>
            </div>
          )}
          {cameraAspect && (
            <div className="flex justify-between items-center">
              <span className="text-zinc-500">Camera Aspect:</span>
              <span className="font-mono text-zinc-300">{cameraAspect.toFixed(3)}</span>
            </div>
          )}
        </div>
        <div className="mt-4 pt-3 border-t border-zinc-800">
          <p className="text-[10px] text-zinc-600 italic">
            MVP Demo - Docker Desktop Integration Concept
          </p>
        </div>
      </div>

      {/* Three.js Scene */}
      <ContainerScene
        state={containerState}
        className="w-full h-full"
        height="100%"
        cameraAspect={cameraAspect}
      />
    </div>
  );
}

function LeftPanelContent() {
  const [cpuUsage, setCpuUsage] = React.useState(45);
  const [memoryUsage, setMemoryUsage] = React.useState(34);

  // Simulate live resource updates
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(Math.floor(Math.random() * 40) + 30); // 30-70%
      setMemoryUsage(Math.floor(Math.random() * 20) + 30); // 30-50%
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <PanelHeader>
        <PanelTitle>Inspector</PanelTitle>
        <div className="text-[10px] text-zinc-500 italic">Mock Data</div>
      </PanelHeader>
      <PanelContent className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-zinc-200 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Container Details
          </h4>
          <div className="space-y-2.5 text-sm bg-zinc-950 rounded-lg p-3 border border-zinc-800">
            <div className="flex justify-between items-center">
              <span className="text-zinc-500">Name:</span>
              <span className="text-zinc-100 font-mono text-xs">webapp-prod</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500">Image:</span>
              <span className="text-blue-400 font-mono text-xs">node:20-alpine</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500">Status:</span>
              <span className="px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-400 font-medium">
                Running
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500">Uptime:</span>
              <span className="text-zinc-300 font-mono text-xs">2h 34m 12s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500">ID:</span>
              <span className="text-zinc-400 font-mono text-[10px]">a8c4f2e9b1d3</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-zinc-200 mb-3">
            Resource Usage
          </h4>
          <div className="space-y-3">
            <div className="bg-zinc-950 rounded-lg p-3 border border-zinc-800">
              <div className="flex justify-between text-xs text-zinc-400 mb-2">
                <span className="font-medium">CPU</span>
                <span className="font-mono text-zinc-300">{cpuUsage}%</span>
              </div>
              <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
                  style={{ width: `${cpuUsage}%` }}
                />
              </div>
            </div>
            <div className="bg-zinc-950 rounded-lg p-3 border border-zinc-800">
              <div className="flex justify-between text-xs text-zinc-400 mb-2">
                <span className="font-medium">Memory</span>
                <span className="font-mono text-zinc-300">{Math.floor((memoryUsage / 50) * 2048)}MB / 2GB</span>
              </div>
              <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                  style={{ width: `${memoryUsage}%` }}
                />
              </div>
            </div>
            <div className="bg-zinc-950 rounded-lg p-3 border border-zinc-800">
              <div className="flex justify-between text-xs text-zinc-400 mb-2">
                <span className="font-medium">Network I/O</span>
                <span className="font-mono text-zinc-300">12.5 MB/s</span>
              </div>
              <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-400"
                  style={{ width: "65%" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-zinc-200 mb-3">Port Mappings</h4>
          <div className="space-y-2 bg-zinc-950 rounded-lg p-3 border border-zinc-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-zinc-500">3000/tcp</span>
              <span className="text-zinc-600">→</span>
              <span className="font-mono text-blue-400">localhost:3000</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-zinc-500">5432/tcp</span>
              <span className="text-zinc-600">→</span>
              <span className="font-mono text-blue-400">localhost:5432</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-zinc-500">6379/tcp</span>
              <span className="text-zinc-600">→</span>
              <span className="font-mono text-blue-400">localhost:6379</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-zinc-200 mb-3">Quick Actions</h4>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <span className="mr-2">🔄</span>
              Restart Container
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <span className="mr-2">📋</span>
              View Logs
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <span className="mr-2">🔍</span>
              Inspect
            </Button>
            <Button variant="destructive" size="sm" className="w-full justify-start">
              <span className="mr-2">⏹</span>
              Stop Container
            </Button>
          </div>
        </div>
      </PanelContent>
    </>
  );
}

function RightDrawerContent() {
  const { rightDrawerPinned } = usePanelLayout();

  return (
    <>
      <PanelHeader>
        <PanelTitle>Properties</PanelTitle>
        <div className="text-xs text-zinc-500">
          {rightDrawerPinned && "(Pinned - Camera reshaped)"}
        </div>
      </PanelHeader>
      <PanelContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-zinc-300 mb-2">
            Environment Variables
          </h4>
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2 bg-zinc-950 rounded border border-zinc-800">
              <div className="text-zinc-500">NODE_ENV</div>
              <div className="text-zinc-300">production</div>
            </div>
            <div className="p-2 bg-zinc-950 rounded border border-zinc-800">
              <div className="text-zinc-500">DATABASE_URL</div>
              <div className="text-zinc-300">postgres://localhost:5432</div>
            </div>
            <div className="p-2 bg-zinc-950 rounded border border-zinc-800">
              <div className="text-zinc-500">API_KEY</div>
              <div className="text-zinc-300">••••••••••••••••</div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-zinc-300 mb-2">
            Mounted Volumes
          </h4>
          <div className="space-y-2 text-xs text-zinc-400">
            <div className="p-2 bg-zinc-950 rounded border border-zinc-800">
              <div className="text-zinc-300 mb-1">/app</div>
              <div className="text-zinc-500 truncate">
                /Users/dev/projects/my-app
              </div>
            </div>
            <div className="p-2 bg-zinc-950 rounded border border-zinc-800">
              <div className="text-zinc-300 mb-1">/data</div>
              <div className="text-zinc-500 truncate">docker-volume-data</div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-zinc-300 mb-2">Networks</h4>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-zinc-950 rounded border border-zinc-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-zinc-300">bridge</span>
                <span className="text-green-400">Connected</span>
              </div>
              <div className="text-zinc-500">172.17.0.2</div>
            </div>
          </div>
        </div>
      </PanelContent>
    </>
  );
}

function TopHistogramContent() {
  return (
    <div className="h-full flex items-center bg-zinc-900 border-b border-zinc-800 px-4 gap-4">
      <div className="flex-1">
        <Histogram height={60} barColor="bg-blue-500" />
      </div>
      <div className="flex gap-3">
        <MetricDisplay label="CPU" value="45" unit="%" trend="up" />
        <MetricDisplay label="Memory" value="680" unit="MB" trend="neutral" />
        <MetricDisplay label="Network" value="12.5" unit="MB/s" trend="down" />
      </div>
    </div>
  );
}

function BottomTerminalContent() {
  const [lines, setLines] = React.useState<TerminalLine[]>([
    {
      id: "1",
      text: "$ docker run -d --name my-app node:20-alpine",
      type: "command",
      timestamp: new Date(),
    },
    {
      id: "2",
      text: "Successfully started container my-app",
      type: "success",
      timestamp: new Date(),
    },
    {
      id: "3",
      text: "$ npm start",
      type: "command",
      timestamp: new Date(),
    },
    {
      id: "4",
      text: "Server listening on port 3000",
      type: "info",
      timestamp: new Date(),
    },
  ]);

  const handleCommand = (command: string) => {
    const newLine: TerminalLine = {
      id: Date.now().toString(),
      text: `$ ${command}`,
      type: "command",
      timestamp: new Date(),
    };

    const responseLine: TerminalLine = {
      id: (Date.now() + 1).toString(),
      text: `Command executed: ${command}`,
      type: "info",
      timestamp: new Date(),
    };

    setLines((prev) => [...prev, newLine, responseLine]);
  };

  return (
    <div className="h-full flex flex-col">
      <TerminalHeader
        title="Terminal"
        actions={
          <Button variant="ghost" size="icon-sm">
            <span className="text-zinc-400">✕</span>
          </Button>
        }
      />
      <Terminal
        lines={lines}
        onCommand={handleCommand}
        autoScroll
        className="flex-1 border-none rounded-none"
      />
    </div>
  );
}

function PanelDemoContent() {
  const {
    leftPanelOpen,
    rightDrawerOpen,
    topHistogramOpen,
    bottomTerminalOpen,
    leftPanelWidth,
    rightDrawerWidth,
    topHistogramHeight,
    bottomTerminalHeight,
  } = usePanelLayout();

  return (
    <>
      <PanelControls />

      <PanelLayout
        topSlot={
          topHistogramOpen && <TopHistogramContent />
        }
        leftSlot={
          <Panel position="left" open={leftPanelOpen} width={leftPanelWidth}>
            <LeftPanelContent />
          </Panel>
        }
        rightSlot={
          <Panel position="right" open={rightDrawerOpen} width={rightDrawerWidth}>
            <RightDrawerContent />
          </Panel>
        }
        bottomSlot={
          bottomTerminalOpen && <BottomTerminalContent />
        }
        centerSlot={<CenterStageContent />}
      />
    </>
  );
}

export default function PanelDemoPage() {
  return (
    <AppStateProvider>
      <PanelLayoutProvider
        defaultLeftPanelOpen={false}
        defaultRightDrawerOpen={false}
        defaultRightDrawerPinned={false}
        defaultTopHistogramOpen={true}
        defaultBottomTerminalOpen={false}
      >
        <PanelDemoContent />
      </PanelLayoutProvider>
    </AppStateProvider>
  );
}
