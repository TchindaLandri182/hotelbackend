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
import { Search, Plus, Edit, Trash2, Tag } from 'lucide-react'
import { fetchCategories, deleteCategory } from '../../store/slices/categorySlice'
import { fetchHotels } from '../../store/slices/hotelSlice'
import { toast } from 'react-toastify'

const Categories = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { categories, loading } = useSelector(state => state.categories)
  const { hotels } = useSelector(state => state.hotels)
  const { user } = useSelector(state => state.auth)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterHotel, setFilterHotel] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [viewMode, setViewMode] = useState('grid')

  const hasPermission = (permission) => {
    if (!user) return false
    if (user.role === 'admin') return true
    return user.permissions && user.permissions.includes(permission)
  }

  // Mock data for demonstration
  const mockCategories = [
    {
      _id: '1',
      name: { en: 'Standard Room', fr: 'Chambre Standard' },
      description: { en: 'Comfortable standard room with basic amenities', fr: 'Chambre standard confortable avec équipements de base' },
      basePrice: 100,
      hotel: { _id: '1', name: 'Grand Palace Hotel' },
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      _id: '2',
      name: { en: 'Deluxe Room', fr: 'Chambre Deluxe' },
      description: { en: 'Spacious deluxe room with premium amenities', fr: 'Chambre deluxe spacieuse avec équipements premium' },
      basePrice: 200,
      hotel: { _id: '1', name: 'Grand Palace Hotel' },
      createdAt: '2024-01-10T14:20:00Z'
    },
  ]

  useEffect(() => {
    dispatch(fetchHotels())
    // dispatch(fetchCategories({ search: searchTerm, hotel: filterHotel }))
  }, [dispatch, searchTerm, filterHotel])

  const handleDelete = async () => {
    if (selectedCategory) {
      // const result = await dispatch(deleteCategory(selectedCategory._id))
      // if (result.type === 'categories/deleteCategory/fulfilled') {
        toast.success(t('categories.category_deleted'))
        setDeleteDialogOpen(false)
        setSelectedCategory(null)
      // }
    }
  }

  const displayCategories = categories.length > 0 ? categories : mockCategories

  const columns = [
    {
      field: 'name',
      headerName: t('categories.category_name'),
      flex: 1,
      minWidth: 200,
      renderCell: (params) => params.row.name?.en || '-',
    },
    {
      field: 'hotel',
      headerName: t('categories.hotel'),
      flex: 1,
      minWidth: 150,
      renderCell: (params) => params.row.hotel?.name || '-',
    },
    {
      field: 'basePrice',
      headerName: t('categories.base_price'),
      width: 120,
      renderCell: (params) => `$${params.row.basePrice}`,
    },
    {
      field: 'actions',
      headerName: t('common.actions'),
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          {hasPermission(1003) && (
            <IconButton
              size="small"
              onClick={() => navigate(`/categories/edit/${params.row._id}`)}
              sx={{ color: 'primary.main' }}
            >
              <Edit size={16} />
            </IconButton>
          )}
          {hasPermission(1004) && (
            <IconButton
              size="small"
              onClick={() => {
                setSelectedCategory(params.row)
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
            {t('categories.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage room categories and pricing
          </Typography>
        </Box>
        {hasPermission(1001) && (
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={() => navigate('/categories/create')}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {t('categories.create_category')}
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
      {displayCategories.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Tag size={64} color="#9ca3af" style={{ marginBottom: 16 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              {t('categories.no_categories')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Get started by creating your first room category.
            </Typography>
            {hasPermission(1001) && (
              <Button
                variant="contained"
                startIcon={<Plus size={20} />}
                onClick={() => navigate('/categories/create')}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                {t('categories.create_category')}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {displayCategories.map((category, index) => (
            <Grid item xs={12} sm={6} lg={4} key={category._id}>
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
                        bgcolor: 'primary.main',
                        mr: 2,
                      }}
                    >
                      <Tag size={20} />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {category.name.en}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {category.hotel?.name}
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      ${category.basePrice}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {category.description.en}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Created {new Date(category.createdAt).toLocaleDateString()}
                    </Typography>
                    <Box>
                      {hasPermission(1003) && (
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/categories/edit/${category._id}`)}
                          sx={{ color: 'primary.main' }}
                        >
                          <Edit size={16} />
                        </IconButton>
                      )}
                      {hasPermission(1004) && (
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedCategory(category)
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
              rows={displayCategories}
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
        <DialogTitle>{t('categories.confirm_delete')}</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedCategory?.name?.en}"? This action cannot be undone.
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

export default Categories