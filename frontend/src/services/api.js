import axios from 'axios'

// Change this URL based on your setup:
// - If using Laravel Herd: 'http://backend.test/api'
// - If using php artisan serve: 'http://localhost:8000/api'
// - Or use environment variable: import.meta.env.VITE_API_URL
const API_URL = import.meta.env.VITE_API_URL || 'http://backend.test/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),
  logout: () => api.post('/logout'),
  getUser: () => api.get('/user'),
  uploadProfilePhoto: (formData) => api.post('/upload-profile-photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
}

export const projectAPI = {
  getAll: () => api.get('/projects'),
  getOne: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
}

export const taskAPI = {
  getAll: () => api.get('/tasks'),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  addSubmission: (id, formData) => api.post(`/tasks/${id}/submissions`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getSubmissions: (id) => api.get(`/tasks/${id}/submissions`),
  deleteSubmission: (taskId, submissionId) => api.delete(`/tasks/${taskId}/submissions/${submissionId}`),
}

export default api
