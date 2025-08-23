import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Avatar,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  CircularProgress,
  InputAdornment,
  Tabs,
  Tab,
} from '@mui/material'
import { Camera, Eye, EyeOff, Save, User } from 'lucide-react'
import { setTheme, setLanguage, setFontSize } from '../../store/slices/uiSlice'
import { updateUser } from '../../store/slices/authSlice'
import { toast } from 'react-toastify'

const Settings = () => {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  
  const { user } = useSelector(state => state.auth)
  const { theme, language, fontSize } = useSelector(state => state.ui)
  
  const [activeTab, setActiveTab] = useState(0)
  const [imagePreview, setImagePreview] = useState(user?.profileImage?.url || null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const profileValidationSchema = Yup.object({
    firstName: Yup.string()
      .required(t('errors.required_field')),
    lastName: Yup.string()
      .required(t('errors.required_field')),
    email: Yup.string()
      .email(t('errors.invalid_email'))
      .required(t('errors.required_field')),
  })

  const passwordValidationSchema = Yup.object({
    currentPassword: Yup.string()
      .required(t('errors.required_field')),
    newPassword: Yup.string()
      .min(8, t('errors.password_too_short'))
      .required(t('errors.required_field')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], t('errors.passwords_dont_match'))
      .required(t('errors.required_field')),
  })

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

  const handleProfileSubmit = async (values) => {
    setLoading(true)
    try {
      const profileData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        profileImage: selectedFile,
      }

      const result = await dispatch(updateUser({ id: user._id, userData: profileData }))
      if (result.type.includes('fulfilled')) {
        toast.success(t('settings.settings_updated'))
      }
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (values) => {
    setLoading(true)
    try {
      // Simulate password change API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success(t('settings.password_changed'))
    } catch (error) {
      toast.error('Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const handleThemeChange = (newTheme) => {
    dispatch(setTheme(newTheme))
    toast.success('Theme updated successfully')
  }

  const handleLanguageChange = (newLanguage) => {
    i18n.changeLanguage(newLanguage)
    dispatch(setLanguage(newLanguage))
    toast.success('Language updated successfully')
  }

  const handleFontSizeChange = (newFontSize) => {
    dispatch(setFontSize(newFontSize))
    toast.success('Font size updated successfully')
  }

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          {t('settings.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account settings and preferences
        </Typography>
      </Box>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab label={t('settings.profile_settings')} />
            <Tab label={t('settings.appearance')} />
            <Tab label={t('settings.change_password')} />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              {t('settings.profile_settings')}
            </Typography>
            
            <Formik
              initialValues={{
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
                email: user?.email || '',
              }}
              validationSchema={profileValidationSchema}
              onSubmit={handleProfileSubmit}
              enableReinitialize
            >
              {({ errors, touched }) => (
                <Form>
                  <Grid container spacing={3}>
                    {/* Profile Image */}
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Avatar
                          src={imagePreview}
                          sx={{ width: 100, height: 100 }}
                        >
                          {!imagePreview && <User size={50} />}
                        </Avatar>
                        <Box>
                          <Button
                            component="label"
                            variant="outlined"
                            startIcon={<Camera size={20} />}
                            sx={{ textTransform: 'none', mb: 1 }}
                          >
                            {t('settings.upload_image')}
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
                          {imagePreview && (
                            <Button
                              variant="text"
                              size="small"
                              onClick={() => {
                                setImagePreview(null)
                                setSelectedFile(null)
                              }}
                              sx={{ textTransform: 'none', color: 'error.main' }}
                            >
                              {t('settings.remove_image')}
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="firstName"
                        label={t('auth.first_name')}
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
                        label={t('auth.last_name')}
                        fullWidth
                        variant="outlined"
                        error={touched.lastName && Boolean(errors.lastName)}
                        helperText={touched.lastName && errors.lastName}
                      />
                    </Grid>

                    <Grid item xs={12}>
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
                  </Grid>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<Save size={20} />}
                      disabled={loading}
                      sx={{ textTransform: 'none', fontWeight: 600 }}
                    >
                      {loading ? <CircularProgress size={20} /> : t('settings.update_profile')}
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </CardContent>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              {t('settings.appearance')}
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                  {t('settings.theme')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant={theme === 'light' ? 'contained' : 'outlined'}
                    onClick={() => handleThemeChange('light')}
                    sx={{ textTransform: 'none' }}
                  >
                    {t('settings.light')}
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'contained' : 'outlined'}
                    onClick={() => handleThemeChange('dark')}
                    sx={{ textTransform: 'none' }}
                  >
                    {t('settings.dark')}
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                  {t('settings.language')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant={language === 'en' ? 'contained' : 'outlined'}
                    onClick={() => handleLanguageChange('en')}
                    sx={{ textTransform: 'none' }}
                  >
                    {t('settings.english')}
                  </Button>
                  <Button
                    variant={language === 'fr' ? 'contained' : 'outlined'}
                    onClick={() => handleLanguageChange('fr')}
                    sx={{ textTransform: 'none' }}
                  >
                    {t('settings.french')}
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                  {t('settings.font_size')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant={fontSize === 'small' ? 'contained' : 'outlined'}
                    onClick={() => handleFontSizeChange('small')}
                    sx={{ textTransform: 'none' }}
                  >
                    {t('settings.small')}
                  </Button>
                  <Button
                    variant={fontSize === 'medium' ? 'contained' : 'outlined'}
                    onClick={() => handleFontSizeChange('medium')}
                    sx={{ textTransform: 'none' }}
                  >
                    {t('settings.medium')}
                  </Button>
                  <Button
                    variant={fontSize === 'large' ? 'contained' : 'outlined'}
                    onClick={() => handleFontSizeChange('large')}
                    sx={{ textTransform: 'none' }}
                  >
                    {t('settings.large')}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              {t('settings.change_password')}
            </Typography>
            
            <Formik
              initialValues={{
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
              }}
              validationSchema={passwordValidationSchema}
              onSubmit={handlePasswordSubmit}
            >
              {({ errors, touched }) => (
                <Form>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        name="currentPassword"
                        type={showCurrentPassword ? 'text' : 'password'}
                        label={t('settings.current_password')}
                        fullWidth
                        variant="outlined"
                        error={touched.currentPassword && Boolean(errors.currentPassword)}
                        helperText={touched.currentPassword && errors.currentPassword}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                edge="end"
                              >
                                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        label={t('settings.new_password')}
                        fullWidth
                        variant="outlined"
                        error={touched.newPassword && Boolean(errors.newPassword)}
                        helperText={touched.newPassword && errors.newPassword}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                edge="end"
                              >
                                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        label={t('settings.confirm_new_password')}
                        fullWidth
                        variant="outlined"
                        error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                        helperText={touched.confirmPassword && errors.confirmPassword}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                edge="end"
                              >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<Save size={20} />}
                      disabled={loading}
                      sx={{ textTransform: 'none', fontWeight: 600 }}
                    >
                      {loading ? <CircularProgress size={20} /> : t('settings.change_password')}
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </CardContent>
        </TabPanel>
      </Card>
    </Box>
  )
}

export default Settings