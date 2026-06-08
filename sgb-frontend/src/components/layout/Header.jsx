import { useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Header() {
  const location = useLocation()
  const { user } = useAuth()
  
  const getPageTitle = () => {
    switch(location.pathname) {
      case '/dashboard': return 'Centro de Comando'
      case '/catalogo': return 'Catálogo de Livros'
      case '/reservas': return 'Fila de Espera Justa'
      case '/emprestimos': return 'Controle de Empréstimos'
      case '/relatorios': return 'Relatórios Éticos'
      default: return 'SGB'
    }
  }

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-slate-800">{getPageTitle()}</h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-400 hover:text-sgb-rosa transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-sgb-rosa rounded-full border border-white"></span>
        </button>
      </div>
    </header>
  )
}
