import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Autocomplete,
  TextField,
  Checkbox,
  FormControlLabel,
  Chip,
  Divider,
  CircularProgress,
} from '@mui/material'
import { Shield, User, Save } from 'lucide-react'
import { fetchUsers, updateUserPermissions } from '../../store/slices/userSlice'
import { toast } from 'react-toastify'

const Permissions = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  
  const { users, loading } = useSelector(state => state.users)
  const { user } = useSelector(state => state.auth)
  
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedPermissions, setSelectedPermissions] = useState([])
  const [saving, setSaving] = useState(false)

  const hasPermission = (permission) => {
    if (!user) return false
    if (user.role === 'admin') return true
    return user.permissions && user.permissions.includes(permission)
  }

  const permissionCategories = {
    'Room Categories': [
      { id: 1001, name: 'Create Room Category' },
      { id: 1002, name: 'Read Room Category' },
      { id: 1003, name: 'Update Room Category' },
      { id: 1004, name: 'Delete Room Category' },
    ],
    'Clients': [
      { id: 2001, name: 'Create Client' },
      { id: 2002, name: 'Read Client' },
      { id: 2003, name: 'Update Client' },
      { id: 2004, name: 'Delete Client' },
    ],
    'Food Items': [
      { id: 3001, name: 'Create Food Item' },
      { id: 3002, name: 'Read Food Item' },
      { id: 3003, name: 'Update Food Item' },
      { id: 3004, name: 'Delete Food Item' },
    ],
    'Hotels': [
      { id: 4001, name: 'Create Hotel' },
      { id: 4002, name: 'Read Hotel' },
      { id: 4003, name: 'Update Hotel' },
      { id: 4004, name: 'Delete Hotel' },
    ],
    'Invoices': [
      { id: 5001, name: 'Create Invoice' },
      { id: 5002, name: 'Read Invoice' },
      { id: 5003, name: 'Update Invoice' },
      { id: 5004, name: 'Delete Invoice' },
    ],
    'Order Items': [
      { id: 6001, name: 'Create Order Item' },
      { id: 6002, name: 'Read Order Item' },
      { id: 6003, name: 'Update Order Item' },
      { id: 6004, name: 'Delete Order Item' },
    ],
    'Price Periods': [
      { id: 7001, name: 'Create Price Period' },
      { id: 7002, name: 'Read Price Period' },
      { id: 7003, name: 'Update Price Period' },
      { id: 7004, name: 'Delete Price Period' },
    ],
    'Rooms': [
      { id: 8001, name: 'Create Room' },
      { id: 8002, name: 'Read Room' },
      { id: 8003, name: 'Update Room' },
      { id: 8004, name: 'Delete Room' },
    ],
    'Stays': [
      { id: 9001, name: 'Create Stay' },
      { id: 9002, name: 'Read Stay' },
      { id: 9003, name: 'Update Stay' },
      { id: 9004, name: 'Delete Stay' },
    ],
    'Users': [
      { id: 1101, name: 'Create User' },
      { id: 1102, name: 'Read User' },
      { id: 1103, name: 'Update User' },
      { id: 1104, name: 'Delete User' },
    ],
    'Locations': [
      { id: 1401, name: 'Create Location' },
      { id: 1402, name: 'Read Location' },
      { id: 1403, name: 'Update Location' },
      { id: 1404, name: 'Delete Location' },
    ],
    'Special': [
      { id: 1701, name: 'Manage Permissions' },
      { id: 1702, name: 'Access Reports' },
      { id: 1703, name: 'Override Restrictions' },
      { id: 1704, name: 'System Configuration' },
      { id: 1705, name: 'Invite User' },
    ],
  }

  // Mock users data
  const mockUsers = [
    {
      _id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      role: 'admin',
      permissions: [1001, 1002, 1003, 1004, 2001, 2002],
    },
    {
      _id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@email.com',
      role: 'hotelManager',
      permissions: [1002, 2001, 2002, 2003, 8001, 8002, 8003],
    },
  ]

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  useEffect(() => {
    if (selectedUser) {
      setSelectedPermissions(selectedUser.permissions || [])
    }
  }, [selectedUser])

  const handlePermissionToggle = (permissionId) => {
    if (selectedPermissions.includes(permissionId)) {
      setSelectedPermissions(selectedPermissions.filter(p => p !== permissionId))
    } else {
      setSelectedPermissions([...selectedPermissions, permissionId])
    }
  }

  const handleSavePermissions = async () => {
    if (!selectedUser) return

    setSaving(true)
    try {
      const result = await dispatch(updateUserPermissions({
        userId: selectedUser._id,
        permissions: selectedPermissions
      }))
      
      if (result.type.includes('fulfilled')) {
        toast.success(t('permissions.permissions_updated'))
      }
    } catch (error) {
      toast.error('Failed to update permissions')
    } finally {
      setSaving(false)
    }
  }

  const displayUsers = users.length > 0 ? users : mockUsers

  if (!hasPermission(1701)) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Shield size={64} color="#9ca3af" style={{ marginBottom: 16 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Access Denied
        </Typography>
        <Typography variant="body2" color="text.secondary">
          You don't have permission to manage user permissions.
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          {t('permissions.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage user permissions and access control
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* User Selection */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                {t('permissions.select_user')}
              </Typography>
              
              <Autocomplete
                options={displayUsers}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.email})`}
                value={selectedUser}
                onChange={(_, newValue) => setSelectedUser(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('permissions.user')}
                    placeholder="Select a user to manage permissions"
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <User size={20} style={{ marginRight: 8 }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2">
                          {option.firstName} {option.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.email} • {t(`users.${option.role}`)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
              />

              {selectedUser && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                    {t('permissions.current_permissions')}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedUser.permissions?.map((permissionId) => {
                      const permission = Object.values(permissionCategories)
                        .flat()
                        .find(p => p.id === permissionId)
                      return permission ? (
                        <Chip
                          key={permissionId}
                          label={permission.name}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ) : null
                    })}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Permission Management */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {t('permissions.assign_permissions')}
                </Typography>
                {selectedUser && (
                  <Button
                    variant="contained"
                    startIcon={<Save size={20} />}
                    onClick={handleSavePermissions}
                    disabled={saving}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                  >
                    {saving ? <CircularProgress size={20} /> : 'Save Permissions'}
                  </Button>
                )}
              </Box>

              {!selectedUser ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Shield size={64} color="#9ca3af" style={{ marginBottom: 16 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Select a User
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Choose a user from the left panel to manage their permissions.
                  </Typography>
                </Box>
              ) : (
                <Box>
                  {Object.entries(permissionCategories).map(([category, permissions]) => (
                    <Box key={category} sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        {category}
                      </Typography>
                      <Grid container spacing={1}>
                        {permissions.map((permission) => (
                          <Grid item xs={12} sm={6} md={4} key={permission.id}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={selectedPermissions.includes(permission.id)}
                                  onChange={() => handlePermissionToggle(permission.id)}
                                  size="small"
                                />
                              }
                              label={
                                <Typography variant="body2">
                                  {permission.name}
                                </Typography>
                              }
                            />
                          </Grid>
                        ))}
                      </Grid>
                      <Divider sx={{ mt: 2 }} />
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Permissions