import axios from 'axios'
import { toast } from 'react-toastify'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://10.54.72.198:4000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1]
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      window.location.href = '/signin'
    }
    
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  signin: (email, password) => api.post('/user/signin', { email, password }),
  signup: (userData) => api.post('/user/signup', userData),
  verifyEmailCode: (code) => api.post('/user/verify-email', { code }),
  completeProfile: (profileData) => {
    const formData = new FormData()
    formData.append('firstName', profileData.firstName)
    formData.append('lastName', profileData.lastName)
    if (profileData.profileImage) {
      formData.append('profileImage', profileData.profileImage)
    }
    return api.post('/user/complete-profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  generateInviteLink: (inviteData) => api.post('/user/invite', inviteData),
  signupViaInvite: (token, password) => api.post('/user/signup/invite', { token, password }),
  resendVerificationEmail: () => api.post('/user/resend-verification'),
  sendResetPassword: (email) => api.post('/user/send-reset-password', { email }),
  resetPassword: (data) => api.post('/user/reset-password', data),
  updateUser: (id, data) => {
    const formData = new FormData()
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        if (key === 'profileImage' && data[key] instanceof File) {
          formData.append(key, data[key])
        } else if (Array.isArray(data[key])) {
          data[key].forEach(item => formData.append(`${key}[]`, item))
        } else {
          formData.append(key, data[key])
        }
      }
    })
    return api.put(`/user/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  deleteUser: (id) => api.delete(`/user/${id}`),
  getUser: (id) => api.get(`/user/${id}`),
  getUsers: (params) => api.get('/user', { params }),
}

// Hotel API
export const hotelAPI = {
  getAll: (params) => api.get('/hotel', { params }),
  getById: (id) => api.get(`/hotel/${id}`),
  create: (data) => api.post('/hotel', data),
  update: (id, data) => api.put(`/hotel/${id}`, data),
  delete: (id) => api.delete(`/hotel/${id}`)
}

// Room API
export const roomAPI = {
  getAll: (params) => api.get('/room', { params }),
  getAllList: () => api.get('/room/all/list'),
  getById: (id) => api.get(`/room/${id}`),
  create: (data) => api.post('/room', data),
  update: (id, data) => api.put(`/room/${id}`, data),
  delete: (id) => api.delete(`/room/${id}`)
}

// Category API
export const categoryAPI = {
  gets: (params) => api.get('/category', { params }),
  getAll: (params) => api.get('/category/all', { params }),
  getById: (id) => api.get(`/category/${id}`),
  create: (data) => api.post('/category', data),
  update: (id, data) => api.put(`/category/${id}`, data),
  delete: (id) => api.delete(`/category/${id}`)
}

// Client API
export const clientAPI = {
  getAll: (params) => api.get('/client', { params }),
  getAllByHotel: (hotelId) => api.get('/client/all/by-hotel', { params: { hotel: hotelId } }),
  getById: (id) => api.get(`/client/${id}`),
  create: (data) => api.post('/client', data),
  update: (id, data) => api.put(`/client/${id}`, data),
  delete: (id) => api.delete(`/client/${id}`)
}

// Stay API
export const stayAPI = {
  getAll: (params) => api.get('/stay', { params }),
  getById: (id) => api.get(`/stay/${id}`),
  create: (data) => api.post('/stay', data),
  update: (id, data) => api.put(`/stay/${id}`, data),
  delete: (id) => api.delete(`/stay/${id}`)
}

// Invoice API
export const invoiceAPI = {
  getAll: (params) => api.get('/invoice', { params }),
  getById: (id) => api.get(`/invoice/${id}`),
  create: (data) => api.post('/invoice', data),
  update: (id, data) => api.put(`/invoice/${id}`, data),
  delete: (id) => api.delete(`/invoice/${id}`)
}

// Food Item API
export const foodItemAPI = {
  getAll: (params) => api.get('/food-item', { params }),
  getById: (id) => api.get(`/food-item/${id}`),
  create: (data) => api.post('/food-item', data),
  update: (id, data) => api.put(`/food-item/${id}`, data),
  delete: (id) => api.delete(`/food-item/${id}`)
}

// Order Item API
export const orderItemAPI = {
  getAll: (params) => api.get('/order-item', { params }),
  getById: (id) => api.get(`/order-item/${id}`),
  create: (data) => api.post('/order-item', data),
  update: (id, data) => api.put(`/order-item/${id}`, data),
  delete: (id) => api.delete(`/order-item/${id}`)
}

// Price Period API
export const pricePeriodAPI = {
  getAll: (params) => api.get('/price-period', { params }),
  getById: (id) => api.get(`/price-period/${id}`),
  create: (data) => api.post('/price-period', data),
  update: (id, data) => api.put(`/price-period/${id}`, data),
  delete: (id) => api.delete(`/price-period/${id}`)
}

// Zone API
export const zoneAPI = {
  getAll: (params) => api.get('/zone', { params }),
  getById: (id) => api.get(`/zone/${id}`),
  create: (data) => api.post('/zone', data),
  update: (id, data) => api.put(`/zone/${id}`, data),
  delete: (id) => api.delete(`/zone/${id}`)
}

// Location API (Countries, Regions, Cities)
export const locationAPI = {
  // Countries
  getCountries: (params) => api.get('/country', { params }),
  getCountry: (id) => api.get(`/country/${id}`),
  createCountry: (data) => api.post('/country', data),
  updateCountry: (id, data) => api.put(`/country/${id}`, data),
  deleteCountry: (id) => api.delete(`/country/${id}`),
  
  // Regions
  getRegions: (params) => api.get('/region', { params }),
  getRegion: (id) => api.get(`/region/${id}`),
  createRegion: (data) => api.post('/region', data),
  updateRegion: (id, data) => api.put(`/region/${id}`, data),
  deleteRegion: (id) => api.delete(`/region/${id}`),
  
  // Cities
  getCities: (params) => api.get('/city', { params }),
  getCity: (id) => api.get(`/city/${id}`),
  createCity: (data) => api.post('/city', data),
  updateCity: (id, data) => api.put(`/city/${id}`, data),
  deleteCity: (id) => api.delete(`/city/${id}`),
}

// Log API
export const logAPI = {
  getAll: (params) => api.get('/log', { params }),
  getById: (id) => api.get(`/log/${id}`)
}

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentActivities: (params) => api.get('/dashboard/recent-activities', { params }),
  getCalendarData: (params) => api.get('/dashboard/calendar-data', { params })
}

// Country API
export const countryAPI = {
  getAll: (params) => api.get('/country', { params }),
  getById: (id) => api.get(`/country/${id}`),
  create: (data) => api.post('/country', data),
  update: (id, data) => api.put(`/country/${id}`, data),
  delete: (id) => api.delete(`/country/${id}`)
}

// Region API
export const regionAPI = {
  getAll: (params) => api.get('/region', { params }),
  getById: (id) => api.get(`/region/${id}`),
  create: (data) => api.post('/region', data),
  update: (id, data) => api.put(`/region/${id}`, data),
  delete: (id) => api.delete(`/region/${id}`)
}

// City API
export const cityAPI = {
  getAll: (params) => api.get('/city', { params }),
  getById: (id) => api.get(`/city/${id}`),
  create: (data) => api.post('/city', data),
  update: (id, data) => api.put(`/city/${id}`, data),
  delete: (id) => api.delete(`/city/${id}`)
}

// Contact API
export const contactAPI = {
  sendMessage: (data) => api.post('/message/contact', data)
}



export default api