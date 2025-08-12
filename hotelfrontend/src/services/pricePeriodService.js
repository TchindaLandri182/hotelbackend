import api from './api';

export const pricePeriodService = {
  // Get all price periods with pagination and filters
  getPricePeriods: async (params = {}) => {
    const response = await api.get('/price-period', { params });
    return response.data;
  },

  // Get price period by ID
  getPricePeriod: async (id) => {
    const response = await api.get(`/price-period/${id}`);
    return response.data;
  },

  // Create new price period
  createPricePeriod: async (pricePeriodData) => {
    const response = await api.post('/price-period', pricePeriodData);
    return response.data;
  },

  // Update price period
  updatePricePeriod: async (id, pricePeriodData) => {
    const response = await api.put(`/price-period/${id}`, pricePeriodData);
    return response.data;
  },

  // Delete price period
  deletePricePeriod: async (id) => {
    const response = await api.delete(`/price-period/${id}`);
    return response.data;
  },
};

export default pricePeriodService;