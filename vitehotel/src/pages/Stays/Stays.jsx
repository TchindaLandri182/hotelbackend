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
import { Search, Plus, Edit, Trash2, Calendar, CheckIn, CheckOut } from 'lucide-react'
import { fetchStays, deleteStay } from '../../store/slices/staySlice'
import { toast } from 'react-toastify'

const Stays = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { stays, loading } = useSelector(state => state.stays)
  const { user } = useSelector(state => state.auth)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedStay, setSelectedStay] = useState(null)
  const [viewMode, setViewMode] = useState('grid')

  const hasPermission = (permission) => {
    if (!user) return false
    if (user.role === 'admin') return true
    return user.permissions && user.permissions.includes(permission)
  }

  // Mock data for demonstration
  const mockStays = [
    {
      _id: '1',
      client: { firstName: 'John', lastName: 'Smith' },
      room: { roomNumber: '101', hotel: { name: 'Grand Palace Hotel' } },
      startDate: '2024-01-15T00:00:00Z',
      endDate: '2024-01-20T00:00:00Z',
      status: 'confirmed',
      notes: 'Late check-in requested',
      createdAt: '2024-01-10T10:30:00Z'
    },
    {
      _id: '2',
      client: { firstName: 'Marie', lastName: 'Dubois' },
      room: { roomNumber: '102', hotel: { name: 'Grand Palace Hotel' } },
      startDate: '2024-01-18T00:00:00Z',
      endDate: '2024-01-25T00:00:00Z',
      status: 'in-progress',
      notes: 'Anniversary celebration',
      createdAt: '2024-01-15T14:20:00Z'
    },
  ]

  useEffect(() => {
    dispatch(fetchStays({ search: searchTerm, status: filterStatus }))
  }, [dispatch, searchTerm, filterStatus])

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning'
      case 'confirmed':
        return 'info'
      case 'in-progress':
        return 'success'
      case 'completed':
        return 'default'
      case 'cancelled':
        return 'error'
      default:
        return 'default'
    }
  }

  const handleDelete = async () => {
    if (selectedStay) {
      const result = await dispatch(deleteStay(selectedStay._id))
      if (result.type === 'stays/deleteStay/fulfilled') {
        toast.success(t('stays.stay_deleted'))
        setDeleteDialogOpen(false)
        setSelectedStay(null)
      }
    }
  }

  const displayStays = stays.length > 0 ? stays : mockStays

  const columns = [
    {
      field: 'guest',
      headerName: 'Guest',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => 
        `${params.row.client.firstName} ${params.row.client.lastName}`,
    },
    {
      field: 'room',
      headerName: 'Room',
      width: 100,
      renderCell: (params) => params.row.room.roomNumber,
    },
    {
      field: 'hotel',
      headerName: 'Hotel',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => params.row.room.hotel?.name || '-',
    },
    {
      field: 'startDate',
      headerName: t('stays.start_date'),
      width: 120,
      renderCell: (params) => new Date(params.row.startDate).toLocaleDateString(),
    },
    {
      field: 'endDate',
      headerName: t('stays.end_date'),
      width: 120,
      renderCell: (params) => new Date(params.row.endDate).toLocaleDateString(),
    },
    {
      field: 'status',
      headerName: t('common.status'),
      width: 120,
      renderCell: (params) => (
        <Chip
          label={t(`stays.${params.row.status}`)}
          color={getStatusColor(params.row.status)}
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
          {hasPermission(9003) && (
            <IconButton
              size="small"
              onClick={() => navigate(`/stays/edit/${params.row._id}`)}
              sx={{ color: 'primary.main' }}
            >
              <Edit size={16} />
            </IconButton>
          )}
          {hasPermission(9004) && (
            <IconButton
              size="small"
              onClick={() => {
                setSelectedStay(params.row)
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

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {t('stays.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage guest bookings and reservations
          </Typography>
        </Box>
        {hasPermission(9001) && (
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={() => navigate('/stays/create')}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {t('stays.create_stay')}
          </Button>
        )}
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">{t('common.all')} Status</MenuItem>
                  <MenuItem value="pending">{t('stays.pending')}</MenuItem>
                  <MenuItem value="confirmed">{t('stays.confirmed')}</MenuItem>
                  <MenuItem value="in-progress">{t('stays.in_progress')}</MenuItem>
                  <MenuItem value="completed">{t('stays.completed')}</MenuItem>
                  <MenuItem value="cancelled">{t('stays.cancelled')}</MenuItem>
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
      {displayStays.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Calendar size={64} color="#9ca3af" style={{ marginBottom: 16 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              {t('stays.no_stays')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Get started by creating your first booking.
            </Typography>
            {hasPermission(9001) && (
              <Button
                variant="contained"
                startIcon={<Plus size={20} />}
                onClick={() => navigate('/stays/create')}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                {t('stays.create_stay')}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {displayStays.map((stay, index) => (
            <Grid item xs={12} sm={6} lg={4} key={stay._id}>
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
                        bgcolor: getStatusColor(stay.status) === 'success' ? 'success.main' : 
                                getStatusColor(stay.status) === 'warning' ? 'warning.main' :
                                getStatusColor(stay.status) === 'error' ? 'error.main' : 'primary.main',
                        mr: 2,
                      }}
                    >
                      {stay.status === 'in-progress' ? <CheckIn size={20} /> : 
                       stay.status === 'completed' ? <CheckOut size={20} /> : 
                       <Calendar size={20} />}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {stay.client.firstName} {stay.client.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Room {stay.room.roomNumber}
                      </Typography>
                    </Box>
                    <Chip
                      label={t(`stays.${stay.status}`)}
                      color={getStatusColor(stay.status)}
                      size="small"
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Check-in: {new Date(stay.startDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Check-out: {new Date(stay.endDate).toLocaleDateString()}
                    </Typography>
                    {stay.notes && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                        "{stay.notes}"
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Created {new Date(stay.createdAt).toLocaleDateString()}
                    </Typography>
                    <Box>
                      {hasPermission(9003) && (
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/stays/edit/${stay._id}`)}
                          sx={{ color: 'primary.main' }}
                        >
                          <Edit size={16} />
                        </IconButton>
                      )}
                      {hasPermission(9004) && (
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedStay(stay)
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
              rows={displayStays}
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
        <DialogTitle>{t('stays.confirm_delete')}</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this stay? This action cannot be undone.
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

export default Stays