import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { format, addDays, startOfWeek, endOfWeek, isSameDay, addWeeks, subWeeks } from 'date-fns'
import { dashboardAPI, hotelAPI } from '../../services/api'
import { toast } from 'react-toastify'
import { useCookies } from 'react-cookie'
import { useAuth } from '../../contexts/AuthContext'
import hotelService from '../../services/hotelService'
import { canManage } from '../../services/roleHierarchy'

const Calendar = () => {
  const { t } = useTranslation()
  const {user} = useAuth()

  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [selectedHotel, setSelectedHotel] = useState('')
  const [hotels, setHotels] = useState([])
  const [calendarData, setCalendarData] = useState(null)
  const [loading, setLoading] = useState(false)

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }) // Monday
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekDays = []

  // Generate week days
  for (let i = 0; i < 7; i++) {
    weekDays.push(addDays(weekStart, i))
  }

  useEffect(() => {
    if(canManage(user.role, 'owner')){
      fetchHotels()
    }
  }, [])

  useEffect(() => {
    if (selectedHotel || user?.hotel) {
      fetchCalendarData()
    }
  }, [currentWeek, selectedHotel])

  const fetchHotels = async () => {
    try {
      const response = await hotelService.getAllHotels();
      setHotels(response.data.hotels || [])
      
      // Auto-select user's hotel if they have one
      if (user?.hotel && !selectedHotel) {
        setSelectedHotel(user.hotel)
      }
    } catch (error) {
      console.error('Error fetching hotels:', error)
      toast.error('Failed to load hotels')
    }
  }

  const fetchCalendarData = async () => {
    setLoading(true)
    try {
      const response = await dashboardAPI.getCalendarData({
        startDate: weekStart.toISOString(),
        endDate: weekEnd.toISOString(),
        hotel: selectedHotel || user?.hotel
      })
      setCalendarData(response.data.calendarData)
    } catch (error) {
      console.error('Error fetching calendar data:', error)
      toast.error('Failed to load calendar data')
    } finally {
      setLoading(false)
    }
  }

  const getStayForRoomAndDate = (roomId, date) => {
    if (!calendarData?.stays) return null
    
    return calendarData.stays.find(stay => 
      stay.room === roomId &&
      new Date(stay.startDate) <= date &&
      new Date(stay.endDate) >= date
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#fbbf24' // yellow
      case 'in-progress':
        return '#ef4444' // red
      case 'pending':
        return '#3b82f6' // blue
      default:
        return '#e5e7eb' // gray
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Reserved'
      case 'in-progress':
        return 'Occupied'
      case 'pending':
        return 'Pending'
      default:
        return 'Available'
    }
  }

  const getDailyRevenue = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return calendarData?.dailyRevenue?.[dateStr] || 0
  }

  const navigateWeek = (direction) => {
    if (direction === 'prev') {
      setCurrentWeek(subWeeks(currentWeek, 1))
    } else {
      setCurrentWeek(addWeeks(currentWeek, 1))
    }
  }

  const goToToday = () => {
    setCurrentWeek(new Date())
  }

  if (loading && !calendarData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Room Calendar
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Weekly view of room occupancy and revenue
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {user?.role === 'admin' && (
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Hotel</InputLabel>
              <Select
                value={selectedHotel}
                onChange={(e) => setSelectedHotel(e.target.value)}
                label="Hotel"
              >
                <MenuItem value="">All Hotels</MenuItem>
                {hotels.map((hotel) => (
                  <MenuItem key={hotel._id} value={hotel._id}>
                    {hotel.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <Button
            variant="outlined"
            onClick={goToToday}
            sx={{ textTransform: 'none' }}
          >
            Today
          </Button>
        </Box>
      </Box>

      {/* Week Navigation */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <IconButton onClick={() => navigateWeek('prev')}>
              <ChevronLeft />
            </IconButton>
            
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {format(weekStart, 'MMM dd')} - {format(weekEnd, 'MMM dd, yyyy')}
            </Typography>
            
            <IconButton onClick={() => navigateWeek('next')}>
              <ChevronRight />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
            Legend
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip label="Available" sx={{ bgcolor: '#e5e7eb', color: 'black' }} size="small" />
            <Chip label="Pending" sx={{ bgcolor: '#3b82f6', color: 'white' }} size="small" />
            <Chip label="Reserved" sx={{ bgcolor: '#fbbf24', color: 'white' }} size="small" />
            <Chip label="Occupied" sx={{ bgcolor: '#ef4444', color: 'white' }} size="small" />
            <Chip label="Maintenance" sx={{ bgcolor: '#6b7280', color: 'white' }} size="small" />
          </Box>
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, minWidth: 120, bgcolor: 'grey.50' }}>
                    Room
                  </TableCell>
                  {weekDays.map((day) => (
                    <TableCell 
                      key={day.toISOString()} 
                      align="center" 
                      sx={{ 
                        fontWeight: 600, 
                        minWidth: 120,
                        bgcolor: isSameDay(day, new Date()) ? 'primary.light' : 'grey.50',
                        color: isSameDay(day, new Date()) ? 'primary.contrastText' : 'inherit'
                      }}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {format(day, 'EEE')}
                        </Typography>
                        <Typography variant="caption">
                          {format(day, 'dd')}
                        </Typography>
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {calendarData?.rooms?.map((room) => (
                  <TableRow key={room._id}>
                    <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.50' }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {room.roomNumber}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {room.category?.name?.en}
                        </Typography>
                        <Typography variant="caption" display="block" color="text.secondary">
                          ${room.category?.basePrice}/night
                        </Typography>
                      </Box>
                    </TableCell>
                    {weekDays.map((day) => {
                      const stay = getStayForRoomAndDate(room._id, day)
                      const isInMaintenance = room.isInMaintenance
                      
                      let cellColor = '#e5e7eb' // Available
                      let cellText = 'Available'
                      let textColor = 'black'
                      
                      if (isInMaintenance) {
                        cellColor = '#6b7280'
                        cellText = 'Maintenance'
                        textColor = 'white'
                      } else if (stay) {
                        cellColor = getStatusColor(stay.status)
                        cellText = getStatusText(stay.status)
                        textColor = 'white'
                      }
                      
                      return (
                        <TableCell 
                          key={`${room._id}-${day.toISOString()}`}
                          align="center"
                          sx={{ 
                            bgcolor: cellColor,
                            color: textColor,
                            border: '1px solid white',
                            cursor: stay ? 'pointer' : 'default',
                            '&:hover': {
                              opacity: 0.8
                            }
                          }}
                        >
                          <Tooltip 
                            title={stay ? 
                              `${stay.client?.firstName} ${stay.client?.lastName}` : 
                              cellText
                            }
                          >
                            <Box sx={{ py: 1 }}>
                              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                {stay ? 
                                  `${stay.client?.firstName?.charAt(0)}${stay.client?.lastName?.charAt(0)}` : 
                                  cellText.charAt(0)
                                }
                              </Typography>
                            </Box>
                          </Tooltip>
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))}
                
                {/* Daily Revenue Row */}
                <TableRow sx={{ bgcolor: 'primary.light' }}>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.contrastText' }}>
                    Daily Revenue
                  </TableCell>
                  {weekDays.map((day) => (
                    <TableCell 
                      key={`revenue-${day.toISOString()}`}
                      align="center"
                      sx={{ fontWeight: 700, color: 'primary.contrastText' }}
                    >
                      {getDailyRevenue(day).toLocaleString()} FCFA
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Week Summary
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {calendarData?.rooms?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Rooms
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {Object.values(calendarData?.dailyRevenue || {}).reduce((sum, amount) => sum + amount, 0).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Week Revenue (FCFA)
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                  {calendarData?.stays?.filter(stay => stay.status === 'in-progress').length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Occupied Rooms
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                  {calendarData?.stays?.filter(stay => stay.status === 'confirmed').length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Reserved Rooms
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Calendar