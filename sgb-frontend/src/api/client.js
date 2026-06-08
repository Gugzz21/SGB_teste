import axios from 'axios'

// ─── Axios Instance ───────────────────────────────────────────
const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Request Interceptor ──────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sgb_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response Interceptor ─────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sgb_token')
      localStorage.removeItem('sgb_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ─── Auth API ─────────────────────────────────────────────────
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
}

// ─── Books API ────────────────────────────────────────────────
export const booksAPI = {
  getAll: (params) => api.get('/books', { params }),
  getOne: (id) => api.get(`/books/${id}`),
  create: (data) => api.post('/books', data),
  update: (id, data) => api.put(`/books/${id}`, data),
  remove: (id) => api.delete(`/books/${id}`),
}

// ─── Authors API ──────────────────────────────────────────────
export const authorsAPI = {
  getAll: (params) => api.get('/authors', { params }),
  create: (data) => api.post('/authors', data),
  update: (id, data) => api.put(`/authors/${id}`, data),
  remove: (id) => api.delete(`/authors/${id}`),
}

// ─── Genres API ───────────────────────────────────────────────
export const genresAPI = {
  getAll: (params) => api.get('/genres', { params }),
  create: (data) => api.post('/genres', data),
  update: (id, data) => api.put(`/genres/${id}`, data),
  remove: (id) => api.delete(`/genres/${id}`),
}

// ─── Users API ────────────────────────────────────────────────
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getOne: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  remove: (id) => api.delete(`/users/${id}`),
  create: (data) => api.post('/users', data),
}

// ─── Loans API ────────────────────────────────────────────────
export const loansAPI = {
  getAll: (params) => api.get('/loans', { params }),
  getOne: (id) => api.get(`/loans/${id}`),
  create: (data) => api.post('/loans', data),
  returnLoan: (id) => api.put(`/loans/${id}/return`),
}

// ─── Reservations API ─────────────────────────────────────────
export const reservationsAPI = {
  getAll: (params) => api.get('/reservations', { params }),
  create: (data) => api.post('/reservations', data),
  cancel: (id) => api.put(`/reservations/${id}/cancel`),
  attend: (id) => api.put(`/reservations/${id}/attend`),
}

// ─── Fines API ────────────────────────────────────────────────
export const finesAPI = {
  getAll: (params) => api.get('/fines', { params }),
  pay: (id) => api.put(`/fines/${id}/pay`),
}

// ─── Reports API ──────────────────────────────────────────────
export const reportsAPI = {
  dashboard: () => api.get('/reports/dashboard'),
  demographics: () => api.get('/reports/demographics'),
  loansOverTime: () => api.get('/reports/loans-over-time'),
  delays: () => api.get('/reports/delays'),
}

export default api
