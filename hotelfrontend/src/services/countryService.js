import api from './api';

export const countryService = {
  // Get all countries with pagination and filters
  getCountries: async (params = {}) => {
    const response = await api.get('/country', { params });
    return response.data;
  },

  // Get country by ID
  getCountry: async (id) => {
    const response = await api.get(`/country/${id}`);
    return response.data;
  },

  // Create new country
  createCountry: async (countryData) => {
    const response = await api.post('/country', countryData);
    return response.data;
  },

  // Update country
  updateCountry: async (id, countryData) => {
    const response = await api.put(`/country/${id}`, countryData);
    return response.data;
  },

  // Delete country
  deleteCountry: async (id) => {
    const response = await api.delete(`/country/${id}`);
    return response.data;
  },
};

export default countryService;