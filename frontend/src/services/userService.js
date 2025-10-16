import api from './api'

export const userService = {
  // Get all users with pagination and filters
  getUsers: async (params = {}) => {
    const response = await api.get('/user', { params })
    return response.data
  },

    getAllUsers: async (params = {}) => {
    const response = await api.get('/user/all', { params })
    return response.data
  },

  // Get user by ID
  getUser: async (id) => {
    const response = await api.get(`/user/${id}`)
    return response.data
  },

  // Create new user
  createUser: async (userData) => {
    const formData = new FormData()
    Object.keys(userData).forEach(key => {
      if (userData[key] !== null && userData[key] !== undefined) {
        if (key === 'profileImage' && userData[key] instanceof File) {
          formData.append(key, userData[key])
        } else if (Array.isArray(userData[key])) {
          userData[key].forEach(item => formData.append(`${key}[]`, item))
        } else {
          formData.append(key, userData[key])
        }
      }
    })

    const response = await api.post('/user/signup', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Update user
  updateUser: async (id, userData) => {
    const formData = new FormData()
    Object.keys(userData).forEach(key => {
      if (userData[key] !== null && userData[key] !== undefined) {
        if (key === 'profileImage' && userData[key] instanceof File) {
          formData.append(key, userData[key])
        } else if (Array.isArray(userData[key])) {
          userData[key].forEach(item => formData.append(`${key}[]`, item))
        } else {
          formData.append(key, userData[key])
        }
      }
    })

    const response = await api.put(`/user/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await api.delete(`/user/${id}`)
    return response.data
  },

  // Generate invite link
  generateInviteLink: async (inviteData) => {
    const response = await api.post('/user/invite', inviteData)
    return response.data
  },

  // Update user permissions
  updateUserPermissions: async (userId, permissions) => {
    const response = await api.put(`/user/${userId}`, { permissions })
    return response.data
  },
}

export default userService