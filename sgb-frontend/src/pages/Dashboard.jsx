import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  // Mock Data
  const emprestimosData = [
    { name: 'Jan', emprestimos: 400, devolucoes: 240 },
    { name: 'Fev', emprestimos: 300, devolucoes: 139 },
    { name: 'Mar', emprestimos: 200, devolucoes: 980 },
    { name: 'Abr', emprestimos: 278, devolucoes: 390 },
    { name: 'Mai', emprestimos: 189, devolucoes: 480 },
    { name: 'Jun', emprestimos: 239, devolucoes: 380 },
  ];

  const demograficoData = [
    { name: 'Centro', value: 400 },
    { name: 'Liberdade', value: 300 },
    { name: 'Periferia Norte', value: 300 },
    { name: 'Zona Sul', value: 200 },
  ];
  const COLORS = ['#881337', '#db2777', '#d97706', '#0f766e'];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 border-l-4 border-slate-700 dark:border-slate-500">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total de Livros</p>
          <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-2">1.234</p>
        </div>
        
        <div className="glass-card p-6 border-l-4 border-sgb-vinho dark:border-rose-500">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Livros Emprestados</p>
          <p className="text-3xl font-bold text-sgb-vinho dark:text-rose-400 mt-2">156</p>
        </div>

        <div className="glass-card p-6 border-l-4 border-emerald-600 dark:border-emerald-400">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Usuários Ativos</p>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">432</p>
        </div>

        <div className="glass-card p-6 border-l-4 border-rose-500 bg-rose-50/50 dark:bg-rose-900/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-rose-800 dark:text-rose-400 uppercase tracking-wider">Multas Pendentes</p>
              <p className="text-3xl font-bold text-rose-600 dark:text-rose-300 mt-2">R$ 245,00</p>
            </div>
            <div className="p-2 bg-rose-100 dark:bg-rose-900/50 rounded-lg">
              <svg className="w-6 h-6 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Empréstimos vs Devoluções</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={emprestimosData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Line type="monotone" dataKey="emprestimos" name="Empréstimos" stroke="#881337" strokeWidth={3} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="devolucoes" name="Devoluções" stroke="#d97706" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Mapeamento Demográfico</h3>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded-full font-medium">Dados Anonimizados</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={demograficoData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {demograficoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
