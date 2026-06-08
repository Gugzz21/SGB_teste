import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const mockLoans = [
  { id: 1, user: { nome: 'Carlos Mendes', temMulta: true }, livro: 'Quarto de Despejo', dataRetirada: '01/06/2026', prazo: '15/06/2026', status: 'ATIVO' },
  { id: 2, user: { nome: 'Luiza Sousa', temMulta: false }, livro: 'A Mão e a Luva', dataRetirada: '25/05/2026', prazo: '08/06/2026', status: 'ATRASADO' },
];

export default function LoanPanel() {
  const { isBibliotecario, user } = useAuth();
  const [activeTab, setActiveTab] = useState('novo');
  const [selectedUser, setSelectedUser] = useState(null);

  const mockUserWithFine = { nome: 'Carlos Mendes', multasPendentes: 12.50, status: 'BLOQUEADO' };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 border-b border-slate-200 pb-4 dark:text-slate-100">
        {isBibliotecario ? 'Gestão de Empréstimos e Devoluções' : 'Meus Empréstimos'}
      </h1>

      {isBibliotecario && (
        <div className="flex space-x-2 border-b border-slate-200">
          <button onClick={() => setActiveTab('novo')} className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === 'novo' ? 'border-sgb-vinho text-sgb-vinho' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Registrar Nova Retirada</button>
          <button onClick={() => setActiveTab('ativos')} className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === 'ativos' ? 'border-sgb-vinho text-sgb-vinho' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Processar Devolução</button>
        </div>
      )}

      {isBibliotecario && activeTab === 'novo' && (
        <div className="glass-card p-6 max-w-2xl">
          <form className="space-y-6">
            <div>
              <label className="form-label">Buscar Usuário</label>
              <div className="flex gap-2">
                <input type="text" placeholder="Nome ou ID do Leitor..." className="input-field" />
                <button type="button" onClick={() => setSelectedUser(mockUserWithFine)} className="btn-secondary whitespace-nowrap">Simular Busca</button>
              </div>
            </div>

            {selectedUser && selectedUser.status === 'BLOQUEADO' && (
              <div className="bg-red-50 text-red-700 border border-red-200 p-4 rounded-xl flex items-start gap-4 animate-slideIn">
                <div className="p-2 bg-red-100 rounded-lg">
                  <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg">Empréstimo Bloqueado</h4>
                  <p className="text-sm mt-1">O usuário <strong>{selectedUser.nome}</strong> possui R$ {selectedUser.multasPendentes.toFixed(2)} em multas pendentes. O sistema só permitirá novos empréstimos após a regularização.</p>
                </div>
              </div>
            )}

            <div>
              <label className="form-label">Código do Exemplar</label>
              <input type="text" placeholder="Escaneie ou digite o patrimônio (Ex: EX-001)" className="input-field" disabled={selectedUser?.status === 'BLOQUEADO'} />
            </div>

            <div className="pt-2">
              <button type="button" className="btn-primary w-full" disabled={selectedUser?.status === 'BLOQUEADO'}>Confirmar Retirada</button>
            </div>
          </form>
        </div>
      )}

      {(!isBibliotecario || activeTab === 'ativos') && (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 uppercase">
              <tr>
                <th className="px-6 py-4">Livro</th>
                {isBibliotecario && <th className="px-6 py-4">Leitor</th>}
                <th className="px-6 py-4">Prazo</th>
                <th className="px-6 py-4">Status</th>
                {isBibliotecario && <th className="px-6 py-4">Ações</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {mockLoans
                .filter(loan => isBibliotecario || loan.user.nome === 'Carlos Mendes')
                .map(loan => (
                <tr key={loan.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100">{loan.livro}</td>
                  {isBibliotecario && <td className="px-6 py-4 dark:text-slate-300">{loan.user.nome}</td>}
                  <td className="px-6 py-4 dark:text-slate-300">{loan.prazo}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${loan.status === 'ATIVO' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{loan.status}</span>
                  </td>
                  {isBibliotecario && (
                    <td className="px-6 py-4">
                      <button className="text-sgb-vinho hover:text-rose-900 font-bold">Processar</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
