import api from './api';

export const clientService = {
  // Get all clients with pagination and filters
  getClients: async (params = {}) => {
    const response = await api.get('/client', { params });
    return response.data;
  },

  // Get client by ID
  getClient: async (id) => {
    const response = await api.get(`/client/${id}`);
    return response.data;
  },

  // Create new client
  createClient: async (clientData) => {
    const response = await api.post('/client', clientData);
    return response.data;
  },

  // Update client
  updateClient: async (id, clientData) => {
    const response = await api.put(`/client/${id}`, clientData);
    return response.data;
  },

  // Delete client
  deleteClient: async (id) => {
    const response = await api.delete(`/client/${id}`);
    return response.data;
  },

  // Get all clients by hotel
  getAllClientsByHotel: async (hotelId) => {
    const response = await api.get('/client/all/by-hotel', { params: { hotel: hotelId } });
    return response.data;
  },
};

export default clientService;