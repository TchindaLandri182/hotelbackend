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
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { Search, Plus, Edit, Trash2, MapPin } from 'lucide-react'
import { countryAPI } from '../../services/api'
import { toast } from 'react-toastify'

const Countries = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [cookies] = useCookies(['user'])
  const user = cookies.user
  
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(false)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState(null)

  const hasPermission = (permission) => {
    if (!user) return false
    if (user.role === 'admin') return true
    return user.permissions && user.permissions.includes(permission)
  }

  // Mock data for demonstration
  const mockCountries = [
    {
      _id: '1',
      name: { en: 'United States', fr: 'États-Unis' },
      code: 'US',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      _id: '2',
      name: { en: 'France', fr: 'France' },
      code: 'FR',
      createdAt: '2024-01-10T14:20:00Z'
    },
    {
      _id: '3',
      name: { en: 'United Kingdom', fr: 'Royaume-Uni' },
      code: 'UK',
      createdAt: '2024-01-05T09:15:00Z'
    },
  ]

  useEffect(() => {
    fetchCountries()
  }, [dispatch, searchTerm])

  const fetchCountries = async () => {
    setLoading(true)
    try {
      const response = await countryAPI.getAll({ search: searchTerm })
      setCountries(response.data.countries || [])
    } catch (error) {
      console.error('Error fetching countries:', error)
      toast.error('Failed to load countries')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (selectedCountry) {
      try {
        await countryAPI.delete(selectedCountry._id)
        toast.success(t('countries.country_deleted'))
        setDeleteDialogOpen(false)
        setSelectedCountry(null)
        fetchCountries()
      } catch (error) {
        toast.error('Failed to delete country')
      }
    }
  }

  const displayCountries = countries.length > 0 ? countries : mockCountries

  const columns = [
    {
      field: 'name',
      headerName: t('countries.country_name'),
      flex: 1,
      minWidth: 200,
      renderCell: (params) => params.row.name?.en || '-',
    },
    {
      field: 'code',
      headerName: t('countries.country_code'),
      width: 120,
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 150,
      renderCell: (params) => new Date(params.row.createdAt).toLocaleDateString(),
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
              onClick={() => navigate(`/countries/edit/${params.row._id}`)}
              sx={{ color: 'primary.main' }}
            >
              <Edit size={16} />
            </IconButton>
          )}
          {hasPermission(1404) && (
            <IconButton
              size="small"
              onClick={() => {
                setSelectedCountry(params.row)
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
            {t('countries.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage countries in the system
          </Typography>
        </Box>
        {hasPermission(1401) && (
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={() => navigate('/countries/create')}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {t('countries.create_country')}
          </Button>
        )}
      </Box>

      {/* Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Countries Table */}
      <Card>
        <Box sx={{ height: 600 }}>
          <DataGrid
            rows={displayCountries}
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
        <DialogTitle>{t('countries.confirm_delete')}</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedCountry?.name?.en}"? This action cannot be undone.
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

export default Countries