import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Sidebar() {
  const { user, isBibliotecario, logout } = useAuth()

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen fixed top-0 left-0">
      <div className="p-6 flex items-center gap-3 border-b border-slate-100">
        <div className="w-10 h-10 bg-sgb-vinho rounded-xl flex items-center justify-center shadow-sm">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-slate-800">SGB</h1>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {isBibliotecario && (
          <NavLink to="/dashboard" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${isActive ? 'bg-sgb-vinho/10 text-sgb-vinho' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Centro de Comando
          </NavLink>
        )}

        <div className="pt-4 pb-2">
          <p className="px-4 text-xs font-bold tracking-wider text-slate-400 uppercase">Meu Espaço</p>
        </div>

        <NavLink to="/catalogo" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${isActive ? 'bg-sgb-vinho/10 text-sgb-vinho' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          Catálogo
        </NavLink>

        <NavLink to="/reservas" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${isActive ? 'bg-sgb-vinho/10 text-sgb-vinho' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
          Reservas & Fila
        </NavLink>

        <NavLink to={isBibliotecario ? "/emprestimos" : "/emprestimos-leitor"} className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${isActive ? 'bg-sgb-vinho/10 text-sgb-vinho' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
          {isBibliotecario ? "Gestão de Empréstimos" : "Meus Empréstimos"}
        </NavLink>

        {isBibliotecario && (
          <>
            <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-bold tracking-wider text-slate-400 uppercase">Administração Global</p>
            </div>
            
            <NavLink to="/usuarios" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${isActive ? 'bg-sgb-vinho/10 text-sgb-vinho' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              Usuários
            </NavLink>
            
            <NavLink to="/relatorios" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${isActive ? 'bg-sgb-vinho/10 text-sgb-vinho' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Relatórios Éticos
            </NavLink>
          </>
        )}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
          <div className="w-10 h-10 rounded-full bg-sgb-dourado text-white flex items-center justify-center font-bold">
            {user?.avatar || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{user?.nome}</p>
            <p className="text-xs text-sgb-rosa font-medium truncate">{user?.tipo}</p>
          </div>
          <button onClick={logout} className="p-2 text-slate-400 hover:text-rose-600 transition-colors" title="Sair">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </div>
    </aside>
  )
}
