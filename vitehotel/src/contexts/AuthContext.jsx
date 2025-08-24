import React, { createContext, useContext, useState, useEffect } from 'react'
import { getAuthUser, getAuthToken, setAuthData, clearAuthData, isAuthenticated } from '../utils/auth'
import { authAPI } from '../services/api'
import { toast } from 'react-toastify'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [requiresVerification, setRequiresVerification] = useState(false)
  const [requiresProfileCompletion, setRequiresProfileCompletion] = useState(false)

  useEffect(() => {
    // Initialize auth state from cookies
    const token = getAuthToken()
    const userData = getAuthUser()
    
    if (token && userData) {
      setUser(userData)
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      setLoading(true)
      const response = await authAPI.signin(email, password)
      const { token, user: userData, requiresVerification, requiresProfileCompletion } = response.data

      if (requiresVerification) {
        setRequiresVerification(true)
        return { requiresVerification: true }
      }

      if (requiresProfileCompletion) {
        setAuthData(token, {})
        setRequiresProfileCompletion(true)
        return { requiresProfileCompletion: true }
      }

      setAuthData(token, userData)
      setUser(userData)
      toast.success('Login successful!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  const signup = async (userData) => {
    try {
      setLoading(true)
      const response = await authAPI.signup(userData)
      
      if (response.data.requiresVerification) {
        setRequiresVerification(true)
        toast.success('Account created! Please verify your email.')
        return { requiresVerification: true }
      }

      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed'
      toast.error(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  const verifyEmail = async (code) => {
    try {
      setLoading(true)
      const response = await authAPI.verifyEmailCode(code)
      const { token, requiresProfileCompletion } = response.data

      if (requiresProfileCompletion) {
        setAuthData(token, {})
        setRequiresVerification(false)
        setRequiresProfileCompletion(true)
        return { requiresProfileCompletion: true }
      }

      setRequiresVerification(false)
      toast.success('Email verified successfully!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Verification failed'
      toast.error(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  const completeProfile = async (profileData) => {
    try {
      setLoading(true)
      const response = await authAPI.completeProfile(profileData)
      const userData = response.data.user

      setAuthData(getAuthToken(), userData)
      setUser(userData)
      setRequiresProfileCompletion(false)
      toast.success('Profile completed successfully!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Profile completion failed'
      toast.error(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    clearAuthData()
    setUser(null)
    setRequiresVerification(false)
    setRequiresProfileCompletion(false)
    toast.success('Logged out successfully!')
  }

  const updateUser = (userData) => {
    setUser(userData)
    setAuthData(getAuthToken(), userData)
  }

  const value = {
    user,
    loading,
    requiresVerification,
    requiresProfileCompletion,
    isAuthenticated: isAuthenticated(),
    login,
    signup,
    verifyEmail,
    completeProfile,
    logout,
    updateUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext