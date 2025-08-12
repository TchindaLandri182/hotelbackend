import api from './api';

export const categoryService = {
  // Get all categories with pagination and filters
  getCategories: async (params = {}) => {
    const response = await api.get('/category', { params });
    return response.data;
  },

  // Get category by ID
  getCategory: async (id) => {
    const response = await api.get(`/category/${id}`);
    return response.data;
  },

  // Create new category
  createCategory: async (categoryData) => {
    const response = await api.post('/category', categoryData);
    return response.data;
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/category/${id}`, categoryData);
    return response.data;
  },

  // Delete category
  deleteCategory: async (id) => {
    const response = await api.delete(`/category/${id}`);
    return response.data;
  },
};

export default categoryService;