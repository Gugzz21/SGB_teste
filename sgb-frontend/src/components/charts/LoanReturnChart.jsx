import { useState, useEffect } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { reportsAPI } from '../../api/client'
import Spinner from '../ui/Spinner'

const MOCK_DATA = [
  { mes: 'Jan', emprestimos: 42, devolucoes: 38 },
  { mes: 'Fev', emprestimos: 58, devolucoes: 49 },
  { mes: 'Mar', emprestimos: 65, devolucoes: 60 },
  { mes: 'Abr', emprestimos: 71, devolucoes: 65 },
  { mes: 'Mai', emprestimos: 80, devolucoes: 72 },
  { mes: 'Jun', emprestimos: 90, devolucoes: 85 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="px-4 py-3 rounded-xl"
      style={{
        background: 'rgba(15, 15, 26, 0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}>
      <p className="text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wider">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 mb-1">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color }} />
          <span className="text-xs text-slate-300">{entry.name}:</span>
          <span className="text-xs font-bold text-white">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function LoanReturnChart() {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [isMock, setIsMock]   = useState(false)

  useEffect(() => {
    reportsAPI.loansOverTime()
      .then((res) => {
        setData(res.data?.data || res.data || MOCK_DATA)
        setIsMock(false)
      })
      .catch(() => {
        setData(MOCK_DATA)
        setIsMock(true)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="glass-card-static p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-white">Empréstimos vs Devoluções</h3>
          <p className="text-xs text-slate-500 mt-0.5">Últimos 6 meses</p>
        </div>
        {isMock && (
          <span className="px-2.5 py-1 text-xs rounded-lg font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20">
            Demo
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-52">
          <Spinner size="md" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorEmprestimos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="colorDevolucoes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="mes"
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '12px', color: '#94a3b8', paddingTop: '12px' }}
            />
            <Area
              type="monotone"
              dataKey="emprestimos"
              name="Empréstimos"
              stroke="#8b5cf6"
              strokeWidth={2.5}
              fill="url(#colorEmprestimos)"
              dot={{ fill: '#8b5cf6', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="devolucoes"
              name="Devoluções"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="url(#colorDevolucoes)"
              dot={{ fill: '#10b981', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
