import api from './api';

export const regionService = {
  // Get all regions with pagination and filters
  getRegions: async (params = {}) => {
    const response = await api.get('/region', { params });
    return response.data;
  },

  // Get region by ID
  getRegion: async (id) => {
    const response = await api.get(`/region/${id}`);
    return response.data;
  },

  // Create new region
  createRegion: async (regionData) => {
    const response = await api.post('/region', regionData);
    return response.data;
  },

  // Update region
  updateRegion: async (id, regionData) => {
    const response = await api.put(`/region/${id}`, regionData);
    return response.data;
  },

  // Delete region
  deleteRegion: async (id) => {
    const response = await api.delete(`/region/${id}`);
    return response.data;
  },
};

export default regionService;