import axios from 'axios'

// API instance oluştur
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - her istekte token'ı ekle
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor - hata durumlarını yakala
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// Auth endpoints
export const auth = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  check: () => api.get('/auth/check')
}

// User endpoints
export const users = {
  getProfile: (username) => api.get(`/users/${username}`),
  updateProfile: (data) => api.patch('/users/me', data),
  uploadAvatar: (formData) => api.post('/users/me/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// Repository endpoints
export const repositories = {
  getAll: () => api.get('/repositories'),
  getOne: (owner, name) => api.get(`/repositories/${owner}/${name}`),
  create: (data) => api.post('/repositories', data),
  update: (owner, name, data) => api.patch(`/repositories/${owner}/${name}`, data),
  delete: (owner, name) => api.delete(`/repositories/${owner}/${name}`),
  updateAllWebsites: async () => {
    try {
      const response = await api.post('/repositories/update-all-websites');
      console.log('All websites updated:', response.data);
      await useStore.getState().fetchRepositories();
    } catch (error) {
      console.error('Failed to update websites:', error);
    }
  },
  updateAllStars: async () => {
    try {
      const response = await api.post('/repositories/update-all-stars');
      console.log('All stars updated:', response.data);
      await useStore.getState().fetchRepositories();
    } catch (error) {
      console.error('Failed to update stars:', error);
    }
  }
}

// api instance'ını da export et
export { api }

export default api 