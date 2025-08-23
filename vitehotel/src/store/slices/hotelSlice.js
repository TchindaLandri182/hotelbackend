import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { hotelService } from '../../services/hotelService'

// Async thunks
export const fetchHotels = createAsyncThunk(
  'hotels/fetchHotels',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await hotelService.getHotels(params)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch hotels')
    }
  }
)

export const fetchHotelById = createAsyncThunk(
  'hotels/fetchHotelById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await hotelService.getHotel(id)
      return response.hotel
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch hotel')
    }
  }
)

export const createHotel = createAsyncThunk(
  'hotels/createHotel',
  async (hotelData, { rejectWithValue }) => {
    try {
      const response = await hotelService.createHotel(hotelData)
      return response.hotel
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create hotel')
    }
  }
)

export const updateHotel = createAsyncThunk(
  'hotels/updateHotel',
  async ({ id, hotelData }, { rejectWithValue }) => {
    try {
      const response = await hotelService.updateHotel(id, hotelData)
      return response.hotel
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update hotel')
    }
  }
)

export const deleteHotel = createAsyncThunk(
  'hotels/deleteHotel',
  async (id, { rejectWithValue }) => {
    try {
      await hotelService.deleteHotel(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete hotel')
    }
  }
)

const initialState = {
  hotels: [],
  currentHotel: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pages: 1,
  },
}

const hotelSlice = createSlice({
  name: 'hotels',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentHotel: (state) => {
      state.currentHotel = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Hotels
      .addCase(fetchHotels.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading = false
        state.hotels = action.payload.hotels
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          pages: action.payload.pages,
        }
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch Hotel by ID
      .addCase(fetchHotelById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchHotelById.fulfilled, (state, action) => {
        state.loading = false
        state.currentHotel = action.payload
      })
      .addCase(fetchHotelById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create Hotel
      .addCase(createHotel.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createHotel.fulfilled, (state, action) => {
        state.loading = false
        state.hotels.unshift(action.payload)
      })
      .addCase(createHotel.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update Hotel
      .addCase(updateHotel.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateHotel.fulfilled, (state, action) => {
        state.loading = false
        const index = state.hotels.findIndex(hotel => hotel._id === action.payload._id)
        if (index !== -1) {
          state.hotels[index] = action.payload
        }
        if (state.currentHotel?._id === action.payload._id) {
          state.currentHotel = action.payload
        }
      })
      .addCase(updateHotel.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Delete Hotel
      .addCase(deleteHotel.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteHotel.fulfilled, (state, action) => {
        state.loading = false
        state.hotels = state.hotels.filter(hotel => hotel._id !== action.payload)
      })
      .addCase(deleteHotel.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, clearCurrentHotel } = hotelSlice.actions
export default hotelSlice.reducer