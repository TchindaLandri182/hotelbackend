import api from './api'

export const invoiceService = {
  // Get all invoices with pagination and filters
  getInvoices: async (params = {}) => {
    const response = await api.get('/invoice', { params })
    return response.data
  },

  // Get invoice by ID
  getInvoice: async (id) => {
    const response = await api.get(`/invoice/${id}`)
    return response.data
  },

  // Create new invoice
  createInvoice: async (invoiceData) => {
    const response = await api.post('/invoice', invoiceData)
    return response.data
  },

  // Update invoice
  updateInvoice: async (id, invoiceData) => {
    const response = await api.put(`/invoice/${id}`, invoiceData)
    return response.data
  },

  // Delete invoice
  deleteInvoice: async (id) => {
    const response = await api.delete(`/invoice/${id}`)
    return response.data
  },
}

export default invoiceService