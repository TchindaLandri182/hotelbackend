import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  IconButton,
  CircularProgress,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  FormControlLabel,
  Checkbox,
  Chip,
  InputAdornment,
} from '@mui/material'
import { ArrowLeft, Camera, Eye, EyeOff } from 'lucide-react'
import { createUser, updateUser, fetchUserById, clearCurrentUser } from '../../store/slices/userSlice'
import { fetchHotels } from '../../store/slices/hotelSlice'
import { toast } from 'react-toastify'

const UserForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams()
  const isEdit = !!id

  const { currentUser, loading } = useSelector(state => state.users)
  const { hotels } = useSelector(state => state.hotels)
  const { user } = useSelector(state => state.auth)
  
  const [imagePreview, setImagePreview] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  const availablePermissions = [
    { id: 1001, name: 'Create Room Category', category: 'Room Categories' },
    { id: 1002, name: 'Read Room Category', category: 'Room Categories' },
    { id: 1003, name: 'Update Room Category', category: 'Room Categories' },
    { id: 1004, name: 'Delete Room Category', category: 'Room Categories' },
    { id: 2001, name: 'Create Client', category: 'Clients' },
    { id: 2002, name: 'Read Client', category: 'Clients' },
    { id: 2003, name: 'Update Client', category: 'Clients' },
    { id: 2004, name: 'Delete Client', category: 'Clients' },
    { id: 4001, name: 'Create Hotel', category: 'Hotels' },
    { id: 4002, name: 'Read Hotel', category: 'Hotels' },
    { id: 4003, name: 'Update Hotel', category: 'Hotels' },
    { id: 4004, name: 'Delete Hotel', category: 'Hotels' },
    { id: 8001, name: 'Create Room', category: 'Rooms' },
    { id: 8002, name: 'Read Room', category: 'Rooms' },
    { id: 8003, name: 'Update Room', category: 'Rooms' },
    { id: 8004, name: 'Delete Room', category: 'Rooms' },
    { id: 9001, name: 'Create Stay', category: 'Stays' },
    { id: 9002, name: 'Read Stay', category: 'Stays' },
    { id: 9003, name: 'Update Stay', category: 'Stays' },
    { id: 9004, name: 'Delete Stay', category: 'Stays' },
  ]

  useEffect(() => {
    dispatch(fetchHotels())

    if (isEdit) {
      dispatch(fetchUserById(id))
    }

    return () => {
      dispatch(clearCurrentUser())
    }
  }, [dispatch, id, isEdit])

  useEffect(() => {
    if (currentUser?.profileImage?.url) {
      setImagePreview(currentUser.profileImage.url)
    }
  }, [currentUser])

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required(t('errors.required_field')),
    lastName: Yup.string()
      .required(t('errors.required_field')),
    email: Yup.string()
      .email(t('errors.invalid_email'))
      .required(t('errors.required_field')),
    role: Yup.string()
      .required(t('errors.required_field')),
    ...(!isEdit && {
      password: Yup.string()
        .min(8, t('errors.password_too_short'))
        .required(t('errors.required_field')),
    }),
  })

  const initialValues = {
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    role: currentUser?.role || '',
    hotel: currentUser?.hotel?._id || '',
    permissions: currentUser?.permissions || [],
    blocked: currentUser?.blocked || false,
    password: '',
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (values) => {
    const userData = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      role: values.role,
      hotel: values.hotel || null,
      permissions: values.permissions,
      blocked: values.blocked,
      profileImage: selectedFile,
    }

    if (!isEdit && values.password) {
      userData.password = values.password
    }

    const result = isEdit 
      ? await dispatch(updateUser({ id, userData }))
      : await dispatch(createUser(userData))

    if (result.type.includes('fulfilled')) {
      toast.success(isEdit ? t('users.user_updated') : t('users.user_created'))
      navigate('/users')
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/users')} sx={{ mr: 2 }}>
          <ArrowLeft size={24} />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {isEdit ? t('users.edit_user') : t('users.create_user')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isEdit ? 'Update user information' : 'Add a new user to your system'}
          </Typography>
        </Box>
      </Box>

      <Card>
        <CardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ errors, touched, values, setFieldValue }) => (
              <Form>
                <Grid container spacing={3}>
                  {/* Profile Image */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={imagePreview}
                        sx={{ width: 80, height: 80 }}
                      >
                        {!imagePreview && <UserPlus size={40} />}
                      </Avatar>
                      <Box>
                        <Button
                          component="label"
                          variant="outlined"
                          startIcon={<Camera size={20} />}
                          sx={{ textTransform: 'none' }}
                        >
                          Upload Photo
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </Button>
                        <Typography variant="caption" display="block" color="text.secondary">
                          JPG, PNG up to 5MB
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      name="firstName"
                      label={t('users.first_name')}
                      fullWidth
                      variant="outlined"
                      error={touched.firstName && Boolean(errors.firstName)}
                      helperText={touched.firstName && errors.firstName}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      name="lastName"
                      label={t('users.last_name')}
                      fullWidth
                      variant="outlined"
                      error={touched.lastName && Boolean(errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      name="email"
                      type="email"
                      label={t('common.email')}
                      fullWidth
                      variant="outlined"
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                    />
                  </Grid>

                  {!isEdit && (
                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        label={t('auth.password')}
                        fullWidth
                        variant="outlined"
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  )}

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={touched.role && Boolean(errors.role)}>
                      <InputLabel>{t('users.role')}</InputLabel>
                      <Select
                        value={values.role}
                        onChange={(e) => setFieldValue('role', e.target.value)}
                        label={t('users.role')}
                      >
                        <MenuItem value="admin">{t('users.admin')}</MenuItem>
                        <MenuItem value="owner">{t('users.owner')}</MenuItem>
                        <MenuItem value="hotelManager">{t('users.hotel_manager')}</MenuItem>
                        <MenuItem value="restaurantManager">{t('users.restaurant_manager')}</MenuItem>
                        <MenuItem value="beveragesManager">{t('users.beverages_manager')}</MenuItem>
                        <MenuItem value="hotelDirector">{t('users.hotel_director')}</MenuItem>
                        <MenuItem value="zoneAgent">{t('users.zone_agent')}</MenuItem>
                        <MenuItem value="cityAgent">{t('users.city_agent')}</MenuItem>
                        <MenuItem value="regionAgent">{t('users.region_agent')}</MenuItem>
                        <MenuItem value="nationalAgent">{t('users.national_agent')}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      options={hotels}
                      getOptionLabel={(option) => option.name || ''}
                      value={hotels.find(hotel => hotel._id === values.hotel) || null}
                      onChange={(_, newValue) => setFieldValue('hotel', newValue?._id || '')}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Hotel (Optional)"
                        />
                      )}
                    />
                  </Grid>

                  {/* Permissions */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      {t('users.permissions')}
                    </Typography>
                    <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                      {availablePermissions.map((permission) => (
                        <FormControlLabel
                          key={permission.id}
                          control={
                            <Checkbox
                              checked={values.permissions.includes(permission.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFieldValue('permissions', [...values.permissions, permission.id])
                                } else {
                                  setFieldValue('permissions', values.permissions.filter(p => p !== permission.id))
                                }
                              }}
                            />
                          }
                          label={
                            <Box>
                              <Typography variant="body2">{permission.name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {permission.category}
                              </Typography>
                            </Box>
                          }
                          sx={{ display: 'block', mb: 1 }}
                        />
                      ))}
                    </Box>
                  </Grid>

                  {isEdit && (
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={values.blocked}
                            onChange={(e) => setFieldValue('blocked', e.target.checked)}
                          />
                        }
                        label="Block User"
                      />
                    </Grid>
                  )}
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/users')}
                    sx={{ textTransform: 'none' }}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                  >
                    {loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      isEdit ? t('common.update') : t('common.create')
                    )}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </Box>
  )
}

export default UserForm