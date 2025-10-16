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
import { Search, Plus, Edit, Trash2, ShoppingCart } from 'lucide-react'
import { fetchOrderItems, deleteOrderItem } from '../../store/slices/orderItemSlice'
import { toast } from 'react-toastify'

const OrderItems = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { orderItems, loading, pagination } = useSelector(state => state.orderItems)
  const { user } = useSelector(state => state.auth)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedOrderItem, setSelectedOrderItem] = useState(null)

  const hasPermission = (permission) => {
    if (!user) return false
    if (user.role === 'admin') return true
    return user.permissions && user.permissions.includes(permission)
  }

  useEffect(() => {
    dispatch(fetchOrderItems({ 
      search: searchTerm,
      status: filterStatus
    }))
  }, [dispatch, searchTerm, filterStatus])

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning'
      case 'preparing':
        return 'info'
      case 'served':
        return 'success'
      case 'cancelled':
        return 'error'
      default:
        return 'default'
    }
  }

  const handleDelete = async () => {
    if (selectedOrderItem) {
      const result = await dispatch(deleteOrderItem(selectedOrderItem._id))
      if (result.type === 'orderItems/deleteOrderItem/fulfilled') {
        toast.success(t('order_items.order_deleted'))
        setDeleteDialogOpen(false)
        setSelectedOrderItem(null)
      }
    }
  }

  // Mock data for demonstration
  const mockOrderItems = [
    {
      _id: '1',
      stay: {
        _id: '1',
        client: { firstName: 'John', lastName: 'Doe' },
        room: { roomNumber: '101' },
        startDate: '2024-01-15T00:00:00Z',
        endDate: '2024-01-20T00:00:00Z'
      },
      foodItem: {
        _id: '1',
        name: { en: 'Grilled Chicken', fr: 'Poulet Grillé' },
        price: 25
      },
      quantity: 2,
      orderDate: '2024-01-16T12:00:00Z',
      status: 'served',
      servedBy: {
        _id: '1',
        firstName: 'Alice',
        lastName: 'Johnson'
      },
      createdAt: '2024-01-16T12:00:00Z'
    },
    {
      _id: '2',
      stay: {
        _id: '2',
        client: { firstName: 'Marie', lastName: 'Dubois' },
        room: { roomNumber: '102' },
        startDate: '2024-01-18T00:00:00Z',
        endDate: '2024-01-25T00:00:00Z'
      },
      foodItem: {
        _id: '2',
        name: { en: 'Caesar Salad', fr: 'Salade César' },
        price: 15
      },
      quantity: 1,
      orderDate: '2024-01-19T14:30:00Z',
      status: 'preparing',
      servedBy: null,
      createdAt: '2024-01-19T14:30:00Z'
    },
  ]

  const displayItems = orderItems.length > 0 ? orderItems : mockOrderItems

  const columns = [
    {
      field: 'orderDate',
      headerName: t('order_items.order_date'),
      width: 150,
      renderCell: (params) => new Date(params.row.orderDate).toLocaleDateString(),
    },
    {
      field: 'guest',
      headerName: 'Guest',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => 
        `${params.row.stay.client.firstName} ${params.row.stay.client.lastName}`,
    },
    {
      field: 'room',
      headerName: 'Room',
      width: 100,
      renderCell: (params) => params.row.stay.room.roomNumber,
    },
    {
      field: 'foodItem',
      headerName: t('order_items.food_item'),
      flex: 1,
      minWidth: 200,
      renderCell: (params) => params.row.foodItem.name.en,
    },
    {
      field: 'quantity',
      headerName: t('order_items.quantity'),
      width: 100,
    },
    {
      field: 'price',
      headerName: 'Total',
      width: 100,
      renderCell: (params) => `$${params.row.foodItem.price * params.row.quantity}`,
    },
    {
      field: 'status',
      headerName: t('common.status'),
      width: 120,
      renderCell: (params) => (
        <Chip
          label={t(`order_items.${params.row.status}`)}
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
          {hasPermission(6003) && (
            <IconButton
              size="small"
              onClick={() => navigate(`/order-items/edit/${params.row._id}`)}
              sx={{ color: 'primary.main' }}
            >
              <Edit size={16} />
            </IconButton>
          )}
          {hasPermission(6004) && (
            <IconButton
              size="small"
              onClick={() => {
                setSelectedOrderItem(params.row)
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
            {t('order_items.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage food service orders and kitchen operations
          </Typography>
        </Box>
        {hasPermission(6001) && (
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={() => navigate('/order-items/create')}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {t('order_items.create_order')}
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
                  <MenuItem value="pending">{t('order_items.pending')}</MenuItem>
                  <MenuItem value="preparing">{t('order_items.preparing')}</MenuItem>
                  <MenuItem value="served">{t('order_items.served')}</MenuItem>
                  <MenuItem value="cancelled">{t('order_items.cancelled')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Orders Table */}
      {displayItems.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <ShoppingCart size={64} color="#9ca3af" style={{ marginBottom: 16 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              {t('order_items.no_orders')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Orders will appear here when guests place food orders.
            </Typography>
            {hasPermission(6001) && (
              <Button
                variant="contained"
                startIcon={<Plus size={20} />}
                onClick={() => navigate('/order-items/create')}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                {t('order_items.create_order')}
              </Button>
            )}
          </CardContent>
        </Card>
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
        <DialogTitle>{t('order_items.confirm_delete')}</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this order? This action cannot be undone.
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

export default OrderItems