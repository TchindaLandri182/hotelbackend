import api from './api'

export const hotelService = {
  // Get all hotels with pagination and filters
  getHotels: async (params = {}) => {
    const response = await api.get('/hotel', { params })
    return response.data
  },

  // Get hotel by ID
  getHotel: async (id) => {
    const response = await api.get(`/hotel/${id}`)
    return response.data
  },

  // Create new hotel
  createHotel: async (hotelData) => {
    const response = await api.post('/hotel', hotelData)
    return response.data
  },

  // Update hotel
  updateHotel: async (id, hotelData) => {
    const response = await api.put(`/hotel/${id}`, hotelData)
    return response.data
  },

  // Delete hotel
  deleteHotel: async (id) => {
    const response = await api.delete(`/hotel/${id}`)
    return response.data
  },
}

export default hotelService