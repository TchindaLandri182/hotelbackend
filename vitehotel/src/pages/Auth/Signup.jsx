import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Avatar,
} from '@mui/material'
import { Eye, EyeOff, UserPlus, Camera, Hotel } from 'lucide-react'
import { authAPI } from '../../services/api'
import { toast } from 'react-toastify'

const Signup = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [signupData, setSignupData] = useState({})
  const [imagePreview, setImagePreview] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  const steps = ['Account Details', 'Profile Information', 'Hotel Information']

  const accountValidationSchema = Yup.object({
    email: Yup.string()
      .email(t('errors.invalid_email'))
      .required(t('errors.required_field')),
    password: Yup.string()
      .min(8, t('errors.password_too_short'))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      )
      .required(t('errors.required_field')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('errors.passwords_dont_match'))
      .required(t('errors.required_field')),
  })

  const profileValidationSchema = Yup.object({
    firstName: Yup.string()
      .required(t('errors.required_field')),
    lastName: Yup.string()
      .required(t('errors.required_field')),
  })

  const hotelValidationSchema = Yup.object({
    hotelName: Yup.string()
      .required(t('errors.required_field')),
    hotelAddress: Yup.string()
      .required(t('errors.required_field')),
    zoneName: Yup.string()
      .required(t('errors.required_field')),
    cityName: Yup.string()
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

  const handleAccountSubmit = (values) => {
    setSignupData(prev => ({ ...prev, ...values }))
    setActiveStep(1)
  }

  const handleProfileSubmit = (values) => {
    setSignupData(prev => ({ 
      ...prev, 
      ...values,
      profileImage: selectedFile 
    }))
    setActiveStep(2)
  }

  const handleHotelSubmit = async (values) => {
    setLoading(true)
    setError('')

    try {
      const completeData = {
        ...signupData,
        ...values,
        role: 'owner' // Default role for new signups
      }

      const formData = new FormData()
      Object.keys(completeData).forEach(key => {
        if (completeData[key] !== null && completeData[key] !== undefined) {
          if (key === 'profileImage' && completeData[key] instanceof File) {
            formData.append(key, completeData[key])
          } else {
            formData.append(key, completeData[key])
          }
        }
      })

      const response = await authAPI.signup(formData)
      
      if (response.data.requiresVerification) {
        toast.success('Account created! Please check your email for verification.')
        navigate('/verify-email')
      } else {
        toast.success('Account created successfully!')
        navigate('/login')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    setActiveStep(prev => prev - 1)
  }

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Formik
            initialValues={{ 
              email: signupData.email || '', 
              password: '', 
              confirmPassword: '' 
            }}
            validationSchema={accountValidationSchema}
            onSubmit={handleAccountSubmit}
          >
            {({ errors, touched, values, handleChange, handleBlur }) => (
              <Form>
                <Field
                  as={TextField}
                  name="email"
                  type="email"
                  label={t('auth.email')}
                  fullWidth
                  variant="outlined"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{ mb: 3 }}
                />

                <Field
                  as={TextField}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  label={t('auth.password')}
                  fullWidth
                  variant="outlined"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
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
                  sx={{ mb: 3 }}
                />

                <Field
                  as={TextField}
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  label={t('auth.confirm_password')}
                  fullWidth
                  variant="outlined"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
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
                  sx={{ mb: 4 }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Continue
                </Button>
              </Form>
            )}
          </Formik>
        )

      case 1:
        return (
          <Formik
            initialValues={{ 
              firstName: signupData.firstName || '', 
              lastName: signupData.lastName || '' 
            }}
            validationSchema={profileValidationSchema}
            onSubmit={handleProfileSubmit}
          >
            {({ errors, touched, values, handleChange, handleBlur }) => (
              <Form>
                {/* Profile Image */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                  <Box sx={{ position: 'relative' }}>
                    <Avatar
                      src={imagePreview}
                      sx={{ 
                        width: 100, 
                        height: 100,
                        bgcolor: 'primary.main',
                        fontSize: '2rem'
                      }}
                    >
                      {!imagePreview && <UserPlus size={50} />}
                    </Avatar>
                    <IconButton
                      component="label"
                      sx={{
                        position: 'absolute',
                        bottom: -8,
                        right: -8,
                        bgcolor: 'primary.main',
                        color: 'white',
                        width: 40,
                        height: 40,
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        },
                      }}
                    >
                      <Camera size={20} />
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </IconButton>
                  </Box>
                </Box>

                <Field
                  as={TextField}
                  name="firstName"
                  label={t('auth.first_name')}
                  fullWidth
                  variant="outlined"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.firstName && Boolean(errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                  sx={{ mb: 3 }}
                />

                <Field
                  as={TextField}
                  name="lastName"
                  label={t('auth.last_name')}
                  fullWidth
                  variant="outlined"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.lastName && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ mb: 4 }}
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    sx={{ textTransform: 'none', flex: 1 }}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ textTransform: 'none', fontWeight: 600, flex: 1 }}
                  >
                    Continue
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        )

      case 2:
        return (
          <Formik
            initialValues={{ 
              hotelName: signupData.hotelName || '',
              hotelAddress: signupData.hotelAddress || '',
              zoneName: signupData.zoneName || '',
              cityName: signupData.cityName || '',
            }}
            validationSchema={hotelValidationSchema}
            onSubmit={handleHotelSubmit}
          >
            {({ errors, touched, values, handleChange, handleBlur }) => (
              <Form>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
                  Tell us about your hotel
                </Typography>

                <Field
                  as={TextField}
                  name="hotelName"
                  label="Hotel Name"
                  fullWidth
                  variant="outlined"
                  value={values.hotelName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.hotelName && Boolean(errors.hotelName)}
                  helperText={touched.hotelName && errors.hotelName}
                  sx={{ mb: 3 }}
                />

                <Field
                  as={TextField}
                  name="hotelAddress"
                  label="Hotel Address"
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  value={values.hotelAddress}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.hotelAddress && Boolean(errors.hotelAddress)}
                  helperText={touched.hotelAddress && errors.hotelAddress}
                  sx={{ mb: 3 }}
                />

                <Field
                  as={TextField}
                  name="cityName"
                  label="City"
                  fullWidth
                  variant="outlined"
                  value={values.cityName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.cityName && Boolean(errors.cityName)}
                  helperText={touched.cityName && errors.cityName}
                  sx={{ mb: 3 }}
                />

                <Field
                  as={TextField}
                  name="zoneName"
                  label="Zone/District"
                  fullWidth
                  variant="outlined"
                  value={values.zoneName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.zoneName && Boolean(errors.zoneName)}
                  helperText={touched.zoneName && errors.zoneName}
                  sx={{ mb: 4 }}
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    sx={{ textTransform: 'none', flex: 1 }}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{ textTransform: 'none', fontWeight: 600, flex: 1 }}
                  >
                    {loading ? <CircularProgress size={20} /> : 'Create Account'}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        )

      default:
        return null
    }
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      p: 2,
    }}>
      <Paper
        elevation={24}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 500,
          borderRadius: 3,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
          }}>
            <UserPlus size={32} color="white" />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {t('auth.create_account')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start managing your hotel with our comprehensive platform
          </Typography>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {renderStepContent(activeStep)}

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            {t('auth.already_have_account')}{' '}
            <Link 
              to="/login"
              style={{ 
                color: '#2563eb',
                textDecoration: 'none',
                fontWeight: 500
              }}
            >
              {t('auth.sign_in')}
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}

export default Signup