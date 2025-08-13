import api from './api';

export const cityService = {
  // Get all cities with pagination and filters
  getCities: async (params = {}) => {
    const response = await api.get('/city', { params });
    return response.data;
  },

  // Get city by ID
  getCity: async (id) => {
    const response = await api.get(`/city/${id}`);
    return response.data;
  },

  // Create new city
  createCity: async (cityData) => {
    const response = await api.post('/city', cityData);
    return response.data;
  },

  // Update city
  updateCity: async (id, cityData) => {
    const response = await api.put(`/city/${id}`, cityData);
    return response.data;
  },

  // Delete city
  deleteCity: async (id) => {
    const response = await api.delete(`/city/${id}`);
    return response.data;
  },
};

export default cityService;