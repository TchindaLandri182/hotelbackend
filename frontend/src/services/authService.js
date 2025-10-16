import api from './api'

export const authService = {
  // Login
  login: async (email, password) => {
    const response = await api.post('/user/signin', { email, password })
    return response.data
  },

  // Verify email
  verifyEmail: async (code) => {
    const response = await api.post('/user/verify-email', { code })
    return response.data
  },

  // Complete profile
  completeProfile: async (profileData) => {
    const formData = new FormData()
    formData.append('firstName', profileData.firstName)
    formData.append('lastName', profileData.lastName)
    if (profileData.profileImage) {
      formData.append('profileImage', profileData.profileImage)
    }

    const response = await api.post('/user/complete-profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Generate invite link
  generateInviteLink: async (inviteData) => {
    const response = await api.post('/user/invite', inviteData)
    return response.data
  },

  // Signup via invitation
  signupViaInvite: async (token, password) => {
    const response = await api.post('/user/signup/invite', { token, password })
    return response.data
  },

  // Resend verification email
  resendVerificationEmail: async () => {
    const response = await api.post('/user/resend-verification')
    return response.data
  },

  // Send password reset email
  sendPasswordResetEmail: async (email) => {
    const response = await api.post('/user/send-reset-password', { email })
    return response.data
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    const response = await api.post('/user/reset-password', { token, newPassword })
    return response.data
  },
}

export default authService