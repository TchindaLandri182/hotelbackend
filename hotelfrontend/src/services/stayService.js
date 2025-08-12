import api from './api';

export const stayService = {
  // Get all stays with pagination and filters
  getStays: async (params = {}) => {
    const response = await api.get('/stay', { params });
    return response.data;
  },

  // Get stay by ID
  getStay: async (id) => {
    const response = await api.get(`/stay/${id}`);
    return response.data;
  },

  // Create new stay
  createStay: async (stayData) => {
    const response = await api.post('/stay', stayData);
    return response.data;
  },

  // Update stay
  updateStay: async (id, stayData) => {
    const response = await api.put(`/stay/${id}`, stayData);
    return response.data;
  },

  // Delete stay
  deleteStay: async (id) => {
    const response = await api.delete(`/stay/${id}`);
    return response.data;
  },
};

export default stayService;