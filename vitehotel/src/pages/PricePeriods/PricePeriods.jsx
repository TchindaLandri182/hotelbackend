import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { Search, Plus, Edit, Trash2, DollarSign } from 'lucide-react'
import { toast } from 'react-toastify'

const PricePeriods = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  
  const [pricePeriods, setPricePeriods] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEntityType, setFilterEntityType] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedPricePeriod, setSelectedPricePeriod] = useState(null)

  // Mock data for demonstration
  const mockPricePeriods = [
    {
      _id: '1',
      entityType: 'Room',
      entityId: { _id: '1', roomNumber: '101', hotel: { name: 'Grand Palace Hotel' } },
      startDate: '2024-02-01T00:00:00Z',
      endDate: '2024-02-28T00:00:00Z',
      newPrice: 150,
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      _id: '2',
      entityType: 'Food',
      entityId: { _id: '1', name: { en: 'Grilled Chicken' } },
      startDate: '2024-03-01T00:00:00Z',
      endDate: '2024-03-31T00:00:00Z',
      newPrice: 30,
      createdAt: '2024-01-20T14:20:00Z'
    },
  ]

  useEffect(() => {
    // Simulate API call
    setLoading(true)
    setTimeout(() => {
      setPricePeriods(mockPricePeriods)
      setLoading(false)
    }, 1000)
  }, [searchTerm, filterEntityType])

  const handleDelete = async () => {
    if (selectedPricePeriod) {
      setPricePeriods(pricePeriods.filter(period => period._id !== selectedPricePeriod._id))
      toast.success(t('price_periods.price_period_deleted'))
      setDeleteDialogOpen(false)
      setSelectedPricePeriod(null)
    }
  }

  const columns = [
    {
      field: 'entityType',
      headerName: t('price_periods.entity_type'),
      width: 120,
    },
    {
      field: 'entity',
      headerName: 'Entity',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        if (params.row.entityType === 'Room') {
          return `Room ${params.row.entityId.roomNumber} - ${params.row.entityId.hotel?.name}`
        } else {
          return params.row.entityId.name?.en || 'Unknown'
        }
      },
    },
    {
      field: 'startDate',
      headerName: t('price_periods.start_date'),
      width: 120,
      renderCell: (params) => new Date(params.row.startDate).toLocaleDateString(),
    },
    {
      field: 'endDate',
      headerName: t('price_periods.end_date'),
      width: 120,
      renderCell: (params) => new Date(params.row.endDate).toLocaleDateString(),
    },
    {
      field: 'newPrice',
      headerName: t('price_periods.new_price'),
      width: 120,
      renderCell: (params) => `$${params.row.newPrice}`,
    },
    {
      field: 'status',
      headerName: t('common.status'),
      width: 100,
      renderCell: (params) => {
        const now = new Date()
        const start = new Date(params.row.startDate)
        const end = new Date(params.row.endDate)
        
        let status = 'upcoming'
        let color = 'info'
        
        if (now >= start && now <= end) {
          status = 'active'
          color = 'success'
        } else if (now > end) {
          status = 'expired'
          color = 'default'
        }
        
        return (
          <Chip
            label={status}
            color={color}
            size="small"
            sx={{ textTransform: 'capitalize' }}
          />
        )
      },
    },
    {
      field: 'actions',
      headerName: t('common.actions'),
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => navigate(`/price-periods/edit/${params.row._id}`)}
            sx={{ color: 'primary.main' }}
          >
            <Edit size={16} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => {
              setSelectedPricePeriod(params.row)
              setDeleteDialogOpen(true)
            }}
            sx={{ color: 'error.main' }}
          >
            <Trash2 size={16} />
          </IconButton>
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
            {t('price_periods.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage seasonal pricing and special rates
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={() => navigate('/price-periods/create')}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          {t('price_periods.create_price_period')}
        </Button>
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
                <InputLabel>Entity Type</InputLabel>
                <Select
                  value={filterEntityType}
                  onChange={(e) => setFilterEntityType(e.target.value)}
                  label="Entity Type"
                >
                  <MenuItem value="">{t('common.all')} Types</MenuItem>
                  <MenuItem value="Room">{t('price_periods.room')}</MenuItem>
                  <MenuItem value="Food">{t('price_periods.food')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Price Periods Table */}
      {pricePeriods.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <DollarSign size={64} color="#9ca3af" style={{ marginBottom: 16 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              {t('price_periods.no_price_periods')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Get started by creating your first price period.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Plus size={20} />}
              onClick={() => navigate('/price-periods/create')}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              {t('price_periods.create_price_period')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Box sx={{ height: 600 }}>
            <DataGrid
              rows={pricePeriods}
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
        <DialogTitle>{t('price_periods.confirm_delete')}</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this price period? This action cannot be undone.
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

export default PricePeriods