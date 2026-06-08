import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('sgb_token')
    if (token) {
      authAPI.me()
        .then(res => {
          setUser(res.data)
        })
        .catch(() => {
          localStorage.removeItem('sgb_token')
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, senha) => {
    const res = await authAPI.login({ email, senha })
    localStorage.setItem('sgb_token', res.data.token)
    setUser(res.data.user)
  }

  const register = async (data) => {
    const payload = {
      nome: data.nome,
      email: data.email,
      senha: data.senha,
      bairro: data.bairro || 'Não informado',
      grupoSocial: data.grupoSocial || null
    }
    const res = await authAPI.register(payload)
    localStorage.setItem('sgb_token', res.data.token)
    setUser(res.data.user)
  }

  const logout = () => {
    localStorage.removeItem('sgb_token')
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
