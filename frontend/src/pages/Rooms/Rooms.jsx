import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  IconButton,
  Chip,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { Search, Plus, Edit, Trash2, Key, Wrench } from 'lucide-react'
import { fetchRooms, deleteRoom } from '../../store/slices/roomSlice'
// import { fetchHotels } from '../../store/slices/hotelSlice'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'
import hotelService from '../../services/hotelService'
import { canManage } from '../../services/roleHierarchy'

const Rooms = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { rooms, loading, pagination } = useSelector(state => state.rooms)
  // const { hotels } = useSelector(state => state.hotels)
  const { user } = useAuth()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterHotel, setFilterHotel] = useState(user?.hotel || '')
  const [filterStatus, setFilterStatus] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [viewMode, setViewMode] = useState('table')
  const [hotels, setHotels] = useState([])

  const hasPermission = (permission) => {
    if (!user) return false
    if (user.role === 'admin') return true
    return user.permissions && user.permissions.includes(permission)
  }

  console.log(rooms)

  useEffect(() => {
    if(canManage(user.role, 'owner')){
      fetchHotels()
    }
    dispatch(fetchRooms({ 
      search: searchTerm,
      hotel: filterHotel,
      status: filterStatus
    }))
  }, [dispatch, searchTerm, filterHotel, filterStatus])

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'success'
      case 'occupied':
        return 'error'
      case 'reserved':
        return 'warning'
      case 'maintenance':
        return 'default'
      default:
        return 'default'
    }
  }

  const getStatusText = (room) => {
    if (room.isInMaintenance) return t('rooms.maintenance')
    return room.status || t('rooms.available')
  }

  const handleDelete = async () => {
    if (selectedRoom) {
      const result = await dispatch(deleteRoom(selectedRoom._id))
      if (result.type === 'rooms/deleteRoom/fulfilled') {
        toast.success(t('rooms.room_deleted'))
        setDeleteDialogOpen(false)
        setSelectedRoom(null)
      }
    }
  }

  const fetchHotels = async () => {
      try{
        const response = await hotelService.getAllHotels()
        setHotels(response?.hotels)
      }catch(error){
        toast.error(error?.response?.data?.message)
      }
    }

  const columns = [
    {
      field: 'roomNumber',
      headerName: t('rooms.room_number'),
      width: 120,
    },
    ...(canManage(user.role, 'owner') ? 
    [
      {
        field: 'hotel',
        headerName: t('rooms.hotel'),
        flex: 1,
        minWidth: 200,
        renderCell: (params) => params.row.hotel?.name || '-',
      }
    ] : []),
    {
      field: 'category',
      headerName: t('rooms.category'),
      flex: 1,
      minWidth: 150,
      renderCell: (params) => params.row.category?.name?.en || '-',
    },
    {
      field: 'basePrice',
      headerName: 'Base Price',
      width: 120,
      renderCell: (params) => `${params.row.category?.basePrice || 0}FCFA`,
    },
    {
      field: 'status',
      headerName: t('common.status'),
      width: 130,
      renderCell: (params) => (
        <Chip
          label={getStatusText(params.row)}
          color={getStatusColor(getStatusText(params.row))}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: t('common.actions'),
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          {hasPermission(8003) && (
            <IconButton
              size="small"
              onClick={() => navigate(`edit/${params.row._id}`)}
              sx={{ color: 'primary.main' }}
            >
              <Edit size={16} />
            </IconButton>
          )}
          {hasPermission(8004) && (
            <IconButton
              size="small"
              onClick={() => {
                setSelectedRoom(params.row)
                setDeleteDialogOpen(true)
              }}
              sx={{ color: 'error.main' }}
            >
              <Trash2 size={16} />
            </IconButton>
          )}
        </Box>
      ),
    },
  ]

  if (loading && rooms.length === 0) {
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
            {t('rooms.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage room inventory and availability
          </Typography>
        </Box>
        {hasPermission(8001) && (
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={() => navigate('create')}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {t('rooms.create_room')}
          </Button>
        )}
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                placeholder={t('common.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={20} />
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
            </Grid>
            {canManage(user.role, 'owner') && (
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Hotel</InputLabel>
                  <Select
                    value={filterHotel}
                    onChange={(e) => setFilterHotel(e.target.value)}
                    label="Hotel"
                  >
                    <MenuItem value="">{t('common.all')} Hotels</MenuItem>
                    {hotels.map((hotel) => (
                      <MenuItem key={hotel._id} value={hotel._id}>
                        {hotel.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">{t('common.all')} Status</MenuItem>
                  <MenuItem value="available">{t('rooms.available')}</MenuItem>
                  <MenuItem value="occupied">{t('rooms.occupied')}</MenuItem>
                  <MenuItem value="reserved">{t('rooms.reserved')}</MenuItem>
                  <MenuItem value="maintenance">{t('rooms.maintenance')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                  onClick={() => setViewMode('grid')}
                  sx={{ textTransform: 'none', minWidth: 'auto', px: 2 }}
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'contained' : 'outlined'}
                  onClick={() => setViewMode('table')}
                  sx={{ textTransform: 'none', minWidth: 'auto', px: 2 }}
                >
                  Table
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Content */}
      {rooms.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Key size={64} color="#9ca3af" style={{ marginBottom: 16 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              {t('rooms.no_rooms')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Get started by adding your first room.
            </Typography>
            {hasPermission(8001) && (
              <Button
                variant="contained"
                startIcon={<Plus size={20} />}
                onClick={() => navigate('create')}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                {t('rooms.create_room')}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {rooms.map((room, index) => (
            <Grid item xs={12} sm={6} lg={4} key={room._id}>
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
                        bgcolor: room.isInMaintenance ? 'grey.400' : 
                                room.status === 'available' ? 'success.main' :
                                room.status === 'occupied' ? 'error.main' :
                                room.status === 'reserved' ? 'warning.main' : 'grey.400',
                        mr: 2,
                      }}
                    >
                      {room.isInMaintenance ? <Wrench size={20} /> : <Key size={20} />}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Room {room.roomNumber}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {room.hotel?.name}
                      </Typography>
                    </Box>
                    <Chip
                      label={getStatusText(room)}
                      color={getStatusColor(getStatusText(room))}
                      size="small"
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Category: {room.category?.name?.en || 'No category'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Base Price: ${room.category?.basePrice || 0}/night
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Created {new Date(room.createdAt).toLocaleDateString()}
                    </Typography>
                    <Box>
                      {hasPermission(8003) && (
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/rooms/edit/${room._id}`)}
                          sx={{ color: 'primary.main' }}
                        >
                          <Edit size={16} />
                        </IconButton>
                      )}
                      {hasPermission(8004) && (
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedRoom(room)
                            setDeleteDialogOpen(true)
                          }}
                          sx={{ color: 'error.main' }}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card>
          <Box sx={{ height: 600 }}>
            <DataGrid
              rows={rooms}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              disableSelectionOnClick
              loading={loading}
              getRowId={(row) => row._id}
              sx={{
                border: 0,
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid #f3f4f6',
                },
                '& .MuiDataGrid-columnHeaders': {
                  bgcolor: 'grey.50',
                  borderBottom: '1px solid #e5e7eb',
                },
              }}
            />
          </Box>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t('rooms.confirm_delete')}</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete Room {selectedRoom?.roomNumber}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Rooms