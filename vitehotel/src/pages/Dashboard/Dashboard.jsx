import React, { useEffect } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCookies } from 'react-cookie'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  LinearProgress,
} from '@mui/material'
import {
  Hotel,
  Key,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Activity,
} from 'lucide-react'
import { Line, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { dashboardAPI } from '../../services/api'
import { toast } from 'react-toastify'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const Dashboard = () => {
  const { t } = useTranslation()
  const [cookies] = useCookies(['user'])
  const user = cookies.user
  
  const [stats, setStats] = useState(null)
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, activitiesResponse] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getRecentActivities({ limit: 10 })
      ])
      
      setStats(statsResponse.data.stats)
      setActivities(activitiesResponse.data.activities)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  // Mock data structure for when API data is not available
  const mockStats = [
    {
      title: t('dashboard.total_hotels'),
      value: stats?.totalHotels?.toString() || '0',
      change: '+2.1%',
      changeType: 'increase',
      icon: Hotel,
      color: '#3b82f6',
      bgColor: '#dbeafe',
    },
    {
      title: t('dashboard.total_rooms'),
      value: stats?.totalRooms?.toString() || '0',
      change: '+5.4%',
      changeType: 'increase',
      icon: Key,
      color: '#10b981',
      bgColor: '#d1fae5',
    },
    {
      title: t('dashboard.total_clients'),
      value: stats?.totalClients?.toString() || '0',
      change: '+12.3%',
      changeType: 'increase',
      icon: Users,
      color: '#8b5cf6',
      bgColor: '#ede9fe',
    },
    {
      title: t('dashboard.active_stays'),
      value: stats?.activeStays?.toString() || '0',
      change: '-2.1%',
      changeType: 'decrease',
      icon: Calendar,
      color: '#f59e0b',
      bgColor: '#fef3c7',
    },
    {
      title: t('dashboard.monthly_revenue'),
      value: `$${stats?.monthlyRevenue?.toLocaleString() || '0'}`,
      change: '+8.7%',
      changeType: 'increase',
      icon: DollarSign,
      color: '#6366f1',
      bgColor: '#e0e7ff',
    },
    {
      title: t('dashboard.occupancy_rate'),
      value: `${stats?.occupancyRate || 0}%`,
      change: '+3.2%',
      changeType: 'increase',
      icon: TrendingUp,
      color: '#ec4899',
      bgColor: '#fce7f3',
    },
  ]

  const displayStats = mockStats

  const quickActions = [
    { name: 'Create Booking', path: '/stays/create', color: '#3b82f6' },
    { name: 'Add Client', path: '/clients/create', color: '#10b981' },
    { name: 'Generate Invoice', path: '/invoices/create', color: '#8b5cf6' },
    { name: 'Add Food Item', path: '/food-items/create', color: '#f59e0b' },
  ]

  // Chart data
  const revenueData = {
    labels: stats?.revenueTrend?.map(item => item.month) || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: stats?.revenueTrend?.map(item => item.revenue) || [12000, 19000, 15000, 25000, 22000, 30000],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  }

  const occupancyData = {
    labels: ['Available', 'Occupied', 'Maintenance'],
    datasets: [
      {
        data: [45, 35, 20],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 0,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: '#f3f4f6',
        },
      },
    },
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome Section */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3,
        }}
        data-aos="fade-up"
      >
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          {t('dashboard.welcome')}, {user?.firstName}!
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Here's what's happening at your hotels today.
        </Typography>
      </Paper>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {displayStats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={4} key={stat.title}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: stat.bgColor,
                      color: stat.color,
                      width: 48,
                      height: 48,
                      mr: 2,
                    }}
                  >
                    <stat.icon size={24} />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {stat.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {stat.value}
                      </Typography>
                      <Chip
                        label={stat.change}
                        size="small"
                        icon={stat.changeType === 'increase' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        color={stat.changeType === 'increase' ? 'success' : 'error'}
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Card sx={{ mb: 4 }} data-aos="fade-up">
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            {t('dashboard.quick_actions')}
          </Typography>
          <Grid container spacing={2}>
            {quickActions.map((action) => (
              <Grid item xs={12} sm={6} md={3} key={action.name}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Plus size={20} />}
                  sx={{
                    py: 2,
                    borderColor: action.color,
                    color: action.color,
                    '&:hover': {
                      bgcolor: `${action.color}10`,
                      borderColor: action.color,
                    },
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                  onClick={() => navigate(action.path)}
                >
                  {action.name}
                </Button>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Charts and Activities */}
      <Grid container spacing={3}>
        {/* Revenue Chart */}
        <Grid item xs={12} lg={8}>
          <Card data-aos="fade-up">
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Revenue Trends
              </Typography>
              <Box sx={{ height: 300 }}>
                <Line data={revenueData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Occupancy Chart */}
        <Grid item xs={12} lg={4}>
          <Card data-aos="fade-up" data-aos-delay="100">
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Room Occupancy
              </Typography>
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                <Doughnut data={occupancyData} options={{ maintainAspectRatio: false }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} lg={6}>
          <Card data-aos="fade-up" data-aos-delay="200">
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                {t('dashboard.recent_activities')}
              </Typography>
              <List>
                {activities.map((activity, index) => (
                  <ListItem key={activity.id} divider={index < recentActivities.length - 1}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                        <Activity size={16} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.message}
                      secondary={`${activity.user} • ${activity.time}`}
                      primaryTypographyProps={{ fontSize: '0.875rem' }}
                      secondaryTypographyProps={{ fontSize: '0.75rem' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Today's Schedule */}
        <Grid item xs={12} lg={6}>
          <Card data-aos="fade-up" data-aos-delay="300">
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Today's Schedule
              </Typography>
              
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'error.main' }}>
                Upcoming Checkouts
              </Typography>
              <Box sx={{ mb: 3 }}>
                {[
                  { room: '101', guest: 'Alice Johnson', time: '11:00 AM' },
                  { room: '205', guest: 'Bob Smith', time: '12:00 PM' },
                ].map((checkout, index) => (
                  <Box key={index} sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    py: 1,
                    px: 2,
                    bgcolor: 'error.light',
                    borderRadius: 1,
                    mb: 1,
                    color: 'error.contrastText'
                  }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Room {checkout.room} - {checkout.guest}
                      </Typography>
                      <Typography variant="caption">
                        {checkout.time}
                      </Typography>
                    </Box>
                    <Chip label="Confirmed" size="small" color="success" />
                  </Box>
                ))}
              </Box>

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'success.main' }}>
                Upcoming Checkins
              </Typography>
              <Box>
                {[
                  { room: '102', guest: 'David Lee', time: '3:00 PM' },
                  { room: '210', guest: 'Emma Davis', time: '4:00 PM' },
                ].map((checkin, index) => (
                  <Box key={index} sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    py: 1,
                    px: 2,
                    bgcolor: 'success.light',
                    borderRadius: 1,
                    mb: 1,
                    color: 'success.contrastText'
                  }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Room {checkin.room} - {checkin.guest}
                      </Typography>
                      <Typography variant="caption">
                        {checkin.time}
                      </Typography>
                    </Box>
                    <Chip label="Pending" size="small" color="warning" />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard