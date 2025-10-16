import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Card,
  CardContent,
  CardMedia,
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
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { Search, Plus, Edit, Trash2, Hotel, MapPin } from 'lucide-react'
import { fetchHotels, deleteHotel } from '../../store/slices/hotelSlice'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'

const Hotels = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { hotels, loading, pagination } = useSelector(state => state.hotels)
  const { user } = useAuth()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [viewMode, setViewMode] = useState('table') // 'grid' or 'table'

  const hasPermission = (permission) => {
    if (!user) return false
    if (user.role === 'admin') return true
    return user.permissions && user.permissions.includes(permission)
  }

  useEffect(() => {
    dispatch(fetchHotels({ search: searchTerm }))
  }, [dispatch, searchTerm])

  const handleDelete = async () => {
    if (selectedHotel) {
      const result = await dispatch(deleteHotel(selectedHotel._id))
      if (result.type === 'hotels/deleteHotel/fulfilled') {
        toast.success(t('hotels.hotel_deleted'))
        setDeleteDialogOpen(false)
        setSelectedHotel(null)
      }
    }
  }

  const columns = [
    {
      field: 'name',
      headerName: t('hotels.hotel_name'),
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'address',
      headerName: t('hotels.hotel_address'),
      flex: 1,
      minWidth: 250,
    },
    {
      field: 'zone',
      headerName: t('hotels.zone'),
      flex: 0.8,
      minWidth: 150,
      renderCell: (params) => params.row.zone?.name?.en || '-',
    },
    {
      field: 'owners',
      headerName: t('hotels.owners'),
      flex: 1,
      minWidth: 200,
      renderCell: (params) => 
        params.row.owners?.map(owner => `${owner.firstName} ${owner.lastName}`).join(', ') || '-',
    },
    {
      field: 'actions',
      headerName: t('common.actions'),
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          {hasPermission(4003) && (
            <IconButton
              size="small"
              onClick={() => navigate(`/hotels/edit/${params.row._id}`)}
              sx={{ color: 'primary.main' }}
            >
              <Edit size={16} />
            </IconButton>
          )}
          {hasPermission(4004) && (
            <IconButton
              size="small"
              onClick={() => {
                setSelectedHotel(params.row)
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

  if (loading && hotels.length === 0) {
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
            {t('hotels.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your hotel properties
          </Typography>
        </Box>
        {hasPermission(4001) && (
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={() => navigate('create')}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {t('hotels.create_hotel')}
          </Button>
        )}
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant={viewMode === 'grid' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('grid')}
              sx={{ textTransform: 'none' }}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'table' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('table')}
              sx={{ textTransform: 'none' }}
            >
              Table
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Content */}
      {hotels.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Hotel size={64} color="#9ca3af" style={{ marginBottom: 16 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              {t('hotels.no_hotels')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Get started by creating your first hotel.
            </Typography>
            {hasPermission(4001) && (
              <Button
                variant="contained"
                startIcon={<Plus size={20} />}
                onClick={() => navigate('/hotels/create')}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                {t('hotels.create_hotel')}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {hotels.map((hotel, index) => (
            <Grid item xs={12} sm={6} lg={4} key={hotel._id}>
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
                <CardMedia
                  component="img"
                  height="200"
                  image={hotel.logo || 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={hotel.name}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {hotel.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {hotel.address}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <MapPin size={16} color="#6b7280" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      {hotel.zone?.name?.en || 'No zone assigned'}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Owners: {hotel.owners?.map(owner => `${owner.firstName} ${owner.lastName}`).join(', ') || 'No owners'}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Created {new Date(hotel.createdAt).toLocaleDateString()}
                    </Typography>
                    <Box>
                      {hasPermission(4003) && (
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/hotels/edit/${hotel._id}`)}
                          sx={{ color: 'primary.main' }}
                        >
                          <Edit size={16} />
                        </IconButton>
                      )}
                      {hasPermission(4004) && (
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedHotel(hotel)
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
              rows={hotels}
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
        <DialogTitle>{t('hotels.confirm_delete')}</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedHotel?.name}"? This action cannot be undone.
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

export default Hotels