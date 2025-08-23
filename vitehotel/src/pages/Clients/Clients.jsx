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
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { Search, Plus, Edit, Trash2, Users, Phone, MapPin } from 'lucide-react'
import { fetchClients, deleteClient } from '../../store/slices/clientSlice'
import { toast } from 'react-toastify'

const Clients = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { clients, loading } = useSelector(state => state.clients)
  const { user } = useSelector(state => state.auth)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [viewMode, setViewMode] = useState('grid')

  const hasPermission = (permission) => {
    if (!user) return false
    if (user.role === 'admin') return true
    return user.permissions && user.permissions.includes(permission)
  }

  // Mock data for demonstration
  const mockClients = [
    {
      _id: '1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@email.com',
      tel: '+1234567890',
      nationality: 'American',
      profession: 'Engineer',
      cityOfResidence: 'New York',
      nIDC: 'ID123456789',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      _id: '2',
      firstName: 'Marie',
      lastName: 'Dubois',
      email: 'marie.dubois@email.com',
      tel: '+33123456789',
      nationality: 'French',
      profession: 'Doctor',
      cityOfResidence: 'Paris',
      nIDC: 'FR987654321',
      createdAt: '2024-01-10T14:20:00Z'
    },
  ]

  useEffect(() => {
    dispatch(fetchClients({ search: searchTerm }))
  }, [dispatch, searchTerm])

  const handleDelete = async () => {
    if (selectedClient) {
      const result = await dispatch(deleteClient(selectedClient._id))
      if (result.type === 'clients/deleteClient/fulfilled') {
        toast.success(t('clients.client_deleted'))
        setDeleteDialogOpen(false)
        setSelectedClient(null)
      }
    }
  }

  const displayClients = clients.length > 0 ? clients : mockClients

  const columns = [
    {
      field: 'fullName',
      headerName: t('common.name'),
      flex: 1,
      minWidth: 200,
      renderCell: (params) => `${params.row.firstName} ${params.row.lastName}`,
    },
    {
      field: 'email',
      headerName: t('common.email'),
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'tel',
      headerName: t('common.phone'),
      width: 150,
    },
    {
      field: 'nationality',
      headerName: t('clients.nationality'),
      width: 120,
    },
    {
      field: 'profession',
      headerName: t('clients.profession'),
      width: 150,
    },
    {
      field: 'actions',
      headerName: t('common.actions'),
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          {hasPermission(2003) && (
            <IconButton
              size="small"
              onClick={() => navigate(`/clients/edit/${params.row._id}`)}
              sx={{ color: 'primary.main' }}
            >
              <Edit size={16} />
            </IconButton>
          )}
          {hasPermission(2004) && (
            <IconButton
              size="small"
              onClick={() => {
                setSelectedClient(params.row)
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
            {t('clients.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage guest information and profiles
          </Typography>
        </Box>
        {hasPermission(2001) && (
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={() => navigate('/clients/create')}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {t('clients.create_client')}
          </Button>
        )}
      </Box>

      {/* Search */}
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
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
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
      {displayClients.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Users size={64} color="#9ca3af" style={{ marginBottom: 16 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              {t('clients.no_clients')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Get started by adding your first client.
            </Typography>
            {hasPermission(2001) && (
              <Button
                variant="contained"
                startIcon={<Plus size={20} />}
                onClick={() => navigate('/clients/create')}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                {t('clients.create_client')}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {displayClients.map((client, index) => (
            <Grid item xs={12} sm={6} lg={4} key={client._id}>
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
                        width: 48,
                        height: 48,
                      }}
                    >
                      {client.firstName.charAt(0)}{client.lastName.charAt(0)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {client.firstName} {client.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {client.profession}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Phone size={16} color="#6b7280" />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        {client.tel}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <MapPin size={16} color="#6b7280" />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        {client.cityOfResidence}, {client.nationality}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      ID: {client.nIDC}
                    </Typography>
                    <Box>
                      {hasPermission(2003) && (
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/clients/edit/${client._id}`)}
                          sx={{ color: 'primary.main' }}
                        >
                          <Edit size={16} />
                        </IconButton>
                      )}
                      {hasPermission(2004) && (
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedClient(client)
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
              rows={displayClients}
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
        <DialogTitle>{t('clients.confirm_delete')}</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedClient?.firstName} {selectedClient?.lastName}"? This action cannot be undone.
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

export default Clients