import React, { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Box, CircularProgress, Typography } from '@mui/material'
import { initializeAuth } from '../../store/slices/authSlice'

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch()
  const { user, loading } = useSelector(state => state.auth)
  const location = useLocation()

  useEffect(() => {
    dispatch(initializeAuth())
  }, [dispatch])

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <CircularProgress size={60} sx={{ color: 'white', mb: 3 }} />
          <Typography variant="h6">Loading...</Typography>
        </Box>
      </Box>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute