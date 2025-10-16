import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { clientService } from '../../services/clientService'

// Async thunks
export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await clientService.getClients(params)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch clients')
    }
  }
)

export const fetchClientById = createAsyncThunk(
  'clients/fetchClientById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await clientService.getClient(id)
      return response.client
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch client')
    }
  }
)

export const createClient = createAsyncThunk(
  'clients/createClient',
  async (clientData, { rejectWithValue }) => {
    try {
      const response = await clientService.createClient(clientData)
      return response.client
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create client')
    }
  }
)

export const updateClient = createAsyncThunk(
  'clients/updateClient',
  async ({ id, clientData }, { rejectWithValue }) => {
    try {
      const response = await clientService.updateClient(id, clientData)
      return response.client
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update client')
    }
  }
)

export const deleteClient = createAsyncThunk(
  'clients/deleteClient',
  async (id, { rejectWithValue }) => {
    try {
      await clientService.deleteClient(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete client')
    }
  }
)

const initialState = {
  clients: [],
  currentClient: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pages: 1,
  },
}

const clientSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentClient: (state) => {
      state.currentClient = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Clients
      .addCase(fetchClients.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false
        state.clients = action.payload.data || action.payload.clients
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          pages: action.payload.pages,
        }
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch Client by ID
      .addCase(fetchClientById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchClientById.fulfilled, (state, action) => {
        state.loading = false
        state.currentClient = action.payload
      })
      .addCase(fetchClientById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create Client
      .addCase(createClient.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.loading = false
        state.clients.unshift(action.payload)
      })
      .addCase(createClient.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update Client
      .addCase(updateClient.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.loading = false
        const index = state.clients.findIndex(client => client._id === action.payload._id)
        if (index !== -1) {
          state.clients[index] = action.payload
        }
        if (state.currentClient?._id === action.payload._id) {
          state.currentClient = action.payload
        }
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Delete Client
      .addCase(deleteClient.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.loading = false
        state.clients = state.clients.filter(client => client._id !== action.payload)
      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, clearCurrentClient } = clientSlice.actions
export default clientSlice.reducer