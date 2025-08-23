import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { invoiceService } from '../../services/invoiceService'

// Async thunks
export const fetchInvoices = createAsyncThunk(
  'invoices/fetchInvoices',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await invoiceService.getInvoices(params)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch invoices')
    }
  }
)

export const fetchInvoiceById = createAsyncThunk(
  'invoices/fetchInvoiceById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await invoiceService.getInvoice(id)
      return response.invoice
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch invoice')
    }
  }
)

export const createInvoice = createAsyncThunk(
  'invoices/createInvoice',
  async (invoiceData, { rejectWithValue }) => {
    try {
      const response = await invoiceService.createInvoice(invoiceData)
      return response.invoice
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create invoice')
    }
  }
)

export const updateInvoice = createAsyncThunk(
  'invoices/updateInvoice',
  async ({ id, invoiceData }, { rejectWithValue }) => {
    try {
      const response = await invoiceService.updateInvoice(id, invoiceData)
      return response.invoice
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update invoice')
    }
  }
)

export const deleteInvoice = createAsyncThunk(
  'invoices/deleteInvoice',
  async (id, { rejectWithValue }) => {
    try {
      await invoiceService.deleteInvoice(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete invoice')
    }
  }
)

const initialState = {
  invoices: [],
  currentInvoice: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pages: 1,
  },
}

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentInvoice: (state) => {
      state.currentInvoice = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Invoices
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false
        state.invoices = action.payload.invoices
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          pages: action.payload.pages,
        }
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch Invoice by ID
      .addCase(fetchInvoiceById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.loading = false
        state.currentInvoice = action.payload
      })
      .addCase(fetchInvoiceById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create Invoice
      .addCase(createInvoice.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.loading = false
        state.invoices.unshift(action.payload)
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update Invoice
      .addCase(updateInvoice.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.loading = false
        const index = state.invoices.findIndex(invoice => invoice._id === action.payload._id)
        if (index !== -1) {
          state.invoices[index] = action.payload
        }
        if (state.currentInvoice?._id === action.payload._id) {
          state.currentInvoice = action.payload
        }
      })
      .addCase(updateInvoice.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Delete Invoice
      .addCase(deleteInvoice.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.loading = false
        state.invoices = state.invoices.filter(invoice => invoice._id !== action.payload)
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, clearCurrentInvoice } = invoiceSlice.actions
export default invoiceSlice.reducer