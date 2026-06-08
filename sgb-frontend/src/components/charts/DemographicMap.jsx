import { useState, useEffect } from 'react'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { reportsAPI } from '../../api/client'
import Spinner from '../ui/Spinner'

const MOCK_BAIRROS = [
  { name: 'Centro',       value: 145 },
  { name: 'Vila Nova',    value: 112 },
  { name: 'Periferia',    value: 98  },
  { name: 'Quilombo',     value: 67  },
  { name: 'Jardim',       value: 54  },
  { name: 'Outros',       value: 89  },
]

const MOCK_GRUPOS = [
  { grupo: 'Comunidade Quilombola', usuarios: 67 },
  { grupo: 'Movimento Sem Terra',   usuarios: 43 },
  { grupo: 'Povos Indígenas',       usuarios: 38 },
  { grupo: 'Periferia Urbana',      usuarios: 112 },
  { grupo: 'Geral',                 usuarios: 205 },
]

const PIE_COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4', '#64748b']

const CustomPieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="px-3 py-2 rounded-xl"
      style={{ background: 'rgba(15,15,26,0.95)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <p className="text-xs font-semibold text-white">{payload[0].name}</p>
      <p className="text-xs text-slate-400">{payload[0].value} usuários</p>
    </div>
  )
}

const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="px-3 py-2 rounded-xl"
      style={{ background: 'rgba(15,15,26,0.95)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <p className="text-xs font-semibold text-white">{label}</p>
      <p className="text-xs text-slate-400">{payload[0].value} usuários</p>
    </div>
  )
}

export default function DemographicMap() {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [isMock, setIsMock]   = useState(false)

  useEffect(() => {
    reportsAPI.demographics()
      .then((res) => {
        setData(res.data?.data || res.data)
        setIsMock(false)
      })
      .catch(() => {
        setData({ bairros: MOCK_BAIRROS, grupos: MOCK_GRUPOS })
        setIsMock(true)
      })
      .finally(() => setLoading(false))
  }, [])

  const bairros = data?.bairros || MOCK_BAIRROS
  const grupos  = data?.grupos  || MOCK_GRUPOS

  return (
    <div className="glass-card-static p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white">Perfil Demográfico</h3>
          <p className="text-xs text-slate-500 mt-0.5">Distribuição por bairro e grupo social</p>
        </div>
        {isMock && (
          <span className="px-2.5 py-1 text-xs rounded-lg font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20">
            Demo
          </span>
        )}
      </div>

      {/* Privacy notice */}
      <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg"
        style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
        <svg className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
        <span className="text-xs text-emerald-400">Dados agregados — privacidade garantida</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Spinner size="md" />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Pie chart - by bairro */}
          <div>
            <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Por Bairro</p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={bairros}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {bairros.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} opacity={0.85} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={7}
                  wrapperStyle={{ fontSize: '10px', color: '#94a3b8' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar chart - by grupo */}
          <div>
            <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Por Grupo Social</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={grupos} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="grupo"
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={100}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar
                  dataKey="usuarios"
                  name="Usuários"
                  fill="#8b5cf6"
                  radius={[0, 4, 4, 0]}
                  fillOpacity={0.8}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
