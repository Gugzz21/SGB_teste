import { useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

export default function Header() {
  const location = useLocation()
  const { user } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()
  
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
    <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="flex items-center justify-between px-8 py-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{getPageTitle()}</h2>
        </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-100 transition-colors bg-slate-100 dark:bg-slate-800 rounded-full"
          title="Alternar Tema"
        >
          {isDarkMode ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          )}
        </button>

        <button className="relative p-2 text-slate-400 hover:text-sgb-rosa transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-sgb-rosa rounded-full border border-white"></span>
        </button>
      </div>
      </div>
    </header>
  )
}
