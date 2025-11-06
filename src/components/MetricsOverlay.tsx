'use client'

import { useEffect, useState } from 'react'

interface MetricData {
  label: string
  value: string
  sparkline: number[]
  color: string
}

interface MetricsOverlayProps {
  show: boolean
}

export function MetricsOverlay({ show }: MetricsOverlayProps) {
  const [opacity, setOpacity] = useState(0)
  const [metrics, setMetrics] = useState<MetricData[]>([
    {
      label: 'CPU Usage',
      value: '24.3%',
      sparkline: [12, 18, 15, 22, 19, 24, 21, 24],
      color: '#00FF00'
    },
    {
      label: 'Memory',
      value: '512 MB',
      sparkline: [200, 280, 320, 380, 420, 480, 500, 512],
      color: '#00FFFF'
    },
    {
      label: 'Network I/O',
      value: '1.2 MB/s',
      sparkline: [0.4, 0.8, 0.6, 1.0, 0.9, 1.2, 1.1, 1.2],
      color: '#FF00FF'
    },
    {
      label: 'Requests/sec',
      value: '847',
      sparkline: [520, 640, 580, 720, 690, 800, 820, 847],
      color: '#FFFF00'
    }
  ])

  // Fade in when show becomes true
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setOpacity(1)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setOpacity(0)
    }
  }, [show])

  // Simulate live data updates
  useEffect(() => {
    if (!show) return

    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => {
        const newSparkline = [...metric.sparkline.slice(1)]
        const lastValue = metric.sparkline[metric.sparkline.length - 1]
        const variation = (Math.random() - 0.5) * 0.2 * lastValue
        const newValue = Math.max(0, lastValue + variation)
        newSparkline.push(newValue)

        let newDisplayValue = metric.value
        if (metric.label === 'CPU Usage') {
          newDisplayValue = `${newValue.toFixed(1)}%`
        } else if (metric.label === 'Memory') {
          newDisplayValue = `${Math.round(newValue)} MB`
        } else if (metric.label === 'Network I/O') {
          newDisplayValue = `${newValue.toFixed(1)} MB/s`
        } else if (metric.label === 'Requests/sec') {
          newDisplayValue = `${Math.round(newValue)}`
        }

        return {
          ...metric,
          value: newDisplayValue,
          sparkline: newSparkline
        }
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [show])

  if (!show && opacity === 0) return null

  return (
    <div
      className="absolute top-16 left-1/2 -translate-x-1/2 z-10 pointer-events-none w-full max-w-5xl px-8"
      style={{
        opacity,
        transition: 'opacity 1s ease-in-out'
      }}
    >
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} metric={metric} index={index} show={show} />
        ))}
      </div>
    </div>
  )
}

function MetricCard({ metric, index, show }: { metric: MetricData; index: number; show: boolean }) {
  const [cardOpacity, setCardOpacity] = useState(0)

  // Sequential fade-in: each card delays by 150ms * index
  useEffect(() => {
    if (show) {
      const delay = index * 150 // 150ms stagger between cards
      const timer = setTimeout(() => {
        setCardOpacity(1)
      }, delay)
      return () => clearTimeout(timer)
    } else {
      setCardOpacity(0)
    }
  }, [show, index])

  return (
    <div
      className="flex flex-col gap-3 p-6 rounded-lg bg-black/80 backdrop-blur-sm border border-black"
      style={{
        opacity: cardOpacity,
        transition: 'opacity 0.6s ease-in-out',
        transform: cardOpacity === 0 ? 'translateY(10px)' : 'translateY(0)',
        transitionProperty: 'opacity, transform'
      }}
    >
      <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">
        {metric.label}
      </div>
      <div className="text-3xl font-bold text-white font-mono leading-none">
        {metric.value}
      </div>
      <div className="mt-2">
        <Sparkline data={metric.sparkline} color={metric.color} />
      </div>
    </div>
  )
}

function Sparkline({ data, color }: { data: number[], color: string }) {
  const width = 160
  const height = 48
  const padding = 4

  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2)
    const y = height - padding - ((value - min) / range) * (height - padding * 2)
    return `${x},${y}`
  }).join(' ')

  const pathD = `M ${points.split(' ').join(' L ')}`

  // Create fill path for gradient effect
  const firstPoint = points.split(' ')[0]
  const lastPoint = points.split(' ')[points.split(' ').length - 1]
  const lastX = lastPoint.split(',')[0]
  const fillPath = `${pathD} L ${lastX},${height} L ${firstPoint.split(',')[0]},${height} Z`

  return (
    <svg width={width} height={height} className="w-full">
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      {/* Fill area */}
      <path
        d={fillPath}
        fill={`url(#gradient-${color})`}
      />
      {/* Line */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
