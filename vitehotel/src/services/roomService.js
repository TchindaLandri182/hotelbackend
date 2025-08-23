import api from './api'

export const roomService = {
  // Get all rooms with pagination and filters
  getRooms: async (params = {}) => {
    const response = await api.get('/room', { params })
    return response.data
  },

  // Get room by ID
  getRoom: async (id) => {
    const response = await api.get(`/room/${id}`)
    return response.data
  },

  // Create new room
  createRoom: async (roomData) => {
    const response = await api.post('/room', roomData)
    return response.data
  },

  // Update room
  updateRoom: async (id, roomData) => {
    const response = await api.put(`/room/${id}`, roomData)
    return response.data
  },

  // Delete room
  deleteRoom: async (id) => {
    const response = await api.delete(`/room/${id}`)
    return response.data
  },

  // Get all rooms (simple list)
  getAllRooms: async () => {
    const response = await api.get('/room/all/list')
    return response.data
  },
}

export default roomService