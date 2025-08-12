import api from './api';

export const zoneService = {
  // Get all zones with pagination and filters
  getZones: async (params = {}) => {
    const response = await api.get('/zone', { params });
    return response.data;
  },

  // Get zone by ID
  getZone: async (id) => {
    const response = await api.get(`/zone/${id}`);
    return response.data;
  },

  // Create new zone
  createZone: async (zoneData) => {
    const response = await api.post('/zone', zoneData);
    return response.data;
  },

  // Update zone
  updateZone: async (id, zoneData) => {
    const response = await api.put(`/zone/${id}`, zoneData);
    return response.data;
  },

  // Delete zone
  deleteZone: async (id) => {
    const response = await api.delete(`/zone/${id}`);
    return response.data;
  },
};

export default zoneService;