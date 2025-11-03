"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface HistogramProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: number[];
  maxValue?: number;
  barColor?: string;
  height?: number;
}

export function Histogram({
  className,
  data = [],
  maxValue,
  barColor = "bg-blue-500",
  height = 80,
  ...props
}: HistogramProps) {
  const max = maxValue || Math.max(...data, 1);

  // Generate sample data if none provided
  const sampleData = React.useMemo(() => {
    if (data.length > 0) return data;
    return Array.from({ length: 50 }, () => Math.random() * 100);
  }, [data]);

  return (
    <div
      data-slot="histogram"
      className={cn(
        "flex items-end justify-between gap-[2px] bg-zinc-900 border-b border-zinc-800 px-4",
        className
      )}
      style={{ height: `${height}px` }}
      {...props}
    >
      {sampleData.map((value, index) => {
        const barHeight = (value / max) * (height - 20); // 20px padding
        return (
          <div
            key={index}
            className={cn(
              "flex-1 rounded-t transition-all duration-200",
              barColor
            )}
            style={{
              height: `${barHeight}px`,
              opacity: 0.6 + (value / max) * 0.4,
            }}
          />
        );
      })}
    </div>
  );
}

interface HistogramBarProps {
  value: number;
  maxValue: number;
  className?: string;
  color?: string;
}

export function HistogramBar({
  value,
  maxValue,
  className,
  color = "bg-blue-500",
}: HistogramBarProps) {
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <div
      className={cn(
        "relative flex-1 rounded-t transition-all duration-200",
        color,
        className
      )}
      style={{
        height: `${percentage}%`,
        opacity: 0.6 + (value / maxValue) * 0.4,
      }}
    />
  );
}

interface HistogramContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: number;
  title?: string;
  actions?: React.ReactNode;
}

export function HistogramContainer({
  className,
  height = 80,
  title,
  actions,
  children,
  ...props
}: HistogramContainerProps) {
  return (
    <div
      data-slot="histogram-container"
      className={cn(
        "flex flex-col bg-zinc-900 border-b border-zinc-800",
        className
      )}
      style={{ height: `${height}px` }}
      {...props}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800">
          {title && (
            <h3 className="text-xs font-medium text-zinc-400">{title}</h3>
          )}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

interface MetricDisplayProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function MetricDisplay({
  label,
  value,
  unit,
  trend,
  className,
}: MetricDisplayProps) {
  const trendColor =
    trend === "up"
      ? "text-green-500"
      : trend === "down"
        ? "text-red-500"
        : "text-zinc-400";

  return (
    <div
      className={cn(
        "flex flex-col gap-1 px-4 py-2 bg-zinc-800/50 rounded",
        className
      )}
    >
      <span className="text-xs text-zinc-500">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-semibold text-zinc-50">{value}</span>
        {unit && <span className="text-xs text-zinc-400">{unit}</span>}
        {trend && (
          <span className={cn("text-xs font-medium ml-1", trendColor)}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
          </span>
        )}
      </div>
    </div>
  );
}
