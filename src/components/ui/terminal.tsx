"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TerminalLine {
  id: string;
  text: string;
  type?: "info" | "error" | "warning" | "success" | "command";
  timestamp?: Date;
}

interface TerminalProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: TerminalLine[];
  prompt?: string;
  onCommand?: (command: string) => void;
  showTimestamps?: boolean;
  maxLines?: number;
  autoScroll?: boolean;
}

export function Terminal({
  className,
  lines = [],
  prompt = "$",
  onCommand,
  showTimestamps = false,
  maxLines = 1000,
  autoScroll = true,
  ...props
}: TerminalProps) {
  const [input, setInput] = React.useState("");
  const [history, setHistory] = React.useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = React.useState(-1);
  const terminalRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const displayLines = React.useMemo(
    () => lines.slice(-maxLines),
    [lines, maxLines]
  );

  React.useEffect(() => {
    if (autoScroll && terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [displayLines, autoScroll]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setHistory((prev) => [...prev, input]);
    setHistoryIndex(-1);
    onCommand?.(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const newIndex =
        historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(history[newIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIndex =
        historyIndex === history.length - 1 ? -1 : historyIndex + 1;
      setHistoryIndex(newIndex);
      setInput(newIndex === -1 ? "" : history[newIndex]);
    }
  };

  const getLineColor = (type?: TerminalLine["type"]) => {
    switch (type) {
      case "error":
        return "text-red-400";
      case "warning":
        return "text-yellow-400";
      case "success":
        return "text-green-400";
      case "command":
        return "text-blue-400";
      case "info":
      default:
        return "text-zinc-300";
    }
  };

  return (
    <div
      data-slot="terminal"
      className={cn(
        "flex flex-col bg-zinc-950 border border-zinc-800 rounded font-mono text-sm",
        className
      )}
      onClick={() => inputRef.current?.focus()}
      {...props}
    >
      {/* Terminal Output */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 space-y-1 cursor-text"
      >
        {displayLines.map((line) => (
          <div key={line.id} className="flex items-start gap-2">
            {showTimestamps && line.timestamp && (
              <span className="text-zinc-600 text-xs">
                {line.timestamp.toLocaleTimeString()}
              </span>
            )}
            <span className={cn("whitespace-pre-wrap", getLineColor(line.type))}>
              {line.text}
            </span>
          </div>
        ))}
      </div>

      {/* Terminal Input */}
      {onCommand && (
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border-t border-zinc-800 p-4"
        >
          <span className="text-green-400">{prompt}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-zinc-300 placeholder-zinc-600"
            placeholder="Type a command..."
            autoFocus
          />
        </form>
      )}
    </div>
  );
}

interface TerminalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  actions?: React.ReactNode;
}

export function TerminalHeader({
  className,
  title = "Terminal",
  actions,
  ...props
}: TerminalHeaderProps) {
  return (
    <div
      data-slot="terminal-header"
      className={cn(
        "flex items-center justify-between border-b border-zinc-800 px-4 py-2 bg-zinc-900",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-sm font-medium text-zinc-400">{title}</span>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

interface TerminalOutputProps {
  children: React.ReactNode;
  className?: string;
}

export function TerminalOutput({ children, className }: TerminalOutputProps) {
  return (
    <div
      data-slot="terminal-output"
      className={cn(
        "flex-1 overflow-y-auto p-4 space-y-1 font-mono text-sm text-zinc-300",
        className
      )}
    >
      {children}
    </div>
  );
}

interface TerminalLineComponentProps {
  text: string;
  type?: "info" | "error" | "warning" | "success" | "command";
  className?: string;
}

export function TerminalLineComponent({
  text,
  type = "info",
  className,
}: TerminalLineComponentProps) {
  const getLineColor = () => {
    switch (type) {
      case "error":
        return "text-red-400";
      case "warning":
        return "text-yellow-400";
      case "success":
        return "text-green-400";
      case "command":
        return "text-blue-400";
      case "info":
      default:
        return "text-zinc-300";
    }
  };

  return (
    <div className={cn("whitespace-pre-wrap", getLineColor(), className)}>
      {text}
    </div>
  );
}
