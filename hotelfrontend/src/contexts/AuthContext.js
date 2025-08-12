import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(['token', 'user']);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = cookies.token;
      const userData = cookies.user;

      if (token && userData) {
        try {
          // Set the token in API headers
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setUser(userData);
        } catch (error) {
          console.error('Auth initialization error:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [cookies.token, cookies.user]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/user/signin', { email, password });
      const { token, user: userData, expiresIn, requiresVerification, requiresProfileCompletion } = response.data;

      if (requiresVerification) {
        return { requiresVerification: true };
      }

      if (requiresProfileCompletion) {
        // Set token for profile completion
        setCookie('token', token, { 
          path: '/', 
          expires: new Date(expiresIn),
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return { requiresProfileCompletion: true };
      }

      // Full login success
      setCookie('token', token, { 
        path: '/', 
        expires: new Date(expiresIn),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      setCookie('user', userData, { 
        path: '/', 
        expires: new Date(expiresIn),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);

      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  const verifyEmail = async (code) => {
    try {
      const response = await api.post('/user/verify-email', { code });
      const { token, requiresProfileCompletion } = response.data;

      if (requiresProfileCompletion) {
        setCookie('token', token, { 
          path: '/', 
          expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return { requiresProfileCompletion: true };
      }

      toast.success('Email verified successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Email verification failed';
      toast.error(message);
      throw error;
    }
  };

  const completeProfile = async (profileData) => {
    try {
      const formData = new FormData();
      formData.append('firstName', profileData.firstName);
      formData.append('lastName', profileData.lastName);
      if (profileData.profileImage) {
        formData.append('profileImage', profileData.profileImage);
      }

      const response = await api.post('/user/complete-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { user: userData } = response.data;
      
      setCookie('user', userData, { 
        path: '/', 
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      setUser(userData);
      toast.success('Profile completed successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile completion failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    removeCookie('token', { path: '/' });
    removeCookie('user', { path: '/' });
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    toast.info('Logged out successfully');
  };

  const updateUser = (userData) => {
    setCookie('user', userData, { 
      path: '/', 
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    setUser(userData);
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.permissions && user.permissions.includes(permission);
  };

  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    verifyEmail,
    completeProfile,
    updateUser,
    hasPermission,
    hasRole,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};