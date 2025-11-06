'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  DockerImage,
  ContainerStatus,
  ContainerConfig,
  LogEntry,
  HistogramEvent,
} from '@/types/docker';

// Camera choreography phase for building sequence
export type CameraPhase = 'default' | 'buildStart' | 'doorsClosing' | 'terminal' | 'runningRotate';

// App state interface as specified in the PRD
export interface AppState {
  selectedImage: DockerImage | null;
  containerStatus: ContainerStatus;
  config: ContainerConfig | null;
  logs: LogEntry[];
  histogram: HistogramEvent[];
  panelOpen: boolean;
  leftPanelOpen: boolean;
  activeTab: 'logs' | 'histogram' | 'ports';
  cameraPhase: CameraPhase;
  userInteracting: boolean;
}

// Context actions interface
interface AppStateActions {
  setSelectedImage: (image: DockerImage | null) => void;
  setContainerStatus: (status: ContainerStatus) => void;
  setConfig: (config: ContainerConfig | null) => void;
  addLog: (log: LogEntry) => void;
  setLogs: (logs: LogEntry[]) => void;
  addHistogramEvent: (event: HistogramEvent) => void;
  setHistogram: (events: HistogramEvent[]) => void;
  setPanelOpen: (open: boolean) => void;
  setLeftPanelOpen: (open: boolean) => void;
  setActiveTab: (tab: 'logs' | 'histogram' | 'ports') => void;
  setCameraPhase: (phase: CameraPhase) => void;
  setUserInteracting: (interacting: boolean) => void;
}

// Combined context type
type AppStateContextType = AppState & AppStateActions;

// Create context
const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

// Initial state
const initialState: AppState = {
  selectedImage: null,
  containerStatus: 'ready',
  config: null,
  logs: [],
  histogram: [],
  panelOpen: false,
  leftPanelOpen: false,
  activeTab: 'logs',
  cameraPhase: 'default',
  userInteracting: false,
};

// Provider component
export function AppStateProvider({ children }: { children: ReactNode }) {
  const [selectedImage, setSelectedImage] = useState<DockerImage | null>(
    initialState.selectedImage
  );
  const [containerStatus, setContainerStatus] = useState<ContainerStatus>(
    initialState.containerStatus
  );
  const [config, setConfig] = useState<ContainerConfig | null>(
    initialState.config
  );
  const [logs, setLogs] = useState<LogEntry[]>(initialState.logs);
  const [histogram, setHistogram] = useState<HistogramEvent[]>(
    initialState.histogram
  );
  const [panelOpen, setPanelOpen] = useState<boolean>(initialState.panelOpen);
  const [leftPanelOpen, setLeftPanelOpen] = useState<boolean>(initialState.leftPanelOpen);
  const [activeTab, setActiveTab] = useState<'logs' | 'histogram' | 'ports'>(
    initialState.activeTab
  );
  const [cameraPhase, setCameraPhase] = useState<CameraPhase>(initialState.cameraPhase);
  const [userInteracting, setUserInteracting] = useState<boolean>(initialState.userInteracting);

  // Helper function to add a single log entry
  const addLog = (log: LogEntry) => {
    setLogs((prevLogs) => [...prevLogs, log]);
  };

  // Helper function to add a single histogram event
  const addHistogramEvent = (event: HistogramEvent) => {
    setHistogram((prevHistogram) => [...prevHistogram, event]);
  };

  const value: AppStateContextType = {
    selectedImage,
    containerStatus,
    config,
    logs,
    histogram,
    panelOpen,
    leftPanelOpen,
    activeTab,
    cameraPhase,
    userInteracting,
    setSelectedImage,
    setContainerStatus,
    setConfig,
    addLog,
    setLogs,
    addHistogramEvent,
    setHistogram,
    setPanelOpen,
    setLeftPanelOpen,
    setActiveTab,
    setCameraPhase,
    setUserInteracting,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

// Custom hook to use app state
export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
