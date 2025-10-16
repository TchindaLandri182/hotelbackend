import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Formik, Form, Field, ErrorMessage } from 'formik'
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
import { Eye, EyeOff, UserPlus, Camera, Hotel, Upload } from 'lucide-react'
import { authAPI, hotelAPI } from '../../services/api'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'

const Signup = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [activeStep, setActiveStep] = useState(1)
  const [signupData, setSignupData] = useState({})
  const [imagePreview, setImagePreview] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const { user, signup, completeProfile, verifyEmail, isAuthenticated } = useAuth()

  const steps = ['Account Details', 'Email Verification', 'Profile Information', 'Hotel Information']

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

  const verificationSchema = Yup.object().shape({
    code: Yup.array()
      .of(Yup.string().matches(/^\d?$/, "Must be a digit")) // each box = one digit
      .test("len", "Code must be exactly 6 digits", (arr) => arr.join("").length === 6)
      .required("Verification code is required"),
  });


  const profileValidationSchema = Yup.object({
    firstName: Yup.string()
      .required(t('errors.required_field')),
    lastName: Yup.string()
      .required(t('errors.required_field')),
  })

  const hotelValidationSchema = Yup.object({
    name: Yup.string()
      .required(t('errors.required_field')),
    address: Yup.string()
      .required(t('errors.required_field')),
    zone: Yup.string()
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

  const handleAccountSubmit = async (values) => {
    setLoading(true)
    const newValues = {...values, role: 'owner'}

    const response = await signup(newValues)
    if(response.success){
      setActiveStep(1)
    }
    setLoading(false)
  }

  const handleEmailCodeVerification = async (values) => {
    setLoading(true)
    const response = await verifyEmail(values.code.join(""))
    if(response.success){
      setActiveStep(2)
    }
    setLoading(false)
  }

  const handleProfileSubmit = async (values) => {
    setLoading(true)
    const newValue = {
      ...values,
      profileImage: selectedFile 
    }
    const response = await completeProfile(newValue);
    if(response.success){
      setImagePreview(null)
      setSelectedFile(null)
      setActiveStep(3)
    }
    setLoading(false)
  }

  const handleHotelSubmit = async (values) => {
    setLoading(true)
    setError('')

    try {
      const hotelData = {
        ...values,
        owners: [],
        logo: selectedFile
      }

      const formData = new FormData()
      Object.keys(hotelData).forEach(key => {
        if (hotelData[key] !== null && hotelData[key] !== undefined) {
          if (key === 'logo' && hotelData[key] instanceof File) {
            formData.append(key, hotelData[key])
          } else {
            formData.append(key, hotelData[key])
          }
        }
      })

      const response = await hotelAPI.create(formData)
      
      toast.success(response.data?.message || 'Account created successfully!')
      navigate('/login')
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create hotel')
    } finally {
      setLoading(false)
    }
  }

  // const handleBack = () => {
  //   setActiveStep(prev => prev - 1)
  // }

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
            initialValues={{ code: Array(6).fill("") }}
            validationSchema={verificationSchema}
            onSubmit={handleEmailCodeVerification}
          >
            {({ errors, touched, values, setFieldValue }) => {
              // Refs for the 6 input boxes
              const inputsRef = Array.from({ length: 6 }, () => React.createRef());

              const handleChange = (e, i) => {
                const newValue = e.target.value.replace(/\D/, ""); // only digits
                const codeArray = [...values.code];
                codeArray[i] = newValue;
                setFieldValue("code", codeArray);

                if (newValue && i < 5) {
                  inputsRef[i + 1].current.focus();
                }
              };

              const handleKeyDown = (e, i) => {
                if (e.key === "Backspace" && !values.code[i] && i > 0) {
                  inputsRef[i - 1].current.focus();
                }
              };

              return (
                <Form>
                  <Box display="flex" justifyContent="center" gap={2} mb={3}>
                    {(values?.code || ["","","","","",""]).map((digit, i) => (
                      <TextField
                        key={i}
                        inputRef={inputsRef[i]}
                        inputProps={{
                          maxLength: 1,
                          style: { textAlign: "center", fontSize: "1.5rem" },
                        }}
                        value={digit}
                        onChange={(e) => handleChange(e, i)}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                        onFocus={(e) => e.target.select()}
                        sx={{ width: 50 }}
                      />
                    ))}
                  </Box>

                  {touched.code && errors.code && (
                    <Typography color="error" variant="body2" mb={2}>
                      {errors.code}
                    </Typography>
                  )}

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ textTransform: "none", fontWeight: 600 }}
                  >
                    {loading ? <CircularProgress size={20} /> : 'Verify'}
                  </Button>
                </Form>
              );
            }}
          </Formik>
        )

      case 2:
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
                  {/*<Button
                    variant="outlined"
                    onClick={handleBack}
                    sx={{ textTransform: 'none', flex: 1 }}
                  >
                    Back
                  </Button>*/}
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ textTransform: 'none', fontWeight: 600, flex: 1 }}
                  >
                    {loading ? <CircularProgress size={20} /> : 'Continue'}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        )

      case 3:
        return (
          <Formik
            initialValues={{ 
              name: signupData.name || '',
              address: signupData.address || '',
              zone: signupData.zoneName || '',
            }}
            validationSchema={hotelValidationSchema}
            onSubmit={handleHotelSubmit}
          >
            {({ errors, touched, values, handleChange, handleBlur }) => (
              <Form>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
                  Tell us about your hotel
                </Typography>

                <div className="mb-6">
                  <label className="form-label">Hotel Logo</label>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Hotel className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="image"
                        className="btn-secondary flex items-center space-x-2 cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload Image</span>
                      </label>
                    </div>
                    <ErrorMessage name="image" component="div" className="form-error" />
                  </div>
                </div>

                <Field
                  as={TextField}
                  name="name"
                  label="Hotel Name"
                  fullWidth
                  variant="outlined"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  sx={{ mb: 3 }}
                />

                <Field
                  as={TextField}
                  name="address"
                  label="Hotel Address"
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  value={values.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.address && Boolean(errors.address)}
                  helperText={touched.address && errors.address}
                  sx={{ mb: 3 }}
                />

                {/*<Field
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
                />*/}

                <Field
                  as={TextField}
                  name="zone"
                  label="Zone/District"
                  fullWidth
                  variant="outlined"
                  value={values.zone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.zone && Boolean(errors.zone)}
                  helperText={touched.zone && errors.zone}
                  sx={{ mb: 4 }}
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  {/*<Button
                    variant="outlined"
                    onClick={handleBack}
                    sx={{ textTransform: 'none', flex: 1 }}
                  >
                    Back
                  </Button>*/}
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
        <Stepper alternativeLabel activeStep={activeStep} sx={{mb: 5}}>
          {steps.map(label => (
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