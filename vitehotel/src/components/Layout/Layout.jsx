import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import Sidebar from './Sidebar'
import Header from './Header'
import { initializeAuth } from '../../store/slices/authSlice'
import { setTheme, setSidebarCollapsed } from '../../store/slices/uiSlice'

const Layout = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { sidebarCollapsed, theme: currentTheme } = useSelector(state => state.ui)

  useEffect(() => {
    // Initialize auth state from localStorage
    dispatch(initializeAuth())
    
    // Apply saved theme
    const savedTheme = localStorage.getItem('theme') || 'light'
    dispatch(setTheme(savedTheme))
    
    // Auto-collapse sidebar on mobile
    if (isMobile && !sidebarCollapsed) {
      dispatch(setSidebarCollapsed(true))
    }
  }, [dispatch, isMobile, sidebarCollapsed])

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      bgcolor: currentTheme === 'dark' ? 'grey.900' : 'grey.50'
    }}>
      <Sidebar />
      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <Header />
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: 3,
            overflow: 'auto',
            bgcolor: currentTheme === 'dark' ? 'grey.900' : 'grey.50'
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default Layout