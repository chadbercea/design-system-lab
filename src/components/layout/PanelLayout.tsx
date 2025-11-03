"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface PanelLayoutContextValue {
  leftPanelOpen: boolean;
  rightDrawerOpen: boolean;
  rightDrawerPinned: boolean;
  topHistogramOpen: boolean;
  bottomTerminalOpen: boolean;
  leftPanelWidth: number;
  rightDrawerWidth: number;
  topHistogramHeight: number;
  bottomTerminalHeight: number;
  toggleLeftPanel: () => void;
  toggleRightDrawer: () => void;
  toggleRightDrawerPin: () => void;
  toggleTopHistogram: () => void;
  toggleBottomTerminal: () => void;
  setLeftPanelWidth: (width: number) => void;
  setRightDrawerWidth: (width: number) => void;
  setTopHistogramHeight: (height: number) => void;
  setBottomTerminalHeight: (height: number) => void;
}

const PanelLayoutContext = React.createContext<
  PanelLayoutContextValue | undefined
>(undefined);

export function usePanelLayout() {
  const context = React.useContext(PanelLayoutContext);
  if (!context) {
    throw new Error("usePanelLayout must be used within PanelLayoutProvider");
  }
  return context;
}

interface PanelLayoutProviderProps {
  children: React.ReactNode;
  defaultLeftPanelOpen?: boolean;
  defaultRightDrawerOpen?: boolean;
  defaultRightDrawerPinned?: boolean;
  defaultTopHistogramOpen?: boolean;
  defaultBottomTerminalOpen?: boolean;
}

export function PanelLayoutProvider({
  children,
  defaultLeftPanelOpen = false,
  defaultRightDrawerOpen = false,
  defaultRightDrawerPinned = false,
  defaultTopHistogramOpen = true,
  defaultBottomTerminalOpen = false,
}: PanelLayoutProviderProps) {
  const [leftPanelOpen, setLeftPanelOpen] = React.useState(
    defaultLeftPanelOpen
  );
  const [rightDrawerOpen, setRightDrawerOpen] = React.useState(
    defaultRightDrawerOpen
  );
  const [rightDrawerPinned, setRightDrawerPinned] = React.useState(
    defaultRightDrawerPinned
  );
  const [topHistogramOpen, setTopHistogramOpen] = React.useState(
    defaultTopHistogramOpen
  );
  const [bottomTerminalOpen, setBottomTerminalOpen] = React.useState(
    defaultBottomTerminalOpen
  );

  const [leftPanelWidth, setLeftPanelWidth] = React.useState(320);
  const [rightDrawerWidth, setRightDrawerWidth] = React.useState(400);
  const [topHistogramHeight, setTopHistogramHeight] = React.useState(80);
  const [bottomTerminalHeight, setBottomTerminalHeight] = React.useState(300);

  const toggleLeftPanel = React.useCallback(() => {
    setLeftPanelOpen((prev) => !prev);
  }, []);

  const toggleRightDrawer = React.useCallback(() => {
    setRightDrawerOpen((prev) => !prev);
  }, []);

  const toggleRightDrawerPin = React.useCallback(() => {
    setRightDrawerPinned((prev) => !prev);
  }, []);

  const toggleTopHistogram = React.useCallback(() => {
    setTopHistogramOpen((prev) => !prev);
  }, []);

  const toggleBottomTerminal = React.useCallback(() => {
    setBottomTerminalOpen((prev) => !prev);
  }, []);

  const value = React.useMemo(
    () => ({
      leftPanelOpen,
      rightDrawerOpen,
      rightDrawerPinned,
      topHistogramOpen,
      bottomTerminalOpen,
      leftPanelWidth,
      rightDrawerWidth,
      topHistogramHeight,
      bottomTerminalHeight,
      toggleLeftPanel,
      toggleRightDrawer,
      toggleRightDrawerPin,
      toggleTopHistogram,
      toggleBottomTerminal,
      setLeftPanelWidth,
      setRightDrawerWidth,
      setTopHistogramHeight,
      setBottomTerminalHeight,
    }),
    [
      leftPanelOpen,
      rightDrawerOpen,
      rightDrawerPinned,
      topHistogramOpen,
      bottomTerminalOpen,
      leftPanelWidth,
      rightDrawerWidth,
      topHistogramHeight,
      bottomTerminalHeight,
      toggleLeftPanel,
      toggleRightDrawer,
      toggleRightDrawerPin,
      toggleTopHistogram,
      toggleBottomTerminal,
    ]
  );

  return (
    <PanelLayoutContext.Provider value={value}>
      {children}
    </PanelLayoutContext.Provider>
  );
}

interface PanelLayoutProps {
  children?: React.ReactNode;
  className?: string;
  topSlot?: React.ReactNode;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  bottomSlot?: React.ReactNode;
  centerSlot?: React.ReactNode;
}

export function PanelLayout({
  children,
  className,
  topSlot,
  leftSlot,
  rightSlot,
  bottomSlot,
  centerSlot,
}: PanelLayoutProps) {
  const {
    leftPanelOpen,
    rightDrawerOpen,
    rightDrawerPinned,
    topHistogramOpen,
    bottomTerminalOpen,
    leftPanelWidth,
    rightDrawerWidth,
    topHistogramHeight,
    bottomTerminalHeight,
  } = usePanelLayout();

  // Calculate the dimensions for the center stage
  // It always stays 100vw x 100vh, panels overlay or split around it
  const centerStageStyle: React.CSSProperties = {
    width: "100vw",
    height: "100vh",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 10,
  };

  // Top histogram adjusts its position based on open side panels
  // ALWAYS respects side panels whether they're overlay or pinned
  const topPanelStyle: React.CSSProperties = {
    height: topHistogramHeight,
    left: leftPanelOpen ? leftPanelWidth : 0,
    right: rightDrawerOpen ? rightDrawerWidth : 0, // Respect ANY open drawer
    transition: "left 300ms ease-in-out, right 300ms ease-in-out",
  };

  // Bottom terminal splits horizontally, constrained by open drawers
  // ALWAYS respects side panels whether they're overlay or pinned
  const bottomPanelStyle: React.CSSProperties = {
    height: bottomTerminalHeight,
    left: leftPanelOpen ? leftPanelWidth : 0,
    right: rightDrawerOpen ? rightDrawerWidth : 0, // Respect ANY open drawer
    transition: "left 300ms ease-in-out, right 300ms ease-in-out",
  };

  return (
    <div
      data-slot="panel-layout"
      className={cn("relative h-screen w-screen overflow-hidden", className)}
    >
      {/* Center Stage - Three.js always 100vh x 100vw */}
      <div
        data-slot="center-stage"
        className="pointer-events-auto"
        style={centerStageStyle}
      >
        {centerSlot || children}
      </div>

      {/* Top Histogram - Responsive to left/right panels */}
      {topSlot && topHistogramOpen && (
        <div
          data-slot="top-histogram"
          className="pointer-events-auto fixed top-0 z-40 bg-zinc-900 border-b border-zinc-800"
          style={topPanelStyle}
        >
          {topSlot}
        </div>
      )}

      {/* Left Panel - Overlays when open (Figma-style) */}
      {leftSlot && leftPanelOpen && (
        <div data-slot="left-panel" className="pointer-events-auto">
          {leftSlot}
        </div>
      )}

      {/* Right Drawer - Overlays when open, reshapes camera when pinned */}
      {rightSlot && rightDrawerOpen && (
        <div data-slot="right-drawer" className="pointer-events-auto">
          {rightSlot}
        </div>
      )}

      {/* Bottom Terminal - Splits view horizontally */}
      {bottomSlot && bottomTerminalOpen && (
        <div
          data-slot="bottom-terminal"
          className="pointer-events-auto fixed bottom-0 z-40 bg-zinc-900 border-t border-zinc-800"
          style={bottomPanelStyle}
        >
          {bottomSlot}
        </div>
      )}
    </div>
  );
}

interface CenterStageProps {
  children: React.ReactNode;
  className?: string;
  onCameraAspectChange?: (aspect: number) => void;
}

export function CenterStage({
  children,
  className,
  onCameraAspectChange,
}: CenterStageProps) {
  const { rightDrawerOpen, rightDrawerPinned, rightDrawerWidth } =
    usePanelLayout();
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!containerRef.current || !onCameraAspectChange) return;

    const updateAspect = () => {
      if (!containerRef.current) return;

      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;

      // When right drawer is pinned, adjust aspect ratio
      if (rightDrawerOpen && rightDrawerPinned) {
        const effectiveWidth = window.innerWidth - rightDrawerWidth;
        const aspect = effectiveWidth / window.innerHeight;
        onCameraAspectChange(aspect);
      } else {
        // Default aspect (full viewport)
        const aspect = width / height;
        onCameraAspectChange(aspect);
      }
    };

    updateAspect();

    window.addEventListener("resize", updateAspect);
    return () => window.removeEventListener("resize", updateAspect);
  }, [
    rightDrawerOpen,
    rightDrawerPinned,
    rightDrawerWidth,
    onCameraAspectChange,
  ]);

  return (
    <div
      ref={containerRef}
      data-slot="center-stage"
      className={cn("h-full w-full", className)}
    >
      {children}
    </div>
  );
}
