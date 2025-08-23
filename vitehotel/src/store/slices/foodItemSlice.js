import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { foodItemService } from '../../services/foodItemService'

// Async thunks
export const fetchFoodItems = createAsyncThunk(
  'foodItems/fetchFoodItems',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await foodItemService.getFoodItems(params)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch food items')
    }
  }
)

export const fetchFoodItemById = createAsyncThunk(
  'foodItems/fetchFoodItemById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await foodItemService.getFoodItem(id)
      return response.foodItem
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch food item')
    }
  }
)

export const createFoodItem = createAsyncThunk(
  'foodItems/createFoodItem',
  async (foodItemData, { rejectWithValue }) => {
    try {
      const response = await foodItemService.createFoodItem(foodItemData)
      return response.foodItem
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create food item')
    }
  }
)

export const updateFoodItem = createAsyncThunk(
  'foodItems/updateFoodItem',
  async ({ id, foodItemData }, { rejectWithValue }) => {
    try {
      const response = await foodItemService.updateFoodItem(id, foodItemData)
      return response.foodItem
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update food item')
    }
  }
)

export const deleteFoodItem = createAsyncThunk(
  'foodItems/deleteFoodItem',
  async (id, { rejectWithValue }) => {
    try {
      await foodItemService.deleteFoodItem(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete food item')
    }
  }
)

const initialState = {
  foodItems: [],
  currentFoodItem: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pages: 1,
  },
}

const foodItemSlice = createSlice({
  name: 'foodItems',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentFoodItem: (state) => {
      state.currentFoodItem = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Food Items
      .addCase(fetchFoodItems.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFoodItems.fulfilled, (state, action) => {
        state.loading = false
        state.foodItems = action.payload.foodItems
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          pages: action.payload.pages,
        }
      })
      .addCase(fetchFoodItems.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch Food Item by ID
      .addCase(fetchFoodItemById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFoodItemById.fulfilled, (state, action) => {
        state.loading = false
        state.currentFoodItem = action.payload
      })
      .addCase(fetchFoodItemById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create Food Item
      .addCase(createFoodItem.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createFoodItem.fulfilled, (state, action) => {
        state.loading = false
        state.foodItems.unshift(action.payload)
      })
      .addCase(createFoodItem.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update Food Item
      .addCase(updateFoodItem.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateFoodItem.fulfilled, (state, action) => {
        state.loading = false
        const index = state.foodItems.findIndex(item => item._id === action.payload._id)
        if (index !== -1) {
          state.foodItems[index] = action.payload
        }
        if (state.currentFoodItem?._id === action.payload._id) {
          state.currentFoodItem = action.payload
        }
      })
      .addCase(updateFoodItem.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Delete Food Item
      .addCase(deleteFoodItem.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteFoodItem.fulfilled, (state, action) => {
        state.loading = false
        state.foodItems = state.foodItems.filter(item => item._id !== action.payload)
      })
      .addCase(deleteFoodItem.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, clearCurrentFoodItem } = foodItemSlice.actions
export default foodItemSlice.reducer