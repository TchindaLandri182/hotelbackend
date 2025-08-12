import api from './api';

export const orderItemService = {
  // Get all order items with pagination and filters
  getOrderItems: async (params = {}) => {
    const response = await api.get('/order-item', { params });
    return response.data;
  },

  // Get order item by ID
  getOrderItem: async (id) => {
    const response = await api.get(`/order-item/${id}`);
    return response.data;
  },

  // Create new order item
  createOrderItem: async (orderItemData) => {
    const response = await api.post('/order-item', orderItemData);
    return response.data;
  },

  // Update order item
  updateOrderItem: async (id, orderItemData) => {
    const response = await api.put(`/order-item/${id}`, orderItemData);
    return response.data;
  },

  // Delete order item
  deleteOrderItem: async (id) => {
    const response = await api.delete(`/order-item/${id}`);
    return response.data;
  },
};

export default orderItemService;