import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { stayService } from '../../services/stayService'

// Async thunks
export const fetchStays = createAsyncThunk(
  'stays/fetchStays',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await stayService.getStays(params)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stays')
    }
  }
)

export const fetchStayById = createAsyncThunk(
  'stays/fetchStayById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await stayService.getStay(id)
      return response.stay
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stay')
    }
  }
)

export const createStay = createAsyncThunk(
  'stays/createStay',
  async (stayData, { rejectWithValue }) => {
    try {
      const response = await stayService.createStay(stayData)
      return response.stay
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create stay')
    }
  }
)

export const updateStay = createAsyncThunk(
  'stays/updateStay',
  async ({ id, stayData }, { rejectWithValue }) => {
    try {
      const response = await stayService.updateStay(id, stayData)
      return response.stay
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update stay')
    }
  }
)

export const deleteStay = createAsyncThunk(
  'stays/deleteStay',
  async (id, { rejectWithValue }) => {
    try {
      await stayService.deleteStay(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete stay')
    }
  }
)

const initialState = {
  stays: [],
  currentStay: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pages: 1,
  },
}

const staySlice = createSlice({
  name: 'stays',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentStay: (state) => {
      state.currentStay = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Stays
      .addCase(fetchStays.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStays.fulfilled, (state, action) => {
        state.loading = false
        state.stays = action.payload.stays
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          pages: action.payload.pages,
        }
      })
      .addCase(fetchStays.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch Stay by ID
      .addCase(fetchStayById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStayById.fulfilled, (state, action) => {
        state.loading = false
        state.currentStay = action.payload
      })
      .addCase(fetchStayById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create Stay
      .addCase(createStay.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createStay.fulfilled, (state, action) => {
        state.loading = false
        state.stays.unshift(action.payload)
      })
      .addCase(createStay.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update Stay
      .addCase(updateStay.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateStay.fulfilled, (state, action) => {
        state.loading = false
        const index = state.stays.findIndex(stay => stay._id === action.payload._id)
        if (index !== -1) {
          state.stays[index] = action.payload
        }
        if (state.currentStay?._id === action.payload._id) {
          state.currentStay = action.payload
        }
      })
      .addCase(updateStay.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Delete Stay
      .addCase(deleteStay.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteStay.fulfilled, (state, action) => {
        state.loading = false
        state.stays = state.stays.filter(stay => stay._id !== action.payload)
      })
      .addCase(deleteStay.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, clearCurrentStay } = staySlice.actions
export default staySlice.reducer