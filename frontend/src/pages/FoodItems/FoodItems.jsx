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
import { Search, Plus, Edit, Trash2, UtensilsCrossed } from 'lucide-react'
import { fetchFoodItems, deleteFoodItem } from '../../store/slices/foodItemSlice'
import { fetchHotels } from '../../store/slices/hotelSlice'
import { toast } from 'react-toastify'

const FoodItems = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { foodItems, loading, pagination } = useSelector(state => state.foodItems)
  const { hotels } = useSelector(state => state.hotels)
  const { user } = useSelector(state => state.auth)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterHotel, setFilterHotel] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedFoodItem, setSelectedFoodItem] = useState(null)
  const [viewMode, setViewMode] = useState('grid')

  const hasPermission = (permission) => {
    if (!user) return false
    if (user.role === 'admin') return true
    return user.permissions && user.permissions.includes(permission)
  }

  useEffect(() => {
    dispatch(fetchHotels())
    dispatch(fetchFoodItems({ 
      search: searchTerm,
      hotel: filterHotel,
      category: filterCategory
    }))
  }, [dispatch, searchTerm, filterHotel, filterCategory])

  const getCategoryColor = (category) => {
    return category === 'food' ? 'primary' : 'secondary'
  }

  const handleDelete = async () => {
    if (selectedFoodItem) {
      const result = await dispatch(deleteFoodItem(selectedFoodItem._id))
      if (result.type === 'foodItems/deleteFoodItem/fulfilled') {
        toast.success(t('food_items.food_item_deleted'))
        setDeleteDialogOpen(false)
        setSelectedFoodItem(null)
      }
    }
  }

  const columns = [
    {
      field: 'name',
      headerName: t('food_items.item_name'),
      flex: 1,
      minWidth: 200,
      renderCell: (params) => params.row.name?.en || '-',
    },
    {
      field: 'hotel',
      headerName: t('food_items.hotel'),
      flex: 1,
      minWidth: 150,
      renderCell: (params) => params.row.hotel?.name || '-',
    },
    {
      field: 'category',
      headerName: t('food_items.category'),
      width: 120,
      renderCell: (params) => (
        <Chip
          label={t(`food_items.${params.row.category}`)}
          color={getCategoryColor(params.row.category)}
          size="small"
        />
      ),
    },
    {
      field: 'price',
      headerName: t('food_items.price'),
      width: 100,
      renderCell: (params) => `$${params.row.price}`,
    },
    {
      field: 'actions',
      headerName: t('common.actions'),
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          {hasPermission(3003) && (
            <IconButton
              size="small"
              onClick={() => navigate(`/food-items/edit/${params.row._id}`)}
              sx={{ color: 'primary.main' }}
            >
              <Edit size={16} />
            </IconButton>
          )}
          {hasPermission(3004) && (
            <IconButton
              size="small"
              onClick={() => {
                setSelectedFoodItem(params.row)
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

  // Mock data for demonstration
  const mockFoodItems = [
    {
      _id: '1',
      name: { en: 'Grilled Chicken', fr: 'Poulet Grillé' },
      description: { en: 'Delicious grilled chicken with herbs', fr: 'Délicieux poulet grillé aux herbes' },
      price: 25,
      category: 'food',
      hotel: { _id: '1', name: 'Grand Palace Hotel' },
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      _id: '2',
      name: { en: 'Caesar Salad', fr: 'Salade César' },
      description: { en: 'Fresh caesar salad with croutons', fr: 'Salade césar fraîche avec croûtons' },
      price: 15,
      category: 'food',
      hotel: { _id: '1', name: 'Grand Palace Hotel' },
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      _id: '3',
      name: { en: 'Red Wine', fr: 'Vin Rouge' },
      description: { en: 'Premium red wine selection', fr: 'Sélection de vin rouge premium' },
      price: 45,
      category: 'beverage',
      hotel: { _id: '2', name: 'Seaside Resort' },
      createdAt: '2024-01-10T14:20:00Z'
    },
  ]

  const displayItems = foodItems.length > 0 ? foodItems : mockFoodItems

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {t('food_items.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage restaurant menu items and beverages
          </Typography>
        </Box>
        {hasPermission(3001) && (
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={() => navigate('/food-items/create')}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {t('food_items.create_food_item')}
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
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="">{t('common.all')} Categories</MenuItem>
                  <MenuItem value="food">{t('food_items.food')}</MenuItem>
                  <MenuItem value="beverage">{t('food_items.beverage')}</MenuItem>
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
      {displayItems.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <UtensilsCrossed size={64} color="#9ca3af" style={{ marginBottom: 16 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              {t('food_items.no_food_items')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Get started by adding your first food item.
            </Typography>
            {hasPermission(3001) && (
              <Button
                variant="contained"
                startIcon={<Plus size={20} />}
                onClick={() => navigate('/food-items/create')}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                {t('food_items.create_food_item')}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {displayItems.map((item, index) => (
            <Grid item xs={12} sm={6} lg={4} key={item._id}>
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
                        bgcolor: item.category === 'food' ? 'primary.main' : 'secondary.main',
                        mr: 2,
                      }}
                    >
                      <UtensilsCrossed size={20} />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {item.name.en}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.hotel?.name}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        ${item.price}
                      </Typography>
                      <Chip
                        label={t(`food_items.${item.category}`)}
                        color={getCategoryColor(item.category)}
                        size="small"
                      />
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {item.description.en}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Created {new Date(item.createdAt).toLocaleDateString()}
                    </Typography>
                    <Box>
                      {hasPermission(3003) && (
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/food-items/edit/${item._id}`)}
                          sx={{ color: 'primary.main' }}
                        >
                          <Edit size={16} />
                        </IconButton>
                      )}
                      {hasPermission(3004) && (
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedFoodItem(item)
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
              rows={displayItems}
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
        <DialogTitle>{t('food_items.confirm_delete')}</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedFoodItem?.name?.en}"? This action cannot be undone.
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

export default FoodItems