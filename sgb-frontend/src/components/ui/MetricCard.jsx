import { useEffect, useRef, useState } from 'react'

const COLOR_CONFIG = {
  violet: {
    bg: 'from-violet-600/20 to-purple-600/10',
    icon: 'from-violet-500 to-purple-600',
    glow: 'shadow-glow-violet',
    text: 'text-violet-400',
    trend: 'text-violet-300',
    border: 'border-violet-500/20',
  },
  emerald: {
    bg: 'from-emerald-600/20 to-teal-600/10',
    icon: 'from-emerald-500 to-teal-500',
    glow: 'shadow-glow-emerald',
    text: 'text-emerald-400',
    trend: 'text-emerald-300',
    border: 'border-emerald-500/20',
  },
  amber: {
    bg: 'from-amber-600/20 to-orange-600/10',
    icon: 'from-amber-500 to-orange-500',
    glow: 'shadow-glow-amber',
    text: 'text-amber-400',
    trend: 'text-amber-300',
    border: 'border-amber-500/20',
  },
  rose: {
    bg: 'from-rose-600/20 to-pink-600/10',
    icon: 'from-rose-500 to-pink-500',
    glow: 'shadow-glow-rose',
    text: 'text-rose-400',
    trend: 'text-rose-300',
    border: 'border-rose-500/20',
  },
  indigo: {
    bg: 'from-indigo-600/20 to-blue-600/10',
    icon: 'from-indigo-500 to-blue-500',
    glow: '',
    text: 'text-indigo-400',
    trend: 'text-indigo-300',
    border: 'border-indigo-500/20',
  },
}

function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0)
  const startTime = useRef(null)
  const frameRef = useRef(null)

  useEffect(() => {
    if (typeof target !== 'number' || isNaN(target)) {
      setCount(target)
      return
    }

    startTime.current = null

    const animate = (ts) => {
      if (!startTime.current) startTime.current = ts
      const elapsed = ts - startTime.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target, duration])

  return count
}

export default function MetricCard({
  icon,
  title,
  value,
  subtitle,
  color = 'violet',
  trend,
  trendUp,
  loading = false,
}) {
  const cfg = COLOR_CONFIG[color] || COLOR_CONFIG.violet
  const numericValue = typeof value === 'number' ? value : parseInt(value) || 0
  const isNumeric = typeof value === 'number' || !isNaN(parseInt(value))
  const animatedValue = useCountUp(isNumeric ? numericValue : 0)

  if (loading) {
    return (
      <div className="glass-card p-6">
        <div className="skeleton h-5 w-24 mb-4 rounded-lg" />
        <div className="skeleton h-9 w-16 mb-2 rounded-lg" />
        <div className="skeleton h-4 w-32 rounded-lg" />
      </div>
    )
  }

  return (
    <div className={`glass-card p-6 cursor-default bg-gradient-to-br ${cfg.bg} border ${cfg.border}`}>
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${cfg.icon} ${cfg.glow} flex-shrink-0`}
          style={{ boxShadow: `0 4px 15px rgba(0,0,0,0.3)` }}>
          {icon}
        </div>

        {trend !== undefined && (
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
            trendUp ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
          }`}>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              {trendUp
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25" />
              }
            </svg>
            {trend}
          </div>
        )}
      </div>

      {/* Value */}
      <div className={`text-3xl font-black text-white mb-1 leading-none`}>
        {isNumeric ? animatedValue.toLocaleString('pt-BR') : value}
      </div>

      {/* Title */}
      <div className="text-sm font-semibold text-slate-300 mb-1">{title}</div>

      {/* Subtitle */}
      {subtitle && (
        <div className="text-xs text-slate-500 mt-1">{subtitle}</div>
      )}
    </div>
  )
}
