import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
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
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Alert,
} from '@mui/material'
import { Eye, EyeOff, Hotel, ArrowLeft } from 'lucide-react'

const Login = () => {
  const { t } = useTranslation()
  const { login, loading, requiresVerification, requiresProfileCompletion } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const from = location.state?.from?.pathname || '/dashboard'

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t('errors.invalid_email'))
      .required(t('errors.required_field')),
    password: Yup.string()
      .required(t('errors.required_field')),
  })

  const handleSubmit = async (values) => {
    setError('')
    try {
      const result = await login(values.email, values.password)
      
      if (result.requiresVerification) {
        navigate('/verify-email')
      } else if (result.requiresProfileCompletion) {
        navigate('/complete-profile')
      } else if (result.success) {
        navigate(from, { replace: true })
      }
    } catch (err) {
      setError(err.message)
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
          maxWidth: 400,
          borderRadius: 3,
          backdropFilter: 'blur(10px)',
          background: 'rgba(255, 255, 255, 0.95)',
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
            <Hotel size={32} color="white" />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {t('auth.welcome_back')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('auth.sign_in')} to Hotel Management System
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Formik
          initialValues={{ email: '', password: '', rememberMe: false }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values, handleChange, handleBlur }) => (
            <Form>
              <Box sx={{ space: 3 }}>
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

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="rememberMe"
                        checked={values.rememberMe}
                        onChange={handleChange}
                        size="small"
                      />
                    }
                    label={t('auth.remember_me')}
                  />
                  <Link 
                    to="/forgot-password"
                    style={{ 
                      textDecoration: 'none', 
                      color: '#2563eb',
                      fontSize: '0.875rem',
                      fontWeight: 500
                    }}
                  >
                    {t('auth.forgot_password')}
                  </Link>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    },
                    fontWeight: 600,
                    textTransform: 'none',
                    mb: 3,
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    t('auth.sign_in')
                  )}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Button
                    component={Link}
                    to="/"
                    startIcon={<ArrowLeft size={16} />}
                    sx={{ textTransform: 'none', mb: 2 }}
                  >
                    Back to Home
                  </Button>
                  <Typography variant="body2" color="text.secondary">
                    {t('auth.dont_have_account')}{' '}
                    <Link 
                      to="/signup"
                      style={{ 
                        color: '#2563eb',
                        textDecoration: 'none',
                        fontWeight: 500
                      }}
                    >
                      {t('auth.sign_up')}
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  )
}

export default Login