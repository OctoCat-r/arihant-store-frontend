import { useEffect, useRef, useState } from 'react'
import { formatINR } from '@/lib/formatters'

interface Series {
  label: string
  data: number[]
  color: string
}

interface LineChartProps {
  series: Series[]
  height?: number
  labels?: string[]
}

export function LineChart({ series, height = 220, labels = [] }: LineChartProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(600)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!wrapRef.current) return
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width))
    ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    let raf: number
    let start: number | null = null
    setProgress(0)
    const tick = (t: number) => {
      if (!start) start = t
      const p = Math.min(1, (t - start) / 1100)
      setProgress(1 - Math.pow(1 - p, 3))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [JSON.stringify(series)])

  const padL = 40, padR = 12, padT = 12, padB = 28
  const allVals = series.flatMap(s => s.data)
  const max = Math.max(...allVals, 1)
  const min = Math.min(...allVals, 0)
  const range = max - min || 1
  const innerW = Math.max(100, width - padL - padR)
  const innerH = height - padT - padB
  const n = series[0]?.data.length ?? 1
  const xStep = innerW / Math.max(1, n - 1)

  const pathFor = (data: number[]) => {
    const pts = data.map((v, i) => [padL + i * xStep, padT + innerH - ((v - min) / range) * innerH])
    const visible = Math.max(2, Math.ceil(pts.length * progress))
    return pts.slice(0, visible).map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ')
  }

  const tickVals = Array.from({ length: 5 }, (_, i) => min + (range / 4) * i)

  return (
    <div ref={wrapRef} className="w-full">
      <svg width={width} height={height}>
        {tickVals.map((v, i) => {
          const y = padT + innerH - ((v - min) / range) * innerH
          return (
            <g key={i}>
              <line x1={padL} y1={y} x2={width - padR} y2={y} stroke="currentColor" strokeOpacity={0.08} strokeDasharray="3 3" />
              <text x={padL - 6} y={y + 3} fontSize="10" textAnchor="end" fill="currentColor" opacity={0.4}>
                {formatINR(v)}
              </text>
            </g>
          )
        })}
        {labels.map((l, i) => {
          if (i % Math.ceil(n / 7) !== 0) return null
          return (
            <text key={i} x={padL + i * xStep} y={height - 8} fontSize="10" textAnchor="middle" fill="currentColor" opacity={0.4}>
              {l}
            </text>
          )
        })}
        {series.map(s => (
          <path key={s.label} d={pathFor(s.data)} fill="none" stroke={s.color}
                strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
        ))}
      </svg>
      <div className="mt-2 flex flex-wrap items-center gap-3 px-1">
        {series.map(s => (
          <span key={s.label} className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  )
}
