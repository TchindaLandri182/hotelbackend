import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { roomService } from '../../services/roomService'

// Async thunks
export const fetchRooms = createAsyncThunk(
  'rooms/fetchRooms',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await roomService.getRooms(params)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch rooms')
    }
  }
)

export const fetchRoomById = createAsyncThunk(
  'rooms/fetchRoomById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await roomService.getRoom(id)
      return response.room
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch room')
    }
  }
)

export const createRoom = createAsyncThunk(
  'rooms/createRoom',
  async (roomData, { rejectWithValue }) => {
    try {
      const response = await roomService.createRoom(roomData)
      return response.room
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create room')
    }
  }
)

export const updateRoom = createAsyncThunk(
  'rooms/updateRoom',
  async ({ id, roomData }, { rejectWithValue }) => {
    try {
      const response = await roomService.updateRoom(id, roomData)
      return response.room
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update room')
    }
  }
)

export const deleteRoom = createAsyncThunk(
  'rooms/deleteRoom',
  async (id, { rejectWithValue }) => {
    try {
      await roomService.deleteRoom(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete room')
    }
  }
)

const initialState = {
  rooms: [],
  currentRoom: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pages: 1,
  },
}

const roomSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentRoom: (state) => {
      state.currentRoom = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Rooms
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false
        state.rooms = action.payload.rooms
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          pages: action.payload.pages,
        }
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch Room by ID
      .addCase(fetchRoomById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRoomById.fulfilled, (state, action) => {
        state.loading = false
        state.currentRoom = action.payload
      })
      .addCase(fetchRoomById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create Room
      .addCase(createRoom.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.loading = false
        state.rooms.unshift(action.payload)
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update Room
      .addCase(updateRoom.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateRoom.fulfilled, (state, action) => {
        state.loading = false
        const index = state.rooms.findIndex(room => room._id === action.payload._id)
        if (index !== -1) {
          state.rooms[index] = action.payload
        }
        if (state.currentRoom?._id === action.payload._id) {
          state.currentRoom = action.payload
        }
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Delete Room
      .addCase(deleteRoom.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.loading = false
        state.rooms = state.rooms.filter(room => room._id !== action.payload)
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, clearCurrentRoom } = roomSlice.actions
export default roomSlice.reducer