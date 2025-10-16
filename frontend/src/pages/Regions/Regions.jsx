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
import { Search, Plus, Edit, Trash2, MapPin } from 'lucide-react'
import { fetchRegions, deleteRegion } from '../../store/slices/locationSlice'
import { toast } from 'react-toastify'

const Regions = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { regions, loading } = useSelector(state => state.locations)
  const { user } = useSelector(state => state.auth)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCountry, setFilterCountry] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState(null)

  const hasPermission = (permission) => {
    if (!user) return false
    if (user.role === 'admin') return true
    return user.permissions && user.permissions.includes(permission)
  }

  // Mock data for demonstration
  const mockRegions = [
    {
      _id: '1',
      name: { en: 'New York State', fr: 'État de New York' },
      country: { _id: '1', name: { en: 'United States', fr: 'États-Unis' } },
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      _id: '2',
      name: { en: 'Île-de-France', fr: 'Île-de-France' },
      country: { _id: '2', name: { en: 'France', fr: 'France' } },
      createdAt: '2024-01-10T14:20:00Z'
    },
  ]

  const mockCountries = [
    { _id: '1', name: { en: 'United States', fr: 'États-Unis' } },
    { _id: '2', name: { en: 'France', fr: 'France' } },
  ]

  useEffect(() => {
    dispatch(fetchRegions({ search: searchTerm, country: filterCountry }))
  }, [dispatch, searchTerm, filterCountry])

  const handleDelete = async () => {
    if (selectedRegion) {
      const result = await dispatch(deleteRegion(selectedRegion._id))
      if (result.type === 'locations/deleteRegion/fulfilled') {
        toast.success(t('regions.region_deleted'))
        setDeleteDialogOpen(false)
        setSelectedRegion(null)
      }
    }
  }

  const displayRegions = regions.length > 0 ? regions : mockRegions

  const columns = [
    {
      field: 'name',
      headerName: t('regions.region_name'),
      flex: 1,
      minWidth: 200,
      renderCell: (params) => params.row.name?.en || '-',
    },
    {
      field: 'country',
      headerName: t('regions.country'),
      flex: 1,
      minWidth: 150,
      renderCell: (params) => params.row.country?.name?.en || '-',
    },
    {
      field: 'actions',
      headerName: t('common.actions'),
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          {hasPermission(1403) && (
            <IconButton
              size="small"
              onClick={() => navigate(`/regions/edit/${params.row._id}`)}
              sx={{ color: 'primary.main' }}
            >
              <Edit size={16} />
            </IconButton>
          )}
          {hasPermission(1404) && (
            <IconButton
              size="small"
              onClick={() => {
                setSelectedRegion(params.row)
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
            {t('regions.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage geographical regions within countries
          </Typography>
        </Box>
        {hasPermission(1401) && (
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={() => navigate('/regions/create')}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {t('regions.create_region')}
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
                <InputLabel>Country</InputLabel>
                <Select
                  value={filterCountry}
                  onChange={(e) => setFilterCountry(e.target.value)}
                  label="Country"
                >
                  <MenuItem value="">{t('common.all')} Countries</MenuItem>
                  {mockCountries.map((country) => (
                    <MenuItem key={country._id} value={country._id}>
                      {country.name.en}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Regions Table */}
      <Card>
        <Box sx={{ height: 600 }}>
          <DataGrid
            rows={displayRegions}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t('regions.confirm_delete')}</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedRegion?.name?.en}"? This action cannot be undone.
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

export default Regions