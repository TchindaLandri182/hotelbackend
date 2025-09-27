import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCookies } from 'react-cookie'
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
import { Search, Plus, CreditCard as Edit, Trash2, MapPin } from 'lucide-react'
import { cityAPI, regionAPI } from '../../services/api'
import { toast } from 'react-toastify'

const Cities = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [cookies] = useCookies(['user'])
  const user = cookies.user
  
  const [cities, setCities] = useState([])
  const [regions, setRegions] = useState([])
  const [loading, setLoading] = useState(false)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRegion, setFilterRegion] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState(null)

  const hasPermission = (permission) => {
    if (!user) return false
    if (user.role === 'admin') return true
    return user.permissions && user.permissions.includes(permission)
  }

  // Mock data for demonstration
  const mockCities = [
    {
      _id: '1',
      name: { en: 'New York', fr: 'New York' },
      region: { _id: '1', name: { en: 'New York State', fr: 'État de New York' } },
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      _id: '2',
      name: { en: 'Paris', fr: 'Paris' },
      region: { _id: '2', name: { en: 'Île-de-France', fr: 'Île-de-France' } },
      createdAt: '2024-01-10T14:20:00Z'
    },
  ]


  useEffect(() => {
    fetchRegions()
    fetchCities()
  }, [dispatch, searchTerm, filterRegion])

  const fetchRegions = async () => {
    try {
      const response = await regionAPI.getAll()
      setRegions(response.data.regions || [])
    } catch (error) {
      console.error('Error fetching regions:', error)
    }
  }

  const fetchCities = async () => {
    setLoading(true)
    try {
      const response = await cityAPI.getAll({ search: searchTerm, region: filterRegion })
      setCities(response.data.cities || [])
    } catch (error) {
      console.error('Error fetching cities:', error)
      toast.error('Failed to load cities')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (selectedCity) {
      try {
        await cityAPI.delete(selectedCity._id)
        toast.success(t('cities.city_deleted'))
        setDeleteDialogOpen(false)
        setSelectedCity(null)
        fetchCities()
      } catch (error) {
        toast.error('Failed to delete city')
      }
    }
  }

  const displayCities = cities

  const columns = [
    {
      field: 'name',
      headerName: t('cities.city_name'),
      flex: 1,
      minWidth: 200,
      renderCell: (params) => params.row.name?.en || '-',
    },
    {
      field: 'region',
      headerName: t('cities.region'),
      flex: 1,
      minWidth: 150,
      renderCell: (params) => params.row.region?.name?.en || '-',
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
              onClick={() => navigate(`/cities/edit/${params.row._id}`)}
              sx={{ color: 'primary.main' }}
            >
              <Edit size={16} />
            </IconButton>
          )}
          {hasPermission(1404) && (
            <IconButton
              size="small"
              onClick={() => {
                setSelectedCity(params.row)
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
            {t('cities.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage cities within regions
          </Typography>
        </Box>
        {hasPermission(1401) && (
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={() => navigate('/cities/create')}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {t('cities.create_city')}
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
                <InputLabel>Region</InputLabel>
                <Select
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)}
                  label="Region"
                >
                  <MenuItem value="">{t('common.all')} Regions</MenuItem>
                  {regions.map((region) => (
                    <MenuItem key={region._id} value={region._id}>
                      {region.name.en}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Cities Table */}
      <Card>
        <Box sx={{ height: 600 }}>
          <DataGrid
            rows={displayCities}
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
        <DialogTitle>{t('cities.confirm_delete')}</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedCity?.name?.en}"? This action cannot be undone.
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

export default Cities