import { useState } from 'react';

const initialUsers = [
  { id: 1, nome: 'Maria da Silva', email: 'maria@email.com', tipo: 'LEITOR', bairro: 'Centro', grupo: 'Nenhum' },
  { id: 2, nome: 'João Pedro', email: 'joao@email.com', tipo: 'LEITOR', bairro: 'Periferia Norte', grupo: 'Comunidade' },
  { id: 3, nome: 'Administrador', email: 'admin@sgb.com', tipo: 'BIBLIOTECARIO', bairro: 'Sede', grupo: 'Staff' },
];

export default function UserList() {
  const [users, setUsers] = useState(initialUsers);

  const toggleRole = (userId) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        return { ...u, tipo: u.tipo === 'LEITOR' ? 'BIBLIOTECARIO' : 'LEITOR' };
      }
      return u;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestão de Usuários</h1>
          <p className="text-sm text-slate-500 mt-1">Administração de perfis e elevação de privilégios éticos.</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase">
            <tr>
              <th className="px-6 py-4">Usuário</th>
              <th className="px-6 py-4">Demografia</th>
              <th className="px-6 py-4">Nível de Acesso</th>
              <th className="px-6 py-4 text-right">Ações de Gestão</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-800 text-base">{u.nome}</p>
                  <p className="text-slate-500">{u.email}</p>
                </td>
                <td className="px-6 py-4">
                  <p>{u.bairro}</p>
                  <p className="text-xs text-sgb-rosa">{u.grupo}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    u.tipo === 'BIBLIOTECARIO' ? 'bg-sgb-vinho text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {u.tipo}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => toggleRole(u.id)}
                    className="btn-secondary text-sm font-medium whitespace-nowrap"
                  >
                    {u.tipo === 'LEITOR' ? 'Promover a Bibliotecário' : 'Rebaixar a Leitor'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
