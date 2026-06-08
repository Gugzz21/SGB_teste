import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('sgb_mock_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (email, senha) => {
    // Mock login logic
    let mockUser = null;
    if (email === 'admin@sgb.com') {
      mockUser = { nome: 'Administrador', email, tipo: 'BIBLIOTECARIO', avatar: 'A' }
    } else {
      mockUser = { nome: 'Leitor Padrão', email, tipo: 'LEITOR', avatar: 'L' }
    }
    
    localStorage.setItem('sgb_mock_user', JSON.stringify(mockUser))
    setUser(mockUser)
    return Promise.resolve()
  }

  const register = (data) => {
    // Mock register logic
    const mockUser = { nome: data.nome, email: data.email, tipo: 'LEITOR', avatar: data.nome[0] }
    localStorage.setItem('sgb_mock_user', JSON.stringify(mockUser))
    setUser(mockUser)
    return Promise.resolve()
  }

  const logout = () => {
    localStorage.removeItem('sgb_mock_user')
    setUser(null)
  }

  const isAuthenticated = Boolean(user)
  const isBibliotecario = user?.tipo === 'BIBLIOTECARIO'

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    isBibliotecario,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export default AuthContext
