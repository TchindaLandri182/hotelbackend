import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
} from '@mui/material'
import {
  Bell,
  Sun,
  Moon,
  Languages,
  User,
  LogOut,
  Settings,
  Menu as MenuIcon,
} from 'lucide-react'
import { setTheme, setLanguage, toggleSidebar } from '../../store/slices/uiSlice'
import { logout } from '../../store/slices/authSlice'

const Header = () => {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { theme, sidebarCollapsed } = useSelector(state => state.ui)
  
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null)
  const [languageMenuAnchor, setLanguageMenuAnchor] = useState(null)
  const [notificationMenuAnchor, setNotificationMenuAnchor] = useState(null)

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    dispatch(setTheme(newTheme))
  }

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng)
    dispatch(setLanguage(lng))
    setLanguageMenuAnchor(null)
  }

  const handleLogout = () => {
    dispatch(logout())
    setProfileMenuAnchor(null)
  }

  const notifications = [
    { id: 1, message: 'New booking created for Room 101', time: '2 min ago', type: 'booking' },
    { id: 2, message: 'Payment received for Invoice #INV-001', time: '15 min ago', type: 'payment' },
    { id: 3, message: 'Guest checked in to Room 205', time: '1 hour ago', type: 'checkin' },
  ]

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        bgcolor: theme === 'dark' ? 'grey.800' : 'white',
        color: theme === 'dark' ? 'white' : 'grey.900',
        borderBottom: 1,
        borderColor: theme === 'dark' ? 'grey.700' : 'grey.200'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            onClick={() => dispatch(toggleSidebar())}
            sx={{ 
              mr: 2,
              color: theme === 'dark' ? 'grey.300' : 'grey.700'
            }}
          >
            <MenuIcon size={24} />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {t('dashboard.title')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Notifications */}
          <IconButton
            onClick={(e) => setNotificationMenuAnchor(e.currentTarget)}
            sx={{ color: theme === 'dark' ? 'grey.300' : 'grey.700' }}
          >
            <Badge badgeContent={notifications.length} color="error">
              <Bell size={20} />
            </Badge>
          </IconButton>

          {/* Theme Toggle */}
          <IconButton
            onClick={handleThemeToggle}
            sx={{ color: theme === 'dark' ? 'grey.300' : 'grey.700' }}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </IconButton>

          {/* Language Selector */}
          <IconButton
            onClick={(e) => setLanguageMenuAnchor(e.currentTarget)}
            sx={{ color: theme === 'dark' ? 'grey.300' : 'grey.700' }}
          >
            <Languages size={20} />
          </IconButton>

          {/* Profile Menu */}
          <IconButton
            onClick={(e) => setProfileMenuAnchor(e.currentTarget)}
            sx={{ ml: 1 }}
          >
            <Avatar 
              src={user?.profileImage?.url}
              sx={{ 
                width: 32, 
                height: 32,
                bgcolor: 'primary.main',
                fontSize: '0.875rem'
              }}
            >
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </Avatar>
          </IconButton>
        </Box>

        {/* Notification Menu */}
        <Menu
          anchorEl={notificationMenuAnchor}
          open={Boolean(notificationMenuAnchor)}
          onClose={() => setNotificationMenuAnchor(null)}
          PaperProps={{ sx: { width: 320, maxHeight: 400 } }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Notifications
            </Typography>
          </Box>
          <Divider />
          {notifications.map((notification) => (
            <MenuItem key={notification.id} sx={{ whiteSpace: 'normal', py: 1.5 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {notification.message}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {notification.time}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>

        {/* Language Menu */}
        <Menu
          anchorEl={languageMenuAnchor}
          open={Boolean(languageMenuAnchor)}
          onClose={() => setLanguageMenuAnchor(null)}
        >
          <MenuItem onClick={() => handleLanguageChange('en')}>
            <Typography>English</Typography>
          </MenuItem>
          <MenuItem onClick={() => handleLanguageChange('fr')}>
            <Typography>Français</Typography>
          </MenuItem>
        </Menu>

        {/* Profile Menu */}
        <Menu
          anchorEl={profileMenuAnchor}
          open={Boolean(profileMenuAnchor)}
          onClose={() => setProfileMenuAnchor(null)}
          PaperProps={{ sx: { width: 200 } }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => { navigate('/settings'); setProfileMenuAnchor(null) }}>
            <ListItemIcon>
              <User size={18} />
            </ListItemIcon>
            <ListItemText primary={t('navigation.profile')} />
          </MenuItem>
          <MenuItem onClick={() => { navigate('/settings'); setProfileMenuAnchor(null) }}>
            <ListItemIcon>
              <Settings size={18} />
            </ListItemIcon>
            <ListItemText primary={t('navigation.settings')} />
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogOut size={18} />
            </ListItemIcon>
            <ListItemText primary={t('navigation.logout')} />
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

export default Header