import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Divider,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  Home,
  Hotel,
  Key,
  Tag,
  Users,
  Calendar,
  FileText,
  UtensilsCrossed,
  ShoppingCart,
  DollarSign,
  MapPin,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Shield,
} from 'lucide-react'
import { toggleSidebar } from '../../store/slices/uiSlice'

const Sidebar = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  const { user } = useSelector(state => state.auth)
  const { sidebarCollapsed, theme: currentTheme } = useSelector(state => state.ui)

  const hasPermission = (permission) => {
    if (!user) return false
    if (user.role === 'admin') return true
    return user.permissions && user.permissions.includes(permission)
  }

  const navigationItems = [
    {
      name: t('navigation.dashboard'),
      path: '/dashboard',
      icon: Home,
      permission: null
    },
    {
      name: t('navigation.hotels'),
      path: '/hotels',
      icon: Hotel,
      permission: 4002
    },
    {
      name: t('navigation.rooms'),
      path: '/rooms',
      icon: Key,
      permission: 8002
    },
    {
      name: t('navigation.categories'),
      path: '/categories',
      icon: Tag,
      permission: 1002
    },
    {
      name: t('navigation.clients'),
      path: '/clients',
      icon: Users,
      permission: 2002
    },
    {
      name: t('navigation.stays'),
      path: '/stays',
      icon: Calendar,
      permission: 9002
    },
    {
      name: t('navigation.invoices'),
      path: '/invoices',
      icon: FileText,
      permission: 5002
    },
    {
      name: t('navigation.food_items'),
      path: '/food-items',
      icon: UtensilsCrossed,
      permission: 3002
    },
    {
      name: t('navigation.order_items'),
      path: '/order-items',
      icon: ShoppingCart,
      permission: 6002
    },
    {
      name: t('navigation.price_periods'),
      path: '/price-periods',
      icon: DollarSign,
      permission: 7002
    },
    {
      name: t('navigation.zones'),
      path: '/zones',
      icon: MapPin,
      permission: 1402
    },
    {
      name: t('navigation.regions'),
      path: '/regions',
      icon: MapPin,
      permission: 1402
    },
    {
      name: t('navigation.cities'),
      path: '/cities',
      icon: MapPin,
      permission: 1402
    },
    {
      name: t('navigation.countries'),
      path: '/countries',
      icon: MapPin,
      permission: 1402
    },
    {
      name: t('navigation.users'),
      path: '/users',
      icon: Users,
      permission: 1102
    },
    {
      name: t('navigation.permissions'),
      path: '/permissions',
      icon: Shield,
      permission: 1701
    },
    {
      name: t('navigation.reports'),
      path: '/reports',
      icon: BarChart3,
      permission: 1702
    },
    {
      name: t('navigation.settings'),
      path: '/settings',
      icon: Settings,
      permission: null
    },
    {
      name: t('navigation.user_guide'),
      path: '/user-guide',
      icon: HelpCircle,
      permission: null
    }
  ]

  const filteredItems = navigationItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  )

  const drawerWidth = sidebarCollapsed ? 64 : 280

  const handleNavigation = (path) => {
    navigate(path)
  }

  const sidebarContent = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: currentTheme === 'dark' ? 'grey.800' : 'white',
      borderRight: 1,
      borderColor: currentTheme === 'dark' ? 'grey.700' : 'grey.200'
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: 1,
        borderColor: currentTheme === 'dark' ? 'grey.700' : 'grey.200'
      }}>
        {!sidebarCollapsed && (
          <Typography variant="h6" sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Hotel MS
          </Typography>
        )}
        <IconButton 
          onClick={() => dispatch(toggleSidebar())}
          size="small"
          sx={{ color: currentTheme === 'dark' ? 'grey.400' : 'grey.600' }}
        >
          {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </IconButton>
      </Box>

      {/* Navigation */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', py: 1 }}>
        <List>
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
            
            return (
              <ListItem key={item.name} disablePadding sx={{ px: 1 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    mb: 0.5,
                    bgcolor: isActive ? (currentTheme === 'dark' ? 'primary.dark' : 'primary.light') : 'transparent',
                    color: isActive ? 'primary.contrastText' : (currentTheme === 'dark' ? 'grey.300' : 'grey.700'),
                    '&:hover': {
                      bgcolor: isActive ? (currentTheme === 'dark' ? 'primary.dark' : 'primary.light') : (currentTheme === 'dark' ? 'grey.700' : 'grey.100'),
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: sidebarCollapsed ? 0 : 40,
                    color: 'inherit',
                    justifyContent: 'center'
                  }}>
                    <item.icon size={20} />
                  </ListItemIcon>
                  {!sidebarCollapsed && (
                    <ListItemText 
                      primary={item.name}
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: isActive ? 600 : 500,
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      </Box>

      {/* User Profile */}
      {!sidebarCollapsed && user && (
        <Box sx={{ 
          p: 2, 
          borderTop: 1, 
          borderColor: currentTheme === 'dark' ? 'grey.700' : 'grey.200'
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: 2, 
            bgcolor: currentTheme === 'dark' ? 'grey.700' : 'grey.100',
            borderRadius: 2
          }}>
            <Avatar 
              src={user.profileImage?.url}
              sx={{ 
                width: 40, 
                height: 40, 
                mr: 2,
                bgcolor: 'primary.main',
                fontSize: '0.875rem',
                fontWeight: 600
              }}
            >
              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
            </Avatar>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ 
                fontWeight: 600,
                color: currentTheme === 'dark' ? 'white' : 'grey.900',
                noWrap: true
              }}>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="caption" sx={{ 
                color: currentTheme === 'dark' ? 'grey.400' : 'grey.600',
                textTransform: 'capitalize'
              }}>
                {user.role}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={!sidebarCollapsed}
        onClose={() => dispatch(toggleSidebar())}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    )
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  )
}

export default Sidebar