import React, { createContext, useContext, useState, useEffect } from 'react'
import { getAuthUser, getAuthToken, setAuthData, clearAuthData, isAuthenticated } from '../utils/auth'
import { authAPI } from '../services/api'
import { useCookies } from 'react-cookie'
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
  const [cookies, setCookie, removeCookie] = useCookies(['token', 'user', 'requiresVerification', 'requiresProfileCompletion'])
  const [requiresVerification, setRequiresVerification] = useState(false)
  const [requiresProfileCompletion, setRequiresProfileCompletion] = useState(false)

  useEffect(() => {
    // Check if user is logged in on app start
    if (cookies.token && cookies.user) {
      setUser(cookies.user)
      setRequiresVerification(cookies?.requiresVerification==='true')
      setRequiresProfileCompletion(cookies?.requiresProfileCompletion==='true') 
    }
    setLoading(false)
  }, [cookies])

  const login = async (email, password) => {
    try {
      setLoading(true)
      const response = await authAPI.signin(email, password)
      const { token, 
        user: userData, 
        expiresIn, 
        message, 
        requiresVerification, 
        requiresProfileCompletion 
      } = response.data

      if (requiresVerification) {
        setCookie('requiresVerification', JSON.stringify('true'), { 
          path: '/', 
          expires: new Date(expiresIn),
          secure: true,
          sameSite: 'strict'
        })
        setRequiresVerification(true)
      }

      if (requiresProfileCompletion) {
        setCookie('requiresProfileCompletion', JSON.stringify('true'), { 
          path: '/', 
          expires: new Date(expiresIn),
          secure: true,
          sameSite: 'strict'
        })
        setRequiresProfileCompletion(true)
      }

      setCookie('token', token, { 
          path: '/', 
          expires: new Date(expiresIn),
          secure: true,
          sameSite: 'strict'
        })
        setCookie('user', userData, { 
          path: '/', 
          expires: new Date(expiresIn),
          secure: true,
          sameSite: 'strict'
        })

      setUser(userData)
      toast.success(message || 'Login successful!')
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
      
      if (response.data.token) {
       const { token, user: newUser, expiresIn } = response.data
               
        // Set cookies with expiration
        setCookie('token', token, { 
          path: '/', 
          expires: new Date(expiresIn),
          secure: true,
          sameSite: 'strict'
        })
        setCookie('user', newUser, { 
          path: '/', 
          expires: new Date(expiresIn),
          secure: true,
          sameSite: 'strict'
        })
        setCookie('requiresProfileCompletion', JSON.stringify('true'), { 
          path: '/', 
          expires: new Date(expiresIn),
          secure: true,
          sameSite: 'strict'
        })
        setCookie('requiresVerification', JSON.stringify('true'), { 
          path: '/', 
          expires: new Date(expiresIn),
          secure: true,
          sameSite: 'strict'
        })
        
        setUser(newUser)
        setRequiresProfileCompletion(true)
        setRequiresVerification(true)
        toast.success(response.data.message || 'Registration successful!')
        return { success: true, user: newUser }
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
      const { requiresProfileCompletion, user: updatedUser} = response.data

      if (requiresProfileCompletion && updatedUser) {

        setCookie('requiresVerification', JSON.stringify('true'), { 
          path: '/', 
          expires: cookies.user ? new Date(Date.now() + 24 * 15 * 60 * 60 * 1000) : undefined,
          secure: true,
          sameSite: 'strict'
        })
        setCookie('user', updatedUser, { 
          path: '/', 
          expires: cookies.user ? new Date(Date.now() + 24 * 15 * 60 * 60 * 1000) : undefined,
          secure: true,
          sameSite: 'strict'
        })

        setRequiresVerification(false)
        setRequiresProfileCompletion(true)
        return { success: true }
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

       setCookie('requiresProfileCompletion', JSON.stringify('false'), { 
          path: '/', 
          expires: cookies.user ? new Date(Date.now() + 24 * 15 * 60 * 60 * 1000) : undefined,
          secure: true,
          sameSite: 'strict'
        })
        setCookie('user', userData, { 
          path: '/', 
          expires: cookies.user ? new Date(Date.now() + 24 * 15 * 60 * 60 * 1000) : undefined,
          secure: true,
          sameSite: 'strict'
        })

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

  const updateUser = async (Data) => {
    try {
      setLoading(true)
      const response = await authAPI.updateUser(user._id, Data)
      const userData = response.data.user

      //  setCookie('requiresProfileCompletion', JSON.stringify('false'), { 
      //     path: '/', 
      //     expires: cookies.user ? new Date(Date.now() + 24 * 15 * 60 * 60 * 1000) : undefined,
      //     secure: true,
      //     sameSite: 'strict'
      //   })
        setCookie('user', userData, { 
          path: '/', 
          expires: cookies.user ? new Date(Date.now() + 24 * 15 * 60 * 60 * 1000) : undefined,
          secure: true,
          sameSite: 'strict'
        })

      setUser(userData)
      // setRequiresProfileCompletion(false)
      toast.success('Profile updated successfully!')
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

  // const updateUser = (userData) => {
  //   setUser(userData)
  //   setAuthData(getAuthToken(), userData)
  // }

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