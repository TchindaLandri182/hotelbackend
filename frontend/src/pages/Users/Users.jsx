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
import { Search, Plus, Edit, Trash2, Users as UsersIcon, UserPlus, Mail } from 'lucide-react'
import { fetchUsers, deleteUser, generateInviteLink } from '../../store/slices/userSlice'
import { toast } from 'react-toastify'

const Users = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { users, loading } = useSelector(state => state.users)
  const { user } = useSelector(state => state.auth)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [inviteData, setInviteData] = useState({ email: '', role: '' })

  const hasPermission = (permission) => {
    if (!user) return false
    if (user.role === 'admin') return true
    return user.permissions && user.permissions.includes(permission)
  }

  const canInviteRole = (role) => {
    const roleHierarchy = {
      admin: 0,
      nationalAgent: 1,
      regionAgent: 2,
      cityAgent: 3,
      zoneAgent: 4,
      hotelDirector: 5,
      hotelManager: 6,
      restaurantManager: 6,
      beveragesManager: 6,
      owner: 7
    }
    
    const userLevel = roleHierarchy[user?.role] || 999
    const targetLevel = roleHierarchy[role] || 999
    
    return userLevel < targetLevel
  }

  // Mock data for demonstration
  const mockUsers = [
    {
      _id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      role: 'admin',
      isEmailVerified: true,
      isSignUpComplete: true,
      blocked: false,
      hotel: null,
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      _id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@email.com',
      role: 'hotelManager',
      isEmailVerified: true,
      isSignUpComplete: true,
      blocked: false,
      hotel: { name: 'Grand Palace Hotel' },
      createdAt: '2024-01-10T14:20:00Z'
    },
  ]

  useEffect(() => {
    dispatch(fetchUsers({ search: searchTerm, role: filterRole }))
  }, [dispatch, searchTerm, filterRole])

  const handleDelete = async () => {
    if (selectedUser) {
      const result = await dispatch(deleteUser(selectedUser._id))
      if (result.type === 'users/deleteUser/fulfilled') {
        toast.success(t('users.user_deleted'))
        setDeleteDialogOpen(false)
        setSelectedUser(null)
      }
    }
  }

  const handleSendInvite = async () => {
    if (!inviteData.email || !inviteData.role) {
      toast.error('Please fill in all fields')
      return
    }

    if (!canInviteRole(inviteData.role)) {
      toast.error('You cannot invite users with this role')
      return
    }

    try {
      const result = await dispatch(generateInviteLink(inviteData))
      if (result.type === 'users/generateInviteLink/fulfilled') {
        toast.success('Invitation sent successfully')
        setInviteDialogOpen(false)
        setInviteData({ email: '', role: '' })
      }
    } catch (error) {
      toast.error('Failed to send invitation')
    }
  }

  const displayUsers = users.length > 0 ? users : mockUsers

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error'
      case 'owner':
        return 'warning'
      case 'hotelManager':
      case 'restaurantManager':
      case 'beveragesManager':
        return 'primary'
      default:
        return 'default'
    }
  }

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
      field: 'role',
      headerName: t('users.role'),
      width: 150,
      renderCell: (params) => (
        <Chip
          label={t(`users.${params.row.role}`)}
          color={getRoleColor(params.row.role)}
          size="small"
        />
      ),
    },
    {
      field: 'hotel',
      headerName: 'Hotel',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => params.row.hotel?.name || '-',
    },
    {
      field: 'status',
      headerName: t('common.status'),
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.row.blocked ? 'Blocked' : 'Active'}
          color={params.row.blocked ? 'error' : 'success'}
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
          {hasPermission(1103) && (
            <IconButton
              size="small"
              onClick={() => navigate(`/users/edit/${params.row._id}`)}
              sx={{ color: 'primary.main' }}
            >
              <Edit size={16} />
            </IconButton>
          )}
          {hasPermission(1104) && (
            <IconButton
              size="small"
              onClick={() => {
                setSelectedUser(params.row)
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
            {t('users.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage system users and access control
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {hasPermission(1705) && (
            <Button
              variant="outlined"
              startIcon={<Mail size={20} />}
              onClick={() => setInviteDialogOpen(true)}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Send Invitation
            </Button>
          )}
          {hasPermission(1101) && (
            <Button
              variant="contained"
              startIcon={<Plus size={20} />}
              onClick={() => navigate('/users/create')}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              {t('users.create_user')}
            </Button>
          )}
        </Box>
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
                <InputLabel>Role</InputLabel>
                <Select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  label="Role"
                >
                  <MenuItem value="">{t('common.all')} Roles</MenuItem>
                  <MenuItem value="admin">{t('users.admin')}</MenuItem>
                  <MenuItem value="owner">{t('users.owner')}</MenuItem>
                  <MenuItem value="hotelManager">{t('users.hotel_manager')}</MenuItem>
                  <MenuItem value="restaurantManager">{t('users.restaurant_manager')}</MenuItem>
                  <MenuItem value="beveragesManager">{t('users.beverages_manager')}</MenuItem>
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
      {displayUsers.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <UsersIcon size={64} color="#9ca3af" style={{ marginBottom: 16 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              {t('users.no_users')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Get started by adding your first user.
            </Typography>
            {hasPermission(1101) && (
              <Button
                variant="contained"
                startIcon={<Plus size={20} />}
                onClick={() => navigate('/users/create')}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                {t('users.create_user')}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {displayUsers.map((userItem, index) => (
            <Grid item xs={12} sm={6} lg={4} key={userItem._id}>
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
                      src={userItem.profileImage?.url}
                      sx={{
                        bgcolor: 'primary.main',
                        mr: 2,
                        width: 48,
                        height: 48,
                      }}
                    >
                      {userItem.firstName.charAt(0)}{userItem.lastName.charAt(0)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {userItem.firstName} {userItem.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {userItem.email}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={t(`users.${userItem.role}`)}
                      color={getRoleColor(userItem.role)}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    {userItem.hotel && (
                      <Typography variant="body2" color="text.secondary">
                        Hotel: {userItem.hotel.name}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Chip
                        label={userItem.isEmailVerified ? 'Verified' : 'Unverified'}
                        color={userItem.isEmailVerified ? 'success' : 'warning'}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={userItem.blocked ? 'Blocked' : 'Active'}
                        color={userItem.blocked ? 'error' : 'success'}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Created {new Date(userItem.createdAt).toLocaleDateString()}
                    </Typography>
                    <Box>
                      {hasPermission(1103) && (
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/users/edit/${userItem._id}`)}
                          sx={{ color: 'primary.main' }}
                        >
                          <Edit size={16} />
                        </IconButton>
                      )}
                      {hasPermission(1104) && (
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedUser(userItem)
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
              rows={displayUsers}
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

      {/* Invite User Dialog */}
      <Dialog
        open={inviteDialogOpen}
        onClose={() => setInviteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Send User Invitation</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                value={inviteData.email}
                onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={inviteData.role}
                  onChange={(e) => setInviteData(prev => ({ ...prev, role: e.target.value }))}
                  label="Role"
                >
                  {['owner', 'hotelManager', 'restaurantManager', 'beveragesManager', 'hotelDirector', 'zoneAgent', 'cityAgent', 'regionAgent', 'nationalAgent']
                    .filter(role => canInviteRole(role))
                    .map(role => (
                      <MenuItem key={role} value={role}>
                        {t(`users.${role}`)}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInviteDialogOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleSendInvite} 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Send Invitation'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t('users.confirm_delete')}</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedUser?.firstName} {selectedUser?.lastName}"? This action cannot be undone.
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

export default Users