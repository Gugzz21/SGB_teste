import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const dataBairros = [
  { name: 'Centro', Leitores: 150 },
  { name: 'Liberdade', Leitores: 230 },
  { name: 'Periferia Norte', Leitores: 450 },
  { name: 'Zona Sul', Leitores: 320 },
];

export default function EthicalReports() {
  return (
    <div className="space-y-6">
      <div className="bg-sgb-bg p-6 rounded-2xl border border-sgb-rosa/30 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <svg className="w-48 h-48 text-sgb-rosa" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        </div>

        <div className="relative z-10 max-w-3xl">
          <h2 className="text-2xl font-bold text-sgb-vinho mb-3">Privacidade de Leitura & DNA Inclusivo</h2>
          <p className="text-slate-700 leading-relaxed">
            Os relatórios demográficos e de impacto social apresentados abaixo são essenciais para a inteligência de curadoria do SGB (ex: saber quais bairros precisam de mais investimentos em literatura).
          </p>
          <div className="mt-4 p-4 bg-white/60 backdrop-blur-sm border-l-4 border-sgb-dourado rounded-r-lg">
            <p className="text-sm font-semibold text-slate-800">
              ⚠️ Alinhamento Ético Rigoroso:
            </p>
            <p className="text-sm text-slate-600 mt-1">
              Todos os dados cruzados são estritamente <span className="font-bold">agregados e anonimizados</span>. O sistema foi desenhado por arquitetura para não permitir o cruzamento do histórico de leitura individual com os dados demográficos do leitor, protegendo integralmente a liberdade de pensamento.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Impacto Social: Leitores Ativos por Região (Bairros)</h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataBairros} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip cursor={{fill: 'rgba(219,39,119,0.05)'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Bar dataKey="Leitores" fill="#db2777" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
