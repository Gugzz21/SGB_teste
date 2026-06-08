import { useState } from 'react';

const mockCatalog = [
  { id: 1, titulo: 'Quarto de Despejo', autor: 'Carolina Maria de Jesus', genero: 'Diário', isDecolonized: true, tags: ['Mulher Negra', 'Favela', 'Resistência'], status: 'DISPONIVEL' },
  { id: 2, titulo: 'A Queda do Céu', autor: 'Davi Kopenawa', genero: 'Relato', isDecolonized: true, tags: ['Literatura Indígena', 'Xamanismo', 'Amazônia'], status: 'EMPRESTADO' },
  { id: 3, titulo: 'Ideias para Adiar o Fim do Mundo', autor: 'Ailton Krenak', genero: 'Ensaio', isDecolonized: true, tags: ['Pensamento Latino-americano', 'Ecologia'], status: 'RESERVADO' },
  { id: 4, titulo: 'Memórias Póstumas de Brás Cubas', autor: 'Machado de Assis', genero: 'Romance', isDecolonized: false, tags: [], status: 'DISPONIVEL' },
];

export default function CatalogList() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Catálogo de Livros</h1>
        <div className="flex gap-3">
          <input 
            type="text" 
            placeholder="Buscar livros, autores ou tags..." 
            className="input-field w-64 md:w-80"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="btn-primary">Novo Livro</button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase">
              <tr>
                <th className="px-6 py-4 font-semibold">Título & Autor</th>
                <th className="px-6 py-4 font-semibold">Tags Éticas</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockCatalog.filter(b => b.titulo.toLowerCase().includes(search.toLowerCase())).map((book) => (
                <tr key={book.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800 text-base">{book.titulo}</p>
                    <p className="text-slate-500">{book.autor} • {book.genero}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {book.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-sgb-rosa/10 text-sgb-rosa border border-sgb-rosa/20 rounded-full text-xs font-semibold shadow-sm">
                          {tag}
                        </span>
                      ))}
                      {!book.isDecolonized && <span className="text-slate-400 text-xs italic">Sem tags específicas</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      book.status === 'DISPONIVEL' ? 'bg-emerald-100 text-emerald-700' :
                      book.status === 'EMPRESTADO' ? 'bg-indigo-100 text-indigo-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {book.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sgb-vinho hover:text-rose-900 font-medium text-sm">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
