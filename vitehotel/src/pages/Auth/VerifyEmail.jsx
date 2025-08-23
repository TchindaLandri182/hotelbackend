import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material'
import { Mail } from 'lucide-react'
import { verifyEmail, clearError } from '../../store/slices/authSlice'

const VerifyEmail = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const { loading, error, requiresProfileCompletion } = useSelector(state => state.auth)
  const [code, setCode] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (code.length !== 6) return
    
    dispatch(clearError())
    const result = await dispatch(verifyEmail(code))
    
    if (result.type === 'auth/verifyEmail/fulfilled') {
      if (requiresProfileCompletion) {
        navigate('/complete-profile')
      } else {
        navigate('/dashboard')
      }
    }
  }

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setCode(value)
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
            <Mail size={32} color="white" />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {t('auth.verify_email')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter the 6-digit code sent to your email
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label={t('auth.verification_code')}
            fullWidth
            variant="outlined"
            value={code}
            onChange={handleCodeChange}
            inputProps={{
              maxLength: 6,
              style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' }
            }}
            placeholder="000000"
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading || code.length !== 6}
            sx={{
              py: 1.5,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              },
              fontWeight: 600,
              textTransform: 'none',
              mb: 2,
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t('auth.verify_email')
            )}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="text"
              size="small"
              sx={{ textTransform: 'none' }}
            >
              {t('auth.resend_code')}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  )
}

export default VerifyEmail