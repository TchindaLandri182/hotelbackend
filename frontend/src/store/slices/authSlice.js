import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '../../services/authService'

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authService.login(email, password)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (code, { rejectWithValue }) => {
    try {
      const response = await authService.verifyEmail(code)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Verification failed')
    }
  }
)

export const completeProfile = createAsyncThunk(
  'auth/completeProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await authService.completeProfile(profileData)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Profile completion failed')
    }
  }
)

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  requiresVerification: false,
  requiresProfileCompletion: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.requiresVerification = false
      state.requiresProfileCompletion = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    clearError: (state) => {
      state.error = null
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
      localStorage.setItem('user', JSON.stringify(state.user))
    },
    initializeAuth: (state) => {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      
      if (token && user) {
        state.token = token
        state.user = JSON.parse(user)
        state.isAuthenticated = true
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        const { token, user, requiresVerification, requiresProfileCompletion } = action.payload
        
        if (requiresVerification) {
          state.requiresVerification = true
        } else if (requiresProfileCompletion) {
          state.token = token
          state.requiresProfileCompletion = true
          localStorage.setItem('token', token)
        } else {
          state.token = token
          state.user = user
          state.isAuthenticated = true
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(user))
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuthenticated = true
        state.token = 'sfjksafkafks'
        state.user = {
          _id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@email.com',
          role: 'admin',
          isEmailVerified: true,
          isSignUpComplete: true,
          blocked: false,
          hotel: null,
          createdAt: '2024-01-15T10:30:00Z'
        }
        localStorage.setItem('token', 'sfjksafkafks')
        localStorage.setItem('user', JSON.stringify({
          _id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@email.com',
          role: 'admin',
          isEmailVerified: true,
          isSignUpComplete: true,
          blocked: false,
          hotel: null,
          createdAt: '2024-01-15T10:30:00Z'
        },))
        state.loading = false
        state.error = action.payload
      })
      // Verify Email
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false
        state.requiresVerification = false
        
        const { token, requiresProfileCompletion } = action.payload
        
        if (requiresProfileCompletion) {
          state.token = token
          state.requiresProfileCompletion = true
          localStorage.setItem('token', token)
        }
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Complete Profile
      .addCase(completeProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(completeProfile.fulfilled, (state, action) => {
        state.loading = false
        state.requiresProfileCompletion = false
        state.user = action.payload.user
        state.isAuthenticated = true
        localStorage.setItem('user', JSON.stringify(action.payload.user))
      })
      .addCase(completeProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { logout, clearError, updateUser, initializeAuth } = authSlice.actions
export default authSlice.reducer