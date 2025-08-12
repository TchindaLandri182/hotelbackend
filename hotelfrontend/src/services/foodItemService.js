import api from './api';

export const foodItemService = {
  // Get all food items with pagination and filters
  getFoodItems: async (params = {}) => {
    const response = await api.get('/food-item', { params });
    return response.data;
  },

  // Get food item by ID
  getFoodItem: async (id) => {
    const response = await api.get(`/food-item/${id}`);
    return response.data;
  },

  // Create new food item
  createFoodItem: async (foodItemData) => {
    const response = await api.post('/food-item', foodItemData);
    return response.data;
  },

  // Update food item
  updateFoodItem: async (id, foodItemData) => {
    const response = await api.put(`/food-item/${id}`, foodItemData);
    return response.data;
  },

  // Delete food item
  deleteFoodItem: async (id) => {
    const response = await api.delete(`/food-item/${id}`);
    return response.data;
  },
};

export default foodItemService;