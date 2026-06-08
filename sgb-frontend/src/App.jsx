import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CatalogList from './pages/catalog/CatalogList'
import ReservationPanel from './pages/reservations/ReservationPanel'
import LoanPanel from './pages/loans/LoanPanel'
import EthicalReports from './pages/reports/EthicalReports'
import UserList from './pages/users/UserList'

const ProtectedRoute = ({ children, requireBibliotecario }) => {
  const { isAuthenticated, isBibliotecario, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sgb-vinho"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requireBibliotecario && !isBibliotecario) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function App() {
  const { isBibliotecario } = useAuth(); // Assuming we export it outside, wait, App is inside AuthProvider so we can use useAuth. No, App is wrapped in main.jsx, so we can use useAuth here!

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Root redirect logic based on Role */}
      <Route path="/" element={<Navigate to={isBibliotecario ? "/dashboard" : "/catalogo"} replace />} />
      
      {/* Shared/Leitor Routes */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/catalogo" element={<CatalogList />} />
        <Route path="/reservas" element={<ReservationPanel />} />
        <Route path="/emprestimos-leitor" element={<LoanPanel />} />
      </Route>

      {/* Bibliotecario Exclusive Routes */}
      <Route element={<ProtectedRoute requireBibliotecario><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/emprestimos" element={<LoanPanel />} />
        <Route path="/usuarios" element={<UserList />} />
        <Route path="/relatorios" element={<EthicalReports />} />
      </Route>
    </Routes>
  )
}

export default App
