import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { reportsAPI } from '../../api/client'
import Spinner from '../ui/Spinner'

const MOCK_DATA = [
  { mes: 'Jan', atrasos: 8,  multas: 124.5 },
  { mes: 'Fev', atrasos: 12, multas: 187.0 },
  { mes: 'Mar', atrasos: 6,  multas: 93.0  },
  { mes: 'Abr', atrasos: 15, multas: 225.5 },
  { mes: 'Mai', atrasos: 9,  multas: 145.0 },
  { mes: 'Jun', atrasos: 11, multas: 168.5 },
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
          <span className="text-xs font-bold text-white">
            {entry.name === 'Multas R$'
              ? `R$ ${Number(entry.value).toFixed(2)}`
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function DelayChart() {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [isMock, setIsMock]   = useState(false)

  useEffect(() => {
    reportsAPI.delays()
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
          <h3 className="text-base font-bold text-white">Atrasos e Multas</h3>
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
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="mes"
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `R$${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '12px', color: '#94a3b8', paddingTop: '12px' }}
            />
            <Bar
              yAxisId="left"
              dataKey="atrasos"
              name="Atrasos"
              fill="#f43f5e"
              radius={[4, 4, 0, 0]}
              fillOpacity={0.85}
            />
            <Bar
              yAxisId="right"
              dataKey="multas"
              name="Multas R$"
              fill="#f59e0b"
              radius={[4, 4, 0, 0]}
              fillOpacity={0.85}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
