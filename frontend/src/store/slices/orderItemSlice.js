import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { orderItemService } from '../../services/orderItemService'

// Async thunks
export const fetchOrderItems = createAsyncThunk(
  'orderItems/fetchOrderItems',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await orderItemService.getOrderItems(params)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order items')
    }
  }
)

export const fetchOrderItemById = createAsyncThunk(
  'orderItems/fetchOrderItemById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await orderItemService.getOrderItem(id)
      return response.orderItem
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order item')
    }
  }
)

export const createOrderItem = createAsyncThunk(
  'orderItems/createOrderItem',
  async (orderItemData, { rejectWithValue }) => {
    try {
      const response = await orderItemService.createOrderItem(orderItemData)
      return response.orderItem
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create order item')
    }
  }
)

export const updateOrderItem = createAsyncThunk(
  'orderItems/updateOrderItem',
  async ({ id, orderItemData }, { rejectWithValue }) => {
    try {
      const response = await orderItemService.updateOrderItem(id, orderItemData)
      return response.orderItem
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order item')
    }
  }
)

export const deleteOrderItem = createAsyncThunk(
  'orderItems/deleteOrderItem',
  async (id, { rejectWithValue }) => {
    try {
      await orderItemService.deleteOrderItem(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete order item')
    }
  }
)

const initialState = {
  orderItems: [],
  currentOrderItem: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pages: 1,
  },
}

const orderItemSlice = createSlice({
  name: 'orderItems',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentOrderItem: (state) => {
      state.currentOrderItem = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Order Items
      .addCase(fetchOrderItems.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrderItems.fulfilled, (state, action) => {
        state.loading = false
        state.orderItems = action.payload.orderItems
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          pages: action.payload.pages,
        }
      })
      .addCase(fetchOrderItems.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch Order Item by ID
      .addCase(fetchOrderItemById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrderItemById.fulfilled, (state, action) => {
        state.loading = false
        state.currentOrderItem = action.payload
      })
      .addCase(fetchOrderItemById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create Order Item
      .addCase(createOrderItem.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createOrderItem.fulfilled, (state, action) => {
        state.loading = false
        state.orderItems.unshift(action.payload)
      })
      .addCase(createOrderItem.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update Order Item
      .addCase(updateOrderItem.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateOrderItem.fulfilled, (state, action) => {
        state.loading = false
        const index = state.orderItems.findIndex(item => item._id === action.payload._id)
        if (index !== -1) {
          state.orderItems[index] = action.payload
        }
        if (state.currentOrderItem?._id === action.payload._id) {
          state.currentOrderItem = action.payload
        }
      })
      .addCase(updateOrderItem.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Delete Order Item
      .addCase(deleteOrderItem.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteOrderItem.fulfilled, (state, action) => {
        state.loading = false
        state.orderItems = state.orderItems.filter(item => item._id !== action.payload)
      })
      .addCase(deleteOrderItem.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, clearCurrentOrderItem } = orderItemSlice.actions
export default orderItemSlice.reducer