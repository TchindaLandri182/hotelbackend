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
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { Search, Plus, Edit, Trash2, MapPin } from 'lucide-react'
import { fetchZones, deleteZone } from '../../store/slices/locationSlice'
import { toast } from 'react-toastify'

const Zones = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { zones, loading } = useSelector(state => state.locations)
  const { user } = useSelector(state => state.auth)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCity, setFilterCity] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedZone, setSelectedZone] = useState(null)

  const hasPermission = (permission) => {
    if (!user) return false
    if (user.role === 'admin') return true
    return user.permissions && user.permissions.includes(permission)
  }

  // Mock data for demonstration
  const mockZones = [
    {
      _id: '1',
      name: { en: 'Downtown', fr: 'Centre-ville' },
      city: { _id: '1', name: { en: 'New York', fr: 'New York' } },
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      _id: '2',
      name: { en: 'Uptown', fr: 'Quartier Haut' },
      city: { _id: '1', name: { en: 'New York', fr: 'New York' } },
      createdAt: '2024-01-10T14:20:00Z'
    },
  ]

  const mockCities = [
    { _id: '1', name: { en: 'New York', fr: 'New York' } },
    { _id: '2', name: { en: 'Paris', fr: 'Paris' } },
  ]

  useEffect(() => {
    dispatch(fetchZones({ search: searchTerm, city: filterCity }))
  }, [dispatch, searchTerm, filterCity])

  const handleDelete = async () => {
    if (selectedZone) {
      const result = await dispatch(deleteZone(selectedZone._id))
      if (result.type === 'locations/deleteZone/fulfilled') {
        toast.success(t('zones.zone_deleted'))
        setDeleteDialogOpen(false)
        setSelectedZone(null)
      }
    }
  }

  const displayZones = zones.length > 0 ? zones : mockZones

  const columns = [
    {
      field: 'name',
      headerName: t('zones.zone_name'),
      flex: 1,
      minWidth: 200,
      renderCell: (params) => params.row.name?.en || '-',
    },
    {
      field: 'city',
      headerName: t('zones.city'),
      flex: 1,
      minWidth: 150,
      renderCell: (params) => params.row.city?.name?.en || '-',
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
              onClick={() => navigate(`/zones/edit/${params.row._id}`)}
              sx={{ color: 'primary.main' }}
            >
              <Edit size={16} />
            </IconButton>
          )}
          {hasPermission(1404) && (
            <IconButton
              size="small"
              onClick={() => {
                setSelectedZone(params.row)
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
            {t('zones.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage geographical zones within cities
          </Typography>
        </Box>
        {hasPermission(1401) && (
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={() => navigate('/zones/create')}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {t('zones.create_zone')}
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
                <InputLabel>City</InputLabel>
                <Select
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  label="City"
                >
                  <MenuItem value="">{t('common.all')} Cities</MenuItem>
                  {mockCities.map((city) => (
                    <MenuItem key={city._id} value={city._id}>
                      {city.name.en}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Zones Table */}
      {displayZones.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <MapPin size={64} color="#9ca3af" style={{ marginBottom: 16 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              {t('zones.no_zones')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Get started by creating your first zone.
            </Typography>
            {hasPermission(1401) && (
              <Button
                variant="contained"
                startIcon={<Plus size={20} />}
                onClick={() => navigate('/zones/create')}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                {t('zones.create_zone')}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Box sx={{ height: 600 }}>
            <DataGrid
              rows={displayZones}
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
        <DialogTitle>{t('zones.confirm_delete')}</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedZone?.name?.en}"? This action cannot be undone.
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

export default Zones